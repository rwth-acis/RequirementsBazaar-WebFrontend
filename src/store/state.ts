import { Project, Category, Requirement, Comment, Dashboard, ProjectMember, User, GamificationNotification } from '../types/bazaar-api';
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
  requirementFollowers: {
    [requirementId: number]: {[memberId: number]: User}
  };
  requirementDevelopers: {
    [requirementId: number]: {[memberId: number]: User}
  };
  categories: {[id: number]: Category};
  requirements: {[id: number]: Requirement};
  comments: {[id: number]: LocalComment};
  activities: {[id: number]: Activity};
  dashboard: Dashboard;
  unhandledErrors: UnhandledError[];
  featuredProjectIds: number[];
  notification: GamificationNotification[];
}

export const state: State = {
  projects: {},
  projectMembers: {},
  requirementFollowers: {},
  requirementDevelopers: {},
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
  featuredProjectIds: [],
  notification: [],
};
