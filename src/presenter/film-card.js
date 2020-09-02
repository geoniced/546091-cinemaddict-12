import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';
import {render, RenderPosition, remove} from '../utils/render.js';

const POPUP_OPEN_CLASSES = new Set([`film-card__poster`, `film-card__title`, `film-card__comments`]);

export default class FilmCard {
  constructor(container) {
    this._filmCardsContainer = container;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;

    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card) {
    this._filmCardComponent = new FilmCardView(card);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(card);

    this._filmCardComponent.setClickHandler(this._handleCardClick);

    render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
  }

  _openFilmDetailsPopup() {
    const footerElement = document.querySelector(`.footer`);
    render(footerElement, this._filmDetailsPopupComponent, RenderPosition.AFTEREND);
    this._filmDetailsPopupComponent.setPopupCloseButtonClickHandler(this._handlePopupCloseButtonClick);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
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
}
