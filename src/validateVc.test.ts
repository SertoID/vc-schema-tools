import "jest";
import fetchMock from "jest-fetch-mock";
import { validateVc } from "./validateVc";
import { EXAMPLE_VCS, EXAMPLE_SCHEMAS } from "./examples";

const vc = EXAMPLE_VCS.DiplomaCredential;
const vcString = JSON.stringify(vc);

beforeEach(() => {
  fetchMock.enableMocks();
  fetchMock.mockResponse(JSON.stringify(EXAMPLE_SCHEMAS.DiplomaCredential));
});

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
  expect(warnings[0]).toMatch(/No "credentialSchema" property found/);
  expect(errors.length).toBe(0);
});
it("should warn on unsupported `credentialSchema.type`", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...(vc as any),
    credentialSchema: {
      ...vc.credentialSchema,
      type: "SomethingElse",
    },
  });
  expect(valid).toBe(true);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/"SomethingElse" not supported/);
  expect(errors.length).toBe(0);
});
it("should fail on missing `credentialSchema.id`", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...(vc as any),
    credentialSchema: {
      ...vc.credentialSchema,
      id: undefined,
    },
  });
  expect(valid).toBe(false);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/"credentialSchema.id" property not found/);
  expect(errors.length).toBe(1);
  expect(errors[0]).toMatch(/must have required property 'id'/);
});

it("should warn on failure to fetch JSON Schema", async () => {
  fetchMock.mockResponse(() => Promise.reject(new Error("nope")));
  const { valid, warnings, errors } = await validateVc(vc);
  expect(valid).toBe(true);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/Failed to (load|fetch) JSON Schema/);
  expect(errors.length).toBe(0);
});
it("should warn on non-200 response when fetching JSON Schema", async () => {
  fetchMock.mockResponse(() => Promise.resolve({ status: 404 }));
  const { valid, warnings, errors } = await validateVc(vc);
  expect(valid).toBe(true);
  expect(warnings.length).toBeGreaterThanOrEqual(1);
  expect(warnings[0]).toMatch(/404 response when fetching JSON Schema/);
  expect(errors.length).toBe(0);
});

it("should detect missing property from base VC schema even if no JSON Schema provided", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...(vc as any),
    credentialSchema: undefined,
    "@context": undefined,
  });
  expect(valid).toBe(false);
  expect(warnings.length).toBe(1);
  expect(warnings[0]).toMatch(/No "credentialSchema" property found/);
  expect(errors.length).toBe(1);
  expect(errors[0]).toMatch(/must have required property '@context'/);
});

it("should detect missing property from JSON Schema", async () => {
  const { valid, warnings, errors } = await validateVc({
    ...vc,
    credentialSubject: {
      ...vc.credentialSubject,
      universityName: undefined,
    },
  });
  expect(valid).toBe(false);
  expect(warnings.length).toBe(0);
  expect(errors.length).toBe(1);
  expect(errors[0]).toMatch(/must have required property 'universityName'/);
});

it("should handle a schema with references", async () => {
  fetchMock.mockOnce(JSON.stringify(EXAMPLE_SCHEMAS.TestWithReferences));
  fetchMock.dontMockIf(/https:\/\/w3id.org\/traceability/);

  const { valid, warnings, errors } = await validateVc(EXAMPLE_VCS.TestWithReferences);
  expect(warnings.length).toBe(0);
  expect(errors.length).toBe(0);
  expect(valid).toBe(true);
});

it("should fail on errors in a referenced schema", async () => {
  fetchMock.mockOnce(JSON.stringify(EXAMPLE_SCHEMAS.TestWithReferences));
  fetchMock.dontMockIf(/https:\/\/w3id.org\/traceability/);

  const vc = {
    ...EXAMPLE_VCS.TestWithReferences,
    credentialSubject: {
      ...EXAMPLE_VCS.TestWithReferences.credentialSubject,
      address: {
        ...EXAMPLE_VCS.TestWithReferences.credentialSubject.address,
        addressCountry: 5,
      },
    },
  };
  const { valid, warnings, errors } = await validateVc(vc);
  expect(valid).toBe(false);
  expect(warnings.length).toBe(0);
  expect(errors.length).toBe(1);
  expect(errors[0]).toMatch(/must be string.*addressCountry/);
});
