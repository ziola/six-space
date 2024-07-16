import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Launchpad,
  LaunchpadsService,
} from './services/api/launchpads.service';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'six-space';
  launchpads: Launchpad[] = [];
  displayedColumns: string[] = ['name', 'region', 'launches'];
  length = 0;
  limit = 5;
  page = 0;

  launchpadsService: LaunchpadsService = inject(LaunchpadsService);

  searchForm = new FormGroup({
    searchBox: new FormControl(''),
  });

  readonly dialog = inject(MatDialog);

  constructor() {
    this.queryLaunchpads('');
  }

  filterLaunchpads() {
    this.page = 0;
    this.queryLaunchpads(this.searchForm.value.searchBox ?? '', {
      page: 0,
      limit: this.limit,
    });
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.queryLaunchpads(this.searchForm.value.searchBox ?? '', {
      page: event.pageIndex,
      limit: event.pageSize,
    });
  }

  openLaunchesDialog(launchpad: Launchpad) {
    this.dialog.open(LaunchesDialog, { data: { launchpad } });
  }

  private async queryLaunchpads(
    text: string,
    {
      page = this.page,
      limit = this.limit,
    }: { page?: number; limit?: number } = {}
  ) {
    const { launchpads, total } = await this.launchpadsService.queryData({
      query: {
        filter: text,
      },
      options: {
        page: page + 1,
        limit,
      },
    });
    this.length = total;
    this.launchpads = launchpads;
  }
}

type LaunchesDialogData = {
  launchpad: Launchpad;
};

@Component({
  selector: 'launches-dialog',
  template: `
    <h2 mat-dialog-title>
      Launches for: <br />
      {{ data.launchpad.fullName }}
    </h2>
    <mat-dialog-content class="mat-typography">
      <ul>
        <li *ngFor="let launch of data.launchpad.launches">
          {{ launch.name }}
        </li>
      </ul>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancel</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LaunchesDialog {
  constructor(@Inject(MAT_DIALOG_DATA) public data: LaunchesDialogData) {}
}
