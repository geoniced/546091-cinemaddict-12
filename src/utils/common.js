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

export const getRandomizedItems = (items) => {
  const copyItems = items.slice();

  const newItems = [];

  while (copyItems.length > 0) {
    const randomItem = getRandomItem(copyItems);
    const randomItemIndex = copyItems.findIndex((copyItem) => copyItem === randomItem);
    newItems.push(randomItem);
    copyItems.splice(randomItemIndex, 1);
  }

  return newItems;
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

// in production, I should use something better, i.e https://github.com/ai/nanoid
export const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);
