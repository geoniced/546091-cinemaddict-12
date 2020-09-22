
export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    return this._api.getFilms();
  }

  getComments(films) {
    return this._api.getComments(films);
  }

  getComment(filmId) {
    return this._api.getComment(filmId);
  }

  updateFilm(film) {
    return this._api.updateFilm(film);
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
