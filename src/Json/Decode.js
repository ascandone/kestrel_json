const Json$Decode$string = Json$Decode$Decoder(({ repr: json }) => {
  if (typeof json !== "string") {
    return {
      $: "Err",
      a0: { $: "Failure", a0: "a string" },
    };
  }

  return { $: "Ok", a0: json };
});

const Json$Decode$float = Json$Decode$Decoder(({ repr: json }) => {
  if (typeof json !== "number") {
    return {
      $: "Err",
      a0: { $: "Failure", a0: "a number" },
    };
  }

  return { $: "Ok", a0: json };
});

const Json$Decode$int = Json$Decode$Decoder(({ repr: json }) => {
  if (typeof json !== "number") {
    return {
      $: "Err",
      a0: { $: "Failure", a0: "a number" },
    };
  }

  const isInt = Math.trunc(json) === json;
  if (!isInt) {
    return {
      $: "Err",
      a0: { $: "Failure", a0: "an int" },
    };
  }

  return { $: "Ok", a0: json };
});

const Json$Decode$null = Json$Decode$Decoder(({ repr: json }) => {
  if (json !== null) {
    return {
      $: "Err",
      a0: { $: "Failure", a0: "null" },
    };
  }

  return { $: "Ok", a0: json };
});

function Json$Decode$field(fieldName, fieldDecoder) {
  return Json$Decode$Decoder(({ repr: json }) => {
    if (json === null || typeof json !== "object") {
      return {
        $: "Err",
        a0: { $: "Failure", a0: "an object" },
      };
    }

    if (!(fieldName in json)) {
      return {
        $: "Err",
        a0: {
          $: "Failure",
          a0: `an object with a '${fieldName}' field`,
        },
      };
    }

    const res = fieldDecoder.a0(new Json$Encode$Json(json[fieldName]));
    if (res.$ === "Err") {
      return {
        $: "Err",
        a0: {
          $: "Field",
          a0: fieldName,
          a1: res.a0,
        },
      };
    }

    return res;
  });
}

function Json$Decode$optional_field(fieldName, fieldDecoder) {
  return Json$Decode$Decoder(({ repr: json }) => {
    if (json === null || typeof json !== "object") {
      return {
        $: "Err",
        a0: { $: "Failure", a0: "an object" },
      };
    }

    if (!(fieldName in json)) {
      return { $: "Ok", a0: Option$None };
    }

    const res = fieldDecoder.a0(new Json$Encode$Json(json[fieldName]));
    if (res.$ === "Err") {
      return {
        $: "Err",
        a0: {
          $: "Field",
          a0: fieldName,
          a1: res.a0,
        },
      };
    }

    return {
      $: "Ok",
      a0: { $: "Some", a0: res.a0 },
    };
  });
}

function Json$Decode$list(decoder) {
  return Json$Decode$Decoder(({ repr: json }) => {
    if (!Array.isArray(json)) {
      return {
        $: "Err",
        a0: { $: "Failure", a0: "a list" },
      };
    }

    let list = List$Nil;

    for (let i = json.length - 1; i >= 0; i--) {
      const value = json[i];
      const decoded = decoder.a0(
        value instanceof Json$Encode$Json ? value : new Json$Encode$Json(value)
      );

      if (decoded.$ === "Err") {
        return {
          $: "Err",
          a0: {
            $: "Index",
            a0: 1,
            a1: decoded.a0,
          },
        };
      }

      list = { $: "Cons", a0: decoded.a0 };
    }

    return { $: "Ok", a0: list };
  });
}

function Json$Decode$decode(json, decoder) {
  return decoder.a0(json);
}

function Json$Decode$parse_json(str) {
  try {
    const parsed = JSON.parse(str);
    return {
      $: "Ok",
      a0: new Json$Encode$Json(parsed),
    };
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    return {
      $: "Err",
      a0: error.message,
    };
  }
}
