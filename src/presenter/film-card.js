import FilmCardView from '../view/film-card.js';
import FilmDetailsPopupView from '../view/film-details-popup.js';
import {render, RenderPosition, remove, replace} from '../utils/render.js';

const POPUP_OPEN_CLASSES = new Set([`film-card__poster`, `film-card__title`, `film-card__comments`]);

export default class FilmCard {
  constructor(container) {
    this._filmCardsContainer = container;
    this._filmCardComponent = null;
    this._filmDetailsPopupComponent = null;
    this._footerElement = document.querySelector(`.footer`);

    this._handlePopupCloseButtonClick = this._handlePopupCloseButtonClick.bind(this);
    this._handleCardClick = this._handleCardClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card) {
    const prevFilmCardComponent = this._filmCardComponent;
    const prevFilmDetailsPopupComponent = this._filmDetailsPopupComponent;

    this._filmCardComponent = new FilmCardView(card);
    this._filmDetailsPopupComponent = new FilmDetailsPopupView(card);

    this._filmCardComponent.setClickHandler(this._handleCardClick);

    if (prevFilmCardComponent === null || prevFilmDetailsPopupComponent === null) {
      render(this._filmCardsContainer, this._filmCardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filmCardComponent, prevFilmCardComponent);

    if (this._footerElement.contains(this._filmDetailsPopupComponent.getElement())) {
      replace(this._filmDetailsPopupComponent, prevFilmDetailsPopupComponent);
    }

    remove(prevFilmCardComponent);
    remove(prevFilmDetailsPopupComponent);
  }

  destroy() {
    remove(this._filmCardComponent);
    remove(this._filmDetailsPopupComponent);
  }

  _openFilmDetailsPopup() {
    render(this._footerElement, this._filmDetailsPopupComponent, RenderPosition.AFTEREND);
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
