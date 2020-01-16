export const parseStringToArray = (strings: string) => {
  if (strings && strings.indexOf(',') >= 0) {
    const array: Array<string> = strings
      .split(',')
      .map((tech: string) => tech.trim());
    return array;
  }
  return [];
};
