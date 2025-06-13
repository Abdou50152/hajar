import React from 'react';
import StatsCard from '../dashboard/StatsCard';
// import PerformanceChart from '../../components/Dashboard/PerformanceChart';

const Dashboard = () => {
  const stats = [
    { title: 'Ventes du mois', value: '1890,00 MAD', change: '' },
    { title: 'Nouveaux clients', value: '6', change: '' },
    { title: 'Articles en stock', value: '15', change: '' }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-amber-800">Tableau de bord</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

    </div>
  );
};

export default Dashboard;