import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/slices/projectsSlice';
import { projectAPI } from '../services/api';
import './Projects.css';

const Projects = () => {
  const dispatch = useDispatch();
  const { projects, loading } = useSelector(state => state.projects);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await projectAPI.getAll();
      dispatch(setProjects(response.data));
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleAddProject = async () => {
    const name = prompt('Project name:');
    if (name) {
      try {
        const newProject = await projectAPI.create({
          name,
          description: '',
          startDate: new Date(),
          budget: 0,
        });
        dispatch(setProjects([...projects, newProject.data]));
      } catch (error) {
        console.error('Error creating project:', error);
      }
    }
  };

  return (
    <div className="projects">
      <div className="projects-header">
        <h1>Projeler</h1>
        <button className="btn-primary" onClick={handleAddProject}>+ Yeni Proje</button>
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
              <span className="status" style={{
                backgroundColor: project.status === 'active' ? '#27ae60' : '#95a5a6',
              }}>
                {project.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;