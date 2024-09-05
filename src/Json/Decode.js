const Json$Decode$bool = (json) => {
  if (typeof json !== "boolean") {
    return {
      $: 1,
      _0: { $: 0, _0: "a boolean" },
    };
  }

  return { $: 0, _0: json };
};

const Json$Decode$string = (json) => {
  if (typeof json !== "string") {
    return {
      $: 1,
      _0: { $: 0, _0: "a string" },
    };
  }

  return { $: 0, _0: json };
};

const Json$Decode$float = (json) => {
  if (typeof json !== "number") {
    return {
      $: 1,
      _0: { $: 0, _0: "a number" },
    };
  }

  return { $: 0, _0: json };
};

const Json$Decode$int = (json) => {
  if (typeof json !== "number") {
    return {
      $: 1,
      _0: { $: 0, _0: "a number" },
    };
  }

  const isInt = Math.trunc(json) === json;
  if (!isInt) {
    return {
      $: 1,
      _0: { $: 0, _0: "an int" },
    };
  }

  return { $: 0, _0: json };
};

const Json$Decode$null = (json) => {
  if (json !== null) {
    return {
      $: 1,
      _0: { $: 0, _0: "null" },
    };
  }

  return { $: 0, _0: json };
};

function Json$Decode$field(fieldName, fieldDecoder) {
  return (json) => {
    if (json === null || typeof json !== "object") {
      return {
        $: 1,
        _0: { $: 0, _0: "an object" },
      };
    }

    if (!(fieldName in json)) {
      return {
        $: 1,
        _0: {
          $: 0,
          _0: `an object with a '${fieldName}' field`,
        },
      };
    }

    const res = fieldDecoder(json[fieldName]);
    if (res.$ === 1) {
      return {
        $: 1,
        _0: {
          $: 1,
          _0: fieldName,
          _1: res._0,
        },
      };
    }

    return res;
  };
}

function Json$Decode$optional_field(fieldName, fieldDecoder) {
  return (json) => {
    if (json === null || typeof json !== "object") {
      return {
        $: 1,
        _0: { $: 0, _0: "an object" },
      };
    }

    if (!(fieldName in json)) {
      return { $: 0, _0: Option$None };
    }

    const res = fieldDecoder(json[fieldName]);
    if (res.$ === 1) {
      return {
        $: 1,
        _0: {
          $: 1,
          _0: fieldName,
          _1: res._0,
        },
      };
    }

    return {
      $: 0,
      _0: { $: 0, _0: res._0 },
    };
  };
}

function Json$Decode$list(decoder) {
  return (json) => {
    if (!Array.isArray(json)) {
      return {
        $: 1,
        _0: { $: 0, _0: "a list" },
      };
    }

    let list = List$Nil;

    for (let i = json.length - 1; i >= 0; i--) {
      const value = json[i];
      const decoded = decoder(value);

      if (decoded.$ === 1) {
        return {
          $: 1,
          _0: {
            $: 2,
            _0: 1,
            _1: decoded._0,
          },
        };
      }

      list = { $: 1, _0: decoded._0, _1: list };
    }

    return { $: 0, _0: list };
  };
}

function Json$Decode$decode(json, decoder) {
  return decoder(json);
}

function Json$Decode$parse_json(str) {
  try {
    const parsed = JSON.parse(str);
    return {
      $: 0,
      _0: parsed,
    };
  } catch (error) {
    if (!(error instanceof SyntaxError)) {
      throw error;
    }

    return {
      $: 1,
      _0: error.message,
    };
  }
}
