# Requirements Bazaar Frontend
This is the Vue3 based implementation of the Requirements Bazaar Frontend.

- Vue 3
- Vuex 4
- Vue Router 4
- PrimeVue 3
- Vite 2
- Typescript
- SASS

## Set up Development Environment
Install dependencies:
```
npm install
```
We use [Vite](https://vitejs.dev/) for frontend tooling.
To start the development server, use:
```
npm run dev
```

## Local Backend

To use a local Requirements Bazaar backend during development use:
```
npm run dev-local-api
```

## Build

There are multiple commands to build the frontend for different environments.
To build for the *beta environment*, use:
```
npm run build-beta
```

To build for the *production environment*, use:
```
npm run build-prod
```

If you want to deploy your own instance of the Requirements Bazaar, provide an environment configuration `.env.my-environment` and use:
```
npm run build -- --mode my-environment
```


## API Types Generation
The following commands have to be executed only after the backend API has been updated. Normally, the
current generated API is already checked into the repository in the `/src/types` folder.

```
npx swagger-typescript-api -p https://beta.requirements-bazaar.org/bazaar/swagger.json -o ./src/types -n bazaar-api.ts --route-types
npx swagger-typescript-api -p https://beta.requirements-bazaar.org/activities/swagger.json -o ./src/types -n activities-api.ts --route-types
```
