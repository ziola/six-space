import { Injectable } from '@angular/core';

export type Launch = {
  name: string;
};

export type Launchpad = {
  name: string;
  fullName: string;
  region: string;
  wikiLink: string;
  launches: Launch[];
};

type Query = { filter?: string };

@Injectable({
  providedIn: 'root',
})
export class LaunchpadsService {
  url = 'https://api.spacexdata.com/v4/launchpads/query';

  constructor() {}

  private buildQuery(query?: Query) {
    if (query?.filter) {
      return {
        $or: [
          { name: { $regex: query.filter, $options: 'i' } },
          { full_name: { $regex: query.filter, $options: 'i' } },
          { region: { $regex: query.filter, $options: 'i' } },
        ],
      };
    }
    return undefined;
  }

  async queryData({
    options,
    query,
  }: {
    options?: { limit?: number; page?: number };
    query?: Query;
  } = {}) {
    const data = await (
      await fetch(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: this.buildQuery(query),
          options: {
            page: (options?.page ?? 0) + 1,
            limit: options?.limit ?? 5,
            select: ['name', 'full_name', 'region', 'launches'],
            populate: [
              {
                path: 'launches',
                select: ['name'],
              },
            ],
          },
        }),
      })
    ).json();
    return {
      launchpads:
        data?.docs?.map(
          (rawLaunchpad: any): Launchpad => ({
            name: rawLaunchpad.name ?? 'Name unknown',
            fullName: rawLaunchpad.full_name ?? 'Full name unknown',
            region: rawLaunchpad.region ?? 'Region unknown',
            wikiLink: 'TODO',
            launches:
              rawLaunchpad.launches?.map((rawLaunch: any) => ({
                name: rawLaunch.name ?? 'Name unknown',
              })) ?? [],
          })
        ) ?? [],
      total: data?.totalDocs ?? 0,
      page: data?.page ?? 1,
    };
  }
}
