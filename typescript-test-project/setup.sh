#!/bin/bash
# Quick setup script for test-project

echo "🚀 Setting up TypeScript test project..."
echo ""
echo "This will:"
echo "  1. Install the parent marklogic package (file:..)"
echo "  2. Install TypeScript and @types/node"
echo "  3. Verify type checking works"
echo ""

npm install

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Setup complete!"
  echo ""
  echo "Try these commands:"
  echo "  npm test          - Check TypeScript types"
  echo "  npm run typecheck - Same as above"
  echo ""
  echo "Open test.ts in your IDE to see autocomplete and IntelliSense in action!"
else
  echo ""
  echo "❌ Setup failed. Check the errors above."
  exit 1
fi
