import AbstractView from "../view/abstract.js";

const createFilterItemTemplate = (filter) => {
  const {name, count} = filter;

  const isAllMovies = name === `all`;
  const capitalizedName = isAllMovies ? `All movies` : `${name[0].toUpperCase()}${name.slice(1)}`;
  const isActive = isAllMovies;

  return (
    `<a href="#${name}" class="main-navigation__item ${isActive ? `main-navigation__item--active` : ``}">${capitalizedName}
      ${!isAllMovies ? `<span class="main-navigation__item-count">${count}</span>` : ``}
    </a>`
  );
};

const createFilterTemplate = (filters) => {
  const filterItemsTemplate = filters
    .map(createFilterItemTemplate)
    .join(``);

  return (
    `<div class="main-navigation__items">
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
