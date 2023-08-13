class ErrorMessage {
  #items = new Map();

  get items() {
    return this.#items;
  }

  add(key, value) {
    if (Array.isArray(key)) {
      key.forEach(value => {
        this.add(...value);
      });
    } else {
      this.#items.set(key, [].concat(value));
    }
  }

  get(...args) {
    const key = args.shift();
    return this.#items.get(key).map(value => {
      return args.reduce(
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
