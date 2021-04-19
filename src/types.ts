export interface DefaultSchemaMetadata {
  uris?: {
    jsonLdContextPlus?: string;
    jsonLdContext?: string;
    jsonSchema?: string;
  };
}

export interface LdContextPlus<MetadataType extends DefaultSchemaMetadata = DefaultSchemaMetadata> {
  "@context": LdContextPlusRootNode<MetadataType>;
}

export interface LdContextPlusRootNode<MetadataType extends DefaultSchemaMetadata = DefaultSchemaMetadata> {
  "@rootType": string;
  "@id"?: string;
  "@title"?: string;
  "@description"?: string;
  "@metadata"?: MetadataType;
  [key: string]: LdContextPlusNode<MetadataType> | MetadataType | number | string | undefined;
}

export interface LdContextPlusInnerNode<MetadataType extends DefaultSchemaMetadata = DefaultSchemaMetadata> {
  "@id": string;
  "@contains"?: string;
  "@replaceWith"?: string;
  "@title"?: string;
  "@description"?: string;
  "@required"?: boolean;
  "@metadata"?: MetadataType;
  "@context"?: { [key: string]: LdContextPlusNode<MetadataType> };
}

export interface LdContextPlusLeafNode<MetadataType extends DefaultSchemaMetadata = DefaultSchemaMetadata> {
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

export type LdContextPlusNode<MetadataType extends DefaultSchemaMetadata = DefaultSchemaMetadata> =
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
