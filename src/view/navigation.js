import AbstractView from "../view/abstract.js";

const createNavigationTemplate = () => {
  return (
    `<nav class="main-navigation">
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`
  );
};

export default class Navigation extends AbstractView {
  getTemplate() {
    return createNavigationTemplate();
  }
}
