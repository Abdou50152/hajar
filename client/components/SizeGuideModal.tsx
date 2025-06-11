// components/SizeGuideModal.tsx
"use client";
import { useState } from 'react';

export default function SizeGuideModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeUnit, setActiveUnit] = useState<'cm' | 'us'>('cm');

  // Données complètes des tailles
  const sizeData = {
    cm: [
      { size: 'XS', shoulder: '34.5', length: '75.5', sleeve: '17.4', bust: '72', waist: '69' },
      { size: 'S', shoulder: '35.5', length: '76.5', sleeve: '18.0', bust: '76', waist: '73' },
      { size: 'M', shoulder: '36.5', length: '77.5', sleeve: '18.5', bust: '80', waist: '77' },
      { size: 'L', shoulder: '37.5', length: '78.5', sleeve: '19.0', bust: '84', waist: '81' },
      { size: 'XL', shoulder: '38.5', length: '79.5', sleeve: '19.5', bust: '88', waist: '85' }
    ],
    us: [
      { size: '2', shoulder: '13.6"', length: '29.7"', sleeve: '6.9"', bust: '28.3"', waist: '27.2"' },
      { size: '4', shoulder: '14.0"', length: '30.1"', sleeve: '7.1"', bust: '29.9"', waist: '28.7"' },
      { size: '6', shoulder: '14.4"', length: '30.5"', sleeve: '7.3"', bust: '31.5"', waist: '30.3"' },
      { size: '8', shoulder: '14.8"', length: '30.9"', sleeve: '7.5"', bust: '33.1"', waist: '31.9"' },
      { size: '10', shoulder: '15.2"', length: '31.3"', sleeve: '7.7"', bust: '34.6"', waist: '33.5"' }
    ]
  };

  return (
    <>
      {/* Bouton déclencheur */}
      <button
        onClick={() => setIsOpen(true)}
        className="text-sm text-amber-900 hover:underline mb-2"
      >
        Guide des tailles
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Guide des tailles</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                &times;
              </button>
            </div>

            {/* Onglets CM/US */}
            <div className="flex mb-4 border-b">
              <button
                className={`px-4 py-2 font-medium ${
                  activeUnit === 'cm' 
                    ? 'border-b-2 border-amber-800 text-amber-800' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveUnit('cm')}
              >
                Centimètres (CM)
              </button>
              <button
                className={`px-4 py-2 font-medium ${
                  activeUnit === 'us' 
                    ? 'border-b-2 border-amber-700 text-amber-700-600' 
                    : 'text-gray-500'
                }`}
                onClick={() => setActiveUnit('us')}
              >
                Tailles US
              </button>
            </div>
            
            {/* Contenu du tableau */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-3 border font-medium">Taille</th>
                    <th className="p-3 border font-medium">Épaules</th>
                    <th className="p-3 border font-medium">Longueur</th>
                    <th className="p-3 border font-medium">Manche</th>
                    <th className="p-3 border font-medium">Buste</th>
                    <th className="p-3 border font-medium">Taille</th>
                  </tr>
                </thead>
                <tbody>
                  {sizeData[activeUnit].map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="p-3 border text-center font-medium">{item.size}</td>
                      <td className="p-3 border text-center">{item.shoulder}</td>
                      <td className="p-3 border text-center">{item.length}</td>
                      <td className="p-3 border text-center">{item.sleeve}</td>
                      <td className="p-3 border text-center">{item.bust}</td>
                      <td className="p-3 border text-center">{item.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 text-sm text-gray-500">
              <p>* Mesures approximatives - tolérance de ±1cm</p>
              <p className="mt-1">** Pour prendre vos mesures : buste = tour de poitrine, taille = tour de taille naturel</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}