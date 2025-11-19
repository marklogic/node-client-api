# TypeScript Type Definitions Testing

This directory contains TypeScript tests to verify that the type definitions in `marklogic.d.ts` work correctly.

## How to Test Types

Run the type checking with:

```bash
npm run test:types
```

This command runs `tsc --noEmit`, which checks for TypeScript errors without generating JavaScript files.

## What Gets Tested

### ✅ Type Constraints
- Valid values for `authType` (basic, digest, application-level, certificate, kerberos, saml, cloud)
- Optional vs required properties
- Union types (string | Buffer for certificates)
- Array types (string[] for multiple certificates)

### ✅ Type Safety
If you uncomment the error examples in the test files, TypeScript will catch:
- Invalid `authType` values
- Incorrect property types
- Missing required properties

## Test Files

### `type-constraints.test.ts`
Tests the `DatabaseClientConfig` interface constraints without importing the module. This works immediately without needing to simulate package installation.

### `basic-types.test.ts` (currently excluded)
Full integration test that imports the `marklogic` module. To use this:
1. Build/link the package locally (`npm link`)
2. Remove it from the exclude list in `tsconfig.json`
3. Run `npm run test:types` again

## Adding More Type Tests

As you add more interfaces to `marklogic.d.ts`, add corresponding test files here. The pattern is:

1. Create a `.test.ts` file
2. Write TypeScript code that uses the types
3. Include examples that should work AND commented examples that should fail
4. Run `npm run test:types` to verify

## Why This Approach?

TypeScript's compiler is the best way to test type definitions because:
- It catches type errors at compile time (before runtime)
- It validates type constraints (like union types for `authType`)
- It ensures IntelliSense and autocomplete will work for users
- It's fast and doesn't require running actual code

## Example: Testing for Type Errors

```typescript
// This should work fine ✅
const good: DatabaseClientConfig = {
  authType: 'digest'
};

// This should fail ❌ (uncomment to test)
// const bad: DatabaseClientConfig = {
//   authType: 'invalid-type'
// };
```

When you uncomment the error example and run `npm run test:types`, you'll see:
```
error TS2322: Type '"invalid-type"' is not assignable to type 'basic' | 'digest' | ...
```

This confirms your types are working correctly!
