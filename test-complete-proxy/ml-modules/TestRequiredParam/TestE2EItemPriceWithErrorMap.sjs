function TestE2EItemPriceWithErrorMap(inputIntegertVaue) {
// Function to test multiple error mappings
var retDoubleValue;

if (inputIntegertVaue == null) {

// Return a valid datatype back to client so that we know null input parameter works

retDoubleValue = 55555.00;
return encodeURI(retDoubleValue);

}

var inputInt = parseInt(inputIntegertVaue, 10);

if (inputInt == 10) {

// Return MLQA-ERROR-1 when input is 10
fn.error(xs.QName("MLQA-ERROR-1"), "MLQA-ERROR-1", "Test for message status code 482");

//retDoubleValue = "String10";

}

else if (inputInt == 1000) {

// Return null when input is 1000
//retDoubleValue = null;
// Return MLQA-ERROR-2 when input is 1000
fn.error(xs.QName("MLQA-ERROR-2"), "MLQA-ERROR-2", "Test for message status code 539");
}

else {

retDoubleValue = inputInt + 1.00;

}

console.debug("Return from CLIENT API new double value is : %s", retDoubleValue);

return encodeURI(retDoubleValue);

}

var t = TestE2EItemPriceWithErrorMap(xdmp.getRequestField("itemId"));

t;