import React, { useState } from 'react';

const DataTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete,
  emptyMessage = "No data available" 
}) => {
  // État pour suivre l'élément actuellement en mode d'actions sur mobile
  const [activeItemId, setActiveItemId] = useState(null);

  // Fonction pour basculer les actions sur mobile
  const toggleMobileActions = (itemId) => {
    setActiveItemId(activeItemId === itemId ? null : itemId);
  };

  // Détecter si nous sommes sur mobile (client-side uniquement)
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div className="overflow-x-auto -mx-4 sm:mx-0">
      {data.length === 0 ? (
        <p className="text-gray-500 py-4 px-4">{emptyMessage}</p>
      ) : (
        <div className="inline-block min-w-full align-middle">
          {/* Version pour écrans larges */}
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-amber-50">
                <tr>
                  {columns.map((column) => (
                    <th 
                      key={column.key} 
                      className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-amber-800 uppercase tracking-wider"
                    >
                      {column.header}
                    </th>
                  ))}
                  <th className="px-3 sm:px-6 py-3 text-right text-xs font-medium text-amber-800 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item) => (
                  <tr key={item.id}>
                    {columns.map((column) => (
                      <td key={`${item.id}-${column.key}`} className="px-3 sm:px-6 py-4 whitespace-nowrap text-sm">
                        {column.render ? column.render(item) : item[column.key]}
                      </td>
                    ))}
                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-amber-600 hover:text-amber-900 mr-4"
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Version pour mobiles */}
          <div className="md:hidden">
            <div className="grid grid-cols-1 gap-4 sm:px-4">
              {data.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-4 space-y-2">
                    {columns.map((column) => (
                      <div key={`${item.id}-${column.key}`} className="flex justify-between">
                        <div className="text-sm font-medium text-gray-700">{column.header}:</div>
                        <div className="text-sm text-gray-900">
                          {column.render ? column.render(item) : item[column.key]}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-gray-200 bg-gray-50 px-4 py-3 flex justify-end space-x-3">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(item)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-amber-700 bg-amber-100 hover:bg-amber-200 focus:outline-none"
                      >
                        Edit
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(item)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;
