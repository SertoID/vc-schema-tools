import { ValidateFunction } from "ajv";
import "cross-fetch/polyfill";
import { Response } from "cross-fetch";
import { VC } from "./types";
import { baseVcJsonSchema, getNewAjv } from "./helpers";

export async function validateVc(
  _vc: string | VC,
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}> {
  let valid = true;
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

  let jsonSchema: { [key: string]: any } | undefined;

  if (!vc.credentialSchema) {
    warnings.push(`No "credentialSchema" property found. Falling back to base VC schema.`);
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

  let validator: ValidateFunction | undefined;
  try {
    const ajv = getNewAjv();
    validator = await ajv.compileAsync(jsonSchema || baseVcJsonSchema);
  } catch (err) {
    errors.push(
      `Failed to compile JSON Schema from response from ${vc.credentialSchema?.id}: ${err.message}. Could not validate.`,
    );
    valid = false;
  }

  if (validator) {
    valid = await validator(vc);
    if (validator.errors?.length) {
      errors = errors.concat(
        validator.errors.map((err) => {
          let errorMessage = JSON.stringify(err);
          if (err.message) {
            errorMessage = `${err.message} (${errorMessage})`;
          }
          return errorMessage;
        }),
      );
    }
  }

  return {
    valid,
    errors,
    warnings,
  };
}
