class UtilService {
  public normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, '');
  }
}

export default new UtilService();
