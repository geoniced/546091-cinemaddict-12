import {getUniqueArray} from "../utils/common.js";
import {filter} from '../utils/filter.js';
import {FilterType, UserScoreTitle, StatsFilterType} from '../const.js';
import moment from "moment";

export const countFilmsByGenre = (films, genre) => {
  // Берем основной жанр
  return films.filter((film) => film.genres[0] === genre).length;
};

export const getFilmsStatistics = (films) => {
  const filmGenres = films
    .filter((film) => film.genres[0] !== undefined)
    .map((film) => film.genres[0]);

  const uniqueGenres = getUniqueArray(filmGenres);
  const filmsByGenre = uniqueGenres.map((genre) => countFilmsByGenre(films, genre));

  return {
    genres: uniqueGenres,
    filmsByGenre,
  };
};

const sortByGenre = (genreCountA, genreCountB) => {
  return genreCountB[1] - genreCountA[1];
};

export const getTopGenre = (filmsByGenre, genres) => {
  const genresMap = {};
  genres.forEach((genre, index) => {
    genresMap[genre] = filmsByGenre[index];
  });

  const sorted = Object.entries(genresMap)
    .sort(sortByGenre);

  const topGenre = {
    genre: ``,
    count: 0,
  };

  if (sorted.length) {
    topGenre.genre = sorted[0][0];
    topGenre.count = sorted[0][1];
  }

  return topGenre;
};

export const getWatchedFilms = (films) => {
  return filter[FilterType.HISTORY](films);
};

export const getUserScore = (films) => {
  return getWatchedFilms(films).length;
};

export const getUserScoreTitle = (userScore) => {
  let scoreTitle = null;

  if (userScore > 0 && userScore <= 10) {
    scoreTitle = UserScoreTitle.NOVICE;
  } else if (userScore >= 11 && userScore <= 20) {
    scoreTitle = UserScoreTitle.FAN;
  } else if (userScore >= 21) {
    scoreTitle = UserScoreTitle.MOVIE_BUFF;
  }

  return scoreTitle;
};

const isWatchedToday = (film) => {
  return moment(film.watchingDate).isBetween(
      moment().startOf(`day`),
      moment()
  );
};

const isWatchedByWeek = (film) => {
  return moment(film.watchingDate).isBetween(
      moment().startOf(`day`).subtract(1, `week`),
      moment()
  );
};

const isWatchedByMonth = (film) => {
  return moment(film.watchingDate).isBetween(
      moment().startOf(`day`).subtract(1, `month`),
      moment()
  );
};

const isWatchedByYear = (film) => {
  return moment(film.watchingDate).isBetween(
      moment().startOf(`day`).subtract(1, `year`),
      moment()
  );
};

export const statsFilter = {
  [StatsFilterType.ALL_TIME]: (films) => films,
  [StatsFilterType.TODAY]: (films) => films.filter(isWatchedToday),
  [StatsFilterType.WEEK]: (films) => films.filter(isWatchedByWeek),
  [StatsFilterType.MONTH]: (films) => films.filter(isWatchedByMonth),
  [StatsFilterType.YEAR]: (films) => films.filter(isWatchedByYear),
};

export const getFilmsByFilter = (films, currentFilter) => {
  return statsFilter[currentFilter](films);
};
