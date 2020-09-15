import Observer from "../utils/observer.js";
import {FilterType} from '../const.js';

export default class Filter extends Observer {
  constructor() {
    super();

    this._activeFilter = FilterType.ALL;
  }

  setFilter(updateType, filterType) {
    this._activeFilter = filterType;
    this._notify(updateType, filterType);
  }

  getFilter() {
    return this._activeFilter;
  }
}
