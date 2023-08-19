export function parseJSON(str: string) {
  let index = 0;

  return parseValue();

  function parseValue() {
    skipWhiteSpace();

    const value =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword("true", true) ??
      parseKeyword("false", false) ??
      parseKeyword("null", null);

    skipWhiteSpace();
    return value;
  }

  function parseObject() {
    if (str[index] === "{") {
      index++;
      skipWhiteSpace();

      const result: Record<string, unknown> = {};

      let initial = true;

      while (str[index] !== "}") {
        if (!initial) {
          eatComma();
          skipWhiteSpace();
        }
        const key = parseString();
        skipWhiteSpace();
        eatColon();
        const value = parseValue();

        result[key] = value;
        initial = false;
      }

      index++;
      return result;
    }
  }

  function parseString(): any {
    if (str[index] === '"') {
      index++;
      let result = "";
      while (str[index] !== '"') {
        if (str[index] === "\\") {
          const char = str[index + 1];
          if (
            char === '"' ||
            char === "\\" ||
            char === "/" ||
            char === "b" ||
            char === "f" ||
            char === "n" ||
            char === "r" ||
            char === "t"
          ) {
            result += char;
            index++;
          }
        } else {
          result += str[index];
        }
        index++;
      }
      index++;
      return result;
    }
  }

  function parseArray(): any {
    if (str[index] === "[") {
      index++;
      skipWhiteSpace();

      const result = [];
      let initial = true;

      while (str[index] !== "]") {
        if (!initial) {
          eatComma();
          skipWhiteSpace();
        }
        const value = parseValue();
        result.push(value);
        initial = false;
      }
      index++;
      return result;
    }
  }

  function parseNumber() {
    let start = index;

    // Negative
    if (str[index] === "-") {
      index++;
    }

    // Integer part
    if (str[index] === "0") {
      index++;
    } else if (str[index] >= "1" && str[index] <= "9") {
      index++;
      while (str[index] >= "0" && str[index] <= "9") {
        index++;
      }
    }

    // Floating part
    if (str[index] === ".") {
      index++;
      while (str[index] >= "0" && str[index] <= "9") {
        index++;
      }
    }

    // Scientific notation
    if (str[index] === "e" || str[index] === "E") {
      index++;
      if (str[index] === "-" || str[index] === "+") {
        index++;
      }
      while (str[index] >= "0" && str[index] <= "9") {
        index++;
      }
    }

    if (index > start) {
      return Number(str.slice(start, index));
    }
  }

  function parseKeyword(name: string, value: unknown): any {
    if (str.slice(index, index + name.length) === name) {
      index += name.length;
      return value;
    }
  }

  function skipWhiteSpace() {
    while (
      str[index] === " " ||
      str[index] === "\n" ||
      str[index] === "\t" ||
      str[index] === "\r"
    ) {
      index++;
    }
  }

  function eatComma() {
    if (str[index] !== ",") {
      throw new Error('Expected ","');
    }
    index++;
  }

  function eatColon() {
    if (str[index] !== ":") {
      throw new Error('Expected ":".');
    }
    index++;
  }
}