import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';
import {UserAction, UpdateType} from '../const.js';

const POPUP_OPEN_CLASSES = new Set([`film-card__poster`, `film-card__title`, `film-card__comments`]);

const Mode = {
  DEFAULT: `DEFAULT`,
  OPENED: `OPENED`
};

export default class FilmCard {
  constructor(container, changeData, changeMode) {
    this._filmCardsContainer = container;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._mode = Mode.DEFAULT;
    this._footerElement = document.querySelector(`.footer`);

    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleAlreadyWatchedClick = this._handleAlreadyWatchedClick.bind(this);
    this._handleAddToWatchlistClick = this._handleAddToWatchlistClick.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card) {
    this._card = card;
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsPopupComponent = this._filmDetailsPopupComponent;

    this._filmCardComponent = new FilmCardView(card);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(card);

    this._setFilmCardHandlers();

    if (prevFilmCardComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);

    if (this._mode === Mode.OPENED) {
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

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._closeFilmDetailsPopup();
    }
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
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
        UserAction.UPDATE_FILM,
        UpdateType.MINOR,
        Object.assign(
            {},
            this._card,
            {
              isInWatchlist: !this._card.isInWatchlist
            }
        )
    );
  }

  _handleDeleteCommentClick(commentId) {
    this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        commentId
    );
  }

  _openFilmDetailsPopup() {
    render(this._footerElement, this._filmDetailsPopupComponent, RenderPosition.AFTEREND);

    // popup events
    this._setPopupHandlers();

    this._changeMode();
    this._mode = Mode.OPENED;
  }

  _closeFilmDetailsPopup() {
    remove(this._filmDetailsPopupComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
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

  _setFilmCardHandlers() {
    this._filmCardComponent.setClickHandler(this._handleCardClick);
    this._filmCardComponent.setAddToWatchListClickHandler(this._handleAddToWatchlistClick);
    this._filmCardComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
  }

  _setPopupHandlers() {
    this._filmDetailsPopupComponent.setPopupCloseButtonClickHandler(this._handlePopupCloseButtonClick);
    this._filmDetailsPopupComponent.setAddToWatchListClickHandler(this._handleAddToWatchlistClick);
    this._filmDetailsPopupComponent.setAlreadyWatchedClickHandler(this._handleAlreadyWatchedClick);
    this._filmDetailsPopupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._filmDetailsPopupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }
}
