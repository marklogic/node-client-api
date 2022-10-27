function transform_function(context, params, content) {
    let document = content + "";
    document = document.replace(document, params.newValue);
    return document;
}

module.exports = {
    transform: transform_function
};
