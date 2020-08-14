const isFilmInWatchlist = (film) => film.isInWatchlist;
const isFilmWatched = (film) => film.isWatched;
const isFilmFavorite = (film) => film.isFavorite;

const filmsToFilterMap = {
  watchlist: (films) => films.filter(isFilmInWatchlist).length,
  history: (films) => films.filter(isFilmWatched).length,
  favorites: (films) => films.filter(isFilmFavorite).length,
};

export const generateFilters = (films) => {
  return Object.entries(filmsToFilterMap).map(([filterName, countFilms]) => {
    return {
      name: filterName,
      count: countFilms(films),
    };
  });
};
