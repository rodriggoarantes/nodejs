export const parseStringToArray = (strings: string) => {
  if (strings) {
    if (strings.indexOf(',') >= 0) {
      const array: Array<string> = strings
        .split(',')
        .map((tech: string) => tech.trim());
      return array;
    } else {
      return [strings.trim()];
    }
  }
  return [];
};
