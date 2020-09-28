import AbstractView from "../view/abstract.js";
import {getDuration} from "../utils/common.js";

const formatDescription = (description) => {
  const SYMBOLS_COUNT = 140;
  let formattedDescription = description;

  if (description.length > SYMBOLS_COUNT) {
    formattedDescription = `${description.slice(0, SYMBOLS_COUNT - 1)}…`;
  }

  return formattedDescription;
};

const createFilmCardTemplate = (film) => {
  const {
    name,
    rating,
    year,
    duration,
    genres,
    poster,
    description,
    comments,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const formattedDescription = formatDescription(description);
  const durationFormatted = getDuration(duration);
  const genre = genres[0];
  const commentsCount = comments.length;

  const inWatchlistClassName = isInWatchlist
    ? `film-card__controls-item--active`
    : ``;

  const isWatchedClassName = isWatched
    ? `film-card__controls-item--active`
    : ``;

  const isFavoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${durationFormatted}</span>
        ${genre !== undefined ? `<span class="film-card__genre">${genre}</span>` : ``}
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${formattedDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${inWatchlistClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  );
};

export default class FilmCard extends AbstractView {
  constructor(film) {
    super();
    this._film = film;

    this._cardClickHandler = this._cardClickHandler.bind(this);
    this._addToWatchlistClickHandler = this._addToWatchlistClickHandler.bind(this);
    this._alreadyWatchedClickHandler = this._alreadyWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  setClickHandler(callback) {
    this._callback.cardClick = callback;
    this.getElement().addEventListener(`click`, this._cardClickHandler);
  }

  setAddToWatchListClickHandler(callback) {
    this._callback.addToWatchlistClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--add-to-watchlist`).addEventListener(`click`, this._addToWatchlistClickHandler);
  }

  setAlreadyWatchedClickHandler(callback) {
    this._callback.alreadyWatchedClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--mark-as-watched`).addEventListener(`click`, this._alreadyWatchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.film-card__controls-item--favorite`).addEventListener(`click`, this._favoriteClickHandler);
  }

  _cardClickHandler(evt) {
    evt.preventDefault();
    this._callback.cardClick(evt);
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
}
