import moment from 'moment';

export const sortByDate = (filmA, filmB) => {
  return filmB.releaseDate.getTime() - filmA.releaseDate.getTime();
};

export const sortByRating = (filmA, filmB) => {
  return filmB.rating - filmA.rating;
};

export const sortByComments = (filmA, filmB) => {
  return filmB.comments.length - filmA.comments.length;
};

export const getDuration = (timeInMinutes) => {
  const duration = moment.duration(timeInMinutes, `m`);
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};
