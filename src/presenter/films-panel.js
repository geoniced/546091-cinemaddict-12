import SortingView from '../view/sorting.js';
import FilmsPanelView from '../view/films-panel.js';
import NoFilmsView from '../view/no-films.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainerView from '../view/films-list-container.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import FilmsListExtraView from '../view/films-list-extra.js';
import FilmCardPresenter from './film-card.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortByDate, sortByRating} from '../utils/film.js';
import {SortType} from '../const.js';

const CARDS_PER_STEP = 5;
const EXTRA_CARDS_COUNT = 2;

const CardTypeBindings = {
  [`all-films`]: {
    presenter: null,
    cards: null,
  },
  [`top-rated`]: {
    presenter: null,
    cards: null,
  },
  [`most-commented`]: {
    presenter: null,
    cards: null,
  },
};

export default class FilmsPanel {
  constructor(mainElement) {
    this._mainElement = mainElement;
    this._renderedCardsCount = CARDS_PER_STEP;
    this._currentSortType = SortType.DEFAULT;
    this._filmPresenter = {};

    this._topRatedPresenter = {};
    this._mostCommentedPresenter = {};

    CardTypeBindings[`all-films`].presenter = this._filmPresenter;
    CardTypeBindings[`top-rated`].presenter = this._topRatedPresenter;
    CardTypeBindings[`most-commented`].presenter = this._mostCommentedPresenter;

    this._sortingComponent = new SortingView();
    this._filmsPanelComponent = new FilmsPanelView();
    this._noFilmsComponent = new NoFilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleFilmCardChange = this._handleFilmCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films) {
    this._films = Object.assign(films);
    this._allFilms = this._films.allFilms.slice();
    this._topRatedFilms = this._films.topRatedFilms.slice();
    this._mostCommentedFilms = this._films.mostCommentedFilms.slice();
    this._sourcedAllFilms = this._films.allFilms.slice();

    CardTypeBindings[`all-films`].cards = this._allFilms;
    CardTypeBindings[`top-rated`].cards = this._topRatedFilms;
    CardTypeBindings[`most-commented`].cards = this._mostCommentedFilms;

    render(this._mainElement, this._filmsPanelComponent, RenderPosition.BEFOREEND);

    this._renderFilmsPanel();
  }

  _renderFilmsPanel() {
    if (this._allFilms.length === 0) {
      this._renderNoFilms();
      return;
    }

    this._renderSorting();

    this._renderFilmsListComponent();
    this._renderFilmsListContainerComponent();

    this._renderFilmCardsList();

    this._renderExtraPanel(`Top rated`, this._topRatedFilms);
    this._renderExtraPanel(`Most commented`, this._mostCommentedFilms);
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._allFilms.sort(sortByDate);
        break;
      case SortType.BY_RATING:
        this._allFilms.sort(sortByRating);
        break;
      default:
        this._allFilms = this._sourcedAllFilms.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortFilms(sortType);
    this._clearFilmCardsList();
    this._renderFilmCardsList();
  }

  _renderSorting() {
    render(this._filmsPanelComponent, this._sortingComponent, RenderPosition.BEFOREBEGIN);
    this._sortingComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
    this._filmPresenter = {};

    remove(this._showMoreButtonComponent);

    this._renderedCardsCount = CARDS_PER_STEP;
  }

  _renderFilmCardsList() {
    this._renderFilmCards(0, Math.min(this._allFilms.length, CARDS_PER_STEP));

    if (this._allFilms.length > CARDS_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderFilmCards(from, to) {
    this._allFilms
      .slice(from, to)
      .forEach((filmCard) => this._renderFilmCard(filmCard));
  }

  _renderFilmCard(card, container = this._filmsListContainerComponent) {
    const filmCardPresenter = new FilmCardPresenter(container, this._handleFilmCardChange, this._handleModeChange);
    filmCardPresenter.init(card);

    const cardType = card.type ? card.type : `all-films`;
    const filmPresenter = CardTypeBindings[cardType].presenter;
    filmPresenter[card.id] = filmCardPresenter;
  }

  _handleFilmCardChange(updatedFilmCard) {
    // Получаем тип фильма: карточка может быть в разных презентерах
    const type = updatedFilmCard.type ? updatedFilmCard.type : `all-films`;
    const cardInfo = CardTypeBindings[type];
    cardInfo.cards = updateItem(cardInfo.cards, updatedFilmCard);

    if (!type) {
      this._sourcedAllFilms = updateItem(this._sourcedAllFilms, updatedFilmCard);
    }

    cardInfo.presenter[updatedFilmCard.id].init(updatedFilmCard);
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
    this._renderFilmCards(this._renderedCardsCount, this._renderedCardsCount + CARDS_PER_STEP);
    this._renderedCardsCount += CARDS_PER_STEP;

    if (this._renderedCardsCount >= this._allFilms.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    // Рисует кнопку допоказа
    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
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
