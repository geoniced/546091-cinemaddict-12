import FilmsModel from "../model/films.js";

const createStoreStructure = (films, comments) => {
  const filmItems = films.reduce((acc, film) => {
    return Object.assign(
        {},
        acc,
        {
          [film.id]: film
        }
    );
  }, {});

  return {films: filmItems, comments};
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilmsWithComments() {
    if (Provider.isOnline()) {
      return this._api.getFilmsWithComments()
        .then((response) => {
          const {films, comments} = response;
          const items = createStoreStructure(films, comments);
          this._store.setItems(items);

          return response;
        });
    }

    const storedItems = this._store.getItems();
    const storedFilms = Object.values(storedItems.films);
    const storedComments = storedItems.comments;

    return Promise.resolve({
      comments: storedComments,
      films: storedFilms
    });
  }

  updateFilm(film) {
    return this._api.updateFilm(film);
  }

  addComment(comment) {
    return this._api.addComment(comment);
  }

  deleteComment(comment) {
    return this._api.deleteComment(comment);
  }

  sync(data) {
    return this._api.sync(data);
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
