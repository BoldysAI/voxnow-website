import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { ArrowLeft } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Demo account credentials
  const DEMO_EMAIL = 'sacha@voxnow.be';
  const DEMO_PASSWORD = 'Cestlademo';

  // Maître Huez account credentials
  const HUEZ_EMAIL = 'mandathuez@gmail.com';
  const HUEZ_PASSWORD = 'ILoveVoxNow1%!';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      // Check for demo account
      if (email === DEMO_EMAIL && password === DEMO_PASSWORD) {
        // Simulate successful authentication for demo
        navigate('/dashboard');
      }
      // Check for Maître Huez account
      else if (email === HUEZ_EMAIL && password === HUEZ_PASSWORD) {
        // Set authentication for Huez dashboard
        console.log('Setting Huez authentication...');
        sessionStorage.setItem('huez_auth', JSON.stringify({
          email: HUEZ_EMAIL,
          authenticated: true,
          timestamp: Date.now()
        }));
        console.log('Auth data set, navigating to dashboard-huez...');
        // Navigate to Maître Huez dashboard with a small delay to ensure sessionStorage is set
        setTimeout(() => {
          navigate('/dashboard-huez');
        }, 200);
      } 
      // Try Firebase authentication for other accounts
      else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError('Email ou mot de passe incorrect');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => navigate('/')}
          className="text-vox-blue hover:text-now-green transition-colors duration-300 flex items-center mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Retour à l'accueil
        </button>
        
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6 sm:p-8">
          <h2 className="text-3xl font-bold mb-6 gradient-text">
            Se connecter
          </h2>
          
          {/* Demo Access Button */}
          <div className="text-center mb-6">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full bg-gradient-to-r from-vox-blue to-now-green text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center"
            >
              Accéder à l'espace démo
            </button>
          </div>
          
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-vox-blue focus:border-transparent text-base"
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-vox-blue to-now-green text-white py-3 rounded-lg hover:shadow-lg transition-all duration-300 font-medium"
            >
              Se connecter
            </button>
          </form>
          
          <div className="mt-6 text-center text-gray-600 text-sm">
            <p>Contactez l'administrateur pour créer un compte</p>
          </div>
        </div>
      </div>
    </div>
  );
}