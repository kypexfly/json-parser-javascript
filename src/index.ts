export function parseJSON(str: string) {
  let index = 0;

  return parseValue();

  function parseValue() {
    skipWhiteSpace();
    const value = parseString() ?? parseObject();
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
      throw new Error('Expected ",".');
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
console.log("parse strings: ", result1);
console.log("parse objects: ", result2);
