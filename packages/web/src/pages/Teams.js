import React, { useEffect, useState } from 'react';
import './Teams.css';

const Teams = () => {
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    // Fetch teams
  }, []);

  return (
    <div className="teams">
      <h1>Ekipler</h1>
      <p>Ekip yönetim sayfası.</p>
    </div>
  );
};

export default Teams;