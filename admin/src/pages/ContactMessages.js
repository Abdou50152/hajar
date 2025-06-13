import React, { useState, useEffect } from 'react';
import { useNotification } from '../context/NotificationContext';

// Données initiales pour démonstration (seront remplacées par les données réelles de localStorage)
const initialContactMessages = [
  { 
    id: 1, 
    name: 'Malak alami', 
    email: 'malak.alami@gmail.com', 
    subject: 'Question sur une commande', 
    message: 'Bonjour, je voudrais savoir si ma commande #CMD-1686542 a été expédiée. Merci.', 
    date: '2025-06-10T14:22:33',
    status: 'read'
  },

  { 
    id: 3, 
    name: 'Karima Mejat', 
    email: 'karima.mejat@gmail.com', 
    subject: 'Problème de livraison', 
    message: 'Bonjour, ma commande devait arriver hier mais je n\'ai toujours rien reçu. Pourriez-vous vérifier le statut de la livraison ? Numéro de commande: CMD-1687755. Merci.', 
    date: '2025-06-12T16:30:45',
    status: 'unread'
  }
];

const ContactMessages = () => {
  const { showNotification } = useNotification();
  const [contactMessages, setContactMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    // Charger les messages depuis localStorage ou utiliser les données de démonstration
    try {
      const savedMessages = localStorage.getItem('contactMessages');
      setContactMessages(savedMessages ? JSON.parse(savedMessages) : initialContactMessages);
    } catch (error) {
      console.error('Erreur lors du chargement des messages:', error);
      setContactMessages(initialContactMessages);
    }
  }, []);

  const handleSelectMessage = (message) => {
    // Marquer le message comme lu
    if (message.status === 'unread') {
      const updatedMessages = contactMessages.map(msg => 
        msg.id === message.id ? { ...msg, status: 'read' } : msg
      );
      setContactMessages(updatedMessages);
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
    }
    
    setSelectedMessage(message);
  };

  const handleDeleteMessage = (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce message ?')) {
      const updatedMessages = contactMessages.filter(message => message.id !== id);
      setContactMessages(updatedMessages);
      localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
      
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage(null);
      }
      
      showNotification('Message supprimé avec succès', 'success');
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('fr-FR', { 
        day: '2-digit', 
        month: '2-digit', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    } catch (e) {
      return 'Date inconnue';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Messages de Contact</h1>
      
      <div className="flex flex-col md:flex-row gap-6">
        {/* Liste des messages */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Boîte de réception</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded">
              {contactMessages.filter(msg => msg.status === 'unread').length} non lu(s)
            </span>
          </div>
          
          {contactMessages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Aucun message
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {contactMessages.map(message => (
                <div 
                  key={message.id}
                  className={`py-3 px-2 cursor-pointer ${selectedMessage?.id === message.id ? 'bg-amber-50' : 'hover:bg-gray-50'} ${message.status === 'unread' ? 'font-semibold' : ''}`}
                  onClick={() => handleSelectMessage(message)}
                >
                  <div className="flex justify-between items-start">
                    <span className="block truncate">{message.name}</span>
                    {message.status === 'unread' && (
                      <span className="inline-block w-2 h-2 bg-amber-500 rounded-full"></span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600 truncate">{message.subject}</div>
                  <div className="text-xs text-gray-400 mt-1">{formatDate(message.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Détail du message sélectionné */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-md p-4">
          {selectedMessage ? (
            <div>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">{selectedMessage.subject}</h2>
                <button 
                  onClick={() => handleDeleteMessage(selectedMessage.id)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Supprimer
                </button>
              </div>
              
              <div className="mb-4 pb-4 border-b">
                <div className="flex gap-2 items-center mb-2">
                  <div className="bg-amber-100 rounded-full w-10 h-10 flex items-center justify-center text-amber-800 font-semibold">
                    {selectedMessage.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-medium">{selectedMessage.name}</div>
                    <div className="text-sm text-gray-600">{selectedMessage.email}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatDate(selectedMessage.date)}
                </div>
              </div>
              
              <div className="whitespace-pre-wrap">{selectedMessage.message}</div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Sélectionnez un message pour voir les détails
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactMessages;
