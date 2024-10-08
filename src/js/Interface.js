export default class Interface {
  constructor(root) {
    this.operation = undefined;
    this.firstFigure = '0';
    this.secondFigure = '0';
    this.result = undefined;
    this.bindToDOM(root);
  }

  bindToDOM(root) {
    if (!(root instanceof HTMLElement)) {
      throw new Error('container is not HTMLElement');
    }
    this.numbers = root.querySelector('.numbers');
    this.operations = root.querySelector('.operations');
    this.display = root.querySelector('.display');
  }

  init() {
    this.numbers.addEventListener('click', (e) => this.operationCheck(e.target.id));
    document.body.addEventListener('keydown', (e) => this.keyboardEvent(e));
    this.operations.addEventListener('click', (e) => this.setOperation(e.target.id));
    this.changeDisplay(this.firstFigure);
  }

  operationCheck(value) {
    if (!this.operation) this.setFigure(value, 'firstFigure');
    else this.setFigure(value, 'secondFigure');
  }

  keyboardEvent(e) {
    const { ctrlKey, altKey, shiftKey } = e;
    let { key } = e;
    if (ctrlKey || altKey || shiftKey) return;
    if (key === 'Enter') key = '=';
    const regOperation = /(c|=|\+|-|\*|\/){1}/gi;
    const regFigure = /\d|\./g;
    if (regOperation.test(key)) {
      this.setOperation(key);
      return;
    }
    if (regFigure.test(key)) this.operationCheck(key);
  }

  setFigure(value, label) {
    if (this[label].toString().includes('.') && value === '.') return;
    if (this[label] === '0' && value === '.') this[label] = '0.';
    else if (this[label] === '0') this[label] = value;
    else this[label] += value;

    if (label === 'firstFigure') {
      this.changeDisplay(this.firstFigure);
      return;
    }
    this.changeDisplay(`${this.firstFigure} ${this.operation} ${this.secondFigure}`);
  }

  setOperation(value) {
    if (value === 'C' || value === 'c') {
      this.firstFigure = '0';
      this.changeDisplay(this.firstFigure);
      this.clear();
      return;
    }
    if (!this.operation && value !== '=') {
      this.operation = value;
      this.changeDisplay(`${this.firstFigure} ${value}`);
      return;
    }
    if (this.operation && value === '=') {
      this.proceed();
    }
  }

  proceed() {
    const firstInt = Number(this.firstFigure);
    const secondInt = Number(this.secondFigure);
    switch (this.operation) {
      case '-': this.result = firstInt - secondInt;
        break;
      case '*': this.result = firstInt * secondInt;
        break;
      case '/': this.result = firstInt / secondInt;
        break;
      default: this.result = firstInt + secondInt;
        break;
    }
    if (this.result.toString().length > 5) this.result = Number(this.result.toPrecision(5));
    this.firstFigure = this.result;
    this.changeDisplay(this.result);
    this.clear();
  }

  changeDisplay(value) {
    this.display.innerHTML = value;
  }

  clear() {
    this.secondFigure = '0';
    this.operation = undefined;
    this.result = undefined;
  }
}
