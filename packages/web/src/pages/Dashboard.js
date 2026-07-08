import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setProjects } from '../redux/slices/projectsSlice';
import { projectAPI } from '../services/api';
import './Dashboard.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { projects } = useSelector(state => state.projects);
  const [stats, setStats] = useState({
    activeProjects: 0,
    totalTeams: 0,
    completedTasks: 0,
    materials: 0,
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await projectAPI.getAll();
      dispatch(setProjects(response.data));
      
      const activeProjects = response.data.filter(p => p.status === 'active').length;
      setStats({
        activeProjects,
        totalTeams: 45,
        completedTasks: 234,
        materials: 1234,
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <div className="dashboard-grid">
        <div className="card">
          <h3>Aktif Projeler</h3>
          <p className="stat">{stats.activeProjects}</p>
        </div>
        <div className="card">
          <h3>Takım Üyeleri</h3>
          <p className="stat">{stats.totalTeams}</p>
        </div>
        <div className="card">
          <h3>Tamamlanan İşler</h3>
          <p className="stat">{stats.completedTasks}</p>
        </div>
        <div className="card">
          <h3>Malzeme Envanteri</h3>
          <p className="stat">{stats.materials}</p>
        </div>
      </div>
      
      <h2 style={{ marginTop: '40px' }}>Son Projeler</h2>
      <div className="projects-list">
        {projects.slice(0, 5).map(project => (
          <div key={project.id} className="project-item">
            <h4>{project.name}</h4>
            <div className="progress-bar">
              <div className="progress" style={{ width: `${project.progress}%` }}></div>
            </div>
            <span className="progress-text">{project.progress}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;