import React, { useEffect, useState } from 'react';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);

  useEffect(() => {
    // Fetch reports
  }, []);

  return (
    <div className="reports">
      <h1>Raporlar</h1>
      <p>Rapor yönetim sayfası.</p>
    </div>
  );
};

export default Reports;