import {FilterType} from '../const.js';

const isFilmInWatchlist = (film) => film.isInWatchlist;
const isFilmWatched = (film) => film.isWatched;
const isFilmFavorite = (film) => film.isFavorite;

export const filter = {
  all: (films) => films,
  watchlist: (films) => films.filter(isFilmInWatchlist),
  history: (films) => films.filter(isFilmWatched),
  favorites: (films) => films.filter(isFilmFavorite),
};
