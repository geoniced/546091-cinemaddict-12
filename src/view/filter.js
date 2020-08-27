import AbstractView from "../view/abstract.js";

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  const capitalizedName = `${name[0].toUpperCase()}${name.slice(1)}`;

  return (
    `<a href="#${name}" class="main-navigation__item">${capitalizedName} <span class="main-navigation__item-count">${count}</span></a>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map(createFilterItemTemplate)
    .join(``);

  return (
    `<div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      ${filterItemsTemplate}
    </div>`
  );
};

export default class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
  }

  getTemplate() {
    return createFilterTemplate(this._filters);
  }
}
