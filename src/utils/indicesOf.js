import cloneRegexp from 'clone-regexp';

export default function indicesOf(text, searchStringOrRegex, caseSensitive = false, qindex) {
  if (searchStringOrRegex instanceof RegExp) {
    const re = cloneRegexp(searchStringOrRegex, { global: true });
    const indices = [];

    let match = re.exec(text);
    while (match) {
      const offset = match.index + match[0].length;
      indices.push([match.index, offset, qindex]);
      match = re.exec(text);
    }
    return indices;
  }
  const searchStringLen = searchStringOrRegex.length;

  if (searchStringLen === 0) {
    return [];
  }

  const indices = [];

  let strCpy = text;
  let searchStringCpy = searchStringOrRegex;
  if (!caseSensitive) {
    strCpy = text.toLocaleLowerCase();
    searchStringCpy = searchStringOrRegex.toLocaleLowerCase();
  }

  let startIndex = 0;
  let index = strCpy.indexOf(searchStringCpy, startIndex);
  while (index > -1) {
    startIndex = index + searchStringLen;
    indices.push([index, startIndex, qindex]);

    index = strCpy.indexOf(searchStringCpy, index + 1);
  }

  return indices;
}
