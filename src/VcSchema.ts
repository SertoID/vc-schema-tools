/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import Ajv from "ajv";
import { omitDeep, mapValuesDeep } from "deepdash-es/standalone";
import slugify from "@sindresorhus/slugify";
import { getSchemaUrl } from "./utils";

const ajv = new Ajv();

export interface LdContextPlus<MetadataType = any> {
  "@context": LdContextPlusRootNode<MetadataType>;
}

export interface LdContextPlusRootNode<MetadataType = any> {
  "@rootType": string;
  "@id"?: string;
  "@title"?: string;
  "@description"?: string;
  "@metadata"?: MetadataType;
  [key: string]: LdContextPlusNode<MetadataType> | MetadataType | number | string | undefined;
}

export interface LdContextPlusInnerNode<MetadataType = any> {
  "@id": string;
  "@contains"?: string;
  "@replaceWith"?: string;
  "@title"?: string;
  "@description"?: string;
  "@required"?: boolean;
  "@metadata"?: MetadataType;
  "@context"?: { [key: string]: LdContextPlusNode<MetadataType> };
}

export interface LdContextPlusLeafNode<MetadataType = any> {
  "@id": string;
  "@type": string;
  "@dataType"?: string;
  "@format"?: string;
  "@title"?: string;
  "@description"?: string;
  "@required"?: boolean;
  "@metadata"?: MetadataType;
  "@items"?: JsonSchemaNode;
}

export type LdContextPlusNodeKey = keyof LdContextPlusLeafNode | keyof LdContextPlusInnerNode;

export type LdContextPlusNode<MetadataType = any> =
  | LdContextPlusInnerNode<MetadataType>
  | LdContextPlusLeafNode<MetadataType>;

export interface JsonSchemaNode {
  type: string | string[];
  properties?: { [key: string]: JsonSchemaNode };
  title?: string;
  description?: string;
  format?: string;
  items?: JsonSchemaNode;
  required?: string[];
}
export interface JsonSchema extends JsonSchemaNode {
  $schema: string;
  $id?: string;
}

const contextPlusFields = [
  "@rootType",
  "@replaceWith",
  "@contains",
  "@dataType",
  "@items",
  "@format",
  "@required",
  "@title",
  "@description",
  "@metadata",
];
const contextPlusFieldsRegexes = contextPlusFields.map((field) => new RegExp(field));

export const jsonLdContextTypeMap: { [key: string]: { type: string; format?: string } } = {
  "@id": { type: "string", format: "uri" }, // JSON-LD @context convention for an IRI
  "http://schema.org/Text": { type: "string" },
  "http://schema.org/URL": { type: "string", format: "uri" },
  "http://schema.org/DateTime": { type: "string", format: "date-time" },
  "http://schema.org/Number": { type: "number" },
  "http://schema.org/Boolean": { type: "boolean" },
  "xsd:anyURI": { type: "string", format: "uri" },
  "xsd:string": { type: "string" },
  "xsd:integer": { type: "integer" },
  "xsd:dateTime": { type: "string", format: "date-time" },
};

const baseVcJsonSchema = {
  type: "object",
  required: ["@context", "type", "issuer", "issuanceDate", "credentialSubject"],
  properties: {
    "@context": {
      type: ["string", "array", "object"],
    },
    id: {
      type: "string",
      format: "uri",
    },
    type: {
      type: ["string", "array"],
      items: {
        type: "string",
      },
    },
    issuer: {
      type: "string",
      format: "uri",
    },
    issuanceDate: {
      type: "string",
      format: "date-time",
    },
    credentialSubject: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uri",
        },
      },
    },
  },
};

export class VcSchema {
  public id?: string;
  public jsonSchemaMessage?: string; // @TODO/tobek This should probably be an array and some of the compilation warnings should get added to it.
  public schema: LdContextPlus;
  public jsonLdContext?: any;
  public jsonSchema?: JsonSchema;

  private debugMode?: boolean;
  private jsonSchemaValidate?: Ajv.ValidateFunction;

  constructor(schema: string | LdContextPlus, id?: string, debugMode?: boolean) {
    this.id = id && slugify(id);
    this.debugMode = debugMode;
    if (typeof schema === "string") {
      try {
        this.schema = JSON.parse(schema);
      } catch (err) {
        throw Error("Failed to parse JSON: " + err.message);
      }
    } else {
      this.schema = schema;
    }

    // @TODO/tobek Should make a JSON Schema for LdContextPlus and validate `this.schema` here and throw an error if invalid.

    this.jsonLdContext = omitDeep(this.schema, contextPlusFieldsRegexes);
    if (this.jsonLdContext["@context"] && !this.jsonLdContext["@context"]["@version"]) {
      // Default to JSON-LD proceessing mode version 1.1
      this.jsonLdContext["@context"]["@version"] = 1.1;
    }

    // This is a bit of a hack. We want to be able to add JSON Schema info to "@id" properties. To do this we can have LD Context Plus nodes such as `{ "id" : { "@id": "@id", "@required": true } }` which compiles to JSON-LD @context `{ "id" : { "@id": "@id" } }`. This works and simply aliases "id" to "@id". However, the W3C Credentials JSON-LD @context thatn we import defines `{ @protected: true, "id": "@id" }`. Because of the "@protected" we can't redefine "id" even to an expanded type definition that is functionally identical. So, this mapValuesDeep call replaces `{ "id" : { "@id": "@id" } }` with `{ "id" : "@id" }` which is allowed by "@protected" since it is functionally *and* syntactically the same.
    this.jsonLdContext = mapValuesDeep(
      this.jsonLdContext,
      (value) => {
        if (value?.["@id"] === "@id") {
          return "@id";
        }
        return value;
      },
      { callbackAfterIterate: true },
    );

    if (this.id && this.jsonLdContext["@context"]?.["schema-id"]) {
      this.jsonLdContext["@context"]["schema-id"] = getSchemaUrl(this.id, "ld-context") + "#";
    }

    try {
      this.jsonSchema = this.generateJsonSchema();
      if (this.jsonSchema) {
        ajv.removeSchema(this.jsonSchema["$id"]);
        this.jsonSchemaValidate = ajv.compile(this.jsonSchema);
      }
    } catch (err) {
      throw Error("Failed to generate JSON Schema from input: " + err.message);
    }
  }

  public getLdContextPlusString(prettyPrint?: boolean): string {
    return JSON.stringify(this.schema, null, prettyPrint ? 2 : undefined);
  }

  public getJsonLdContextString(prettyPrint?: boolean): string {
    return JSON.stringify(this.jsonLdContext, null, prettyPrint ? 2 : undefined);
  }

  public getJsonSchemaString(prettyPrint?: boolean): string {
    if (!this.jsonSchema) {
      // @TODO/tobek Should this throw an error? Explanation available in instance.jsonSchemaMessage but that's a bit of a weird paradigm
      return "";
    }
    return JSON.stringify(this.jsonSchema, null, prettyPrint ? 2 : undefined);
  }

  public async validateVc(vc: any, cb: (isValid: boolean | null, message?: string) => any): Promise<void> {
    let vcObj: any;
    try {
      vcObj = JSON.parse(vc);
    } catch (err) {
      return cb(false, "VC is invalid: Invalid JSON: " + err.message);
    }

    if (!this.jsonSchema || !this.jsonSchemaValidate) {
      return cb(null, "VC could not be validated since JSON Schema could not be generated: " + this.jsonSchemaMessage);
    } else if (
      this.schema["@context"]?.["@rootType"] &&
      vcObj.type !== this.schema["@context"]["@rootType"] &&
      (!Array.isArray(vcObj.type) || vcObj.type.indexOf(this.schema["@context"]["@rootType"]) === -1)
    ) {
      // @TODO/tobek A single JSON-LD @context could define multiple VC types but this is set up to recognize exactly one. This could theoretically be expanded - we would probably need to support an array of @rootType's and create a separate JSON Schema for each.
      return cb(
        null,
        `VC could not be validated since it is not of the type "${this.schema["@context"]["@rootType"]}" that we have a schema for.`,
      );
    }

    const isValid = await this.jsonSchemaValidate(vcObj);

    let message: string;
    if (this.jsonSchemaValidate.errors) {
      message = "VC is invalid: " + JSON.stringify(this.jsonSchemaValidate.errors);
    } else if (this.jsonSchemaMessage) {
      message = "VC is valid according to schema, with warnings: " + this.jsonSchemaMessage;
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

  private generateJsonSchema(): JsonSchema | undefined {
    let context = this.schema["@context"] || this.schema;
    if (Array.isArray(context)) {
      context = context[context.length - 1];
    }
    // @TODO/tobek Handle more complex @context's - merge array of multiple contexts, dereference URLs, etc.

    let parsedSchema: JsonSchemaNode | undefined;
    const rootType = context["@rootType"];
    if (typeof context !== "object") {
      // @TODO/tobek If it's a URL we should fetch that URL
      this.jsonSchemaMessage = "Invalid LD Context Plus schema: could not find @context object";
    } else if (!rootType) {
      this.jsonSchemaMessage =
        'Invalid LD Context Plus schema: no "@rootType" property. Falling back to base VC schema.';
    } else if (!context[rootType]) {
      this.jsonSchemaMessage = `Invalid LD Context Plus schema: "@rootType" property "${rootType}" is not defined. Falling back to base VC schema.`;
    } else {
      parsedSchema = this.parseContextPlusNode(context, context[rootType] as LdContextPlusNode, "root");
    }

    return {
      $schema: "http://json-schema.org/draft-07/schema#",
      $id: this.id && getSchemaUrl(this.id, "json-schema"),
      title: context["@title"],
      description: context["@description"],
      ...baseVcJsonSchema,
      ...parsedSchema,
      required: Array.from(new Set([...baseVcJsonSchema.required, ...(parsedSchema?.required || [])])),
      properties: {
        ...baseVcJsonSchema.properties,
        ...(parsedSchema?.properties || {}),
      },
    };
  }

  private parseContextPlusNode(
    context: LdContextPlusRootNode,
    node: LdContextPlusNode,
    key: string,
  ): JsonSchemaNode | undefined {
    if (typeof node !== "object") {
      console.warn(
        `Unsupported LD Context Plus node type at ${key}: node is not an object. Excluding from JSON Schema. Node:`,
        node,
      );
      return;
    }

    const dataTypeInfo = this.parseContextPlusDataType(node);
    if (dataTypeInfo) {
      const leafNode = node as LdContextPlusLeafNode;
      this.debug(`Parsing "${key}": leaf node`, leafNode);
      return {
        title: leafNode["@title"],
        description: leafNode["@description"],
        ...dataTypeInfo,
        ...(leafNode["@format"] && { format: leafNode["@format"] }),
        ...(leafNode["@items"] && { items: leafNode["@items"] }),
      };
    } else {
      node = node as LdContextPlusInnerNode;
    }

    const replaceWithType = node["@replaceWith"];
    if (replaceWithType) {
      this.debug(`Parsing "${key}": replace with type "${replaceWithType}"`, node);
      if (!context[replaceWithType]) {
        console.warn(
          `Referenced type "${replaceWithType}" could not be found; excluding from JSON Schema. replaceWith from node:`,
          node,
        );
        return;
      }
      return this.parseContextPlusNode(context, context[replaceWithType] as LdContextPlusNode, replaceWithType);
    }

    const nestedProperties = {
      ...node["@context"],
    };
    if (node["@contains"]) {
      (Array.isArray(node["@contains"]) ? node["@contains"] : [node["@contains"]]).forEach((containedType) => {
        if (context[containedType]) {
          nestedProperties[containedType] = context[containedType] as LdContextPlusNode;
        } else {
          console.warn(
            `Referenced type "${containedType}" could not be found; excluding from JSON Schema. Referenced from node:`,
            node,
          );
        }
      });
    }

    if (!Object.keys(nestedProperties).length) {
      console.warn(`Unsupported LD Context Plus node type at ${key}; excluding from JSON Schema. Node:`, node);
      return;
    }

    this.debug(`Parsing "${key}": inner @context and/or @contains`, node);
    const nestedRequired: string[] = [];
    const parsedNestedProperties: { [key: string]: JsonSchemaNode } = {};

    Object.keys(nestedProperties)
      .filter((nestedKey) => nestedKey[0] !== "@")
      .forEach((nestedKey) => {
        const nestedNode = nestedProperties[nestedKey];
        const property = this.parseContextPlusNode(context, nestedNode, nestedKey);
        if (property) {
          if (
            nestedNode["@required"] ||
            ("@replaceWith" in nestedNode &&
              nestedNode["@replaceWith"] &&
              (context[nestedNode["@replaceWith"]] as LdContextPlusNode)?.["@required"])
          ) {
            nestedRequired.push(nestedKey);
          }
          parsedNestedProperties[nestedKey] = property;
        }
      });

    return {
      // Avoid setting these keys to `undefined` which would then override any previously defined values if this node is used with spread operator:
      ...(node["@title"] && { title: node["@title"] }),
      ...(node["@description"] && { description: node["@description"] }),

      type: "object",
      required: nestedRequired.length ? nestedRequired : undefined,
      properties: parsedNestedProperties,
    };
  }

  private parseContextPlusDataType(
    node: LdContextPlusNode,
  ): { type: string | string[]; format?: string; items?: JsonSchemaNode } | undefined {
    if ("@dataType" in node && node["@dataType"]) {
      return {
        type: node["@dataType"],
        format: node["@format"],
        items: node["@items"],
      };
    } else if ("@type" in node && jsonLdContextTypeMap[node["@type"]]) {
      return jsonLdContextTypeMap[node["@type"]];
    }
    return undefined;
  }

  /** Appends our JSON-LD @context to a to the @context of a given VC. */
  private getVcWithSchemaContext(_vc: any): { [key: string]: any } {
    const vc = typeof _vc === "string" ? JSON.parse(_vc) : { ..._vc };
    if (!vc["@context"]) {
      vc["@context"] = this.jsonLdContext["@context"];
    } else if (Array.isArray(vc["@context"])) {
      vc["@context"] = vc["@context"].concat(this.jsonLdContext["@context"]);
    } else {
      vc["@context"] = [vc["@context"]].concat(this.jsonLdContext["@context"]);
    }
    return vc;
  }
}
