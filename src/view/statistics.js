import AbstractView from "../view/abstract.js";

const createStatisticsTemplate = (filmsCount) => {
  return (
    `<p>${filmsCount} movies inside</p>`
  );
};

export default class Statistics extends AbstractView {
  constructor(filmsCount = 0) {
    super();
    this._filmsCount = filmsCount;
  }

  getTemplate() {
    return createStatisticsTemplate(this._filmsCount);
  }
}
