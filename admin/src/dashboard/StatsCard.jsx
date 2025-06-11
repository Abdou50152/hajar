const StatsCard = ({ title, value, change, icon }) => {
  const isPositive = change && change.includes('+');
  
  return (
    <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-2xl font-bold mt-2">{value}</p>
        </div>
        <span className="text-2xl">{icon}</span>
      </div>
      
      {change && (
        <p className={`mt-3 text-sm ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
          {change} vs mois précédent
        </p>
      )}
    </div>
  );
};

export default StatsCard;