## VC Schema Tools

[![CircleCI](https://circleci.com/gh/SertoID/vc-schema-tools.svg?style=svg)](https://circleci.com/gh/SertoID/vc-schema-tools)

### Installing

```bash
yarn add vc-schema-tools
# or
npm install vc-schema-tools
```

### Validating a VC according to schema

Import the `validateVc` function, an async function with the following signature:

```typescript
validateVc(vc: string | object): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
}>;
```

This function primarily looks at the [`credentialSchema`](https://www.w3.org/TR/vc-data-model/#data-schemas) property, fetching any [JSON Schema](https://json-schema.org/) from the URL found there and validating the VC according to it.

If no `credentialSchema` property is found, the VC is checked against a fallback schema that checks for basic properties like `type`, `issuer`, `issuanceDate`, etc.

Example usage:

```js
import { validateVc, EXAMPLE_VCS } from "vc-schema-tools";

(async function () {
  const vc = JSON.parse(EXAMPLE_VCS.DiplomaCredential);

  let { valid, warnings, errors } = await validateVc(vc);
  // valid === true
  // warnings.length === 0
  // errors.length === 0

  delete vc.credentialSubject.degreeName;
  ({ valid, warnings, errors } = await validateVc(vc));
  // valid === false
  // warnings.length === 0
  // errors.length === 1
  // errors[0].includes("should have required property 'degreeName'")
})();
```

### Generating a VC schema

This library provides a `VcSchema` class that can be instantiated with a [JSON-LD Context Plus schema](https://docs.google.com/document/d/1l41XsI1nTCxx3T6IpAV59UkBrMfRzC89TZRPYiDjOC4/edit?usp=sharing). The resulting instance can be used to validate a VC, generate a JSON-LD context, generate a JSON Schema, and various other utilities.

Example usage:

```js
import { VcSchema, EXAMPLE_SCHEMAS, EXAMPLE_VCS } from "vc-schema-tools";

const schema = new VcSchema(EXAMPLE_SCHEMAS.DiplomaCredential);
console.log("JSON-LD Context Plus:", schema.getLdContextPlusString());
console.log("JSON-LD Context:", schema.getJsonLdContextString());
console.log("JSON Schema:", schema.getJsonSchemaString());

schema.validateVc(EXAMPLE_VCS.DiplomaCredential, (isValid, message) => {
  console.log("VC validity:", isValid);
  console.log("Validation message:", message);
});
```
