/* istanbul ignore file */

import { Performer } from './app/models/performer';
import { Task } from './app/models/task';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export const expectedPerformers: Performer[] = [
  { id: 1, name: 'Expected Name' },
  { id: 2, name: 'Expected Name_2' },
  { id: 3, name: 'Expected Name_3' }
];

export const expectedIdPerformerMap: Map<number, Performer> = expectedPerformers.reduce(
  (map, performer) => map.set(performer.id, performer),
  new Map<number, Performer>()
);

export const expectedTasks: Task[] = [
  {
    id: 11,
    description: 'Expected description',
    performerId: expectedPerformers[0].id,
    priority: 6,
    created: new Date(2013, 9, 23).toISOString(),
    isCompleted: false
  },
  {
    id: 12,
    description: 'Expected description 2',
    performerId: expectedPerformers[1].id,
    priority: 2,
    created: new Date(2013, 9, 30).toISOString(),
    isCompleted: false
  },
  {
    id: 13,
    description: 'Expected description 3',
    performerId: expectedPerformers[1].id,
    priority: 2,
    created: new Date(2013, 7, 30).toISOString(),
    isCompleted: false
  },
  {
    id: 14,
    description: 'Expected description 4',
    performerId: expectedPerformers[1].id,
    priority: 4,
    created: new Date(2013, 7, 30).toISOString(),
    isCompleted: true
  }
];

export const hasElement = (fixture: ComponentFixture<any>, selector: string): boolean => {
  const de = fixture.debugElement.query(By.css(selector));
  return de && de.nativeElement && de.nativeElement instanceof HTMLElement;
}

export const getElement = (fixture: ComponentFixture<any>, selector: string): HTMLElement => {
  const de = fixture.debugElement.query(By.css(selector));
  if (!de || !de.nativeElement) {
    throw new Error(`Element is not found by selector ${selector}`)
  }
  return de.nativeElement;
}

export const getElements = (fixture: ComponentFixture<any>, selector: string): HTMLElement[] => {
  const des = fixture.debugElement.queryAll(By.css(selector));
  return des.map(de => de.nativeElement);
}

export const getTexts = (fixture: ComponentFixture<any>, selector: string): string[] => {
  return getElements(fixture, selector).map(element => element.textContent!);
}

export const getText = (fixture: ComponentFixture<any>, selector: string): string => {
  return getElement(fixture, selector).textContent!.trim();
}

export const getButton = (fixture: ComponentFixture<any>, selector: string): HTMLButtonElement => {
  const element = getElement(fixture, selector);

  if (!(element instanceof HTMLButtonElement)) {
    throw new Error(`Element is not HTMLButtonElement. Selector: ${selector} `);
  }

  return element;
}

export const getInputElement = (fixture: ComponentFixture<any>, selector: string): HTMLInputElement => {
  const element = getElement(fixture, selector);

  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Element is not HTMLInputElement. Selector: ${selector} `);
  }

  return element;
}

export const getTextAreaElement = (fixture: ComponentFixture<any>, selector: string): HTMLTextAreaElement => {
  const element = getElement(fixture, selector);

  if (!(element instanceof HTMLTextAreaElement)) {
    throw new Error(`Element is not HTMLTextAreaElement. Selector: ${selector} `);
  }

  return element;
}

export const getLinkElement = (fixture: ComponentFixture<any>, selector: string): HTMLLinkElement => {
  const element = getElement(fixture, selector);

  if (!(element instanceof HTMLLinkElement)) {
    throw new Error(`Element is not HTMLLinkElement. Selector: ${selector} `);
  }

  return element;
}

export const clickOnLink = (fixture: ComponentFixture<any>, selector: string): void => {
  getLinkElement(fixture, selector).click();
}

export const clickOnButton = (fixture: ComponentFixture<any>, selector: string): void => {
  getButton(fixture, selector).click();
}

export const getSelect = (fixture: ComponentFixture<any>, selector: string): HTMLSelectElement => {
  const element = getElement(fixture, selector);

  if (!(element instanceof HTMLSelectElement)) {
    throw new Error(`Element is not HTMLSelectElement. Selector: ${selector} `);
  }

  return element;
}

export const textValue = (fixture: ComponentFixture<any>, selector: string, text: string): void => {
  const textArea = getTextAreaElement(fixture, selector);
  textArea.value = text;
  textArea.dispatchEvent(new Event('input'));
}

export const selectValue = (fixture: ComponentFixture<any>, selector: string, selectIndex: number): void => {
  const select = getSelect(fixture, selector);
  select.value = select.options[selectIndex].value;
  select.dispatchEvent(new Event('change'));
}

export const inputValue = (fixture: ComponentFixture<any>, selector: string, value: string | number): void => {
  const input = getInputElement(fixture, selector);
  input.value = `${value}`;
  input.dispatchEvent(new Event('input'));
}

