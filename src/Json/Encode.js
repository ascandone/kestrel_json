const Show_Json$Encode$Json = (j) => JSON.stringify(j);

const Json$Encode$null = null;

function Json$Encode$wrap(str) {
  return str;
}

function Json$Encode$list(mapper, list) {
  const arr = [];
  while (list !== List$Nil) {
    arr.push(mapper(list.a0));
    list = list.a1;
  }
  return arr;
}

function Json$Encode$object(fields) {
  let o = {};

  while (fields !== List$Nil) {
    const { a0: fieldName, a1: json } = fields.a0;
    o[fieldName] = json;
    fields = fields.a1;
  }

  return o;
}
