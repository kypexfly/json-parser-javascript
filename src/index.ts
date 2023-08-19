export function parseJSON(str: string) {
  let index = 0;

  return parseValue();

  function parseValue() {
    skipWhiteSpace();
    const value = parseNumber() ?? parseString() ?? parseObject() ?? parseArray();
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
    skipWhiteSpace();
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

const result1 = parseJSON('"foobar"');
const result2 = parseJSON('{ "foo": "bar" }');
const result3 = parseJSON('["a", "b", "c"]');
const result4 = parseJSON("[1, 2, 3, 4, 5]");
console.log("parse strings: ", result1);
console.log("parse objects: ", result2);
console.log("parse arrays of strings: ", result3);
console.log("parse arrays of numbers: ", result4);
