import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import FilterView from './view/filter.js';
import SortingView from './view/sorting.js';
import FilmsPanelView from './view/films-panel.js';
import FilmsListView from './view/films-list.js';
import ShowMoreButtonView from './view/show-more-button.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import FilmCardView from './view/film-card.js';
import {createFilmDetailsPopupTemplate} from './view/film-details-popup.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import {render, renderTemplate, RenderPosition} from './utils.js';

const CARDS_COUNT = 20;
const EXTRA_CARDS_COUNT = 2;
const CARDS_PER_STEP = 5;

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

// make a component
const filmsListContainer = filmsPanelComponent.getElement().querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  render(filmsListContainer, new FilmCardView(filmCards[i]).getElement(), RenderPosition.BEFOREEND);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedCardsCount = CARDS_PER_STEP;

  const showMoreButtonComponent = new ShowMoreButtonView();
  render(filmsListComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

  showMoreButtonComponent.getElement().addEventListener(`click`, (evt) => {
    evt.preventDefault();

    filmCards
      .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
      .forEach((filmCard) => render(filmsListContainer, new FilmCardView(filmCard).getElement(), RenderPosition.BEFOREEND));

    renderedCardsCount += CARDS_PER_STEP;

    if (renderedCardsCount >= filmCards.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.removeElement();
    }
  });
}

renderTemplate(filmsPanelComponent.getElement(), createFilmsListExtraTemplate(), `beforeend`);
renderTemplate(filmsPanelComponent.getElement(), createFilmsListExtraTemplate(), `beforeend`);

const extraFilmsElements = filmsPanelComponent.getElement().querySelectorAll(`.films-list--extra`);

const topRatedContainer = extraFilmsElements[0].querySelector(`.films-list__container`);
for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
  render(topRatedContainer, new FilmCardView(extraFilmCardsTopRated[j]).getElement(), RenderPosition.BEFOREEND);
}

const mostCommentedContainer = extraFilmsElements[1].querySelector(`.films-list__container`);
for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
  render(mostCommentedContainer, new FilmCardView(extraFilmCardsMostCommented[j]).getElement(), RenderPosition.BEFOREEND);
}

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new StatisticsView().getElement(), RenderPosition.BEFOREEND);

// renderTemplate(footerElement, createFilmDetailsPopupTemplate(filmCards[0]), `afterend`);

// const filmDetailsPopupElement = document.querySelector(`.film-details`);
// const popupCloseButton = filmDetailsPopupElement.querySelector(`.film-details__close-btn`);

// popupCloseButton.addEventListener(`click`, (evt) => {
//   evt.preventDefault();
//   filmDetailsPopupElement.remove();
// });
