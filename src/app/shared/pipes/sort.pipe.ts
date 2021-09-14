import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  private static getSortValue(obj: any, fields: string[]): any {
    return fields.reduce((obj, field) => obj[field], obj);
  }

  transform<T>(value: T[] | null, options: SortOptions = { direction: 'asc', fields: [] }): T[] | null {
    if (!value) {
      return null;
    }

    return value.sort((o1, o2) => {
      const v1 = SortPipe.getSortValue(o1, options.fields);
      const v2 = SortPipe.getSortValue(o2, options.fields);
      const isNumber = typeof o1 === 'number';
      const isAscending = options.direction === 'asc';

      if (isNumber && isAscending) {
        return v1 - v2;
      }

      if (isNumber && !isAscending) {
        return v2 - v1;
      }

      if (!isNumber && isAscending) {
        return v1 < v2 ? -1 : v1 === v2 ? 0 : 1;
      }

      return v1 < v2 ? 1 : v1 === v2 ? 0 : -1;
    });
  }

}

export interface SortOptions {
  direction: 'asc' | 'desc';
  fields: string[];
}
