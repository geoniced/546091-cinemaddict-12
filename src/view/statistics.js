import {createElement} from "../utils";

const createStatisticsTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

export default class Statistics {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
