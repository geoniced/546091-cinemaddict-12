import AbstractView from "../view/abstract.js";

export const createFilmsListExtraTemplate = (panelTitle) => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">${panelTitle}</h2>
    </section>`
  );
};

export default class FilmsListExtra extends AbstractView {
  constructor(panelTitle) {
    super();
    this._panelTitle = panelTitle;
  }

  getTemplate() {
    return createFilmsListExtraTemplate(this._panelTitle);
  }
}
