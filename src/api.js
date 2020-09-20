import FilmsModel from "./model/films.js";
import CommentsModel from "./model/comments.js";

const Method = {
  GET: `GET`,
  PUT: `PUT`,
  POST: `POST`,
  DELETE: `DELETE`,
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilms() {
    return this._load({url: `movies`})
      .then(Api.toJSON)
      .then((films) => films.map(FilmsModel.adaptToClient));
  }

  getComments(films) {
    const commentPromises = films.map((film) => this.getComment(film.id));
    return Promise.all(commentPromises)
      .then((commentsForEachFilm) => {
        let commentsFlat = [];
        commentsForEachFilm.forEach((filmComments) => {
          commentsFlat = commentsFlat.concat(filmComments);
        });

        return commentsFlat;
      });
  }

  getComment(filmId) {
    return this._load({url: `comments/${filmId}`})
      .then(Api.toJSON)
      .then((comments) => comments.map(CommentsModel.adaptToClient));
  }

  updateFilm(film) {
    return this._load({
      url: `movies/${film.id}`,
      method: Method.PUT,
      body: JSON.stringify(FilmsModel.adaptToServer(film)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then(FilmsModel.adaptToClient);
  }

  addComment(comment) {
    return this._load({
      url: `comments/${comment.filmId}`,
      method: Method.POST,
      body: JSON.stringify(CommentsModel.adaptToServer(comment)),
      headers: new Headers({"Content-Type": `application/json`})
    })
      .then(Api.toJSON)
      .then((response) => {
        response.comments = response.comments.map(CommentsModel.adaptToClient);
        response.movie = FilmsModel.adaptToClient(response.movie);
        return response;
      });
  }

  deleteComment(comment) {
    return this._load({
      url: `comments/${comment}`,
      method: Method.DELETE
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers()
  }) {
    headers.append(`Authorization`, this._authorization);

    return fetch(
        `${this._endPoint}/${url}`,
        {method, body, headers}
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN &&
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
