export function findBibleVerses(contentBlock, callback) {
  const text = contentBlock.getText();
  const regex = /\b(?:[1-3]?\s?[a-záéíóúñ]+)\d+:\d{1,3}(?:-\d{1,3})?(?:,\d{1,3}(?:-\d{1,3})?)*\b/gi;

  let matchArr;
  while ((matchArr = regex.exec(text)) !== null) {
    callback(matchArr.index, matchArr.index + matchArr[0].length);
  }
}
