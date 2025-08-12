import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download, FileText, Shield, Scale, Phone, Mail, MapPin } from 'lucide-react';
import { trackViewContent, trackCustomEvent } from '../utils/fbPixel';

export function TermsAndConditions() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track terms page view
    trackViewContent({
      content_name: 'Terms and Conditions',
      content_category: 'Legal'
    });
  }, []);

  const handleDownload = () => {
    trackCustomEvent('TermsDownload', {
      content_name: 'Terms PDF Download',
      content_category: 'Legal'
    });
    window.open('https://drive.google.com/uc?export=download&id=13LIsxGvJe-DK984J81p7Zvp9YgEmT4Nn', '_blank');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-sm fixed w-full z-50 border-b border-gray-100 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Link to="/">
                <img 
                  src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                  alt="VoxNow Logo"
                  className="h-12 hover:opacity-80 transition-opacity cursor-pointer"
                />
              </Link>
            </div>
            <Link
              to="/"
              className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center font-medium"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center bg-white/80 backdrop-blur-sm border border-gray-200 px-6 py-3 rounded-full shadow-sm mb-6">
              <Scale className="h-5 w-5 text-vox-blue mr-2" />
              <span className="text-gray-700 font-medium">Document juridique</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
              Conditions générales de VoxNow
            </h1>
            
            <p className="text-xl text-gray-600 mb-8">
              Votre messagerie vocale automatisée
            </p>

            {/* Company Info */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-8 border border-gray-100">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-vox-blue/10 rounded-full flex items-center justify-center">
                    <MapPin className="h-6 w-6 text-vox-blue" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Adresse</p>
                    <p className="text-gray-600 text-sm">Chaussée de Saint Amand 20</p>
                    <p className="text-gray-600 text-sm">7500 Tournai</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-now-green/10 rounded-full flex items-center justify-center">
                    <Phone className="h-6 w-6 text-now-green" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Téléphone</p>
                    <p className="text-gray-600">+32 493 69 08 20</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-center space-x-3">
                  <div className="w-12 h-12 bg-light-blue/10 rounded-full flex items-center justify-center">
                    <Mail className="h-6 w-6 text-light-blue" />
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">Email</p>
                    <p className="text-gray-600">sacha@voxnow.be</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Download Button */}
            <button
              onClick={handleDownload}
              className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex items-center mx-auto"
            >
              <Download className="h-5 w-5 mr-2" />
              Télécharger les conditions (PDF)
            </button>
          </div>

          {/* Terms Content */}
          <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
            <div className="prose prose-lg max-w-none">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold gradient-text mb-2">
                  Conditions Générales d'Utilisation et de Vente (CGUV)
                </h2>
                <p className="text-gray-600">En vigueur au 29 janvier 2025</p>
              </div>

              {/* Section 1 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-vox-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-vox-blue font-bold">1</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Présentation du service</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    VoxNow est un service de gestion intelligente de la messagerie vocale professionnelle, édité par Sacha Delcourt, entrepreneur inscrit en personne physique sous le numéro d'entreprise 0790669566, dont le siège est situé Chaussée de Saint-Amand 20, 7500 Tournai, Belgique.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    VoxNow permet de rediriger les appels manqués vers une messagerie vocale intelligente, de transcrire automatiquement les messages reçus, et de les envoyer par e-mail et d'y répondre automatiquement par SMS.
                  </p>
                </div>
              </div>

              {/* Section 2 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-now-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-now-green font-bold">2</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Acceptation des CGUV</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    L'utilisation du service VoxNow implique l'acceptation pleine et entière des présentes conditions générales. Ces conditions peuvent être modifiées à tout moment ; les utilisateurs en seront informés par e-mail ou via le site.
                  </p>
                </div>
              </div>

              {/* Section 3 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-blue font-bold">3</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Accès au service</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    L'accès au service VoxNow requiert une configuration initiale, notamment le paramétrage de la redirection des appels vers le numéro de messagerie fourni. Une fois actif, le service fonctionne de manière automatisée et continue.
                  </p>
                </div>
              </div>

              {/* Section 4 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-green font-bold">4</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Fonctionnalités principales</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Transcription et résumé automatique des messages vocaux via intelligence artificielle
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-now-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Envoi des transcriptions par e-mail
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Réponse automatique au client par SMS
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-light-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Intégration avec Symplicy (si applicable)
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 5 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-vox-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-vox-blue font-bold">5</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Tarification</h3>
                </div>
                <div className="bg-gradient-to-r from-vox-blue/5 to-now-green/5 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Le service est proposé au tarif de <span className="font-bold text-vox-blue">90 € TTC par mois</span>, sans engagement, résiliable à tout moment.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    Le paiement s'effectue mensuellement, par envoi de facture, à régler dans les 14 jours. Aucune pénalité de résiliation n'est appliquée.
                  </p>
                </div>
              </div>

              {/* Section 6 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-now-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-now-green font-bold">6</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Obligations du client</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">Le client s'engage à :</p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Fournir des informations exactes et à jour
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-now-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Configurer correctement le renvoi d'appel selon les instructions
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      Ne pas détourner l'usage du service à des fins frauduleuses ou illégales
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 7 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-blue font-bold">7</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Responsabilité</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    VoxNow s'efforce de fournir un service fiable et performant. Toutefois :
                  </p>
                  <ul className="space-y-3 text-gray-700">
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      La transcription automatique peut comporter des erreurs, notamment dues à la qualité sonore ou au langage utilisé
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-now-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      VoxNow n'est pas responsable des problèmes liés à une mauvaise redirection d\'appel ou à l\'infrastructure téléphonique du client
                    </li>
                    <li className="flex items-start">
                      <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                      En cas d'interruption du service, tout sera mis en œuvre pour un rétablissement rapide
                    </li>
                  </ul>
                </div>
              </div>

              {/* Section 8 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-green font-bold">8</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Propriété intellectuelle</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed">
                    L'ensemble des éléments relatifs à VoxNow (nom, interface, technologies, scripts IA, visuels) sont la propriété exclusive de leur auteur. Toute reproduction, utilisation ou diffusion sans autorisation est interdite.
                  </p>
                </div>
              </div>

              {/* Section 9 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-vox-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-vox-blue font-bold">9</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Résiliation</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Le client peut résilier son abonnement à tout moment, sans frais, via un simple e-mail à l'adresse suivante : <a href="mailto:sacha@voxnow.be" className="text-vox-blue hover:text-now-green transition-colors">sacha@voxnow.be</a>
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    VoxNow se réserve le droit de suspendre un compte en cas d'abus ou de non-respect des présentes conditions.
                  </p>
                </div>
              </div>

              {/* Section 10 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-now-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-now-green font-bold">10</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Droit applicable et juridiction compétente</h3>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Les présentes conditions sont soumises au droit belge.
                  </p>
                  <p className="text-gray-700 leading-relaxed">
                    En cas de litige, une solution amiable sera recherchée en priorité. À défaut, les tribunaux de Tournai seront seuls compétents.
                  </p>
                </div>
              </div>

              {/* Section 11 - Privacy & Security */}
              <div className="mb-8">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-light-blue/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-blue font-bold">11</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Confidentialité, sécurité et traitement des données</h3>
                </div>
                
                {/* 11.a */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Shield className="h-5 w-5 text-vox-blue mr-2" />
                    11.a. Confidentialité et protection des données
                  </h4>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      VoxNow accorde une importance absolue à la confidentialité, à la sécurité et à la protection des données de ses utilisateurs, en particulier celles traitées pour les professionnels du droit.
                    </p>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Toutes les données collectées via le service (messages vocaux, transcriptions, numéros de téléphone, adresses e-mail, informations contextuelles) sont strictement confidentielles.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                      Elles ne sont en aucun cas revendues, partagées ou transmises à une organisation tierce, ni utilisées à des fins commerciales, publicitaires ou d'analyse externe. De plus, le client consent explicitement au traitement des catégories particulières de données personnelles, pour les besoins du fonctionnement de l'application.
                    </p>
                  </div>
                </div>

                {/* 11.b */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">11.b. Sécurité technique et organisationnelle</h4>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      VoxNow met en œuvre des mesures de sécurité avancées pour garantir l'intégrité, la confidentialité et la disponibilité des données :
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Accès restreint aux serveurs par authentification sécurisée
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-now-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Chiffrement des communications entre les services (SSL/TLS)
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Protection contre les accès non autorisés ou les tentatives d'intrusion
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-light-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Journalisation des accès aux données sensibles
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Environnement cloisonné par projet et par client
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 11.c */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">11.c. Données et profession réglementée</h4>
                  <div className="bg-gray-50 rounded-xl p-6">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Conscient des exigences particulières liées à la profession d'avocat, VoxNow s'engage à :
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Ne conserver aucune donnée au-delà de la durée strictement nécessaire au fonctionnement du service, sauf demande contraire du client
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-now-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Protéger l'accès aux transcriptions et messages afin qu\'ils restent exclusivement consultables par le client autorisé
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Ne pas exploiter ou analyser le contenu des messages vocaux à d'autres fins que la transcription automatique
                      </li>
                    </ul>
                  </div>
                </div>

                {/* 11.d */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">11.d. Droits du client</h4>
                  <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6 border border-gray-200">
                    <p className="text-gray-700 leading-relaxed mb-4">
                      Conformément aux réglementations en vigueur sur le règlement général de la protection des données, le client peut à tout moment :
                    </p>
                    <ul className="space-y-3 text-gray-700">
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-vox-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Demander l'accès ou la suppression de ses données
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-now-green rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Demander la suppression d'un message ou d\'une transcription spécifique
                      </li>
                      <li className="flex items-start">
                        <div className="w-2 h-2 bg-light-blue rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        Obtenir des précisions sur le traitement technique de ses informations
                      </li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed mt-4">
                      Ces demandes peuvent être adressées à : <a href="mailto:sacha@voxnow.be" className="text-vox-blue hover:text-now-green transition-colors font-medium">sacha@voxnow.be</a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Section 12 */}
              <div className="mb-8">
                <div className="flex items-center mb-4">
                  <div className="w-8 h-8 bg-light-green/10 rounded-full flex items-center justify-center mr-3">
                    <span className="text-light-green font-bold">12</span>
                  </div>
                  <h3 className="text-xl font-bold text-vox-blue">Contact</h3>
                </div>
                <div className="bg-gradient-to-r from-vox-blue/5 to-now-green/5 rounded-xl p-6 border border-gray-200">
                  <p className="text-gray-700 leading-relaxed">
                    Pour toute demande d'information ou résiliation : <a href="mailto:sacha@voxnow.be" className="text-vox-blue hover:text-now-green transition-colors font-medium">sacha@voxnow.be</a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Download Section */}
          <div className="text-center mt-12">
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
              <div className="flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-vox-blue mr-3" />
                <h3 className="text-xl font-bold text-vox-blue">Document PDF</h3>
              </div>
              <p className="text-gray-600 mb-6">
                Téléchargez une copie PDF de nos conditions générales pour vos archives
              </p>
              <button
                onClick={handleDownload}
                className="bg-gradient-to-r from-vox-blue to-now-green text-white px-8 py-3 rounded-full font-semibold hover:shadow-lg transition-all duration-300 flex items-center mx-auto"
              >
                <Download className="h-5 w-5 mr-2" />
                Télécharger le PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}