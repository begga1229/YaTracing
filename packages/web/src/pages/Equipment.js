import React, { useEffect, useState } from 'react';
import './Equipment.css';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    // Fetch equipment
  }, []);

  return (
    <div className="equipment">
      <h1>Ekipmanlar</h1>
      <p>Ekipman takip sayfası.</p>
    </div>
  );
};

export default Equipment;