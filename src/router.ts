import { createRouter, createWebHistory } from 'vue-router';
import Landing from './views/Landing.vue';
import Home from './views/Home.vue';
import Privacy from './views/Privacy.vue';
import About from './views/About.vue';
import Developer from './views/Developer.vue';
import Projects from './views/Projects.vue';
import Project from './views/Project.vue';
import Category from './views/Category.vue';
import Requirement from './views/Requirement.vue';
import OidcCallback from './views/oidc/OidcCallback.vue';
import OidcPopupCallback from './views/oidc/OidcPopupCallback.vue'
import OidcCallbackError from './views/oidc/OidcCallbackError.vue'
import { vuexOidcCreateRouterMiddleware } from 'vuex-oidc';
import { store } from './store';

export const router = createRouter({
  history: createWebHistory(),
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  },
  routes: [
    {
      path: "/",
      name: "landing",
      component: Landing,
    },
    {
      path: "/home",
      name: "Home",
      component: Home,
    },
    {
      path: '/oidc-callback',
      name: 'oidcCallback',
      component: OidcCallback,
    },
    {
      path: '/oidc-popup-callback', // Needs to match popupRedirectUri in you oidcSettings
      name: 'oidcPopupCallback',
      component: OidcPopupCallback
    },
    {
      path: '/oidc-callback-error', // Needs to match redirect_uri in you oidcSettings
      name: 'oidcCallbackError',
      component: OidcCallbackError,
    },
    {
      path: "/privacy",
      name: "privacy",
      component: Privacy,
    },
    {
      path: "/about",
      name: "about",
      component: About,
    },
    {
      path: "/developer",
      name: "developer",
      component: Developer,
    },
    {
      path: "/projects",
      name: "projects",
      component: Projects,
    },
    {
      path: "/projects/:projectId",
      name: "project",
      component: Project,
    },
    {
      path: "/projects/:projectId/all",
      name: "project-all",
      component: Project,
    },
    {
      path: "/projects/:projectId/members",
      name: "project-members",
      component: Project,
    },
    {
      path: "/projects/:projectId/categories/:categoryId/:done?",
      name: "category",
      component: Category,
    },
    {
      path: "/projects/:projectId/requirements/:requirementId",
      name: "requirement",
      component: Requirement,
    },
  ],
});

export const routePathToProject = (projectId: string | number) => {
  return `/projects/${projectId}`;
};

/**
 * Returns the *route path* to the given requirment (no absolute URL!).
 */
export const routePathToRequirement = (projectId: string | number, requirementId: string | number) => {
  return `/projects/${projectId}/requirements/${requirementId}`;
};

router.beforeEach(vuexOidcCreateRouterMiddleware(store, 'oidcStore'))
router.beforeEach((to, from, next) => {
  console.log({to, from});
  next();
});
