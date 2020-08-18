import {createElement} from "../utils";

export const createFilmsListExtraTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`
  );
};

export default class FilmsListExtra {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsListExtraTemplate();
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
