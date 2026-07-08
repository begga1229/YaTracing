import React, { useEffect, useState } from 'react';
import './Materials.css';

const Materials = () => {
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Fetch materials
  }, []);

  return (
    <div className="materials">
      <h1>Malzemeler</h1>
      <p>Malzeme takip sayfası.</p>
    </div>
  );
};

export default Materials;