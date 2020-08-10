import {createUserScoreTemplate} from './view/user-score.js';
import {createNavigationTemplate} from './view/navigation.js';
import {createSortingTemplate} from './view/sorting.js';
import {createFilmsPanelTemplate} from './view/films-panel.js';
import {createFilmsListTemplate} from './view/films-list.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmsListExtraTemplate} from './view/films-list-extra.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createFilmDetailsPopupTemplate} from './view/film-details-popup.js';
import {createStatisticsTemplate} from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';

const CARDS_COUNT = 20;
const EXTRA_CARDS_COUNT = 2;

const filmCards = new Array(CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCards = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);

console.log(filmCards);
console.log(extraFilmCards);


const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const headerElement = document.querySelector(`.header`);
render(headerElement, createUserScoreTemplate(), `beforeend`);

const mainElement = document.querySelector(`.main`);
render(mainElement, createNavigationTemplate(), `beforeend`);
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

for (let i = 0; i < extraFilmsElements.length; i++) {
  const extraFilmsContainer = extraFilmsElements[i].querySelector(`.films-list__container`);

  for (let j = 0; j < EXTRA_CARDS_COUNT; j++) {
    render(extraFilmsContainer, createFilmCardTemplate(extraFilmCards[j]), `beforeend`);
  }
}

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, createStatisticsTemplate(), `beforeend`);
