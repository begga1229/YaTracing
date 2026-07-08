import { configureStore } from '@reduxjs/toolkit';
import projectsReducer from './slices/projectsSlice';
import teamsReducer from './slices/teamsSlice';

const store = configureStore({
  reducer: {
    projects: projectsReducer,
    teams: teamsReducer,
  },
});

export default store;