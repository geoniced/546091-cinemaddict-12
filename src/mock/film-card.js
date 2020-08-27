import {getRandomInteger, getRandomItem, getUniqueArray} from '../utils/common.js';

const getRandomSentences = () => {
  return [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`,
  ];
};

const getFilmName = () => {
  const films = [
    `The Dance of Life`,
    `Sagebrush Trail`,
    `The Man with the Golden Arm`,
    `Santa Claus Conquers the Martians`,
    `Popeye the Sailor Meets Sindbad the Sailor`,
    `The Man with the Golden Arm`,
    `The Great Flamarion`,
    `Made for Each Other`,
  ];

  return getRandomItem(films);
};

const getPoster = () => {
  const posterFiles = [
    `made-for-each-other.png`,
    `popeye-meets-sinbad.png`,
    `sagebrush-trail.jpg`,
    `santa-claus-conquers-the-martians.jpg`,
    `the-dance-of-life.jpg`,
    `the-great-flamarion.jpg`,
    `the-man-with-the-golden-arm.jpg`,
  ];

  return `./images/posters/${getRandomItem(posterFiles)}`;
};

const getRating = () => {
  const hundredths = getRandomInteger(0, 100);
  const rating = hundredths / 10;

  return rating;
};

const generateText = (from = 1, to = 2) => {
  const sentences = getRandomSentences();

  const sentencesCount = getRandomInteger(from, to);

  const text = new Array(sentencesCount)
    .fill()
    .map(() => getRandomItem(sentences))
    .join(` `);

  return text;
};

const getDescription = () => {
  const description = generateText(1, 5);

  return description;
};

const getYear = () => {
  return getRandomInteger(1900, 2020);
};

const getDuration = () => {
  const timeInMinutes = getRandomInteger(60, 200);
  const hours = Math.floor(timeInMinutes / 60);
  const minutes = timeInMinutes % 60;

  return `${hours > 0 ? `${hours}h ` : ``}${minutes}m`;
};

const getGenre = () => {
  const genres = [
    `Musical`,
    `Western`,
    `Drama`,
    `Comedy`,
    `Cartoon`,
    `Mystery`,
  ];

  return getRandomItem(genres);
};

const getGenres = () => {
  const genresCount = getRandomInteger(1, 3);
  const genres = new Array(genresCount).fill().map(getGenre);

  return genres;
};

const getEmotion = () => {
  const emotions = [`smile`, `sleeping`, `puke`, `angry`];

  return getRandomItem(emotions);
};

const getAuthor = () => {
  const authors = [`John Doe`, `Tim Macoveev`, `Peter Parker`, `Tony Stark`];

  return getRandomItem(authors);
};

const generateDate = (gap = 7) => {
  const daysGap = getRandomInteger(2 * -gap, 0);
  const currentDate = new Date();

  currentDate.setDate(currentDate.getDate() + daysGap);

  return currentDate;
};

const getComment = () => {
  const text = generateText();
  const emotion = getEmotion();
  const author = getAuthor();
  const date = generateDate();

  return {
    text,
    emotion,
    author,
    date,
  };
};

const getComments = () => {
  const commentsCount = getRandomInteger(0, 5);
  const comments = new Array(commentsCount)
    .fill()
    .map(getComment);

  return comments;
};

const getDirector = () => {
  const directors = [
    `Anthony Mann`,
    `Alfred Hitchcock`,
    `Stanley Kubrick`,
    `Akira Kurosawa`,
    `James Cameron`,
  ];

  return getRandomItem(directors);
};

const getWriters = () => {
  const writers = [
    `Ethan Coen`,
    `Anne Wigton`,
    `Heinz Herald`,
    `Richard Weil`,
    `Joel Coen`,
    `Billy Wilder`,
  ];

  const writersCount = getRandomInteger(1, 3);
  const writersArray = new Array(writersCount)
    .fill()
    .map(() => getRandomItem(writers));
  const uniqueWriters = getUniqueArray(writersArray);

  return uniqueWriters;
};

const getActors = () => {
  const actors = [
    `Erich von Stroheim`,
    `Mary Beth Hughes`,
    `Dan Duryea`,
    `Tom Hanks`,
    `Will Smith`,
    `Tom Cruise`,
  ];

  const actorsCount = getRandomInteger(1, 3);
  const actorsArray = new Array(actorsCount)
    .fill()
    .map(() => getRandomItem(actors));
  const uniqueActors = getUniqueArray(actorsArray);

  return uniqueActors;
};

const getReleaseDate = () => {
  const releaseDate = new Date(getRandomInteger(1900, 2020), getRandomInteger(0, 11));
  releaseDate.setDate(getRandomInteger(0, 30));

  return releaseDate;
};

const getCountry = () => {
  const countries = [
    `USA`,
    `Russia`,
    `China`,
    `South Korea`,
    `Canada`,
    `UK`,
  ];

  return getRandomItem(countries);
};

const getAgeLimit = () => {
  const limits = [
    `0+`,
    `6+`,
    `12+`,
    `16+`,
    `18+`,
  ];

  return getRandomItem(limits);
};

export const generateFilmCard = () => {
  const name = getFilmName();
  const poster = getPoster();
  const rating = getRating();
  const description = getDescription();
  const year = getYear();
  const duration = getDuration();
  const genres = getGenres();
  // const genre = genres[0];
  const comments = getComments();
  // extended properties
  const posterFullSize = poster; // They are already at full size
  const originalName = name;
  const director = getDirector();
  const writers = getWriters();
  const actors = getActors();
  const releaseDate = getReleaseDate();
  const country = getCountry();
  const ageLimit = getAgeLimit();

  return {
    name,
    poster,
    rating,
    description,
    year,
    duration,
    // genre,// Скорее всего он не нужен
    genres,
    comments,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isInWatchlist: Boolean(getRandomInteger(0, 1)),

    posterFullSize,
    originalName,
    director,
    writers,
    actors,
    releaseDate,
    country,
    ageLimit,
  };
};
