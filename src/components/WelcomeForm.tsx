import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Clock, Wrench, Brain, Users, Coins } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { trackLead, trackCompleteRegistration, trackViewContent } from '../utils/fbPixel';

type FormData = {
  // Section 1: Votre activité
  metier: string;
  messageFrequency: string;
  messageSource: string[];
  messageSourceOther: string;

  // Section 2: Gérer vos messages vocaux
  messageReasons: string[];
  messageReasonsOther: string;
  listeningTime: string;
  actionTime: string;
  tiringActions: string;
  missedCallAction: string;
  missedOpportunity: boolean;
  missedOpportunityDetails: string;
  difficultyLevel: string;

  // Section 3: Vos outils actuels
  usesCalendar: boolean;
  calendarName: string;
  usesCRM: boolean;
  crmName: string;

  // Section 4: Et si on vous faisait gagner du temps ?
  interestedInSolution: string;
  usefulFeatures: string[];
  usefulFeaturesOther: string;
  preferredNotification: string;
  perfectSolution: string;
  firstAutomation: string;

  // Section 5: Et si c'était pour vous ?
  lostTimeEstimate: string;
  priceRange: string;

  // Section 6: Références
  hasReferrals: boolean;
  referralDetails: string;
  
  // Contact fields
  email: string;
  phone: string;
};

export function WelcomeForm() {
  const { register, handleSubmit, watch, formState: { isSubmitting } } = useForm<FormData>();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Track welcome form page view
    trackViewContent({
      content_name: 'Welcome Form',
      content_category: 'Lead Generation'
    });
  }, []);

  const onSubmit = async (data: FormData) => {
    try {
      // Track lead generation
      trackLead({
        content_name: 'Welcome Form',
        content_category: 'Lead Generation',
        value: 1,
        currency: 'EUR'
      });

      const formattedMessage = Object.entries(data)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(', ') : value}`)
        .join('\n');

      const emailParams = {
        to_name: "Sacha",
        Email: "sacha@voxnow.be",
        content: formattedMessage,
        reply_to: "sacha@voxnow.be"
      };

      await emailjs.send(
        'service_x363l68',
        'template_3djlpft',
        emailParams,
        'anQ8hTILRv7MQZtGm'
      );

      // Track successful form completion
      trackCompleteRegistration({
        content_name: 'Welcome Form Completion',
        value: 1,
        currency: 'EUR'
      });

      // After successful submission, navigate to success page
      navigate('/success');
    } catch (error) {
      console.error('EmailJS Error:', error);
      alert('Une erreur est survenue lors de l\'envoi. Veuillez réessayer ou nous contacter directement.');
    }
  };

  const watchUsesCalendar = watch('usesCalendar') === true;
  const watchUsesCRM = watch('usesCRM') === true;
  const watchMissedOpportunity = watch('missedOpportunity') === true;
  const watchHasReferrals = watch('hasReferrals') === true;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text mb-6">
              🎉 Merci d'être ici dès les débuts de VoxNow ! 🎉
            </h1>
            <p className="text-xl text-gray-600 mb-4">
              Vous faites partie des premiers à découvrir notre solution, et nous voulons vous remercier pour votre soutien ! 🙏
            </p>
            <p className="text-lg text-gray-600 mb-4">
              En tant qu'early adopters, vous bénéficierez de prix préférentiels à vie et de cadeaux exclusifs.
            </p>
            <div className="bg-gradient-to-r from-vox-blue to-now-green p-[1px] rounded-xl">
              <div className="bg-white px-6 py-4 rounded-xl">
                <p className="text-lg font-medium bg-gradient-to-r from-vox-blue to-now-green bg-clip-text text-transparent">
                  Pour nous aider à vous offrir une expérience encore meilleure, remplissez ce formulaire.
                  On vous réserve plein de surprises et de super avantages pour avoir été là dès le départ !
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-12">
            {/* Section 1: Votre activité */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Sparkles className="h-6 w-6 text-vox-blue mr-3" />
                <h2 className="text-2xl font-bold text-vox-blue">1. Votre activité</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quel est votre métier ?
                  </label>
                  <input
                    type="text"
                    {...register('metier')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Dans le cadre de votre travail, combien de messages vocaux recevez-vous en moyenne ?
                  </label>
                  <select
                    {...register('messageFrequency')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="none">Je n'en reçois pas</option>
                    <option value="1-3">1 à 3 par jour</option>
                    <option value="4-10">4 à 10 par jour</option>
                    <option value="10+">Plus de 10 par jour</option>
                    <option value="variable">Variable, selon les périodes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Qui vous laisse principalement ces messages vocaux ?
                  </label>
                  <div className="space-y-2">
                    {['Patients', 'Clients', 'Collaborateurs', 'Fournisseurs'].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          {...register('messageSource')}
                          className="rounded border-gray-300 text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value="other"
                          {...register('messageSource')}
                          className="rounded border-gray-300 text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="ml-2">Autres</span>
                      </label>
                      <input
                        type="text"
                        {...register('messageSourceOther')}
                        placeholder="Précisez"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2: Gérer vos messages vocaux */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Clock className="h-6 w-6 text-now-green mr-3" />
                <h2 className="text-2xl font-bold text-vox-blue">2. Gérer vos messages vocaux</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    En général, pour quelles raisons reçoit-on un message vocal dans votre métier ?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Gestion de rdv (planification, modification, annulation)',
                      'Demande d\'information'
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          {...register('messageReasons')}
                          className="rounded border-gray-300 text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value="other"
                          {...register('messageReasons')}
                          className="rounded border-gray-300 text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="ml-2">Autre</span>
                      </label>
                      <input
                        type="text"
                        {...register('messageReasonsOther')}
                        placeholder="Précisez"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Combien de temps passez-vous par jour à écouter vos messages vocaux ?
                  </label>
                  <select
                    {...register('listeningTime')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="<5">Moins de 5 minutes</option>
                    <option value="5-15">5 à 15 minutes</option>
                    <option value="15-30">15 à 30 minutes</option>
                    <option value="30+">Plus de 30 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Combien de temps passez-vous à agir suite à un message vocal ?
                  </label>
                  <select
                    {...register('actionTime')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="<5">Moins de 5 minutes</option>
                    <option value="5-15">5 à 15 minutes</option>
                    <option value="15-30">15 à 30 minutes</option>
                    <option value="30+">Plus de 30 minutes</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quelles sont les actions les plus chronophages ? Classez-les par ordre de pénibilité.
                  </label>
                  <textarea
                    {...register('tiringActions')}
                    placeholder="Ex: 1. Écouter 2. Rappeler 3. Proposer un créneau 4. Modifier le calendrier 5. Ajouter l'information dans le CRM"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Que faites-vous quand vous manquez un appel vocal ?
                  </label>
                  <input
                    type="text"
                    {...register('missedCallAction')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Avez-vous déjà manqué une information importante ou perdu une opportunité à cause d'un message vocal ?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="true"
                        {...register('missedOpportunity')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="false"
                        {...register('missedOpportunity')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Non</span>
                    </label>
                  </div>
                  {watchMissedOpportunity && (
                    <textarea
                      {...register('missedOpportunityDetails')}
                      placeholder="Que s'est-il passé ?"
                      className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent h-32"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Sur une échelle de 1 à 5, à quel point cette gestion est-elle pénible ?
                  </label>
                  <div className="flex space-x-4">
                    {[1, 2, 3, 4, 5].map((value) => (
                      <label key={value} className="flex flex-col items-center">
                        <input
                          type="radio"
                          value={value}
                          {...register('difficultyLevel')}
                          className="text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="mt-1">{value}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Vos outils actuels */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Wrench className="h-6 w-6 text-light-blue mr-3" />
                <h2 className="text-2xl font-bold text-vox-blue">3. Vos outils actuels</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Utilisez-vous un agenda ou outil de prise de rendez-vous en ligne ?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="true"
                        {...register('usesCalendar')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="false"
                        {...register('usesCalendar')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Non</span>
                    </label>
                  </div>
                  {watchUsesCalendar && (
                    <input
                      type="text"
                      {...register('calendarName')}
                      placeholder="Lequel ?"
                      className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Utilisez-vous un logiciel de gestion client (CRM) ?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="true"
                        {...register('usesCRM')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="false"
                        {...register('usesCRM')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Non</span>
                    </label>
                  </div>
                  {watchUsesCRM && (
                    <input
                      type="text"
                      {...register('crmName')}
                      placeholder="Lequel ?"
                      className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Section 4: Et si on vous faisait gagner du temps ? */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Brain className="h-6 w-6 text-light-green mr-3" />
                <h2 className="text-2xl font-bold text-vox-blue">4. Et si on vous faisait gagner du temps ?</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Une solution qui transcrit vos messages vocaux, vous les résume, et propose directement des créneaux ou actions vous intéresserait-elle ?
                  </label>
                  <select
                    {...register('interestedInSolution')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="very-interested">Oui, carrément</option>
                    <option value="maybe">Pourquoi pas</option>
                    <option value="not-really">Pas vraiment</option>
                    <option value="not-at-all">Non, pas du tout</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quelles fonctionnalités seraient les plus utiles pour vous ?
                  </label>
                  <div className="space-y-2">
                    {[
                      'Résumé du message par email',
                      'Proposition automatique de créneaux',
                      'Intégration avec mon agenda',
                      'Annulation automatique de rendez-vous'
                    ].map((option) => (
                      <label key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          value={option}
                          {...register('usefulFeatures')}
                          className="rounded border-gray-300 text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="ml-2">{option}</span>
                      </label>
                    ))}
                    <div>
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          value="other"
                          {...register('usefulFeatures')}
                          className="rounded border-gray-300 text-vox-blue focus:ring-vox-blue"
                        />
                        <span className="ml-2">Autre</span>
                      </label>
                      <input
                        type="text"
                        {...register('usefulFeaturesOther')}
                        placeholder="Précisez"
                        className="mt-2 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Comment préférez-vous recevoir ces informations ?
                  </label>
                  <select
                    {...register('preferredNotification')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="app">Dans une application dédiée</option>
                    <option value="other">Autre</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Si vous aviez une baguette magique, à quoi ressemblerait la solution parfaite ?
                  </label>
                  <textarea
                    {...register('perfectSolution')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Quelle serait la première action que vous aimeriez automatiser ?
                  </label>
                  <input
                    type="text"
                    {...register('firstAutomation')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  />
                </div>
              </div>
            </section>

            {/* Section 5: Et si c'était pour vous ? */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Coins className="h-6 w-6 text-now-green mr-3" />
                <h2 className="text-2xl font-bold text-vox-blue">5. Et si c'était pour vous ?</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Avez-vous une idée du temps ou de l'argent que vous perdez chaque mois à cause de ça ?
                  </label>
                  <textarea
                    {...register('lostTimeEstimate')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent h-32"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Combien seriez-vous prêt(e) à payer pour gagner ce temps chaque mois ?
                  </label>
                  <select
                    {...register('priceRange')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                  >
                    <option value="">Sélectionnez une option</option>
                    <option value="<50">Moins de 50 €/mois</option>
                    <option value="50-100">50 à 100 €/mois</option>
                    <option value="100-200">100 à 200 €/mois</option>
                    <option value="200+">Plus de 200 €/mois</option>
                  </select>
                </div>
              </div>
            </section>

            {/* Section 6: Références */}
            <section className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex items-center mb-6">
                <Users className="h-6 w-6 text-light-blue mr-3" />
                <h2 className="text-2xl font-bold text-vox-blue">6. Références</h2>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Connaissez-vous une ou plusieurs personnes qui pourraient être intéressées ?
                  </label>
                  <div className="space-x-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="true"
                        {...register('hasReferrals')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Oui</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        value="false"
                        {...register('hasReferrals')}
                        className="text-vox-blue focus:ring-vox-blue"
                      />
                      <span className="ml-2">Non</span>
                    </label>
                  </div>
                  {watchHasReferrals && (
                    <textarea
                      {...register('referralDetails')}
                      placeholder="Pouvez-vous nous laisser leur prénom, métier et email ?"
                      className="mt-4 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent h-32"
                    />
                  )}
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="space-y-6">
                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Votre email *
                  </label>
                  <input
                    type="email"
                    required
                    {...register('email')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                    placeholder="exemple@email.com"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 font-medium mb-2">
                    Votre numéro de téléphone *
                  </label>
                  <input
                    type="tel"
                    required
                    {...register('phone')}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent"
                    placeholder="+32 123 45 67 89"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`
                  bg-gradient-to-r from-vox-blue to-now-green text-white 
                  px-8 py-4 rounded-full text-lg font-semibold 
                  hover:shadow-xl transition-all duration-300 
                  transform hover:-translate-y-1
                  ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}
                `}
              >
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer mes réponses'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}