# TypeScript Type Definitions Testing

This directory contains TypeScript tests to verify that the type definitions in `marklogic.d.ts` work correctly.

## How to Test Types

Run the type checking with:

```bash
npm run test:types
```

This command runs `tsc --noEmit`, which checks for TypeScript errors without generating JavaScript files.

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
