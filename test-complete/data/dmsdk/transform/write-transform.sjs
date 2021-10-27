function writeTimestamp(context, params, content)
{
  if (context.inputType.search('json') >= 0) {
    const result = content.toObject();
    result.writeTimestamp = fn.currentDateTime();

    // Add a property for each caller-supplied request param
    for (const pname in params) {
      if (params.hasOwnProperty(pname)) {
        result[pname] = params[pname];
      }
    }
    return result;
  } else {
    // Pass thru for non-JSON documents
    return content;
  }
};

exports.transform = writeTimestamp;