import SortingView from '../view/sorting.js';
import FilmsPanelView from '../view/films-panel.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import FilmCardPresenter from './film-card.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortByDate, sortByRating, sortByComments} from '../utils/film.js';
import {SortType, UserAction, UpdateType} from '../const.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

const CardTypeBindings = {
  [`all-films`]: {
    presenter: null,
  },
  [`top-rated`]: {
    presenter: null,
  },
  [`most-commented`]: {
    presenter: null,
  },
};

export default class FilmsPanel {
  constructor(mainElement, filmsModel, commentsModel) {
    this._mainElement = mainElement;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;

    this._renderedCardsCount = CARDS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._sortingComponent = null;
    this._showMoreButtonComponent = null;

    CardTypeBindings[`all-films`].presenter = this._filmPresenter;
    CardTypeBindings[`top-rated`].presenter = this._topRatedPresenter;
    CardTypeBindings[`most-commented`].presenter = this._mostCommentedPresenter;

    this._filmsPanelComponent = new FilmsPanelView();
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._topRatedFilms = this._getExtraFilms(`top-rated`, sortByRating);
    this._mostCommentedFilms = this._getExtraFilms(`most-commented`, sortByComments);

    render(this._mainElement, this._filmsPanelComponent, RenderPosition.BEFOREEND);

    this._renderFilmsPanel();
  }

  _getFilms() {
    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return this._filmsModel.getFilms().slice().sort(sortByDate);
      case SortType.BY_RATING:
        return this._filmsModel.getFilms().slice().sort(sortByRating);
    }

    return this._filmsModel.getFilms();
  }

  _getFilmComments(film) {
    return this._commentsModel.getCommentsByFilmId(film.id);
  }

  _getExtraFilms(type, sortingFunction) {
    return this._getFilms()
      .slice().sort(sortingFunction)
      .slice(0, EXTRA_CARDS_COUNT)
      .map((card) => Object.assign(
          {},
          card,
          {
            type,
          }
      ));
  }

  _clearFilmsPanel({resetRenderedCardsCount = false, resetSortType = false}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    remove(this._sortingComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);

    if (resetRenderedCardsCount) {
      this._renderedCardsCount = CARDS_PER_STEP;
    } else {
      this._renderedCardsCount = Math.min(filmCount, this._renderedCardsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderFilmsPanel() {
    const films = this._getFilms();
    const filmCount = films.length;

    if (filmCount === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSorting();

    this._renderFilmsListComponent();
    this._renderFilmsListContainerComponent();

    this._renderFilmCards(films.slice(0, Math.min(filmCount, this._renderedCardsCount)));

    if (filmCount > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }

    this._renderExtraPanel(`Top rated`, this._topRatedFilms);
    this._renderExtraPanel(`Most commented`, this._mostCommentedFilms);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsPanel({resetRenderedCardsCount: true});
    this._renderFilmsPanel();
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView();
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsPanelComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderNoFilms() {
    render(this._filmsPanelComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListComponent() {
    render(this._filmsPanelComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
  }

  _renderFilmsListContainerComponent() {
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);
  }

  _clearFilmCardsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());

    remove(this._showMoreButtonComponent);

    this._renderedCardsCount = CARDS_PER_STEP;
  }

  _renderFilmCardsList() {
    const filmCount = this._getFilms().length;
    const films = this._getFilms().slice(0, Math.min(filmCount, CARDS_PER_STEP));

    this._renderFilmCards(films);

    if (filmCount > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmCards(cards) {
    cards.forEach((filmCard) => this._renderFilmCard(filmCard));
  }

  _renderFilmCard(card, container = this._filmsListContainerComponent) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._handleModeChange);
    filmCardPresenter.init(card);

    const cardType = card.type ? card.type : `all-films`;
    const filmPresenter = CardTypeBindings[cardType].presenter;
    filmPresenter[card.id] = filmCardPresenter;
  }

  _handleViewAction(actionType, updateType, update) {
    console.log(actionType, updateType, update);
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.UPDATE_COMMENT:
        this._commentsModel.updateComment(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    // В зависимости от типа изменений updateType делаем: -обновляем список фильмов, или целую панель (со списком)
    switch (updateType) {
      case UpdateType.MINOR:
        // Обновить список фильмов
        this._clearFilmsPanel();
        this._renderFilmsPanel();
        break;
      case UpdateType.MAJOR:
        // Обновить список фильмов + экстра
        this._clearFilmsPanel({resetRenderedCardsCount: true, resetSortType: true});
        this._renderFilmsPanel();
        break;
    }
  }

  _handleModeChange() {
    // Здесь нужно пробежаться по абсолютно всем презентерам, потому
    // уже здесь понятно, что иметь несколько презентеров – плохая идея ;)
    const allPresenters = Object.assign( // Решение временное – TODO: переделать на 1 презентер фильмов
        {},
        this._filmPresenter,
        this._topRatedPresenter,
        this._mostCommentedPresenter
    );

    Object
      .values(allPresenters)
      .forEach((presenter) => presenter.resetView());
  }

  _handleShowMoreButtonClick() {
    const filmCount = this._getFilms().length;
    const newRenderedFilmCount = Math.min(filmCount, this._renderedCardsCount + CARDS_PER_STEP);
    const films = this._getFilms().slice(this._renderedCardsCount, newRenderedFilmCount);

    this._renderFilmCards(films);
    this._renderedCardsCount = newRenderedFilmCount;

    if (this._renderedCardsCount >= filmCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderExtraPanel(panelTitle, films) {
    // Рисует экстра панель
    const extraPanelComponent = new FilmsListExtraView(panelTitle);
    render(this._filmsPanelComponent, extraPanelComponent, RenderPosition.BEFOREEND);

    const extraPanelContainerComponent = new FilmsListContainerView();
    render(extraPanelComponent, extraPanelContainerComponent, RenderPosition.BEFOREEND);
    for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
      this._renderFilmCard(films[i], extraPanelContainerComponent);
    }
  }
}
