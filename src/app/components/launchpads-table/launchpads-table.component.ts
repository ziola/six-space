import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Launchpad } from '../../services/api/launchpads.service';
import { PageEvent } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-launchpads-table',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatChipsModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './launchpads-table.component.html',
  styleUrl: './launchpads-table.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class LaunchpadsTableComponent {
  displayedColumns: string[] = ['name', 'region', 'launches'];
  expandedRow: Launchpad | null = null;

  @Input() launchpads: Launchpad[] = [];
  @Input() loading = false;
  @Input() error = false;
  @Input() searchTerm = '';

  @Output() pageChange = new EventEmitter<PageEvent>();
}
