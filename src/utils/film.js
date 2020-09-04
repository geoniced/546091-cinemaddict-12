export const sortByDate = (filmA, filmB) => {
  return filmB.releaseDate.getTime() - filmA.releaseDate.getTime();
};

export const sortByRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortByComments = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};
