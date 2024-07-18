import { Component, inject } from '@angular/core';
import {
  Launchpad,
  LaunchpadsService,
} from './services/api/launchpads.service';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { SearchFormComponent } from './components/search-form/search-form.component';
import { LaunchpadsTableComponent } from './components/launchpads-table/launchpads-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatPaginatorModule,
    SearchFormComponent,
    LaunchpadsTableComponent,
  ],
  template: `
    <main>
      <h1>SpaceX launchpads browser</h1>

      <app-search-form (search)="filterLaunchpads($event)"></app-search-form>

      <mat-paginator
        [pageSizeOptions]="[2, 5, 10]"
        [length]="length"
        [pageSize]="limit"
        [pageIndex]="page"
        (page)="handlePageEvent($event)"
        showFirstLastButtons
        aria-label="Select page of launchapds"
      >
      </mat-paginator>

      <app-launchpads-table
        [launchpads]="launchpads"
        [error]="showError"
        [loading]="showSpinner"
        [searchTerm]="searchTerm"
      ></app-launchpads-table>
    </main>
  `,
  styles: `
    *,
    *:after,
    *:before {
      box-sizing: border-box;
    }

    main {
      margin: 64px 32px 0;
    }
  `,
})
export class AppComponent {
  title = 'six-space';
  launchpads: Launchpad[] = [];
  length = 0;
  limit = 5;
  page = 0;
  showSpinner = false;
  showError = false;
  searchTerm = '';

  launchpadsService: LaunchpadsService = inject(LaunchpadsService);

  constructor() {
    this.queryLaunchpads('');
  }

  filterLaunchpads(searchTerm: string) {
    this.page = 0;
    this.searchTerm = searchTerm;
    this.queryLaunchpads(searchTerm ?? '', {
      page: 0,
      limit: this.limit,
    });
  }

  handlePageEvent(event: PageEvent) {
    this.page = event.pageIndex;
    this.limit = event.pageSize;
    this.queryLaunchpads(this.searchTerm ?? '', {
      page: event.pageIndex,
      limit: event.pageSize,
    });
  }

  private async queryLaunchpads(
    text: string,
    {
      page = this.page,
      limit = this.limit,
    }: { page?: number; limit?: number } = {}
  ) {
    this.showSpinner = true;
    this.showError = false;
    this.launchpads = [];
    try {
      const { launchpads, total } = await this.launchpadsService.queryData({
        query: {
          filter: text,
        },
        options: {
          page: page,
          limit,
        },
      });
      this.length = total;
      this.launchpads = launchpads;
    } catch {
      this.showError = true;
    } finally {
      this.showSpinner = false;
    }
  }
}
