import { Component, EventEmitter, Output } from '@angular/core';
import { Filter } from '../../../models';
import { FilterService } from '../../../services/filter.service';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.css'],
})
export class FilterComponent {
  @Output() update = new EventEmitter();

  protected readonly Filter = Filter;

  constructor(public filterService: FilterService) {}

  onRefresh() {
    this.update.emit();
  }
}
