import { Project } from '../types/api';

export type State = {
  projects: {[id: number] : Project};
}

export const state: State = {
  projects: {},
};
