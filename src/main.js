import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import StatsView from './view/stats.js';
import FilmsPanelPresenter from './presenter/films-panel.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';
import {generateFilmCard, exportFilmComments} from './mock/film-card.js';
import {remove, render, RenderPosition} from './utils/render.js';
import {MenuItem} from './const.js';
import Api from './api.js';

const CARDS_COUNT = 20;
const AUTHORIZATION = `Basic saAShasdAAS77211`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const api = new Api(END_POINT, AUTHORIZATION);

api.getFilms()
  .then((response) => {
    console.log(response);
  });

const handleNavigationMenuItemClick = (menuItem) => {
  // Сбросить активный пункт меню
  switch (menuItem) {
    case MenuItem.FILMS:
      // Скрыть статистику
      remove(statsComponent);
      filmsPanelPresenter.destroy();
      filmsPanelPresenter.init(); // Показать панель фильмов
      break;
    case MenuItem.STATS:
      // Поставить активный
      filmsPanelPresenter.destroy(); // Скрыть панель фильмов
      statsComponent = new StatsView(filmsModel.getFilms()); // Показать статистику
      render(mainElement, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

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

navigationComponent.setMenuClickHandler(handleNavigationMenuItemClick);
filmsPanelPresenter.init();
filterPresenter.init();

let statsComponent = new StatsView(filmsModel.getFilms());

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new StatisticsView(), RenderPosition.BEFOREEND);
