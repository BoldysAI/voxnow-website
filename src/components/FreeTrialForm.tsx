import React, { useState } from 'react';
import { AlertTriangle, Mic, Scale, Globe, Mail, Phone, User, Building } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { trackLead, trackCompleteRegistration, trackCustomEvent } from '../utils/fbPixel';

interface FormData {
  fullName: string;
  legalDomain: string;
  email: string;
  phone: string;
  website: string;
  isSymplicyClient: string;
}

export function FreeTrialForm() {
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    legalDomain: '',
    email: '',
    phone: '',
    website: '',
    isSymplicyClient: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Validate required fields
      if (!formData.fullName || !formData.legalDomain || !formData.email || !formData.phone) {
        throw new Error('Veuillez remplir tous les champs obligatoires');
      }

      // Validate email
      if (!formData.email.includes('@')) {
        throw new Error('Adresse email invalide');
      }

      // Track lead generation
      trackLead({
        content_name: 'Free Trial Form',
        content_category: 'Lead Generation',
        value: 1,
        currency: 'EUR'
      });

      // Prepare data for webhook
      const webhookData = {
        fullName: formData.fullName,
        legalDomain: formData.legalDomain,
        email: formData.email,
        phone: formData.phone,
        website: formData.website || 'Non renseigné',
        isSymplicyClient: formData.isSymplicyClient,
        timestamp: new Date().toISOString(),
        source: 'VoxNow Free Trial Form'
      };

      // Send to webhook
      const response = await fetch('https://hook.eu2.make.com/2lsxs99c8ja75y3rgmxuwpt5gmrqux8j', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookData)
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      // Track successful registration
      trackCompleteRegistration({
        content_name: 'Free Trial Registration',
        value: 1,
        currency: 'EUR'
      });

      setSubmitStatus('success');
      
      // Scroll to success message after a short delay
      setTimeout(() => {
        const successElement = document.querySelector('.success-message');
        if (successElement) {
          successElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        }
      }, 100);
      
      setFormData({
        fullName: '',
        legalDomain: '',
        email: '',
        phone: '',
        website: '',
        isSymplicyClient: '',
      });
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
            <User className="inline h-4 w-4 mr-2" />
            Nom et prénom *
          </label>
          <input
            type="text"
            id="fullName"
            required
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            placeholder="ex. Maître Jean Dupont"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="legalDomain" className="block text-sm font-medium text-gray-700 mb-2">
            <Scale className="inline h-4 w-4 mr-2" />
            Votre domaine de droit *
          </label>
          <select
            id="legalDomain"
            required
            value={formData.legalDomain}
            onChange={(e) => setFormData({ ...formData, legalDomain: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
          >
            <option value="">Sélectionnez votre domaine</option>
            <option value="Droit civil">Droit civil</option>
            <option value="Droit pénal">Droit pénal</option>
            <option value="Droit commercial">Droit commercial</option>
            <option value="Droit du travail">Droit du travail</option>
            <option value="Droit de la famille">Droit de la famille</option>
            <option value="Droit immobilier">Droit immobilier</option>
            <option value="Droit fiscal">Droit fiscal</option>
            <option value="Droit des sociétés">Droit des sociétés</option>
            <option value="Droit administratif">Droit administratif</option>
            <option value="Droit social">Droit social</option>
            <option value="Droit international">Droit international</option>
            <option value="Droit de l'environnement">Droit de l'environnement</option>
            <option value="Droit de la propriété intellectuelle">Droit de la propriété intellectuelle</option>
            <option value="Droit de la santé">Droit de la santé</option>
            <option value="Droit des assurances">Droit des assurances</option>
            <option value="Généraliste">Généraliste</option>
            <option value="Autre">Autre</option>
          </select>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="inline h-4 w-4 mr-2" />
            Votre email *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
            placeholder="avocat@cabinet.be"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
            <Phone className="inline h-4 w-4 mr-2" />
            Votre numéro de téléphone *
          </label>
          <input
            type="tel"
            id="phone"
            required
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            placeholder="+32 123 45 67 89"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="inline h-4 w-4 mr-2" />
            Site web (optionnel)
          </label>
          <input
            type="text"
            id="website"
            value={formData.website}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://www.votrecabinet.be"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Building className="inline h-4 w-4 mr-2" />
            Êtes-vous client chez <a href="https://symplicy.com" target="_blank" rel="noopener noreferrer" className="text-vox-blue hover:text-now-green underline font-semibold">Symplicy</a> ? *
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="radio"
                name="isSymplicyClient"
                value="oui"
                checked={formData.isSymplicyClient === 'oui'}
                onChange={(e) => setFormData({ ...formData, isSymplicyClient: e.target.value })}
                className="text-vox-blue focus:ring-vox-blue"
                required
              />
              <span className="ml-2">Oui</span>
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                name="isSymplicyClient"
                value="non"
                checked={formData.isSymplicyClient === 'non'}
                onChange={(e) => setFormData({ ...formData, isSymplicyClient: e.target.value })}
                className="text-vox-blue focus:ring-vox-blue"
                required
              />
              <span className="ml-2">Non</span>
            </label>
          </div>
          {formData.isSymplicyClient === 'oui' && (
            <div className="mt-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <p className="text-green-800 text-sm">
                ✨ Parfait ! VoxNow peut s'intégrer directement avec <a href="https://symplicy.com" target="_blank" rel="noopener noreferrer" className="text-vox-blue hover:text-now-green underline font-semibold">Symplicy</a> pour automatiser l'envoi de formulaires d'ouverture de dossier.
              </p>
            </div>
          )}
        </div>

        <div className="bg-yellow-50 p-4 rounded-lg flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-yellow-700">
            <strong>ATTENTION :</strong> Nous n'activerons pas vos services sans que vous n'enregistriez votre messagerie vocale grâce à l'outil ci-dessous. Une fois fait, nous vous enverrons un code de déviation à taper sur votre clavier dans les 48H.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 ${
            isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
          }`}
        >
          {isSubmitting ? 'Envoi en cours...' : 'Commencer l\'essai gratuit'}
        </button>

        {submitStatus === 'success' && (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg success-message">
            <p className="mb-4">Votre demande a été envoyée avec succès ! Vous recevrez un email de confirmation.</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-yellow-800 font-medium mb-2">
                    ⚠️ Étape importante : Enregistrez votre message vocal
                  </p>
                  <p className="text-yellow-700 text-sm">
                    Pour que nous puissions configurer votre système personnalisé, vous devez maintenant enregistrer votre message vocal grâce au bouton ci-dessous.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {submitStatus === 'error' && (
          <div className="bg-red-50 text-red-700 p-4 rounded-lg">
            Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
          </div>
        )}

        <div className="text-center mt-6 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => {
              trackCustomEvent('VoiceRecordingPageAccess', {
                content_name: 'Voice Recording Test',
                content_category: 'Lead Generation'
              });
              navigate('/recording');
            }}
            className="inline-flex items-center bg-white border-2 border-vox-blue text-vox-blue px-6 py-3 rounded-lg hover:bg-vox-blue hover:text-white transition-all duration-300 mb-4"
          >
            <Mic className="h-5 w-5 mr-2" />
            Enregistrer votre messagerie vocale
          </button>

          <div className="text-center text-gray-600">
            <p className="text-sm">
              Pour toute question vous pouvez nous envoyer un email{' '}
              <a
                href="mailto:sacha@voxnow.be"
                className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center justify-center space-x-1"
              >
                <Mail className="h-4 w-4" />
                <span>sacha@voxnow.be</span>
              </a>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}