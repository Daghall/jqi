export default function extractKeys(string) {
  const result = [];
  let keyFound = false;
  let searchFrom = 0;
  let start = 0;
  let pos = 0;

  if (!/^\[(.*\n)*\]$/.test(string)) {
    return [];
  }

  while (pos !== -1) {
    pos = string.indexOf('"', searchFrom);

    if (string[pos - 1] === "\\") {
      searchFrom = pos + 1;
      continue;
    }

    if (keyFound) {
      result.push(string.slice(start, pos).replace(/\\"/g, '"'));
    }

    keyFound = !keyFound;
    start = pos + 1;
    searchFrom = start;
  }

  return result;
}
