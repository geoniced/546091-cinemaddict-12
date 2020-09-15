import {FilterType} from '../const.js';

const isFilmInWatchlist = (film) => film.isInWatchlist;
const isFilmWatched = (film) => film.isWatched;
const isFilmFavorite = (film) => film.isFavorite;

export const filter = {
  [FilterType.ALL]: (films) => films,
  [FilterType.WATCHLIST]: (films) => films.filter(isFilmInWatchlist),
  [FilterType.HISTORY]: (films) => films.filter(isFilmWatched),
  [FilterType.FAVORITES]: (films) => films.filter(isFilmFavorite),
};
