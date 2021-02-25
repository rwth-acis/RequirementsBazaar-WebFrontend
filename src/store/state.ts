import { Project, Category, Requirement, Comment } from '../types/api';

export type State = {
  projects: {[id: number]: Project};
  categories: {[id: number]: Category};
  requirements: {[id: number]: Requirement};
  comments: {[id: number]: Comment};
}

export const state: State = {
  projects: {},
  categories: {},
  requirements: {},
  comments: {},
};
