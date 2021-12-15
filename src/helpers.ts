import Ajv from "ajv";
import addFormats from "ajv-formats";
import { JsonSchemaNode } from "./types";

export const jsonLdContextTypeMap: { [key: string]: { type: string; format?: string } } = {
  "@id": { type: "string", format: "uri" }, // JSON-LD @context convention for an IRI
  "http://schema.org/Text": { type: "string" },
  "http://schema.org/URL": { type: "string", format: "uri" },
  "http://schema.org/Date": { type: "string", format: "date" },
  "http://schema.org/DateTime": { type: "string", format: "date-time" },
  "http://schema.org/Number": { type: "number" },
  "http://schema.org/Boolean": { type: "boolean" },
  "xsd:anyURI": { type: "string", format: "uri" },
  "xsd:string": { type: "string" },
  "xsd:integer": { type: "integer" },
  "xsd:date": { type: "string", format: "date" },
  "xsd:dateTime": { type: "string", format: "date-time" },
};

/** Map from a "nice" name for a type to a sample JsonSchemaNode of that type.  */
export const jsonLdSchemaTypeMap: { [key: string]: JsonSchemaNode } = {
  DID: {
    $linkedData: {
      term: "",
      "@id": "@id",
    },
    type: "string",
    format: "uri",
  },
  Text: {
    $linkedData: {
      term: "",
      "@id": "http://schema.org/Text",
    },
    type: "string",
  },
  URL: {
    $linkedData: {
      term: "",
      "@id": "http://schema.org/URL",
    },
    type: "string",
    format: "uri",
  },
  Date: {
    $linkedData: {
      term: "",
      "@id": "http://schema.org/Date",
    },
    type: "string",
    format: "date",
  },
  DateTime: {
    $linkedData: {
      term: "",
      "@id": "http://schema.org/DateTime",
    },
    type: "string",
    format: "date-time",
  },
  Number: {
    $linkedData: {
      term: "",
      "@id": "http://schema.org/Number",
    },
    type: "number",
  },
  Boolean: {
    $linkedData: {
      term: "",
      "@id": "http://schema.org/Boolean",
    },
    type: "boolean",
  },
};

export function nodeToTypeName(node: JsonSchemaNode): string | undefined {
  if (node.oneOf && Array.isArray(node.oneOf)) {
    return node.oneOf.map(nodeToTypeName).join(" OR ");
  }

  if (Array.isArray(node.type)) {
    return node.type.join(",");
  }

  if (node.$ref) {
    return "Ref: " + node.$ref;
  } else if (node.type === "array" && node.items?.$ref) {
    return `List (Ref: ${node.items.$ref})`;
  }

  for (const typeName in jsonLdSchemaTypeMap) {
    const typeNode = jsonLdSchemaTypeMap[typeName];
    if (node.$linkedData?.["@id"] && node.$linkedData["@id"] === typeNode.$linkedData?.["@id"]) {
      return typeName;
    }
    if (typeName === "DID") {
      // Don't match DID based on JSON Schema properties only, since those are the same as URL. Only match DID based on $linkedData above
      continue;
    }

    if (node.type === typeNode.type && (node.format === typeNode.format || (!node.format && !typeNode.format))) {
      return typeName;
    }
  }

  if (typeof node.type === "string" && node.format) {
    return `Text (${node.format})`;
  }

  if (node.type === "array") {
    return "List";
  }

  return JSON.stringify(node.type);
}

/** Recursively generate JSON Schema `$linkedData` objects that embed JSON-LD data in JSON Schema. Use `$comment` properties if present, or else guess at the values based on the JSON Schema types. */
export function generateLinkedData(_node: JsonSchemaNode, key?: string): JsonSchemaNode {
  // Duplicate node:
  const node = JSON.parse(JSON.stringify(_node)) as JsonSchemaNode;

  if (!node.$linkedData && node.$comment) {
    try {
      const parsedComment = JSON.parse(node.$comment);
      if (parsedComment.term) {
        node.$linkedData = parsedComment;
        delete node.$comment;
      }
    } catch {
      // Must've been a $comment for something else - nevermind
    }
  }

  if (!node.$linkedData && key) {
    const typeName = nodeToTypeName(node);
    node.$linkedData = {
      term: key,
      "@id": jsonLdSchemaTypeMap[typeName || ""]?.$linkedData?.["@id"] || key,
    };
  }

  if (node.properties) {
    Object.entries(node.properties).forEach(([key, nestedProp]) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      node.properties![key] = generateLinkedData(nestedProp, key);
    });
  }

  return node;
}

export const baseVcJsonSchema = {
  type: "object",
  required: ["@context", "type", "issuer", "issuanceDate", "credentialSubject"],
  properties: {
    "@context": {
      anyOf: [{ type: "string" }, { type: "array" }, { type: "object" }],
    },
    id: {
      type: "string",
      format: "uri",
    },
    type: {
      anyOf: [{ type: "string" }, { type: "array", items: { type: "string" } }],
    },
    issuer: {
      anyOf: [
        {
          type: "string",
          format: "uri",
        },
        {
          type: "object",
          required: ["id"],
          properties: {
            id: {
              type: "string",
              format: "uri",
            },
          },
        },
      ],
    },
    issuanceDate: {
      type: "string",
      format: "date-time",
    },
    expirationDate: {
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
    credentialSchema: {
      type: "object",
      required: ["id", "type"],
      properties: {
        id: {
          type: "string",
          format: "uri",
        },
        type: {
          type: "string",
        },
      },
    },
  },
};

async function loadSchema(uri: string) {
  const res = await fetch(uri);
  if (res.status >= 400) {
    throw new Error("Loading error: " + res.status);
  }
  const json = await res.json();

  // workaround for https://github.com/w3c-ccg/traceability-vocab/issues/219
  if (json.$schema === "https://json-schema.org/draft-07/schema#") {
    json.$schema = "http://json-schema.org/draft-07/schema#";
  }

  return json;
}

export const getNewAjv = (): Ajv => {
  const ajv = new Ajv({ loadSchema });
  ajv.addKeyword("$metadata");
  ajv.addKeyword("$linkedData");
  addFormats(ajv);
  return ajv;
};
