import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import StatsView from './view/stats.js';
import FilmsPanelPresenter from './presenter/films-panel.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FilterModel from './model/filter.js';
import StatisticsView from './view/statistics.js';
import {remove, render, RenderPosition} from './utils/render.js';
import {MenuItem, UpdateType} from './const.js';
import Api from './api/index.js';

const AUTHORIZATION = `Basic saAShasdAAS77211`;
const END_POINT = `https://12.ecmascript.pages.academy/cinemaddict`;

const headerElement = document.querySelector(`.header`);
const mainElement = document.querySelector(`.main`);
const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);

const api = new Api(END_POINT, AUTHORIZATION);
const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FilterModel();

const navigationComponent = new NavigationView();
const filmsPanelPresenter = new FilmsPanelPresenter(mainElement, filmsModel, commentsModel, filterModel, api);
const filterPresenter = new FilterPresenter(navigationComponent, filterModel, filmsModel);

let statsComponent = new StatsView(filmsModel.getFilms());

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
      remove(statsComponent);
      statsComponent = new StatsView(filmsModel.getFilms()); // Показать статистику
      render(mainElement, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

navigationComponent.setMenuClickHandler(handleNavigationMenuItemClick);

render(headerElement, new UserScoreView(), RenderPosition.BEFOREEND);
render(mainElement, navigationComponent, RenderPosition.BEFOREEND);
render(footerStatisticsElement, new StatisticsView(), RenderPosition.BEFOREEND);

filmsPanelPresenter.init();
filterPresenter.init();

api.getFilms()
  .then((films) => {
    filmsModel.setFilms(UpdateType.SILENT, films);

    return api.getComments(films);
  })
  .then((comments) => {
    commentsModel.setComments(UpdateType.INIT, comments);
  })
  .catch(() => {
    filmsModel.setFilms(UpdateType.INIT, []);
  });

window.addEventListener(`load`, () => {
  navigator.serviceWorker.register(`/sw.js`)
    .then(() => {
      console.log(`Service worker is available`); // eslint-disable-line
    })
    .catch(() => {
      console.log(`Service worker is not available!`); // eslint-disable-line
    });
});
