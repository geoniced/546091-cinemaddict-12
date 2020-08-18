import UserScoreView from './view/user-score.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortingTemplate} from './view/sorting.js';
import {createFilmsPanelTemplate} from './view/films-panel.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createFilmDetailsPopupTemplate} from './view/film-details-popup.js';
import {createStatisticsTemplate} from './view/statistics.js';
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
renderTemplate(mainElement, createNavigationTemplate(), `beforeend`);

const mainNavigation = mainElement.querySelector(`.main-navigation`);
renderTemplate(mainNavigation, createFilterTemplate(filters), `afterbegin`);

renderTemplate(mainElement, createSortingTemplate(), `beforeend`);
renderTemplate(mainElement, createFilmsPanelTemplate(), `beforeend`);

const filmsPanelElement = mainElement.querySelector(`.films`);
renderTemplate(filmsPanelElement, createFilmsListTemplate(), `beforeend`);

const filmsListContainer = filmsPanelElement.querySelector(`.films-list__container`);

for (let i = 0; i < Math.min(filmCards.length, CARDS_PER_STEP); i++) {
  renderTemplate(filmsListContainer, createFilmCardTemplate(filmCards[i]), `beforeend`);
}

if (filmCards.length > CARDS_PER_STEP) {
  let renderedCardsCount = CARDS_PER_STEP;

  renderTemplate(filmsListContainer, createShowMoreButtonTemplate(), `afterend`);

  const showMoreButton = filmsPanelElement.querySelector(`.films-list__show-more`);

  showMoreButton.addEventListener(`click`, (evt) => {
    evt.preventDefault();

    filmCards
      .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
      .forEach((filmCard) => renderTemplate(filmsListContainer, createFilmCardTemplate(filmCard), `beforeend`));

    renderedCardsCount += CARDS_PER_STEP;

    if (renderedCardsCount >= filmCards.length) {
      showMoreButton.remove();
    }
  });
}


renderTemplate(filmsPanelElement, createFilmsListExtraTemplate(), `beforeend`);
renderTemplate(filmsPanelElement, createFilmsListExtraTemplate(), `beforeend`);

const extraFilmsElements = filmsPanelElement.querySelectorAll(`.films-list--extra`);

const topRatedContainer = extraFilmsElements[0].querySelector(`.films-list__container`);
for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
  renderTemplate(topRatedContainer, createFilmCardTemplate(extraFilmCardsTopRated[j]), `beforeend`);
}

const mostCommentedContainer = extraFilmsElements[1].querySelector(`.films-list__container`);
for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
  renderTemplate(mostCommentedContainer, createFilmCardTemplate(extraFilmCardsMostCommented[j]), `beforeend`);
}

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
renderTemplate(footerStatisticsElement, createStatisticsTemplate(), `beforeend`);

renderTemplate(footerElement, createFilmDetailsPopupTemplate(filmCards[0]), `afterend`);

const filmDetailsPopupElement = document.querySelector(`.film-details`);
const popupCloseButton = filmDetailsPopupElement.querySelector(`.film-details__close-btn`);

popupCloseButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  filmDetailsPopupElement.remove();
});
