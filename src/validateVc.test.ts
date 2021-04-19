import "jest";
import { validateVc } from "./validateVc";
import { EXAMPLE_VCS } from "./examples";

const vcString = EXAMPLE_VCS.DiplomaCredential;
const vc = JSON.parse(EXAMPLE_VCS.DiplomaCredential);

it("should fail on invalid JSON string", async () => {
  const { valid, errors } = await validateVc(vcString.substr(1));
  expect(valid).toBe(false);
  expect(errors[0]).toMatch(/Failed to parse JSON/);
});

it("should be able to validate a basic VC string", async () => {
  const { valid, warnings, errors } = await validateVc(vcString);
  expect(valid).toBe(true);
  expect(warnings.length).toBe(0);
  expect(errors.length).toBe(0);
});
it("should be able to validate a basic VC object", async () => {
  const { valid, warnings, errors } = await validateVc(vc);
  expect(valid).toBe(true);
  expect(warnings.length).toBe(0);
  expect(errors.length).toBe(0);
});

it("should warn on missing `credentialSchema`", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    credentialSchema: undefined,
  });
  expect(valid).toBe(true);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/"credentialSchema" property not found/);
  expect(errors.length).toBe(0);
});
it("should warn on unsupported `credentialSchema.type`", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    credentialSchema: {
      type: "SomethingElse",
    },
  });
  expect(valid).toBe(true);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/not supported/);
  expect(errors.length).toBe(0);
});
it("should warn on missing `credentialSchema.id`", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    credentialSchema: {
      type: "JsonSchemaValidator2018",
      id: undefined,
    },
  });
  expect(valid).toBe(true);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/"credentialSchema.id" property not found/);
  expect(errors.length).toBe(0);
});

it("should warn on failure to fetch JSON Schema", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    credentialSchema: {
      type: "JsonSchemaValidator2018",
      id: "http://blahblahblah",
    },
  });
  expect(valid).toBe(true);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/Failed to fetch JSON Schema/);
  expect(errors.length).toBe(0);
});
// @TODO/tobek Test non-200 response

it("should detect invalid via base VC schema even if no JSON Schema", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    credentialSchema: undefined,
    "@context": undefined,
  });
  expect(valid).toBe(false);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/"credentialSchema" property not found/);
  expect(errors.length).toBe(1);
  expect(errors[0]).toMatch(/should have required property '@context'/);
});

it("should detect missing property from JSON Schema", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    // @TODO/tobek Publish a VC schema that has non-default required properties
    credentialSubject: undefined,
  });
  expect(valid).toBe(false);
  expect(warnings.length).toBe(0);
  expect(errors.length).toBe(1);
  expect(errors[0]).toMatch(/should have required property 'credentialSubject'/);
});
