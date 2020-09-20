import Observer from "../utils/observer.js";

export default class Comments extends Observer {
  constructor() {
    super();

    this._comments = [];
    // this._comments = {};
  }

  setComments(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  getComments() {
    return this._comments;
  }

  getCommentsByFilmId(filmId) {
    return this._comments.filter((comment) => comment.filmId === filmId);
  }

  getCommentsByIds(commentIds) {
    return commentIds
      .map((commentId) => {
        return this._comments.find((comment) => {
          return comment.id === commentId;
        });
      })
      .filter((comment) => {
        return comment;
      });
  }

  addComment(updateType, update) {
    this._comments = [
      ...this._comments,
      update
    ];

    this._notify(updateType, update);
  }

  deleteComment(updateType, updateId) {
    const index = this._comments.findIndex((comment) => comment.id === updateId);

    if (index === -1) {
      throw new Error(`Can't update unexisting film`);
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          text: comment.comment
        }
    );

    delete adaptedComment.comment;
    return adaptedComment;
  }

  static adaptToServer(comment) {
    const adaptedComment = Object.assign(
        {},
        comment,
        {
          comment: comment.text
        }
    );

    delete adaptedComment.text;
    delete adaptedComment.filmId;

    return adaptedComment;
  }
}
