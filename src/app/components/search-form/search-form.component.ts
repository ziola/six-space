import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
  ],
  template: `
    <form [formGroup]="searchForm" (submit)="onSubmit()" class="search-form">
      <mat-form-field
        appearance="outline"
        subscriptSizing="dynamic"
        class="search-box"
      >
        <mat-label>Search by name of region</mat-label>
        <input
          matInput
          type="text"
          name="search-box"
          id="search-box"
          placeholder="Ex. Florida"
          formControlName="searchBox"
        />
        <button
          *ngIf="searchForm.value.searchBox"
          matSuffix
          mat-icon-button
          aria-label="Clear"
          type="button"
          (click)="onClear()"
        >
          <mat-icon>close</mat-icon>
        </button>
      </mat-form-field>
      <button mat-raised-button type="submit">Search</button>
    </form>
  `,
  styles: `
    .search-form {
      display: flex;
      justify-content: center;
      align-items: center;
      flex-wrap: wrap;
      gap: 32px;
      margin-bottom: 32px;
    }

    .search-box {
      width: 250px;
    }
  `,
})
export class SearchFormComponent {
  @Output() search = new EventEmitter<string>();

  searchForm = new FormGroup({
    searchBox: new FormControl(''),
  });

  onSubmit() {
    this.search.emit(this.searchForm.value.searchBox ?? '');
  }

  onClear() {
    this.searchForm.controls.searchBox.setValue('');
    this.onSubmit();
  }
}
