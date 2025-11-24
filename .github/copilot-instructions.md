When generating TypeScript definitions, follow this advice:

All types will go into marklogic.d.ts.

Determining the output type is difficult. You have to look at the module containing the 
implementation code and look for an "outputTransform". The implementation of that function 
should reveal what the user-facing function will return. 

Please add "runtime" tests to the test-typescript directory. These tests should do 
"smoke" tests that - critically - verify the output of each function. 
