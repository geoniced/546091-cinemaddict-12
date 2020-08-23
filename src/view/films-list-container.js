import AbstractView from "../view/abstract.js";

export const createFilmsListContainerTemplate = () => {
  return (
    `<div class="films-list__container"></div>`
  );
};

export default class FilmsListContainer extends AbstractView {
  getTemplate() {
    return createFilmsListContainerTemplate();
  }
}
