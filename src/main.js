import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import FilmsPanelPresenter from './presenter/films-panel.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard, exportFilmComments} from './mock/film-card.js';
import {render, RenderPosition} from './utils/render.js';

const CARDS_COUNT = 20;

const filmCards = new Array(CARDS_COUNT).fill().map(generateFilmCard);
const comments = exportFilmComments(filmCards);

const filmsModel = new FilmsModel();
filmsModel.setFilms(filmCards);

const commentsModel = new CommentsModel();
commentsModel.setComments(comments);

const filterModel = new FilterModel();

const headerElement = document.querySelector(`.header`);
render(headerElement, new UserScoreView(), RenderPosition.BEFOREEND);

const mainElement = document.querySelector(`.main`);
const navigationComponent = new NavigationView();
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);

const filmsPanelPresenter = new FilmsPanelPresenter(mainElement, filmsModel, commentsModel, filterModel);
const filterPresenter = new FilterPresenter(navigationComponent, filterModel, filmsModel);

filmsPanelPresenter.init();
filterPresenter.init();

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new StatisticsView(), RenderPosition.BEFOREEND);
