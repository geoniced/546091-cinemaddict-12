import AbstractView from "../view/abstract.js";
import {humanizeDate} from '../utils/common.js';

const formatDate = (date) => {
  const year = date.getYear() + 1900;
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();

  let resultDate = `${year}/${month}/${day} ${hours}:${minutes}`;

  const currentDate = new Date();
  const dateDifference = Math.round((currentDate - date) / 1000 / 60 / 60 / 24);

  if (dateDifference <= 1) {
    resultDate = `Today`;
  } else if (dateDifference <= 2) {
    resultDate = `1 day ago`;
  } else if (dateDifference <= 3) {
    resultDate = `2 days ago`;
  }

  return resultDate;
};

const createGenreItemTemplate = (genre) => {
  return (
    `<span class="film-details__genre">${genre}</span>`
  );
};

const createCommentItemTemplate = (comment) => {
  const {
    emotion,
    text,
    author,
    date,
  } = comment;

  const dateFormatted = formatDate(date);

  return (
    `<li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${text}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${author}</span>
          <span class="film-details__comment-day">${dateFormatted}</span>
          <button class="film-details__comment-delete">Delete</button>
        </p>
      </div>
    </li>`
  );
};


const createFilmDetailsPopupTemplate = (film) => {
  const {
    posterFullSize,
    ageLimit,
    name,
    originalName,
    rating,
    director,
    writers,
    actors,
    releaseDate,
    duration,
    country,
    genres,
    description,
    comments,
  } = film;

  const writersText = writers.join(`, `);
  const actorsText = actors.join(`, `);

  const titleGenre = genres.length > 1
    ? `Genres`
    : `Genre`;
  const genreItems = genres.map(createGenreItemTemplate).join(``);

  const commentsCount = comments.length;
  const commentItems = comments.map(createCommentItemTemplate).join(``);

  return (
    `<section class="film-details">
      <form class="film-details__inner" action="" method="get">
        <div class="form-details__top-container">
          <div class="film-details__close">
            <button class="film-details__close-btn" type="button">close</button>
          </div>
          <div class="film-details__info-wrap">
            <div class="film-details__poster">
              <img class="film-details__poster-img" src="${posterFullSize}" alt="">

              <p class="film-details__age">${ageLimit}</p>
            </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${name}</h3>
                  <p class="film-details__title-original">Original: ${originalName}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${writersText}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${actorsText}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeDate(releaseDate)}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${duration}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${country}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">${titleGenre}</td>
                  <td class="film-details__cell">
                    ${genreItems}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${description}
              </p>
            </div>
          </div>

          <section class="film-details__controls">
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist">
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched">
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite">
            <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
          </section>
        </div>

        <div class="form-details__bottom-container">
          <section class="film-details__comments-wrap">
            <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

            <ul class="film-details__comments-list">
              ${commentItems}
            </ul>

            <div class="film-details__new-comment">
              <div for="add-emoji" class="film-details__add-emoji-label"></div>

              <label class="film-details__comment-label">
                <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
              </label>

              <div class="film-details__emoji-list">
                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                <label class="film-details__emoji-label" for="emoji-smile">
                  <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                <label class="film-details__emoji-label" for="emoji-sleeping">
                  <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                <label class="film-details__emoji-label" for="emoji-puke">
                  <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                </label>

                <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
                <label class="film-details__emoji-label" for="emoji-angry">
                  <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                </label>
              </div>
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsPopup extends AbstractView {
  constructor(filmDetails) {
    super();
    this._filmDetails = filmDetails;

    this._popupCloseButtonClickHandler = this._popupCloseButtonClickHandler.bind(this);
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._filmDetails);
  }

  _getPopupCloseButton() {
    return this.getElement().querySelector(`.film-details__close-btn`);
  }

  _popupCloseButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.popupCloseClick();
  }

  _addToWatchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.addToWatchlistClick();
  }

  _alreadyWatchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.alreadyWatchedClick();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  setPopupCloseButtonClickHandler(callback) {
    this._callback.popupCloseClick = callback;
    this._getPopupCloseButton().addEventListener(`click`, this._popupCloseButtonClickHandler);
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watchlist`).addEventListener(`click`, this._addToWatchlistClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector(`.film-details__control-label--watched`).addEventListener(`click`, this._alreadyWatchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-details__control-label--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }
}
