import Ajv from "ajv";
import fetch, { Response } from "cross-fetch";
import { VC } from "./types";
import { baseVcJsonSchema } from "./helpers";

export async function validateVc(
  _vc: string | VC,
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  let valid = true; // @TODO/tobek What's the default here?
  let errors: string[] = [];
  const warnings: string[] = [];

  let vc: VC;
  try {
    vc = typeof _vc === "string" ? JSON.parse(_vc) : { ..._vc };
  } catch (err) {
    errors.push("Failed to parse JSON: " + err.message);
    return {
      valid: false,
      errors,
      warnings,
    };
  }

  let jsonSchema: any;

  if (!vc.credentialSchema) {
    warnings.push(`"credentialSchema" property not found. Falling back to base VC schema.`);
  } else if (!vc.credentialSchema.type || vc.credentialSchema.type.indexOf("JsonSchemaValidator") !== 0) {
    warnings.push(
      `"credentialSchema.type" value "${vc.credentialSchema.type}" not supported - expecting "JsonSchemaValidator2018". Falling back to base VC schema.`,
    );
  } else if (!vc.credentialSchema.id) {
    warnings.push(`"credentialSchema.id" property not found. Falling back to base VC schema.`);
  } else {
    let res: Response | undefined;
    try {
      res = await fetch(vc.credentialSchema.id);
      if (res.status >= 400) {
        warnings.push(
          `${res.status} response when fetching JSON Schema from ${vc.credentialSchema.id}. Falling back to base VC schema.`,
        );
      }
    } catch (err) {
      warnings.push(
        `Failed to fetch JSON Schema from ${vc.credentialSchema.id}: ${err.message}. Falling back to base VC schema.`,
      );
    }

    if (res) {
      try {
        const responseIsJson = res.headers.get("content-type")?.indexOf("application/json") === 0;
        jsonSchema = responseIsJson ? await res.json() : JSON.parse(await res.text());
      } catch (err) {
        warnings.push(
          `Failed to load JSON Schema from ${vc.credentialSchema.id}, could not get or parse JSON response: ${err.message}. Falling back to base VC schema.`,
        );
      }
    }
  }

  let validator: Ajv.ValidateFunction | undefined;
  try {
    const ajv = new Ajv();
    validator = ajv.compile(jsonSchema || baseVcJsonSchema);
  } catch (err) {
    errors.push(`Failed to generate JSON Schema from input: ${err.message}. Could not validate.`);
    // @TODO/tobek Set valid to false?
  }

  if (validator) {
    valid = await validator(vc);
    if (validator.errors?.length) {
      // @TODO/tobek Should we always include the whole error?
      errors = errors.concat(validator.errors.map((err) => err.message || JSON.stringify(err)));
    }
  }

  return {
    valid,
    errors,
    warnings,
  };
}
