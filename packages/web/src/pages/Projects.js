import React, { useEffect, useState } from 'react';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      console.log('Fetching projects...');
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>Projeler</h1>
        <button className="btn-primary">+ Yeni Proje</button>
      </div>
      <div className="projects-list">
        {loading ? (
          <p>Yükleniyor...</p>
        ) : projects.length === 0 ? (
          <p>Henüz proje yok.</p>
        ) : (
          projects.map(project => (
            <div key={project.id} className="project-card">
              <h3>{project.name}</h3>
              <p>{project.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;