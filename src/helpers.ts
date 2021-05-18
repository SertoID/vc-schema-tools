/** Fields valid in JSON-LD Context Plus that are not valid in JSON-LD Context. */
export const contextPlusFields = [
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
export const contextPlusFieldsRegexes = contextPlusFields.map((field) => new RegExp(field));

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

export const baseVcJsonSchema = {
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
      type: ["string", "object"],
      format: "uri",
      required: ["id"],
      properties: {
        id: {
          type: "string",
          format: "uri",
        },
      },
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
