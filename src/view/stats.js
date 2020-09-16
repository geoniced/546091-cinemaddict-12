import SmartView from "./smart.js";
import {filter} from "../utils/filter.js";
import {FilterType} from "../const.js";
import {countFilmsDuration} from "../utils/film.js";
import moment from "moment";

const STATISTICS_FILTERS = [
  {
    title: `All time`,
    value: `all-time`,
  },
  {
    title: `Today`,
    value: `today`,
  },
  {
    title: `Week`,
    value: `week`,
  },
  {
    title: `Month`,
    value: `month`,
  },
  {
    title: `Year`,
    value: `year`,
  }
];

const createStatisticsFilters = (currentFilter) => {
  return STATISTICS_FILTERS.map(({value, title} = {}) => {
    return (
      `<input type="radio"
        class="statistic__filters-input visually-hidden"
        name="statistic-filter"
        id="statistic-${value}"
        value="${value}"
        ${value === currentFilter ? `checked` : ``}>
      <label for="statistic-${value}" class="statistic__filters-label">${title}</label>`
    );
  }).join(``);
};

const createStatsTemplate = (data) => {
  const {films, statisticFilter} = data;
  const watchedFilms = filter[FilterType.HISTORY](films);
  const watchedFilmsCount = watchedFilms.length;
  const totalDurationCount = watchedFilms.reduce(countFilmsDuration, 0);
  const filmsTotalDuration = moment.duration(totalDurationCount, `m`);
  const filmsTotalDurationHours = Math.floor(filmsTotalDuration.asHours());

  const statisticsFiltersTemplate = createStatisticsFilters(statisticFilter);

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        <span class="statistic__rank-label">Sci-Fighter</span>
      </p>

      <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
        <p class="statistic__filters-description">Show stats:</p>

        ${statisticsFiltersTemplate}
      </form>

      <ul class="statistic__text-list">
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">You watched</h4>
          <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Total duration</h4>
          <p class="statistic__item-text">${filmsTotalDurationHours} <span class="statistic__item-description">h</span> ${filmsTotalDuration.minutes()} <span class="statistic__item-description">m</span></p>
        </li>
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">Sci-Fi</p>
        </li>
      </ul>

      <div class="statistic__chart-wrap">
        <canvas class="statistic__chart" width="1000"></canvas>
      </div>

    </section>`
  );
};

export default class Stats extends SmartView {
  constructor(films) {
    super();

    this._data = {
      films,
      statisticFilter: STATISTICS_FILTERS[0].value,
    };

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setStatisticsHandler();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setStatisticsHandler();
  }

  _setStatisticsHandler() {
    this.getElement().addEventListener(`change`, this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      statisticFilter: evt.target.value,
    });
    console.log(evt.target.value);
  }
}
