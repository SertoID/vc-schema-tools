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

  vc.credentialSubject.degreeName = undefined;
  ({ valid, warnings, errors } = await validateVc(vc));
  // valid === false
  // warnings.length === 0
  // errors.length === 1
  // errors[0].includes("should have required property 'degreeName'")
})();
```
