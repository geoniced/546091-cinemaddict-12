import AbstractView from "../view/abstract.js";

const createFilmsPanelTemplate = () => {
  return (
    `<section class="films">
    </section>`
  );
};

export default class FilmsPanel extends AbstractView {
  getTemplate() {
    return createFilmsPanelTemplate();
  }
}
