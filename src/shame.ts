export function compare(obj: any, anotherOjb: any): boolean {
  return JSON.stringify(obj) === JSON.stringify(anotherOjb);
}
