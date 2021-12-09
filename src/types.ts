/** Quick n dirty VC type with properties we need, the full W3C VC spec has much much more. */
export interface VC {
  "@context": string | string[];
  id?: string;
  type: string[];
  issuer: string | { id: string; [key: string]: any };
  issuanceDate: string;
  expirationDate?: string;
  credentialSubject: { [key: string]: any };
  proof?: {
    type?: string;
    jwt: string;
  };
  credentialSchema?: {
    id: string;
    type: string;
  };
}

export interface DefaultSchemaMetadata {
  uris?: {
    jsonLdContext?: string;
    jsonSchema?: string;
  };
  [key: string]: any;
}

export interface JsonSchemaNode {
  $ref?: string;
  $linkedData?: {
    term: string;
    "@id": string;
  };
  type?: string | string[];
  anyOf?: JsonSchemaNode[];
  oneOf?: JsonSchemaNode[];
  properties?: { [key: string]: JsonSchemaNode };
  title?: string;
  description?: string;
  format?: string;
  items?: JsonSchemaNode;
  required?: string[];
}
export interface JsonSchema<MetadataType extends DefaultSchemaMetadata = DefaultSchemaMetadata> extends JsonSchemaNode {
  $schema: string;
  $id?: string;
  $metadata?: MetadataType;
  [key: string]: any;
}
