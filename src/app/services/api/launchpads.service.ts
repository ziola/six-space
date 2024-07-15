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

class Or {
  private conditions: Array<Record<string, any>> = [];

  addCondition(name: string, value: string) {
    this.conditions.push({ [name]: value });
  }

  value() {
    return this.conditions.length ? this.conditions : undefined;
  }
}

@Injectable({
  providedIn: 'root',
})
export class LaunchpadsService {
  url = 'https://api.spacexdata.com/v4/launchpads/query';

  constructor() {}

  private buildQuery(query?: Query) {
    const or = new Or();

    if (query?.filter) {
      or.addCondition('name', query.filter);
      or.addCondition('full_name', query.filter);
      or.addCondition('region', query.filter);
    }

    return { $or: or.value() };
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
            page: options?.page ?? 1,
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
    return (
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
      ) ?? []
    );
  }
}
