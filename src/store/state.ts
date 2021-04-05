import { Project, Category, Requirement, Comment } from '../types/api';
import { Activity } from '../types/activities-api';

export interface LocalComment extends Comment {
  showReplyTo?: boolean;
}

export type State = {
  projects: {[id: number]: Project};
  categories: {[id: number]: Category};
  requirements: {[id: number]: Requirement};
  comments: {[id: number]: LocalComment};
  activities: {[id: number]: Activity};
}

export const state: State = {
  projects: {},
  categories: {},
  requirements: {},
  comments: {},
  activities: {},
};
