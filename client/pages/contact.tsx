import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
  // État du formulaire
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [formStatus, setFormStatus] = useState({ success: false, error: false, message: '' });
  
  // Gestion des changements dans le formulaire
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Soumission du formulaire
  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      // Création du message avec date et ID
      const newMessage = {
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'unread',
        ...formData
      };

      // Récupérer les messages existants ou initialiser un tableau vide
      const existingMessages = JSON.parse(localStorage.getItem('contactMessages') || '[]');
      
      // Ajouter le nouveau message
      existingMessages.unshift(newMessage); // Ajoute au début du tableau
      
      // Sauvegarder dans localStorage
      localStorage.setItem('contactMessages', JSON.stringify(existingMessages));
      
      // Montrer le succès
      setFormStatus({ 
        success: true, 
        error: false, 
        message: 'Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.' 
      });
      
      // Réinitialiser le formulaire
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      // En cas d'erreur
      setFormStatus({ 
        success: false, 
        error: true, 
        message: 'Une erreur est survenue. Veuillez réessayer.' 
      });
      console.error('Erreur lors de l\'envoi du message:', error);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Bannière */}
        <div className="relative h-60 rounded-lg overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg/bg1.jpg')" }}></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact</h1>
            <p className="text-lg md:text-xl max-w-2xl">Nous sommes à votre écoute, contactez-nous</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Informations de contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Nos coordonnées</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                  <MapPin size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Adresse</h3>
                  <p className="text-gray-600">123 Boulevard allal el fassi<br />Marrakech, Maroc</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                  <Mail size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Email</h3>
                  <p className="text-gray-600">contact@elegancenezha.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-amber-100 p-3 rounded-full text-amber-700">
                  <Phone size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-gray-800">Téléphone</h3>
                  <p className="text-gray-600">+212 524 22 22 22</p>
                </div>
              </div>
            </div>
            
            {/* <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Horaires d'ouverture</h2>
              <div className="space-y-2 text-gray-600">
                <p><span className="font-medium">Lundi - Vendredi:</span> 9h00 - 18h00</p>
                <p><span className="font-medium">Samedi:</span> 10h00 - 16h00</p>
                <p><span className="font-medium">Dimanche:</span> Fermé</p>
              </div>
            </div> */}
          </div>
          
          {/* Formulaire de contact */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Envoyez-nous un message</h2>
            
            {formStatus.success && (
              <div className="bg-green-50 text-green-700 p-4 rounded-md mb-6">
                {formStatus.message}
              </div>
            )}
            
            {formStatus.error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md mb-6">
                {formStatus.message}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Nom complet</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Sujet</label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                />
              </div>
              
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-700 focus:border-transparent"
                ></textarea>
              </div>
              
              <div>
                <button
                  type="submit"
                  className="inline-flex items-center px-6 py-3 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors"
                >
                  Envoyer <Send size={16} className="ml-2" />
                </button>
              </div>
            </form>
          </div>
        </div>
        
        {/* Google Maps (à remplacer par une vraie intégration Google Maps si nécessaire) */}
        {/* <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Où nous trouver</h2>
          <div className="h-96 bg-gray-200 rounded-lg"> */}
            {/* Emplacement pour Google Maps */}
            {/* <div className="w-full h-full flex items-center justify-center">
              <p className="text-gray-500">Carte Google Maps à intégrer ici</p>
            </div>
          </div>
        </div> */}
        
        {/* FAQ rapide */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Questions fréquentes</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Quel est le délai de livraison ?</h3>
              <p className="text-gray-600">Nos délais de livraison varient entre 2 à 5 jours ouvrables pour les commandes nationales, et entre 7 à 14 jours pour les commandes internationales.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Puis-je retourner un article ?</h3>
              <p className="text-gray-600">Oui, vous disposez de 14 jours à compter de la réception de votre commande pour retourner un article. Consultez notre politique de retour pour plus de détails.</p>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">Proposez-vous des remises pour les achats en gros ?</h3>
              <p className="text-gray-600">Oui, nous proposons des tarifs spéciaux pour les achats en gros. Veuillez nous contacter directement pour discuter de vos besoins.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ContactPage;
