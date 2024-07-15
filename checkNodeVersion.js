const result = process.versions;
if (result && result.node) {
    const nodeVersion = parseFloat(result.node).toFixed(2);
    if (nodeVersion >= 16.14) {
        console.log('-------******* Good to Go with your Node Version: ' + result.node + ' *******-------');
    } else {
        console.log('-------******* Package installation(npm install) or Project startup command(npm start) failed due to Node Version, Please install and use Node Version >=16.14 *******-------');
        console.log('-------******* Your current Node Version is: ' + result.node + ' *******-------');
        process.exit(1);
    }
} else {
    console.log('-------******* Something went wrong while checking Node version *******-------');
    process.exit(1);
}