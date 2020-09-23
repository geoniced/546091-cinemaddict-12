import FilmsModel from "../model/films.js";

const getSyncedFilms = ((films) => {
  return films.map(FilmsModel.adaptToClient);
});

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
    if (Provider.isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setSubItem(`films`, updatedFilm.id, updatedFilm);
          return updatedFilm;
        });
    }

    this._store.setSubItem(`films`, film.id, Object.assign({}, film, {
      changed: true
    }));

    return Promise.resolve(film);
  }

  addComment(comment) {
    if (Provider.isOnline()) {
      return this._api.addComment(comment);
    }

    return Promise.reject(new Error(`Comment creation cannot be done when offline`));
  }

  deleteComment(comment) {
    if (Provider.isOnline()) {
      return this._api.deleteComment(comment);
    }

    return Promise.reject(new Error(`Deletion cannot be done when offline`));
  }

  sync() {
    if (Provider.isOnline()) {
      const storedItems = this._store.getItems();
      const storedFilms = Object.values(storedItems.films)
        .filter((film) => film.changed)
        .map(FilmsModel.adaptToServer);

      return this._api.sync(storedFilms)
        .then((response) => {
          const updatedFilms = getSyncedFilms(response.updated);

          updatedFilms.forEach((updatedFilm) => {
            this._store.setSubItem(`films`, updatedFilm.id, updatedFilm);
          });

          return response;
        });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }

  static isOnline() {
    return window.navigator.onLine;
  }
}
