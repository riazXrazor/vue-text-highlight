import { indicesOf, mergeRange } from '../utils';

export default function highlightChunks(text, queriesOrQuery, caseSensitive = false) {
  let queries = queriesOrQuery;
  if (typeof queriesOrQuery === 'string' || queriesOrQuery instanceof RegExp) {
    queries = [queriesOrQuery];
  } else if (!Array.isArray(queriesOrQuery)) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error('queries must be either string, array of strings or regex.');
    } else {
      return [];
    }
  }

  const matches = [];

  queries.forEach((query, qindex) => {
    matches.push(...indicesOf(text, query, caseSensitive, qindex));
  });


  // console.log('m',matches)

  const highlights = matches;

  // console.log('h',highlights)

  const chunks = [];
  let lastEnd = 0;

  highlights.forEach(([start, end, qindex], index) => {
    if (lastEnd !== start) {
      chunks.push({
        isHighlighted: false,
        text: text.slice(lastEnd, start),
      });
    }
    chunks.push({
      isHighlighted: true,
      text: text.slice(start, end),
      highlightIndex: index,
      queryindex: qindex,
    });

    lastEnd = end;
  });

  if (lastEnd !== text.length) {
    chunks.push({
      isHighlighted: false,
      text: text.slice(lastEnd),
    });
  }

  return chunks;
}
