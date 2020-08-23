import UserScoreView from './view/user-score.js';
import NavigationView from './view/navigation.js';
import FilterView from './view/filter.js';
import SortingView from './view/sorting.js';
import FilmsPanelView from './view/films-panel.js';
import FilmsListView from './view/films-list.js';
import FilmsListContainerView from './view/films-list-container.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilmsListExtraView from './view/films-list-extra.js';
import FilmCardView from './view/film-card.js';
import FilmDetailsPopupView from './view/film-details-popup.js';
import StatisticsView from './view/statistics.js';
import NoFilmsView from './view/no-films.js';
import {generateFilmCard} from './mock/film-card.js';
import {generateFilters} from './mock/filter.js';
import {render, RenderPosition, remove} from './utils/render.js';

const CARDS_COUNT = 20;
const EXTRA_CARDS_COUNT = 2;
const CARDS_PER_STEP = 5;

const renderFilmCard = (container, filmCard) => {
  const filmCardComponent = new FilmCardView(filmCard);
  const filmDetailsPopupComponent = new FilmDetailsPopupView(filmCard);

  const popupOpenClasses = new Set([`film-card__poster`, `film-card__title`, `film-card__comments`]);

  const openFilmDetailsPopup = () => {
    const footerElement = document.querySelector(`.footer`);
    render(footerElement, filmDetailsPopupComponent, RenderPosition.AFTEREND);
    filmDetailsPopupComponent.setPopupCloseButtonClickHandler(onPopupCloseButtonClick);
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  const closeFilmDetailsPopup = () => {
    filmDetailsPopupComponent.getElement().remove();
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      closeFilmDetailsPopup();
      filmDetailsPopupComponent.deletePopupCloseButtonClickHandler();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const onCardClick = (evt) => {
    if (popupOpenClasses.has(evt.target.className)) {
      openFilmDetailsPopup();
    }
  };

  const onPopupCloseButtonClick = () => {
    closeFilmDetailsPopup();
    filmDetailsPopupComponent.deletePopupCloseButtonClickHandler();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  filmCardComponent.setClickHandler(onCardClick);

  render(container, filmCardComponent, RenderPosition.BEFOREEND);
};

const renderFilmsList = (container, films) => {
  const {
    allFilms,
    topRatedFilms,
    mostCommentedFilms,
  } = films;

  const filmsPanelComponent = new FilmsPanelView();
  render(container, filmsPanelComponent, RenderPosition.BEFOREEND);

  if (allFilms.length === 0) {
    render(filmsPanelComponent, new NoFilmsView(), RenderPosition.BEFOREEND);
    return;
  }

  const filmsListComponent = new FilmsListView();
  render(filmsPanelComponent, filmsListComponent, RenderPosition.BEFOREEND);

  const filmsListContainerComponent = new FilmsListContainerView();
  render(filmsListComponent, filmsListContainerComponent, RenderPosition.BEFOREEND);

  allFilms
    .slice(0, Math.min(allFilms.length, CARDS_PER_STEP))
    .forEach((filmCard) => renderFilmCard(filmsListContainerComponent, filmCard));

  if (allFilms.length > CARDS_PER_STEP) {
    let renderedCardsCount = CARDS_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();
    render(filmsListComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      allFilms
        .slice(renderedCardsCount, renderedCardsCount + CARDS_PER_STEP)
        .forEach((filmCard) => renderFilmCard(filmsListContainerComponent, filmCard));

      renderedCardsCount += CARDS_PER_STEP;

      if (renderedCardsCount >= filmCards.length) {
        remove(showMoreButtonComponent);
      }
    });
  }

  renderExtraPanel(filmsPanelComponent, topRatedFilms, `Top rated`);
  renderExtraPanel(filmsPanelComponent, mostCommentedFilms, `Most commented`);
};

const renderExtraPanel = (container, extraFilms, panelTitle) => {
  const extraPanelComponent = new FilmsListExtraView(panelTitle);
  render(container, extraPanelComponent, RenderPosition.BEFOREEND);

  const extraPanelContainerComponent = new FilmsListContainerView();
  render(extraPanelComponent, extraPanelContainerComponent, RenderPosition.BEFOREEND);
  for (let i = 0; i < EXTRA_CARDS_COUNT; i++) {
    renderFilmCard(extraPanelContainerComponent, extraFilms[i]);
  }
};

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
render(mainElement, new SortingView(), RenderPosition.BEFOREEND);

renderFilmsList(mainElement, films);

const footerElement = document.querySelector(`.footer`);
const footerStatisticsElement = footerElement.querySelector(`.footer__statistics`);
render(footerStatisticsElement, new StatisticsView(), RenderPosition.BEFOREEND);
