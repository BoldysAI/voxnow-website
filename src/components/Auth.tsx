import { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, Monitor } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showPasswordReset, setShowPasswordReset] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error('Auth error details:', error);
        
        // Provide more specific error messages
        switch (error.message) {
          case 'Invalid login credentials':
            setError('Email ou mot de passe incorrect. Vérifiez vos identifiants ou utilisez "Mot de passe oublié".');
            break;
          case 'Email not confirmed':
            setError('Veuillez confirmer votre email avant de vous connecter.');
            break;
          case 'Too many requests':
            setError('Trop de tentatives de connexion. Veuillez patienter quelques minutes.');
            break;
          default:
            setError(`Erreur de connexion: ${error.message}`);
        }
        return;
      }

      if (data.user) {
        console.log('User authenticated successfully:', data.user.email);
        
        // Check if user profile exists in public.users
        try {
          const { data: userData, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (userError && userError.code !== 'PGRST116') {
            console.error('Error fetching user profile:', userError);
            setError('Erreur lors de la récupération du profil utilisateur');
            return;
          }

          if (!userData) {
            console.log('User profile not found in public.users, attempting to create...');
            
            // Try to create the user profile
            const { error: insertError } = await supabase
              .from('users')
              .insert({
                id: data.user.id,
                email: data.user.email!,
                full_name: data.user.user_metadata?.full_name || data.user.email!.split('@')[0],
                last_login: new Date().toISOString(),
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
              });

            if (insertError) {
              console.error('Error creating user profile:', insertError);
              setError('Profil utilisateur manquant. Veuillez contacter l\'administrateur pour configurer votre compte.');
              return;
            } else {
              console.log('User profile created successfully');
            }
          } else {
            // User exists, update last_login timestamp
            console.log('User profile found, updating last_login...');
            const { error: updateError } = await supabase
              .from('users')
              .update({
                last_login: new Date().toISOString(),
                updated_at: new Date().toISOString()
              })
              .eq('id', data.user.id);

            if (updateError) {
              console.error('Error updating last_login:', updateError);
              // Don't fail the login for this, just log the error
            } else {
              console.log('Last login timestamp updated successfully');
            }
          }
        } catch (err) {
          console.error('Error checking user profile:', err);
          setError('Erreur lors de la vérification du profil utilisateur.');
          return;
        }

        setSuccess('Connexion réussie! Redirection...');
        setTimeout(() => navigate('/dashboard'), 1000);
      }
    } catch (err: any) {
      console.error('Unexpected auth error:', err);
      setError('Erreur de connexion inattendue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setResetLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail, {
        redirectTo: `https://voxnow.be/auth?reset=true`,
      });

      if (error) {
        console.error('Reset password error:', error);
        setError(`Erreur lors de l'envoi de l'email: ${error.message}`);
      } else {
        setSuccess('Un email de réinitialisation a été envoyé à votre adresse email.');
        setShowForgotPassword(false);
        setResetEmail('');
      }
    } catch (err: any) {
      console.error('Unexpected reset error:', err);
      setError('Erreur lors de l\'envoi de l\'email de réinitialisation.');
    } finally {
      setResetLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        console.error('Password update error:', error);
        setError(`Erreur lors de la mise à jour: ${error.message}`);
      } else {
        setSuccess('Mot de passe mis à jour avec succès! Vous pouvez maintenant vous connecter.');
        setShowPasswordReset(false);
        setNewPassword('');
        setConfirmPassword('');
        // Redirect to dashboard or clear URL params
        navigate('/auth', { replace: true });
      }
    } catch (err: any) {
      console.error('Unexpected password update error:', err);
      setError('Erreur lors de la mise à jour du mot de passe.');
    } finally {
      setLoading(false);
    }
  };

  // Check for password reset mode
  useEffect(() => {
    // Check if we're in password reset mode
    if (searchParams.get('reset') === 'true') {
      setShowPasswordReset(true);
    }

    // Handle auth state changes for password reset
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setShowPasswordReset(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center mb-6"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à l'accueil
        </button>
        
        {/* Demo Button - Centered and Prominent */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-4 border border-orange-200">
            <div className="flex items-center justify-center mb-3">
              <Monitor className="h-8 w-8 text-orange-600 mr-3" />
              <h3 className="text-xl font-bold text-gray-900">Découvrez VoxNow en action</h3>
            </div>
            <p className="text-gray-600 mb-4">
              Explorez toutes les fonctionnalités du tableau de bord avec des données de démonstration
            </p>
            <button
              onClick={() => navigate('/demo')}
              className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 flex items-center mx-auto"
            >
              <Monitor className="h-6 w-6 mr-3" />
              Accéder à la démo interactive
            </button>
          </div>
        </div>
        
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            {showPasswordReset ? 'Nouveau mot de passe' : 
             showForgotPassword ? 'Réinitialiser le mot de passe' : 'Se connecter'}
          </h2>
          
          {!showForgotPassword && !showPasswordReset && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-blue-800 text-sm text-center">
                <strong>Pas encore de compte ?</strong><br/>
                Contactez l'équipe VoxNow pour créer votre accès au tableau de bord.
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-4 rounded-lg mb-6">
              {success}
            </div>
          )}

          {showPasswordReset ? (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-green-800 text-sm text-center">
                  Entrez votre nouveau mot de passe ci-dessous.
                </p>
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                    placeholder="Entrez votre nouveau mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400" /> : 
                      <Eye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                    placeholder="Confirmez votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400" /> : 
                      <Eye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Mise à jour...' : 'Mettre à jour le mot de passe'}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordReset(false);
                    setNewPassword('');
                    setConfirmPassword('');
                    navigate('/auth', { replace: true });
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          ) : !showForgotPassword ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                    placeholder="Votre mot de passe"
                    required
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 
                      <EyeOff className="h-5 w-5 text-gray-400" /> : 
                      <Eye className="h-5 w-5 text-gray-400" />
                    }
                  </button>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(true);
                    setError('');
                    setSuccess('');
                  }}
                  className="text-sm text-vox-blue hover:text-now-green transition-colors"
                >
                  Mot de passe oublié ?
                </button>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Connexion...' : 'Se connecter'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword} className="space-y-6">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm text-center">
                  Entrez votre adresse email pour recevoir un lien de réinitialisation de mot de passe.
                </p>
              </div>

              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    id="resetEmail"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                    placeholder="votre@email.com"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={resetLoading}
                  className="w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? 'Envoi en cours...' : 'Envoyer le lien de réinitialisation'}
                </button>
                
                <button
                  type="button"
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetEmail('');
                    setError('');
                    setSuccess('');
                  }}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Retour à la connexion
                </button>
              </div>
            </form>
          )}
          
          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>Si vous rencontrez des difficultés, merci de nous contacter : Email: sacha@voxnow.be | Tél: +32 493 69 08 20</p>
          </div>
        </div>
      </div>
    </div>
  );
}