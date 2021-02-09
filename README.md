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

## API Types Generation
```
npx swagger-typescript-api -p https://beta.requirements-bazaar.org/bazaar/swagger.json -o ./src/types -n api.ts
```
