import {createElement} from "../utils";

export const createFilmsPanelTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmsPanel {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsPanelTemplate();
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
