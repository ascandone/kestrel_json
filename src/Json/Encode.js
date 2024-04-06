class Json$Encode$Json {
  constructor(repr) {
    this.repr = repr;
  }
}

const Json$Encode$null = new Json$Encode$Json(null);

function Json$Encode$wrap(str) {
  return new Json$Encode$Json(str);
}

function Json$Encode$list(mapper, list) {
  const arr = [];
  while (list !== List$Nil) {
    arr.push(list.a0);
    list = list.a1;
  }
  return new Json$Encode$Json(arr);
}

function Json$Encode$object(fields) {
  let o = {};

  while (fields !== List$Nil) {
    const { a0: fieldName, a1: json } = fields.a0;
    o[fieldName] = json.repr;
    fields = fields.a1;
  }

  return new Json$Encode$Json(o);
}
