import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {
  Launchpad,
  LaunchpadsService,
} from './services/api/launchpads.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'six-space';
  launchpads: Launchpad[] = [];

  launchpadsService: LaunchpadsService = inject(LaunchpadsService);

  constructor() {
    this.filterLaunchpads('');
  }

  filterLaunchpads(text: string) {
    this.launchpadsService
      .queryData({
        query: {
          filter: text,
        },
      })
      .then((launchapds) => {
        this.launchpads = launchapds;
      });
  }
}
