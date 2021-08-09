export function oneLine(strings: TemplateStringsArray, ...values: any[]) {
  const processedString = strings.reduce((acc, curr, i) => {
    acc += curr + (values[i] ?? '');
    return acc;
  }, '');

  return processedString
    .split('\n')
    .map((line) => line.trim())
    .join(' ')
    .trim();
}
