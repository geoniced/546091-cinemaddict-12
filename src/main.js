import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import FilterView from './view/filter.js';
import SortingView from './view/sorting.js';
import FilmsPanelView from './view/films-panel.js';
import FilmsListView from './view/films-list.js';
import FilmsListContainerView from './view/films-list-container.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmsListExtraView from './view/films-list-extra.js';
import FilmCardView from './view/film-card.js';
import FilmDetailsPopupView from './view/film-details-popup.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils.js';

const CARDS_COUNT = 20;
const EXTRA_CARDS_COUNT = 2;
const CARDS_PER_STEP = 5;

const renderFilmCard = (container, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmDetailsPopupComponent = new FilmDetailsPopupView(filmCard);

  const popupOpenClasses = new Set([`film-card__poster`, `film-card__title`, `film-card__comments`]);
  const popupCloseButton = filmDetailsPopupComponent.getElement().querySelector(`.film-details__close-btn`);

  const openFilmDetailsPopup = () => {
    const footerElement = document.querySelector(`.footer`);
    render(footerElement, filmDetailsPopupComponent.getElement(), RenderPosition.AFTEREND);
    popupCloseButton.addEventListener(`click`, onPopupCloseButtonClick);
  };

  const closeFilmDetailsPopup = () => {
    filmDetailsPopupComponent.getElement().remove();
    filmDetailsPopupComponent.removeElement();
  };

  const onCardKeyDown = (evt) => {
    if (popupOpenClasses.has(evt.target.className)) {
      evt.preventDefault();
      openFilmDetailsPopup();
    }
  };

  const onPopupCloseButtonClick = (evt) => {
    evt.preventDefault();
    closeFilmDetailsPopup();
    popupCloseButton.removeEventListener(`click`, onPopupCloseButtonClick);
  };

  filmCardComponent.getElement().addEventListener(`click`, onCardKeyDown);

  render(container, filmCardComponent.getElement(), RenderPosition.BEFOREEND);
};

const filmCards = new Array(CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCardsTopRated = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCardsMostCommented = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);

const filters = generateFilters(filmCards);

const headerElement = document.querySelector(`.header`);
render(headerElement, new UserScoreView().getElement(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);
const navigationComponent = new NavigationView();
render(mainElement, navigationComponent.getElement(), RenderPosition.BEFOREEND);

render(navigationComponent.getElement(), new FilterView(filters).getElement(), RenderPosition.AFTERBEGIN);

render(mainElement, new SortingView().getElement(), RenderPosition.BEFOREEND);

const filmsPanelComponent = new FilmsPanelView();
render(mainElement, filmsPanelComponent.getElement(), RenderPosition.BEFOREEND);

const filmsListComponent = new FilmsListView();
render(filmsPanelComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);

const filmsListContainerComponent = new FilmsListContainerView();
render(filmsListComponent.getElement(), filmsListContainerComponent.getElement(), RenderPosition.BEFOREEND);
const filmsListContainer = filmsListContainerComponent.getElement();

for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  renderFilmCard(filmsListContainer, filmCards[i]);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedCardsCount = CARDS_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    filmCards
      .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
      .forEach((filmCard) => renderFilmCard(filmsListContainer, filmCard));

    renderedCardsCount += CARDS_PER_STEP;

    if (renderedCardsCount >= filmCards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

const topRatedExtraComponent = new FilmsListExtraView();
const topRatedExtraElement = topRatedExtraComponent.getElement();
render(filmsPanelComponent.getElement(), topRatedExtraElement, RenderPosition.BEFOREEND);

const topRatedContainer = new FilmsListContainerView().getElement();
render(topRatedExtraElement, topRatedContainer, RenderPosition.BEFOREEND);
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  renderFilmCard(topRatedContainer, extraFilmCardsTopRated[i]);
}

const mostCommentedExtraComponent = new FilmsListExtraView();
const mostCommentedExtraElement = mostCommentedExtraComponent.getElement();
render(filmsPanelComponent.getElement(), mostCommentedExtraElement, RenderPosition.BEFOREEND);

const mostCommentedContainer = new FilmsListContainerView().getElement();
render(mostCommentedExtraElement, mostCommentedContainer, RenderPosition.BEFOREEND);
for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
  renderFilmCard(mostCommentedContainer, extraFilmCardsMostCommented[i]);
}

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new StatisticsView().getElement(), RenderPosition.BEFOREEND);

// const filmDetailsPopupComponent = new FilmDetailsPopupView(filmCards[0]);
// render(footerElement, filmDetailsPopupComponent.getElement(), RenderPosition.AFTEREND);

// const popupCloseButton = filmDetailsPopupComponent.getElement().querySelector(`.film-details__close-btn`);

// popupCloseButton.addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   filmDetailsPopupComponent.getElement().remove();
//   filmDetailsPopupComponent.removeElement();
// });
