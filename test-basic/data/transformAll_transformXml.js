function transform_function(context, params, content) {
    let replaced = content.getElementsByTagName("key")[0].childNodes[0].nodeValue + "";
    let document = content + "";
    document = document.replace(replaced, params.newValue);
    return document;
}

module.exports = {
    transform: transform_function
};
