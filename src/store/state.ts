import { Project, Category, Requirement } from '../types/api';

export type State = {
  projects: {[id: number]: Project};
  categories: {[id: number]: Category};
  requirements: {[id: number]: Requirement};
}

export const state: State = {
  projects: {},
  categories: {},
  requirements: {},
};
