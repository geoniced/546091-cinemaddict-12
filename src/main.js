import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import FilterView from './view/filter.js';
import FilmsPanelPresenter from './presenter/films-panel.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';

const CARDS_COUNT = 20;
const EXTRA_CARDS_COUNT = 2;

const filmCards = new Array(CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCardsTopRated = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);
const extraFilmCardsMostCommented = new Array(EXTRA_CARDS_COUNT).fill().map(generateFilmCard);

const films = {
  allFilms: filmCards,
  topRatedFilms: extraFilmCardsTopRated,
  mostCommentedFilms: extraFilmCardsMostCommented,
};

const filters = generateFilters(filmCards);

const headerElement = document.querySelector(`.header`);
render(headerElement, new UserScoreView(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);
const navigationComponent = new NavigationView();
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);

render(navigationComponent, new FilterView(filters), RenderPosition.AFTERBEGIN);

const filmsPanelPresenter = new FilmsPanelPresenter(mainElement);
filmsPanelPresenter.init(films);

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new StatisticsView(), RenderPosition.BEFOREEND);
