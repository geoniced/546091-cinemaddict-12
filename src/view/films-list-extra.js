import AbstractView from "../view/abstract.js";

export const createFilmsListExtraTemplate = () => {
  return (
    `<section class="films-list--extra">
      <h2 class="films-list__title">Top rated</h2>
    </section>`
  );
};

export default class FilmsListExtra extends AbstractView {
  getTemplate() {
    return createFilmsListExtraTemplate();
  }
}
