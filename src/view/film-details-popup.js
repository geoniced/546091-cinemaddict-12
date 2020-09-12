import SmartView from "../view/smart.js";
import {humanizeDate, getDuration} from '../utils/common.js';
import {EMOTIONS} from "../const.js";
import moment from "moment";

const formatDate = (date) => {
  let resultDate = moment(date).format(`YYYY/M/D H:mm`);

  const currentDate = new Date();
  const dateDifference = moment.duration(moment(currentDate).diff(moment(date))).days();

  if (dateDifference <= 4) {
    resultDate = moment(date).fromNow();
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
    id,
    emotion,
    text,
    author,
    date,
  } = comment;

  const dateFormatted = formatDate(date);

  return (
    `<li class="film-details__comment" data-comment-id="${id}">
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

const createEmotionsListTemplate = (choosenEmotion) => {
  return EMOTIONS.map((emotion) => (
    `<input class="film-details__emoji-item visually-hidden"
            name="comment-emoji"
            type="radio"
            id="emoji-${emotion}"
            value="${emotion}"
            ${emotion === choosenEmotion ? `checked` : ``}>
    <label class="film-details__emoji-label" for="emoji-${emotion}">
      <img src="./images/emoji/${emotion}.png" width="30" height="30" alt="emoji">
    </label>`
  )).join(``);
};

const createCurrentEmojiTemplate = (emotion) => {
  if (!emotion) {
    return ``;
  }

  return `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`;
};

const createNewCommentTemplate = (emotion, comment) => {
  const emotionsListTemplate = createEmotionsListTemplate(emotion);
  const currentEmojiTemplate = createCurrentEmojiTemplate(emotion);

  return (
    `<div for="add-emoji" class="film-details__add-emoji-label">${currentEmojiTemplate}</div>

      <label class="film-details__comment-label">
        <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment">${comment}</textarea>
      </label>

      <div class="film-details__emoji-list">
        ${emotionsListTemplate}
      </div>`
  );
};


const createFilmDetailsPopupTemplate = (data) => {
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
    isFavorite,
    isWatched,
    isInWatchlist,
    emotion,
    comment,
  } = data;

  const writersText = writers.join(`, `);
  const actorsText = actors.join(`, `);

  const durationFormatted = getDuration(duration);

  const titleGenre = genres.length > 1
    ? `Genres`
    : `Genre`;
  const genreItems = genres.map(createGenreItemTemplate).join(``);

  const commentsCount = comments.length;
  const commentItems = comments.map(createCommentItemTemplate).join(``);

  const newCommentTemplate = createNewCommentTemplate(emotion, comment);

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
                  <td class="film-details__cell">${durationFormatted}</td>
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
            <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${isInWatchlist ? `checked` : ``}>
            <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${isWatched ? `checked` : ``}>
            <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

            <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${isFavorite ? `checked` : ``}>
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
              ${newCommentTemplate}
            </div>
          </section>
        </div>
      </form>
    </section>`
  );
};

export default class FilmDetailsPopup extends SmartView {
  constructor(filmDetails) {
    super();
    this._data = FilmDetailsPopup.parseFilmCardToData(filmDetails);

    // outside
    this._popupCloseButtonClickHandler = this._popupCloseButtonClickHandler.bind(this);
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);

    // inside
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._commentInputHandler = this._commentInputHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createFilmDetailsPopupTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setPopupCloseButtonClickHandler(this._callback.popupCloseClick);
    this.setAddToWatchListClickHandler(this._callback.addToWatchlistClick);
    this.setAlreadyWatchedClickHandler(this._callback.alreadyWatchedClick);
    this.setFavoriteClickHandler(this._callback.favoriteClick);
    this.setDeleteCommentClickHandler(this._callback.deleteCommentClick);
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

  _deleteCommentClickHandler(evt) {
    if (evt.target.classList.contains(`film-details__comment-delete`)) {
      evt.preventDefault();
      const commentListElement = evt.target.closest(`.film-details__comment`);
      this._callback.deleteCommentClick(Number(commentListElement.dataset.commentId));
    }
  }

  _emotionChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      emotion: evt.target.value
    });
  }

  _commentInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      comment: evt.target.value
    }, true);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.film-details__emoji-list`)
      .addEventListener(`change`, this._emotionChangeHandler);

    this.getElement()
      .querySelector(`.film-details__comment-input`)
      .addEventListener(`input`, this._commentInputHandler);
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

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteCommentClick = callback;
    this.getElement().querySelector(`.film-details__comments-list`).addEventListener(`click`, this._deleteCommentClickHandler);
  }

  static parseFilmCardToData(filmCard) {
    return Object.assign(
        {},
        filmCard,
        {
          emotion: ``,
          comment: ``,
        }
    );
  }
}
