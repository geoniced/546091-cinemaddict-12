import AbstractView from "../view/abstract.js";

const createStatisticsTemplate = () => {
  return (
    `<p>130 291 movies inside</p>`
  );
};

export default class Statistics extends AbstractView {
  getTemplate() {
    return createStatisticsTemplate();
  }
}
