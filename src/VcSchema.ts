/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ValidateFunction } from "ajv";
import { schemasToContext } from "@transmute/jsonld-schema";
import { JsonSchema, JsonSchemaNode } from "./types";
import { getNewAjv } from "./helpers";

const ajv = getNewAjv();
let schemaCompilationInProgress: Promise<unknown> | undefined;

export class VcSchema {
  public jsonSchema: JsonSchema;
  public jsonLdContext?: { [key: string]: any };

  private jsonSchemaValidate: Promise<ValidateFunction>;
  private initError?: Error;
  private debugMode?: boolean;

  constructor(jsonSchema: string | JsonSchema, debugMode?: boolean) {
    this.debugMode = debugMode;
    if (typeof jsonSchema === "string") {
      try {
        this.jsonSchema = JSON.parse(jsonSchema);
      } catch (err) {
        throw Error("Failed to parse supplied JSON Schema as JSON: " + err.message);
      }
    } else {
      this.jsonSchema = jsonSchema;
    }

    try {
      this.jsonLdContext = jsonSchemaToContext(this.jsonSchema, this.jsonSchema.$metadata?.uris?.jsonLdContext);
    } catch (err) {
      throw Error("Failed to generate JSON-LD Context from input: " + err.message);
    }

    this.jsonSchemaValidate = this.initValidator();
  }

  private initValidator(): Promise<ValidateFunction> {
    // unusual use-case, but it makes wrapping async/await function in a promise easier:
    // eslint-disable-next-line no-async-promise-executor
    const promise = new Promise<ValidateFunction>(async (resolve, reject) => {
      try {
        // Since we're sharing a global instance of ajv (ideal for caching compiled schemas and references), need to do this check to avoid race condition where there are multiple near-simultaneous async calls to compile the same schema, which result in "schema with key or id already exists" error. This will only solve a race condition of two compilations (we'd need some kind of queue to handle perfectly for any number) but it's already an edge-case caused by some helpers running in storybook stories so this will do for now.
        if (schemaCompilationInProgress) {
          try {
            await schemaCompilationInProgress;
          } catch {
            // we don't care about any error, we just want to wait til previous compilation is complete before continuing
          }
        }
        ajv.removeSchema(this.jsonSchema?.["$id"]);
        const validator = await ajv.compileAsync(this.jsonSchema);
        resolve(validator);
      } catch (err) {
        this.initError = Error("AJV failed to generate validator from supplied JSON Schema: " + err.message);
        console.error(this.initError, "JSON Schema:", this.jsonSchema);
        reject(this.initError);
        return;
      }
    });
    schemaCompilationInProgress = promise;
    return promise;
  }

  public getJsonLdContextString(prettyPrint?: boolean): string {
    return JSON.stringify(this.jsonLdContext, null, prettyPrint ? 2 : undefined);
  }

  public getJsonSchemaString(prettyPrint?: boolean): string {
    return JSON.stringify(this.jsonSchema, null, prettyPrint ? 2 : undefined);
  }

  public async validateVc(vc: string | { [key: string]: any }): Promise<{ isValid: boolean | null; message?: string }> {
    let vcObj = vc;
    if (typeof vc === "string") {
      try {
        vcObj = JSON.parse(vc);
      } catch (err) {
        return {
          isValid: false,
          message: "VC is invalid: Invalid JSON: " + err.message,
        };
      }
    }

    let validator: ValidateFunction;
    try {
      validator = await this.jsonSchemaValidate;
    } catch (err) {
      return {
        isValid: false,
        message: err.message,
      };
    }

    const isValid = await validator(vcObj);

    let message: string;
    if (validator.errors) {
      message = "VC is invalid: " + JSON.stringify(validator.errors);
    } else {
      message = "VC is valid according to schema";
    }

    return { isValid, message };
  }

  /** Deprecated, but could migrate to google's new tool. */
  public openGoogleJsonLdValidatorPage(vc: any): void {
    const form = document.createElement("form");
    form.method = "post";
    form.target = "_blank";
    form.action = "https://search.google.com/structured-data/testing-tool";

    const field = document.createElement("input");
    field.type = "hidden";
    field.name = "code";
    field.value = JSON.stringify(this.getVcWithSchemaContext(vc), null, 2);
    form.appendChild(field);

    document.body.appendChild(form);
    form.submit();
  }

  public openJsonLdChecker(vc: any): void {
    const jsonLd = JSON.stringify(this.getVcWithSchemaContext(vc), null, 2);
    window.open("https://www.jsonld-checker.com/?json=" + encodeURIComponent(jsonLd), "_blank");
  }

  public openJsonLdPlaygroundPage(vc: any): void {
    const jsonLd = JSON.stringify(this.getVcWithSchemaContext(vc), null, 2);
    window.open(
      "https://json-ld.org/playground/#startTab=tab-compacted&json-ld=" + encodeURIComponent(jsonLd),
      "_blank",
    );
  }

  private debug(...args: any[]): void {
    this.debugMode && console.log(...args);
  }

  /** Appends our JSON-LD @context to a to the @context of a given VC. */
  private getVcWithSchemaContext(_vc: any): { [key: string]: any } {
    const vc = typeof _vc === "string" ? JSON.parse(_vc) : { ..._vc };

    const schemaContext = this.jsonLdContext?.["@context"];
    if (!schemaContext) {
      console.warn("No JSON-LD @context for this schema");
      return vc;
    }

    if (!vc["@context"]) {
      vc["@context"] = schemaContext;
    } else if (Array.isArray(vc["@context"])) {
      vc["@context"] = vc["@context"].concat(schemaContext);
    } else {
      vc["@context"] = [vc["@context"]].concat(schemaContext);
    }

    if (Array.isArray(vc["@context"])) {
      vc["@context"] = vc["@context"].filter((context) => !context.includes?.("://example.com"));
    }

    return vc;
  }
}

function jsonSchemaToContext(schema: JsonSchema, contextBaseUrl?: string): { [key: string]: any } {
  if (!schema.properties?.credentialSubject?.properties) {
    throw Error("Invalid schema: no `credentialSubject` properties");
  }

  const { subjectLdType, credLdType } = generateSchemaLdTypes(schema);

  let url = contextBaseUrl;
  if (!contextBaseUrl) {
    console.warn("No URL found for JSON-LD @context. Falling back to example.org URL.");
    url = "https://example.org/" + credLdType;
  }

  const context = {
    "@context": {
      "@vocab": url + "#",
      [credLdType]: url + "#" + credLdType,
      ...jsonSchemaToNestedContext(schema.properties.credentialSubject)["@context"],
    },
  };

  if (context["@context"]?.[subjectLdType]?.["@context"]?.id) {
    // Since `subjectLdType` will be used for `credentialSubject` and base W3C VC context already defines `credentialSubject.id` and is marked protected, we can't redefine it
    delete context["@context"][subjectLdType]["@context"].id;
  }

  return context;
}

export function generateSchemaLdTypes(schema: JsonSchema): { subjectLdType: string; credLdType: string } {
  let subjectLdType = schema.properties?.credentialSubject?.$linkedData?.term;
  let credLdType = schema.$linkedData?.term;

  if (credLdType && !subjectLdType) {
    subjectLdType = credLdType + "Subject";
  } else if (subjectLdType && !credLdType) {
    credLdType = subjectLdType + "Credential";
  }

  if (!subjectLdType) {
    subjectLdType = schema.properties?.credentialSubject?.title?.replace(/[^\w]/g, "") || "";
  }
  if (!credLdType) {
    credLdType = schema.title?.replace(/[^\w]/g, "") || "";
  }

  return { subjectLdType, credLdType };
}

function jsonSchemaToNestedContext(node: JsonSchemaNode): { [key: string]: any } {
  const ldContext = schemasToContext([node]);
  const ldTerm = node.$linkedData?.term;

  if (ldTerm && ldContext?.["@context"]?.[ldTerm]?.["@context"]?.["@context"]) {
    // JSON Schema description of "@context" attribute copied into JSON-LD @context of the term we just converted will break some readers with "Invalid JSON-LD syntax; invalid scoped context", so remove it
    delete ldContext["@context"][ldTerm]["@context"]["@context"];
  }

  // library adds @vocab value we don't need
  delete ldContext["@context"]["@vocab"];

  // `schemasToContext` doesn't natively support nested properties, so here we loop through and see if any have nested properties and recursively call `schemasToContext` on them
  for (const propName in node.properties) {
    const prop = node.properties[propName];
    const propLdTerm = prop.$linkedData?.term;
    if (ldTerm && propLdTerm && prop.type === "object" && prop.properties) {
      ldContext["@context"][ldTerm]["@context"][propLdTerm] = {
        ...ldContext["@context"][ldTerm]["@context"][propLdTerm],
        ...jsonSchemaToNestedContext(prop)["@context"][propLdTerm],
      };
    }
  }

  return ldContext;
}
