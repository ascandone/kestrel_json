const Show_Json$Encode$Json = (j) => JSON.stringify(j);

const Json$Encode$null = null;

function Json$Encode$wrap(str) {
  return str;
}

function Json$Encode$list(mapper, list) {
  const arr = [];
  while (list.$ !== 0) {
    arr.push(mapper(list._0));
    list = list._1;
  }
  return arr;
}

function Json$Encode$object(fields) {
  let o = {};

  while (fields !== List$Nil) {
    const { _0: fieldName, _1: json } = fields._0;
    o[fieldName] = json;
    fields = fields._1;
  }

  return o;
}

function Json$Encode$encode(json, i) {
  return JSON.stringify(json, null, i);
}
