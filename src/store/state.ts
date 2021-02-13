import { Project, Category } from '../types/api';

export type State = {
  projects: {[id: number]: Project};
  categories: {[id: number]: Category}
}

export const state: State = {
  projects: {},
  categories: {},
};
