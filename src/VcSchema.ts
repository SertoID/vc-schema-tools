/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import { ValidateFunction } from "ajv";
import { schemasToContext } from "@transmute/jsonld-schema";
import { JsonSchema, JsonSchemaNode } from "./types";
import { getNewAjv } from "./helpers";

const ajv = getNewAjv();

export class VcSchema {
  public jsonSchema: JsonSchema;
  public jsonLdContext?: { [key: string]: any };

  private jsonSchemaValidate: ValidateFunction;
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
      ajv.removeSchema(this.jsonSchema?.["$id"]);
      this.jsonSchemaValidate = ajv.compile(this.jsonSchema);
    } catch (err) {
      throw Error("AJV failed to generate validator from supplied JSON Schema: " + err.message);
    }

    try {
      let vocabUri = this.jsonSchema.$metadata?.uris?.jsonLdContext;
      vocabUri = vocabUri && vocabUri + "#";
      this.jsonLdContext = jsonSchemaToNestedContext(this.jsonSchema, vocabUri);
    } catch (err) {
      throw Error("Failed to generate JSON-LD Context from input: " + err.message);
    }
  }

  public getJsonLdContextString(prettyPrint?: boolean): string {
    return JSON.stringify(this.jsonLdContext, null, prettyPrint ? 2 : undefined);
  }

  public getJsonSchemaString(prettyPrint?: boolean): string {
    return JSON.stringify(this.jsonSchema, null, prettyPrint ? 2 : undefined);
  }

  public async validateVc(
    vc: string | { [key: string]: any },
    cb: (isValid: boolean | null, message?: string) => any,
  ): Promise<void> {
    let vcObj = vc;
    if (typeof vc === "string") {
      try {
        vcObj = JSON.parse(vc);
      } catch (err) {
        return cb(false, "VC is invalid: Invalid JSON: " + err.message);
      }
    }

    const isValid = await this.jsonSchemaValidate(vcObj);

    let message: string;
    if (this.jsonSchemaValidate.errors) {
      message = "VC is invalid: " + JSON.stringify(this.jsonSchemaValidate.errors);
    } else {
      message = "VC is valid according to schema";
    }

    cb(isValid, message);
  }

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
    return vc;
  }
}

function getLdTerm(jsonSchemaNode: JsonSchemaNode): string | void {
  try {
    return JSON.parse(jsonSchemaNode.$comment || "{}").term;
  } catch {
    return;
  }
}

function jsonSchemaToNestedContext(node: JsonSchemaNode, vocab?: string): { [key: string]: any } {
  const ldContext = schemasToContext([node]);

  if (vocab) {
    ldContext["@context"]["@vocab"] = vocab;
  } else {
    delete ldContext["@context"]["@vocab"];
  }

  // `schemasToContext` doesn't natively support nested properties, so here we loop through and see if any have nested properties and recursively call `schemasToContext` on them
  const ldTerm = getLdTerm(node);
  for (const propName in node.properties) {
    const prop = node.properties[propName];
    const propLdTerm = getLdTerm(prop);
    if (ldTerm && propLdTerm && prop.type === "object" && prop.properties) {
      ldContext["@context"][ldTerm]["@context"][propLdTerm] = {
        ...ldContext["@context"][ldTerm]["@context"][propLdTerm],
        ...jsonSchemaToNestedContext(prop)["@context"][propLdTerm],
      };
    }
  }

  return ldContext;
}
