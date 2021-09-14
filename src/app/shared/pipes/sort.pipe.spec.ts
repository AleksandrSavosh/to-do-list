import { SortPipe } from './sort.pipe';

describe('SortPipe', () => {
  let pipe: SortPipe;
  let numbers: number[];
  let objects: { id: number, child: { name: string } }[];

  beforeEach(() => {
    numbers = [4, 2, 58, 8, 5, 4]
    objects = [
      { id: 1, child: { name: 'a' } },
      { id: 4, child: { name: 'z' } },
      { id: 2, child: { name: 'b' } },
      { id: 3, child: { name: 'z' } }
    ];
    pipe = new SortPipe();
  })

  it('create an instance', () => {
    const pipe = new SortPipe();
    expect(pipe).toBeTruthy();
    expect(pipe.transform(null)).toBeNull();
  });

  it('should sort numbers in ascending order', () => {
    const actualArray = pipe.transform(numbers, { direction: 'asc', fields: [] });
    expect(actualArray).toEqual(numbers.sort());
  });

  it('should sort numbers in descending order', () => {
    const actualArray = pipe.transform(numbers, { direction: 'desc', fields: [] });
    expect(actualArray).toEqual(numbers.sort().reverse());
  });

  it('should sort object by number field in ascending order', () => {
    const actualArray = pipe.transform(objects, { direction: 'asc', fields: ['id'] });
    expect(actualArray!.map(value => value.id)).toEqual(objects.map(value => value.id).sort());
  });

  it('should sort object by number field in descending order', () => {
    const actualArray = pipe.transform(objects, { direction: 'desc', fields: ['id'] });
    expect(actualArray!.map(value => value.id)).toEqual(objects.map(value => value.id).sort().reverse());
  });

  it('should sort object by string field in ascending order', () => {
    const actualArray = pipe.transform(objects, { direction: 'asc', fields: ['child', 'name'] });
    expect(actualArray!.map(value => value.child.name)).toEqual(objects.map(value => value.child.name).sort());
  });

  it('should sort object by string field in descending order', () => {
    const actualArray = pipe.transform(objects, { direction: 'desc', fields: ['child', 'name'] });
    expect(actualArray!.map(value => value.child.name)).toEqual(objects.map(value => value.child.name).sort().reverse());
  });

});
