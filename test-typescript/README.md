# TypeScript Type Definitions Testing

This directory contains TypeScript tests to verify that the type definitions in `marklogic.d.ts` work correctly.

## Types of Tests

### 1. Compile-Only Tests (Type Checking)
Files like `basic-types.test.ts`, `connection-methods.test.ts`, `type-constraints.test.ts`, `error-examples.test.ts`

- **Purpose**: Verify that TypeScript code compiles without errors
- **Execution**: Not executed at runtime - only compiled
- **Speed**: Very fast (seconds)
- **Requirements**: No MarkLogic server needed
- **Run with**: `npm run test:types`

These tests validate:
- Type definitions are syntactically correct
- Type constraints work (e.g., `authType` only accepts valid values)
- IntelliSense will work for users
- Type errors are caught at compile time

### 2. Runtime Tests
Files like `checkConnection-runtime.test.ts`

- **Purpose**: Verify that TypeScript definitions match actual runtime behavior
- **Execution**: Compiled to JavaScript and executed with mocha
- **Speed**: Slower (requires MarkLogic)
- **Requirements**: MarkLogic server running
- **Run with**: `npm run test:compile && npx mocha test-typescript/*.js`

These tests validate:
- Types compile correctly (compile-time check)
- Real API calls return the expected types (runtime check)
- TypeScript definitions accurately reflect the actual JavaScript behavior

## How to Test Types

### Type Checking Only
```bash
npm run test:types
```

This runs `tsc --noEmit`, which checks for TypeScript errors without generating JavaScript files.

### Runtime Tests
```bash
npm run test:compile    # Compile TypeScript tests to JavaScript
npx mocha test-typescript/*.js    # Run compiled tests against MarkLogic
```

Or in one command:
```bash
npm run test:compile && npx mocha test-typescript/*.js
```

## Why Two Approaches?

**Compile-only tests** are great for:
- Fast feedback during development
- Catching type definition errors quickly
- CI/CD pre-flight checks (before spinning up MarkLogic)
- Validating that autocomplete/IntelliSense will work

**Runtime tests** are essential for:
- Ensuring type definitions match actual behavior
- Catching mismatches between declared types and runtime values
- Integration testing with real MarkLogic instances
- Preventing issues like returning `{}` when a `Promise` was expected

Both approaches complement each other for comprehensive type safety validation.

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

## Adding New Tests

### To add a compile-only test:
1. Create a `.test.ts` file in this directory
2. Use `/// <reference path="../marklogic.d.ts" />` to load types
3. Import types with: `type MyType = import('marklogic').MyType;`
4. Write code that should compile (or intentionally fail)
5. Run `npm run test:types` to verify

### To add a runtime test:
1. Create a `.test.ts` file in this directory
2. Use the same reference and import pattern as above
3. Import test framework: `import should = require('should');`
4. Use `describe`/`it` blocks like normal mocha tests
5. Make actual API calls to MarkLogic
6. Compile with `npm run test:compile` and run with mocha

**Note**: Compiled `.js` files are gitignored and regenerated on each test run.
