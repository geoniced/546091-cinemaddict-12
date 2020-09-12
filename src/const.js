export const EMOTIONS = [`smile`, `sleeping`, `puke`, `angry`];

export const SortType = {
  DEFAULT: `default`,
  BY_DATE: `date`,
  BY_RATING: `rating`,
};

export const UserAction = {
  UPDATE_FILM: `UPDATE_FILM`,
  UPDATE_COMMENT: `UPDATE_COMMENT`,
  ADD_COMMENT: `ADD_COMMENT`,
  DELETE_COMMENT: `DELETE_COMMENT`,
};

export const UpdateType = {
  MINOR: `MINOR`, // Действия над карточкой – перерисовка фильтров
  MAJOR: `MAJOR`, // Действия над комментариями – надо изменять экстра панель
};

export const FilmType = {
  ALL_FILMS: `all-films`,
  TOP_RATED: `top-rated`,
  MOST_COMMENTED: `most-commented`,
};
