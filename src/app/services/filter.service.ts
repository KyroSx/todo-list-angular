import { Injectable } from '@angular/core';
import { Filter } from '../models';

@Injectable({
  providedIn: 'root',
})
export class FilterService {
  current: Filter = Filter.ALL;

  setToAll() {
    this.current = Filter.ALL;
  }
}
