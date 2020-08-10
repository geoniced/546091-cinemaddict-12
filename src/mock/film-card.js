const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

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

  return films[getRandomInteger(0, films.length - 1)];
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

  const posterIndex = getRandomInteger(0, posterFiles.length - 1);

  return `./images/posters/${posterFiles[posterIndex]}`;
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
    .map(() => sentences[getRandomInteger(0, sentences.length - 1)])
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

  const genreIndex = getRandomInteger(0, genres.length - 1);

  return genres[genreIndex];
};

const getEmotion = () => {
  const emotions = [`smile`, `sleeping`, `puke`, `angry`];
  const emotionIndex = getRandomInteger(0, emotions.length - 1);

  return emotions[emotionIndex];
};

const getAuthor = () => {
  const authors = [`John Doe`, `Tim Macoveev`, `Peter Parker`, `Tony Stark`];
  const authorIndex = getRandomInteger(0, authors.length - 1);

  return authors[authorIndex];
};

const generateDate = (gap = 7) => {
  const daysGap = getRandomInteger(-gap, gap);
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

export const generateFilmCard = () => {
  const name = getFilmName();
  const poster = getPoster();
  const rating = getRating();
  const description = getDescription();
  const year = getYear();
  const duration = getDuration();
  const genre = getGenre();
  const comments = getComments();

  return {
    name,
    poster,
    rating,
    description,
    year,
    duration,
    genre,
    comments,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    isWatched: Boolean(getRandomInteger(0, 1)),
    isInWatchlist: Boolean(getRandomInteger(0, 1)),
  };
};
