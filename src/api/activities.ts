import { Api } from '../types/activities-api';

export const activitiesApi = new Api({
  baseUrl: `${import.meta.env.VITE_ACTIVITIES_API_URL}`,
});
