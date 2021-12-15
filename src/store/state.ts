import { Project, Category, Requirement, Comment, Dashboard, ProjectMember } from '../types/bazaar-api';
import { Activity } from '../types/activities-api';

export interface LocalComment extends Comment {
  showReplyTo?: boolean;
  draftMessage?: String;
}

export interface UnhandledError {
  message: string;
  source: string;
  details: string;
  timestamp: number;
}

export type State = {
  projects: {[id: number]: Project};
  projectMembers: {
    [projectId: number]: {[memberId: number]: ProjectMember}
  };
  categories: {[id: number]: Category};
  requirements: {[id: number]: Requirement};
  comments: {[id: number]: LocalComment};
  activities: {[id: number]: Activity};
  dashboard: Dashboard;
  unhandledErrors: UnhandledError[];
}

export const state: State = {
  projects: {},
  projectMembers: {},
  categories: {},
  requirements: {},
  comments: {},
  activities: {},
  dashboard: {
    projects: [],
    categories: [],
    requirements: [],
  },
  unhandledErrors: [],
};
