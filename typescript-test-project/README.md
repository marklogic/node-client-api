# Test Project - Realistic TypeScript Usage

This is a **standalone npm project** that demonstrates how users will consume the MarkLogic Node.js Client with TypeScript support.

## Purpose

This folder serves as:
- A realistic demo of TypeScript integration for colleagues and users
- A quick testing ground for new TypeScript features
- Validation that the library works as an installed npm package
- A showcase of IntelliSense and type safety in action

## Quick Start

### 1. Setup (First Time Only)
```bash
cd typescript-test-project
npm run setup
```

This will:
- Install the parent `marklogic` package (via `file:..`)
- Install TypeScript and type dependencies
- Set up everything needed for type checking

### 2. Test TypeScript Types
```bash
npm test
# or
npm run typecheck
```

This runs TypeScript's compiler in check-only mode (no JS output).

### 3. Edit and Experiment
Open `test.ts` in your IDE (VS Code, IntelliJ, etc.) and start typing:
- You'll get **autocomplete** for all config properties
- **Hover** over methods to see their signatures
- **IntelliSense** shows available options (like authType values)
- Type **errors are highlighted** in real-time

## How It Works

This project installs the parent `marklogic` package using npm's `file:..` protocol, which:
- Simulates a real npm install
- Picks up the `types` field from `package.json` 
- Loads `marklogic.d.ts` automatically
- Provides full TypeScript support

## Demo This to Colleagues

1. **Show autocomplete**: In `test.ts`, type `marklogic.createDatabaseClient({` and watch the suggestions appear
2. **Show type safety**: Try setting `authType: 'invalid'` - TypeScript catches it!
3. **Show IntelliSense**: Hover over `checkConnection()` to see its return type
4. **Show error detection**: Run `npm test` with an invalid config to see type errors

## Files

- `package.json` - Standard npm package configuration
- `tsconfig.json` - TypeScript compiler configuration  
- `test.ts` - Example TypeScript code using the marklogic client
- `.gitignore` - Ignores node_modules and build artifacts

## Updating After Changes

If you make changes to the parent `marklogic` package:

```bash
# Quick way - just reinstall the local package
npm install ..

# Or full clean reinstall
rm -rf node_modules package-lock.json
npm run setup
```

## Note

This is a **development/testing project only** - it's not meant to be published. The `"private": true` flag prevents accidental publishing to npm.
