import React from 'react';
import Layout from '../components/Layout';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

const AboutPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Bannière */}
        <div className="relative h-80 rounded-lg overflow-hidden mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40"></div>
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('/images/bg/bg.jpg')" }}></div>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">À Propos</h1>
            <p className="text-lg md:text-xl max-w-2xl">Découvrez l'histoire et les valeurs d'Élégance Nezha</p>
          </div>
        </div>

        {/* Notre histoire */}
        {/* <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Notre Histoire</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="aspect-square rounded-lg overflow-hidden">
              <img 
                src="/images/categories/abaya.png" 
                alt="Notre histoire" 
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="text-gray-600 mb-4">
                Fondée en 2020, Élégance Nezha est née d'une passion pour la mode modeste et élégante. Notre fondatrice, Nezha, a créé cette marque avec la vision de proposer des vêtements qui allient modestie, style contemporain et qualité exceptionnelle.
              </p>
              <p className="text-gray-600 mb-4">
                Ce qui a commencé comme une petite collection d'abayas s'est rapidement transformé en une marque complète proposant des robes, des foulards et des accessoires appréciés par les femmes du monde entier.
              </p>
              <p className="text-gray-600">
                Aujourd'hui, Élégance Nezha est reconnue pour ses designs innovants, ses matériaux de qualité et son engagement envers l'élégance intemporelle, permettant à chaque femme d'exprimer sa personnalité tout en restant fidèle à ses valeurs.
              </p>
            </div>
          </div>
        </div> */}

        {/* Nos valeurs */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Nos Valeurs</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-700 mb-3">Élégance</h3>
              <p className="text-gray-600">
                Nous croyons que la mode modeste peut être sophistiquée et élégante. Chaque pièce est conçue pour mettre en valeur la beauté naturelle de celle qui la porte.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-700 mb-3">Qualité</h3>
              <p className="text-gray-600">
                Nous nous engageons à utiliser des matériaux de haute qualité et à maintenir des standards de fabrication excellents pour créer des pièces durables.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-bold text-amber-700 mb-3">Inclusivité</h3>
              <p className="text-gray-600">
                Nos collections sont conçues pour toutes les femmes, quels que soient leur âge, leur morphologie ou leur style personnel.
              </p>
            </div>
          </div>
        </div>

        {/* Notre équipe */}
        {/* <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Notre Équipe</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                <img 
                  src="/images/categories/jewellery.png" 
                  alt="Nezha" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Nezha</h3>
              <p className="text-gray-600">Fondatrice & Directrice Créative</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                <img 
                  src="/images/categories/foulard.png" 
                  alt="Leila" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Leila</h3>
              <p className="text-gray-600">Responsable Design</p>
            </div>
            <div className="text-center">
              <div className="w-40 h-40 mx-auto rounded-full overflow-hidden mb-4">
                <img 
                  src="/images/categories/abaya.png" 
                  alt="Salma" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Salma</h3>
              <p className="text-gray-600">Service Client</p>
            </div>
          </div>
        </div> */}

        {/* Engagement qualité */}
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Notre Engagement Qualité</h2>
          <p className="text-gray-600 text-center max-w-3xl mx-auto mb-8">
            Chez Élégance Nezha, nous nous engageons à offrir des produits de la plus haute qualité. Nous sélectionnons soigneusement nos matériaux et travaillons avec des artisans talentueux pour créer des pièces durables et élégantes.
          </p>
          <div className="flex justify-center">
            <Link href="/contact" className="inline-flex items-center px-6 py-3 bg-amber-700 text-white rounded-md hover:bg-amber-800 transition-colors">
              Contactez-nous <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default AboutPage;
