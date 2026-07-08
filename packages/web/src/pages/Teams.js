import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTeams } from '../redux/slices/teamsSlice';
import { teamAPI } from '../services/api';
import './Teams.css';

const Teams = () => {
  const dispatch = useDispatch();
  const { teams } = useSelector(state => state.teams);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await teamAPI.getAll();
      dispatch(setTeams(response.data));
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  return (
    <div className="teams">
      <h1>Ekipler</h1>
      <div className="teams-grid">
        {teams.map(team => (
          <div key={team.id} className="team-card">
            <h3>{team.name}</h3>
            <p>{team.department}</p>
            <span className="member-count">👥 {team.memberCount} üye</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Teams;