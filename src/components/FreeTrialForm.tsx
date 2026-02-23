import React, { useState, useEffect } from 'react';
import { AlertTriangle, Mic, Scale, Globe, Mail, Phone, User, Building, X, CheckCircle, AlertCircle, ArrowRight } from 'lucide-react';
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

// ─── Mandatory Voicemail Popup ────────────────────────────────────────────────
function VoicemailMandatoryPopup({
  onRecord,
  onDismiss,
}: {
  onRecord: () => void;
  onDismiss: () => void;
}) {
  // Prevent background scroll while popup is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onDismiss}
      />

      {/* Modal card */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-fade-in">

        {/* Red top bar */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 rounded-full p-2">
              <AlertTriangle className="h-6 w-6 text-white" />
            </div>
            <span className="text-white font-bold text-lg tracking-wide uppercase">
              Étape obligatoire
            </span>
          </div>
          <button
            onClick={onDismiss}
            className="text-white/80 hover:text-white transition-colors"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {/* Steps tracker */}
          <div className="flex items-center gap-2 mb-6">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-100 border-2 border-green-500">
                <CheckCircle className="h-4 w-4 text-green-600" />
              </div>
              <span className="text-sm font-medium text-green-700">Inscription</span>
            </div>
            {/* Connector */}
            <div className="flex-1 h-0.5 bg-gray-200 mx-1" />
            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-red-100 border-2 border-red-500">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-40" />
                <Mic className="h-4 w-4 text-red-600 relative" />
              </div>
              <span className="text-sm font-bold text-red-700">Message vocal</span>
            </div>
          </div>

          {/* Main message */}
          <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 mb-5">
            <div className="flex gap-3">
              <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-red-800 mb-1 text-base">
                  L'enregistrement de votre message vocal est <span className="underline">obligatoire</span> pour finaliser votre configuration.
                </p>
                <p className="text-red-700 text-sm">
                  Sans cette étape, votre essai gratuit <strong>ne pourra pas être activé</strong>. Cela ne prend que 30 secondes.
                </p>
              </div>
            </div>
          </div>

          {/* What happens */}
          <ul className="space-y-2 mb-6 text-sm text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Votre messagerie vocale sera configurée automatiquement
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Vos clients entendront un message professionnel
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              Durée : 30 secondes maximum
            </li>
          </ul>

          {/* CTA */}
          <button
            onClick={onRecord}
            className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-base"
          >
            <Mic className="h-5 w-5" />
            Enregistrer mon message vocal maintenant
            <ArrowRight className="h-5 w-5" />
          </button>

          {/* Dismiss note */}
          <p className="text-center mt-3 text-xs text-gray-400">
            Vous pouvez aussi le faire plus tard via le bouton en bas de page —{' '}
            <button onClick={onDismiss} className="underline hover:text-gray-600 transition-colors">
              ignorer pour l'instant
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Main Form Component ──────────────────────────────────────────────────────
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
  const [showVoicemailPopup, setShowVoicemailPopup] = useState(false);
  const navigate = useNavigate();

  const goToRecording = () => {
    trackCustomEvent('VoiceRecordingPageAccess', {
      content_name: 'Voice Recording Test',
      content_category: 'Lead Generation',
    });
    navigate('/recording');
  };

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
        currency: 'EUR',
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
        source: 'VoxNow Free Trial Form',
      };

      // Send to webhook
      const webhookUrl = import.meta.env.VITE_MAKE_WEBHOOK_TRIAL_URL;
      if (!webhookUrl) {
        throw new Error('Configuration manquante. Veuillez contacter le support.');
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookData),
      });

      if (!response.ok) {
        throw new Error(`Erreur serveur: ${response.status}`);
      }

      // Track successful registration
      trackCompleteRegistration({
        content_name: 'Free Trial Registration',
        value: 1,
        currency: 'EUR',
      });

      setSubmitStatus('success');
      // Show the mandatory voicemail popup immediately
      setShowVoicemailPopup(true);

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
    <>
      {/* ── Mandatory Voicemail Popup ── */}
      {showVoicemailPopup && (
        <VoicemailMandatoryPopup
          onRecord={() => {
            setShowVoicemailPopup(false);
            goToRecording();
          }}
          onDismiss={() => setShowVoicemailPopup(false)}
        />
      )}

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
              Êtes-vous client chez{' '}
              <a
                href="https://symplicy.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-vox-blue hover:text-now-green underline font-semibold"
              >
                Symplicy
              </a>{' '}
              ? *
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
                  ✨ Parfait ! VoxNow peut s'intégrer directement avec{' '}
                  <a
                    href="https://symplicy.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-vox-blue hover:text-now-green underline font-semibold"
                  >
                    Symplicy
                  </a>{' '}
                  pour automatiser l'envoi de formulaires d'ouverture de dossier.
                </p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-semibold ${
              isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Envoi en cours...' : "Commencer l'essai gratuit"}
          </button>

          {/* ── Success state ── */}
          {submitStatus === 'success' && (
            <div className="success-message space-y-4">
              {/* Success confirmation */}
              <div className="bg-green-50 text-green-700 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <p>Votre demande a été envoyée avec succès ! Vous recevrez un email de confirmation.</p>
              </div>

              {/* ── BIG mandatory voicemail call-to-action ── */}
              <div className="rounded-xl border-2 border-red-400 overflow-hidden shadow-lg">
                {/* Header */}
                <div className="bg-gradient-to-r from-red-500 to-orange-500 px-4 py-3 flex items-center gap-3">
                  <div className="relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
                    <Mic className="h-5 w-5 text-white relative" />
                  </div>
                  <span className="text-white font-bold text-sm uppercase tracking-wider">
                    ⚠️ Action obligatoire requise
                  </span>
                </div>

                {/* Body */}
                <div className="bg-red-50 px-4 py-4 space-y-3">
                  <p className="text-red-900 font-bold text-base">
                    Vous devez maintenant enregistrer votre message vocal.
                  </p>
                  <p className="text-red-800 text-sm">
                    Cette étape est <strong>indispensable</strong> pour finaliser la configuration de votre messagerie. Sans elle, votre essai gratuit ne peut pas être activé.
                  </p>

                  {/* Progress steps */}
                  <div className="flex items-center gap-2 py-2">
                    <div className="flex items-center gap-1.5">
                      <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-green-700">Inscription ✓</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400 flex-shrink-0" />
                    <div className="flex items-center gap-1.5">
                      <div className="relative w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-50 rounded-full" />
                        <Mic className="h-3.5 w-3.5 text-white relative" />
                      </div>
                      <span className="text-xs font-bold text-red-700">Message vocal ← vous êtes ici</span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-300 flex-shrink-0" />
                    <div className="flex items-center gap-1.5 opacity-40">
                      <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                        <CheckCircle className="h-3.5 w-3.5 text-white" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Activation</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={goToRecording}
                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold py-3.5 px-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    <Mic className="h-5 w-5" />
                    Enregistrer mon message vocal maintenant
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {submitStatus === 'error' && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg">
              Une erreur est survenue. Veuillez réessayer ou nous contacter directement.
            </div>
          )}

          {/* ── Bottom recording button (always visible) ── */}
          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-3 flex items-center justify-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5" />
              Étape obligatoire après l'inscription
            </p>
            <button
              type="button"
              onClick={goToRecording}
              className="inline-flex items-center gap-2 bg-white border-2 border-red-400 text-red-600 px-6 py-3 rounded-lg hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-300 font-semibold shadow-sm"
            >
              <Mic className="h-5 w-5" />
              Enregistrer votre messagerie vocale
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-0.5 rounded-full group-hover:bg-red-200">
                Obligatoire
              </span>
            </button>

            <div className="text-center text-gray-600 mt-4">
              <p className="text-sm">
                Pour toute question vous pouvez nous envoyer un email{' '}
                <a
                  href="mailto:sacha@voxnow.be"
                  className="text-vox-blue hover:text-now-green transition-colors duration-300 inline-flex items-center space-x-1"
                >
                  <Mail className="h-4 w-4" />
                  <span>sacha@voxnow.be</span>
                </a>
              </p>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}
