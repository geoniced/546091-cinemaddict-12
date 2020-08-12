import {createUserScoreTemplate} from './view/user-score.js';
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

const CARDS_COUNT = 20;
const EXTRA_CARDS_COUNT = 2;

const filmCards = new Array(CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCardsTopRated = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCardsMostCommented = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);

const filters = generateFilters(filmCards);

console.log(filmCards);
console.log(extraFilmCardsTopRated);
console.log(extraFilmCardsMostCommented);
console.log(filters);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
render(headerElement, createUserScoreTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);
render(mainElement, createNavigationTemplate(), `beforeend`);

const mainNavigation = mainElement.querySelector(`.main-navigation`);
render(mainNavigation, createFilterTemplate(filters), `afterbegin`);

render(mainElement, createSortingTemplate(), `beforeend`);
render(mainElement, createFilmsPanelTemplate(), `beforeend`);

const filmsPanelElement = mainElement.querySelector(`.films`);
render(filmsPanelElement, createFilmsListTemplate(), `beforeend`);

const filmsListContainer = filmsPanelElement.querySelector(`.films-list__container`);

for (let i = 0; i < CARDS_COUNT; i++) {
  render(filmsListContainer, createFilmCardTemplate(filmCards[i]), `beforeend`);
}

render(filmsListContainer, createShowMoreButtonTemplate(), `afterend`);

render(filmsPanelElement, createFilmsListExtraTemplate(), `beforeend`);
render(filmsPanelElement, createFilmsListExtraTemplate(), `beforeend`);

const extraFilmsElements = filmsPanelElement.querySelectorAll(`.films-list--extra`);

const topRatedContainer = extraFilmsElements[0].querySelector(`.films-list__container`);
for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
  render(topRatedContainer, createFilmCardTemplate(extraFilmCardsTopRated[j]), `beforeend`);
}

const mostCommentedContainer = extraFilmsElements[1].querySelector(`.films-list__container`);
for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
  render(mostCommentedContainer, createFilmCardTemplate(extraFilmCardsMostCommented[j]), `beforeend`);
}

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createStatisticsTemplate(), `beforeend`);

// render(footerElement, createFilmDetailsPopupTemplate(filmCards[0]), `afterend`);
