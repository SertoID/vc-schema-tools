import { config } from "./config";

export function getSchemaUrl(slug: string, type: "ld-context-plus" | "ld-context" | "json-schema"): string {
  return `${config.SCHEMA_HOST_URL}/v1/schemas/public/${slug}/${type}.json`;
}
