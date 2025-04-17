class ErrorMessage {
  items: Map<string, string[]> = new Map();

  add(key: string | [string, [string, string]][], value?: string | string[]) {
    if (Array.isArray(key)) {
      key.forEach(([key, value]) => {
        this.add(key, value);
      });
    } else if (value) {
      if (!Array.isArray(value)) {
        value = [value];
      }
      this.items.set(key, value);
    }
  }

  get(...keys: string[]) {
    const key = keys.shift() || '';
    return this.items.get(key)?.map(value => {
      return keys.reduce(
        (result, value) => result.replace(/%\d+/, value),
        value
      );
    });
  }
}

const errorMessage = new ErrorMessage();

errorMessage.add('bad_args', 'Bad args');
errorMessage.add('cant_find', "Can't find %1");

export default errorMessage;
