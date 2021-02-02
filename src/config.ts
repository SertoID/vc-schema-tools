// @TODO/tobek This config value needs to be abstracted out and passed in when creating schema instances, and then this file can be deleted.
export interface ConfigType {
  SCHEMA_HOST_URL: string;
}
const config: ConfigType = {
  SCHEMA_HOST_URL: "https://alpha.consensysidentity.com",
};

export { config };
