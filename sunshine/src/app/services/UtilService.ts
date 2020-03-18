class UtilService {
  public normalizeValue(value: string): string {
    const clearString = this.removeSpecialChars(value);
    return clearString.toLowerCase().replace(/\s/g, '');
  }

  public removeSpecialChars(value: string): string {
    const parsed = value
      .normalize('NFD')
      .replace(/([\u0300-\u036f]|[^0-9a-zA-Z])/g, '');
    return parsed;
  }
}

export default new UtilService();
