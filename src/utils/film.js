

export const sortByDate = (filmA, filmB) => {
  return filmB.releaseDate.getTime() - filmA.releaseDate.getTime();
};

export const sortByRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortByComments = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};

export const filterByEmptyRating = (film) => {
  return film.rating > 0;
};

export const filterByEmptyComments = (film) => {
  return film.comments.length > 0;
};

export const countFilmsDuration = (counter, film) => {
  return counter + film.duration;
};
