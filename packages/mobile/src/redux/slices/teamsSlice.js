import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  teams: [],
  loading: false,
  error: null,
};

const teamsSlice = createSlice({
  name: 'teams',
  initialState,
  reducers: {
    setTeams: (state, action) => {
      state.teams = action.payload;
    },
  },
});

export const { setTeams } = teamsSlice.actions;
export default teamsSlice.reducer;