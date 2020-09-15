import AbstractView from "../view/abstract.js";

const createFilterItemTemplate = (filter, currentFilterType) => {
  const {type, name, count} = filter;

  const isAllMovies = type === `all`;
  const isActive = type === currentFilterType;

  return (
    `<a href="#${type}"
        class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}"
        data-filter-type="${type}"
        data-page="FILMS">
      ${name}
      ${!isAllMovies ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join(``);

  return (
    `<div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createFilterTemplate(this._filters, this._currentFilterType);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName === `A`) {
      this._callback.filterTypeChange(evt.target.dataset.filterType);
    }
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener(`click`, this._filterTypeChangeHandler);
  }
}
