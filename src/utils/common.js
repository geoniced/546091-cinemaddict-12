import moment from 'moment';

export const getUniqueArray = (array) => {
  return [...new Set(array)];
};

export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandomItem = (collection) => {
  return collection[getRandomInteger(0, collection.length - 1)];
};

export const humanizeDate = (date) => {
  return moment(date).format(`DD MMMM YYYY`);
};

export const getDuration = (timeInMinutes) => {
  const duration = moment.duration(timeInMinutes, `m`);
  const hours = duration.hours();
  const minutes = duration.minutes();

  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};


export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1)
  ];
};
