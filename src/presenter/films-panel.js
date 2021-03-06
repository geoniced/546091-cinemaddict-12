import UserScoreView from '../view/user-score.js';
import SortingView from '../view/sorting.js';
import FilmsPanelView from '../view/films-panel.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import FilmCardPresenter, {State as FilmCardPresenterState} from './film-card.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortByDate, sortByRating, sortByComments, filterByEmptyRating, filterByEmptyComments} from '../utils/film.js';
import {SortType, UserAction, UpdateType, FilmType, ExtraPanelTitle} from '../const.js';
import {filter} from '../utils/filter.js';
import {getUserScore} from '../utils/stats.js';
import LoadingView from '../view/loading.js';
import {getRandomizedItems} from '../utils/common.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

const CardTypeBindings = {
  [FilmType.ALL_FILMS]: {
    presenter: null,
    panelComponent: null,
  },
  [FilmType.TOP_RATED]: {
    presenter: null,
    panelComponent: null,
  },
  [FilmType.MOST_COMMENTED]: {
    presenter: null,
    panelComponent: null,
  },
};

export default class FilmsPanel {
  constructor(mainElement, headerElement, filmsModel, commentsModel, filterModel, api) {
    this._mainElement = mainElement;
    this._headerElement = headerElement;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._renderedCardsCount = CARDS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};
    this._openedPopup = null;
    this._isLoading = true;

    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    this._sortingComponent = null;
    this._showMoreButtonComponent = null;

    CardTypeBindings[FilmType.ALL_FILMS].presenter = this._filmPresenter;
    CardTypeBindings[FilmType.TOP_RATED].presenter = this._topRatedPresenter;
    CardTypeBindings[FilmType.MOST_COMMENTED].presenter = this._mostCommentedPresenter;

    this._filmsPanelComponent = new FilmsPanelView();
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._loadingComponent = new LoadingView();
    this._userScoreComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._destroyPresenter = this._destroyPresenter.bind(this);

    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    render(this._mainElement, this._filmsPanelComponent, RenderPosition.BEFOREEND);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._commentsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsPanel();
  }

  destroy() {
    this._clearFilmsPanel({resetRenderedCardsCount: true, resetSortType: true});

    remove(this._filmsPanelComponent);

    this._filmsModel.removeObserver(this._handleModelEvent);
    this._commentsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getFilms() {
    const filterType = this._filterModel.getFilter();
    const films = this._filmsModel.getFilms();
    const filteredFilms = filter[filterType](films);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filteredFilms.sort(sortByDate);
      case SortType.BY_RATING:
        return filteredFilms.sort(sortByRating);
    }

    return filteredFilms;
  }

  _getExtraFilms(sortedFilms, filteringFunction, type) {
    return sortedFilms
      .filter(filteringFunction)
      .slice(0, EXTRA_CARDS_COUNT)
      .map((card) => Object.assign(
          {},
          card,
          {
            type,
          }
      ));
  }

  _getTopRatedExtraFilms(options) {
    const {type, sortingFunction, filteringFunction} = options;

    let sortedFilms = this._getFilms()
      .slice()
      .sort(sortingFunction);

    const sequenceStartNumber = sortedFilms[0].rating;
    if (sortedFilms.every((film) => film.rating === sequenceStartNumber)) {
      sortedFilms = getRandomizedItems(sortedFilms);
    }

    return this._getExtraFilms(sortedFilms, filteringFunction, type);
  }

  _getMostCommentedExtraFilms(options) {
    const {type, sortingFunction, filteringFunction} = options;

    let sortedFilms = this._getFilms()
      .slice()
      .sort(sortingFunction);

    const sequenceStartNumber = sortedFilms[0].comments.length;
    if (sortedFilms.every((film) => film.comments.length === sequenceStartNumber)) {
      sortedFilms = getRandomizedItems(sortedFilms);
    }

    return this._getExtraFilms(sortedFilms, filteringFunction, type);
  }

  _clearFilmsPanel({resetRenderedCardsCount = false, resetSortType = false} = {}) {
    const filmCount = this._getFilms().length;

    Object
      .values(this._filmPresenter)
      .forEach(this._destroyPresenter);
    this._filmPresenter = {};

    remove(this._sortingComponent);
    remove(this._noFilmsComponent);
    remove(this._loadingComponent);
    remove(this._showMoreButtonComponent);

    // remove extra panels
    this._clearExtraPanels(FilmType.TOP_RATED);
    this._clearExtraPanels(FilmType.MOST_COMMENTED);

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
    this._renderUserScore();

    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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

    this._topRatedFilms = this._getTopRatedExtraFilms({
      type: FilmType.TOP_RATED,
      sortingFunction: sortByRating,
      filteringFunction: filterByEmptyRating,
    });

    this._mostCommentedFilms = this._getMostCommentedExtraFilms({
      type: FilmType.MOST_COMMENTED,
      sortingFunction: sortByComments,
      filteringFunction: filterByEmptyComments,
    });

    this._renderExtraPanel(FilmType.TOP_RATED, ExtraPanelTitle.TOP_RATED, this._topRatedFilms);
    this._renderExtraPanel(FilmType.MOST_COMMENTED, ExtraPanelTitle.MOST_COMMENTED, this._mostCommentedFilms);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    this._clearFilmsPanel({resetRenderedCardsCount: true});
    this._renderFilmsPanel();
  }

  _renderUserScore() {
    const userScore = getUserScore(this._filmsModel.getFilms());

    if (this._userScoreComponent !== null) {
      remove(this._userScoreComponent);
    }

    this._userScoreComponent = new UserScoreView(userScore);
    render(this._headerElement, this._userScoreComponent, RenderPosition.BEFOREEND);
  }

  _renderSorting() {
    if (this._sortingComponent !== null) {
      this._sortingComponent = null;
    }

    this._sortingComponent = new SortingView(this._currentSortType);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsPanelComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
  }

  _renderLoading() {
    render(this._filmsPanelComponent, this._loadingComponent, RenderPosition.BEFOREEND);
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

  _renderFilmCards(cards) {
    cards.forEach((filmCard) => this._renderFilmCard(filmCard));
  }

  _renderFilmCard(card, container = this._filmsListContainerComponent) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleViewAction, this._handleModeChange);

    // Получаем комментарии из модели
    card.comments = this._commentsModel.getCommentsByIds(card.commentsIds);
    card.commentsIds = card.comments.slice().map((comment) => comment.id); // Обновляем список айдишников

    // Примешиваю флаг того что карточка была открыта до перерисовки
    if (card.id === this._openedPopup) {
      card.wasOpened = true;
      this._openedPopup = null;
    }

    filmCardPresenter.init(card);

    const cardType = card.type ? card.type : FilmType.ALL_FILMS;

    // Решение не лучшее? Иначе теряется ссылка на этот презентере при очищении
    // используя мои CardTypeBindings. Здесь надо всё же подумать что делать с экстра
    // карточками, ибо нужно от CardTypeBindings отказаться и оставить одну структуру this._filmPresenter
    if (cardType === FilmType.ALL_FILMS) {
      this._filmPresenter[card.id] = filmCardPresenter;
    } else {
      const filmPresenter = CardTypeBindings[cardType].presenter;
      filmPresenter[card.id] = filmCardPresenter;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    const allPresenters = this._getAllPresenters();
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.updateFilm(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        allPresenters[update.filmId].setViewState(FilmCardPresenterState.SUBMIT);
        this._api.addComment(update)
          .then((response) => {
            this._commentsModel.addComment(updateType, response.comments[response.comments.length - 1]);
            return response;
          })
          .then((response) => {
            this._filmsModel.updateFilm(updateType, response.movie);
          })
          .catch(() => {
            allPresenters[update.filmId].setViewState(FilmCardPresenterState.ABORTING_SUBMIT);
          });
        break;
      case UserAction.DELETE_COMMENT:
        const filmIdByCommentId = this._filmsModel.getFilmIdByCommentId(update);
        allPresenters[filmIdByCommentId].setViewState(FilmCardPresenterState.DELETING, {commentId: update});

        this._api.deleteComment(update)
          .then(() => {
            this._commentsModel.deleteComment(updateType, update);
          })
          .catch(() => {
            allPresenters[filmIdByCommentId].setViewState(FilmCardPresenterState.ABORTING_DELETE, {commentId: update});
          });
        break;
    }
  }

  _handleModelEvent(updateType) {
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._updateFilmsComments();
        this._renderFilmsPanel();
    }
  }

  _updateFilmsComments() {
    const films = this._getFilms();
    films.forEach((film) => {
      const comments = this._commentsModel.getCommentsByIds(film.commentsIds);
      this._filmsModel.updateFilmCommentsPresentation(film.id, comments);
    });
  }

  _handleModeChange() {
    // Здесь нужно пробежаться по абсолютно всем презентерам, потому
    // уже здесь понятно, что иметь несколько презентеров – плохая идея ;)
    const allPresenters = this._getAllPresenters();

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

  _clearExtraPanels(type) {
    Object
      .values(CardTypeBindings[type].presenter)
      .forEach(this._destroyPresenter);

    remove(CardTypeBindings[type].panelComponent);
  }

  _renderExtraPanel(type, panelTitle, films) {
    if (films.length > 0) {
      const extraPanelComponent = new FilmsListExtraView(panelTitle);
      CardTypeBindings[type].panelComponent = extraPanelComponent;
      render(this._filmsPanelComponent, extraPanelComponent, RenderPosition.BEFOREEND);

      const extraPanelContainerComponent = new FilmsListContainerView();
      render(extraPanelComponent, extraPanelContainerComponent, RenderPosition.BEFOREEND);

      films.forEach((film) => {
        this._renderFilmCard(film, extraPanelContainerComponent);
      });
    }
  }

  _getAllPresenters() {
    return Object.assign(
        {},
        this._filmPresenter,
        this._topRatedPresenter,
        this._mostCommentedPresenter
    );
  }

  _destroyPresenter(presenter) {
    if (presenter.isOpened()) {
      this._openedPopup = presenter.getId();
    }

    presenter.destroy();
  }
}
