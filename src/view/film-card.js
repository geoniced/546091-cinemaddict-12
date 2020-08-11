const formatDescription = (description) => {
  const SYMBOLS_COUNT = 140;
  let formattedDescription = description;

  if (description.length > SYMBOLS_COUNT) {
    formattedDescription = `${description.slice(0, SYMBOLS_COUNT - 1)}…`;
  }

  return formattedDescription;
};

export const createFilmCardTemplate = (film) => {
  const {
    name,
    rating,
    year,
    duration,
    genre,
    poster,
    description,
    comments,
    isInWatchlist,
    isWatched,
    isFavorite,
  } = film;

  const formattedDescription = formatDescription(description);
  const commentsCount = comments.length;

  const inWatchlistClassName = isInWatchlist
    ? `film-card__controls-item--active`
    : ``;

  const isWatchedClassName = isWatched
    ? `film-card__controls-item--active`
    : ``;

  const isFavoriteClassName = isFavorite
    ? `film-card__controls-item--active`
    : ``;

  return (
    `<article class="film-card">
      <h3 class="film-card__title">${name}</h3>
      <p class="film-card__rating">${rating}</p>
      <p class="film-card__info">
        <span class="film-card__year">${year}</span>
        <span class="film-card__duration">${duration}</span>
        <span class="film-card__genre">${genre}</span>
      </p>
      <img src="${poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${formattedDescription}</p>
      <a class="film-card__comments">${commentsCount} comments</a>
      <form class="film-card__controls">
        <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${inWatchlistClassName}">Add to watchlist</button>
        <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${isWatchedClassName}">Mark as watched</button>
        <button class="film-card__controls-item button film-card__controls-item--favorite ${isFavoriteClassName}">Mark as favorite</button>
      </form>
    </article>`
  );
};
