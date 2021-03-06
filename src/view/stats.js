import SmartView from "./smart.js";
import Chart from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import {
  getFilmsStatistics,
  getTopGenre,
  getUserScore,
  getUserScoreTitle,
  getWatchedFilms,
  getFilmsByFilter,
} from "../utils/stats.js";
import {countFilmsDuration} from "../utils/film.js";
import {StatsFilterType} from "../const.js";
import moment from "moment";

const STATISTICS_FILTERS = [
  {
    title: `All time`,
    value: StatsFilterType.ALL_TIME,
  },
  {
    title: `Today`,
    value: StatsFilterType.TODAY,
  },
  {
    title: `Week`,
    value: StatsFilterType.WEEK,
  },
  {
    title: `Month`,
    value: StatsFilterType.MONTH,
  },
  {
    title: `Year`,
    value: StatsFilterType.YEAR,
  }
];

const renderStatisticsChart = (statisticCtx, films, statisticFilter) => {
  const BAR_HEIGHT = 50;
  const watchedFilms = getWatchedFilms(films);
  const filteredFilms = getFilmsByFilter(watchedFilms, statisticFilter);

  const {genres, filmsByGenre} = getFilmsStatistics(filteredFilms);

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: `horizontalBar`,
    data: {
      labels: genres,
      datasets: [{
        data: filmsByGenre,
        backgroundColor: `#ffe800`,
        hoverBackgroundColor: `#ffe800`,
        anchor: `start`
      }]
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20
          },
          color: `#ffffff`,
          anchor: `start`,
          align: `start`,
          offset: 40,
        }
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: `#ffffff`,
            padding: 100,
            fontSize: 20
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          barThickness: 24
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: false
      }
    }
  });
};

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

const createStatsTemplate = (statsInfo) => {
  const {films, statisticFilter} = statsInfo;
  const watchedFilms = getWatchedFilms(films);

  const filteredFilms = getFilmsByFilter(watchedFilms, statisticFilter);

  const watchedFilmsCount = filteredFilms.length;
  const totalDurationCount = filteredFilms.reduce(countFilmsDuration, 0);
  const filmsTotalDuration = moment.duration(totalDurationCount, `m`);
  const filmsTotalDurationHours = Math.floor(filmsTotalDuration.asHours());

  const statisticsFiltersTemplate = createStatisticsFilters(statisticFilter);

  const {filmsByGenre, genres} = getFilmsStatistics(filteredFilms);
  const {genre: topGenre, count: topGenreCount} = getTopGenre(filmsByGenre, genres);

  const userScoreTitle = getUserScoreTitle(getUserScore(films));

  return (
    `<section class="statistic">
      <p class="statistic__rank">
        Your rank
        <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
        ${userScoreTitle !== null ? `<span class="statistic__rank-label">${userScoreTitle}</span>` : ``}
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
        ${topGenreCount > 0 ? `
        <li class="statistic__text-item">
          <h4 class="statistic__item-title">Top genre</h4>
          <p class="statistic__item-text">${topGenre}</p>
        </li>` : ``}
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
    this._filmsChart = null;

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setStatisticsHandler();
    this._setCharts();
  }

  getTemplate() {
    return createStatsTemplate(this._data);
  }

  restoreHandlers() {
    this._setStatisticsHandler();
    this._setCharts();
  }

  _setStatisticsHandler() {
    this.getElement().addEventListener(`change`, this._periodChangeHandler);
  }

  _setCharts() {
    if (this._filmsChart !== null) {
      this._filmsChart = null;
    }

    const {films, statisticFilter} = this._data;
    const statisticCtx = this.getElement().querySelector(`.statistic__chart`);

    this._filmsChart = renderStatisticsChart(statisticCtx, films, statisticFilter);
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      statisticFilter: evt.target.value,
    });
  }
}
