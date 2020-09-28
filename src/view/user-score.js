import AbstractView from "../view/abstract.js";
import {getUserScoreTitle} from "../utils/stats.js";

const createUserScoreTemplate = (userScore) => {
  const userScoreTitle = getUserScoreTitle(userScore);

  return (
    `<section class="header__profile profile">
      ${userScoreTitle !== null ? `<p class="profile__rating">${userScoreTitle}</p>` : ``}
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
  );
};

export default class UserScore extends AbstractView {
  constructor(userScore = 0) {
    super();

    this._userScore = userScore;
  }

  getTemplate() {
    return createUserScoreTemplate(this._userScore);
  }
}
