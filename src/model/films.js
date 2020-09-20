import Observer from "../utils/observer.js";
import moment from "moment";

export default class Films extends Observer {
  constructor() {
    super();

    this._films = [];
  }

  setFilms(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
  }

  getFilms() {
    return this._films;
  }

  updateFilm(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  getFilmIdByCommentId(commentId) {
    const filmByComment = this._films.find((film) => {
      return film.commentsIds.indexOf(commentId) !== -1;
    });

    return filmByComment.id;
  }

  static adaptToClient(films) {
    const {film_info: filmInfo, user_details: userDetails} = films;
    const adaptedFilms = Object.assign(
        {},
        films,
        {
          actors: filmInfo.actors,
          ageLimit: filmInfo.age_rating,
          country: filmInfo.release.release_country,
          commentsIds: films.comments, // should be ids
          description: filmInfo.description,
          director: filmInfo.director,
          duration: filmInfo.runtime,
          genres: filmInfo.genre,
          isFavorite: userDetails.favorite,
          isInWatchlist: userDetails.watchlist,
          isWatched: userDetails.already_watched,
          watchingDate: new Date(userDetails.watching_date),
          name: filmInfo.title,
          originalName: filmInfo.alternative_title,
          poster: filmInfo.poster,
          posterFullSize: filmInfo.poster,
          rating: filmInfo.total_rating,
          releaseDate: new Date(filmInfo.release.date),
          writers: filmInfo.writers,
          year: moment(filmInfo.release.date).year()
        }
    );

    delete adaptedFilms.film_info;
    delete adaptedFilms.user_details;

    return adaptedFilms;
  }

  static adaptToServer(films) {
    const filmInfo = Object.assign(
        {},
        {
          "actors": films.actors,
          "age_rating": films.ageLimit,
          "release": {
            "release_country": films.country,
            "date": films.releaseDate.toISOString(),
          },
          "runtime": films.duration,
          "description": films.description,
          "director": films.director,
          "genre": films.genres,
          "title": films.name,
          "alternative_title": films.originalName,
          "poster": films.poster,
          "total_rating": films.rating,
          "writers": films.writers,
        }
    );

    const userDetails = Object.assign(
        {},
        {
          "favorite": films.isFavorite,
          "watchlist": films.isInWatchlist,
          "already_watched": films.isWatched,
          "watching_date": films.watchingDate.toISOString(),
        }
    );

    const adaptedFilms = Object.assign(
        {},
        {
          "id": films.id,
          "comments": films.commentsIds,
          "film_info": filmInfo,
          "user_details": userDetails
        }
    );

    delete adaptedFilms.commentsIds;

    return adaptedFilms;
  }
}
