import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

const POPUP_OPEN_CLASSES = new Set([`film-card__poster`, `film-card__title`, `film-card__comments`]);

export default class FilmCard {
  constructor(container, changeData) {
    this._filmCardsContainer = container;
    this._changeData = changeData;

    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._footerElement = document.querySelector(`.footer`);

    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card) {
    this._card = card;
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsPopupComponent = this._filmDetailsPopupComponent;

    this._filmCardComponent = new FilmCardView(card);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(card);

    this._filmCardComponent.setClickHandler(this._handleCardClick);
    this._filmCardComponent.setAddToWatchListClickHandler(this._handleAddToWatchlistClick);
    this._filmCardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (prevFilmCardComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);

    if (document.contains(prevFilmDetailsPopupComponent.getElement())) {
      replace(this._filmDetailsPopupComponent, prevFilmDetailsPopupComponent);
      this._setPopupHandlers();
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isFavorite: !this._card.isFavorite
            }
        )
    );
  }

  _handleAlreadyWatchedClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isWatched: !this._card.isWatched
            }
        )
    );
  }

  _handleAddToWatchlistClick() {
    this._changeData(
        Object.assign(
            {},
            this._card,
            {
              isInWatchlist: !this._card.isInWatchlist
            }
        )
    );
  }

  _openFilmDetailsPopup() {
    render(this._footerElement, this._filmDetailsPopupComponent, RenderPosition.AFTEREND);

    // popup events
    this._setPopupHandlers();

    document.addEventListener(`keydown`, this._escKeyDownHandler);
    // end //
  }

  _closeFilmDetailsPopup() {
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handlePopupCloseButtonClick() {
    this._closeFilmDetailsPopup();
  }

  _handleCardClick(evt) {
    if (POPUP_OPEN_CLASSES.has(evt.target.className)) {
      this._openFilmDetailsPopup();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._closeFilmDetailsPopup();
    }
  }

  _setPopupHandlers() {
    this._filmDetailsPopupComponent.setPopupCloseButtonClickHandler(this._handlePopupCloseButtonClick);
    this._filmDetailsPopupComponent.setAddToWatchListClickHandler(this._handleAddToWatchlistClick);
    this._filmDetailsPopupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmDetailsPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }
}
