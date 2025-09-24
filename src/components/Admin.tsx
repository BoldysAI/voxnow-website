import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Lock,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Save,
  X,
  Shield,
  LogOut,
  Loader2
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  status?: string;
  last_login?: string;
  created_at: string;
  updated_at?: string;
  demo_user: boolean;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
  banned_until?: string;
}

interface CreateUserData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
}

interface UpdateUserData {
  email?: string;
  password?: string;
  full_name?: string;
  phone?: string;
  email_confirm?: boolean;
}

// Get admin password from environment variables
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

// Get Supabase URL and anon key from environment variables
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validate required environment variables
if (!SUPABASE_URL || !SUPABASE_URL.startsWith('https://')) {
  throw new Error('VITE_SUPABASE_URL is required and must be a valid HTTPS URL');
}

if (!SUPABASE_ANON_KEY || SUPABASE_ANON_KEY.length < 50) {
  throw new Error('VITE_SUPABASE_ANON_KEY is required and must be a valid JWT token');
}

if (!ADMIN_PASSWORD || ADMIN_PASSWORD.length < 8) {
  throw new Error('VITE_ADMIN_PASSWORD is required and must be at least 8 characters long');
}
const ADMIN_FUNCTION_BASE_URL = `${SUPABASE_URL}/functions/v1/admin-users`;

// Helper function to get authenticated headers for Edge Functions
const getAuthHeaders = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'apikey': SUPABASE_ANON_KEY
});

export function Admin() {
  const navigate = useNavigate();
  
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  
  // Users data
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Form states
  const [createData, setCreateData] = useState<CreateUserData>({
    email: '',
    password: '',
    full_name: '',
    phone: ''
  });
  const [updateData, setUpdateData] = useState<UpdateUserData>({});
  const [formLoading, setFormLoading] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [showCreatePassword, setShowCreatePassword] = useState(false);

  // Check if user is already authenticated on component mount
  useEffect(() => {
    const adminAuth = sessionStorage.getItem('voxnow_admin_authenticated');
    const authTimestamp = sessionStorage.getItem('voxnow_admin_auth_timestamp');
    
    if (adminAuth === 'true' && authTimestamp) {
      const now = Date.now();
      const authTime = parseInt(authTimestamp, 10);
      const sessionTimeout = 30 * 60 * 1000; // 30 minutes
      
      if (now - authTime < sessionTimeout) {
        setIsAuthenticated(true);
      } else {
        // Session expired, clear storage
        sessionStorage.removeItem('voxnow_admin_authenticated');
        sessionStorage.removeItem('voxnow_admin_auth_timestamp');
      }
    }
  }, []);

  // Auto-logout after session timeout
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const checkSession = () => {
      const authTimestamp = sessionStorage.getItem('voxnow_admin_auth_timestamp');
      if (authTimestamp) {
        const now = Date.now();
        const authTime = parseInt(authTimestamp, 10);
        const sessionTimeout = 30 * 60 * 1000; // 30 minutes
        
        if (now - authTime >= sessionTimeout) {
          handleLogout();
        }
      }
    };
    
    const interval = setInterval(checkSession, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  // Load users when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const handlePasswordAuth = () => {
    // Add debugging to help troubleshoot
    console.log('Environment password exists:', !!ADMIN_PASSWORD);
    console.log('Input length:', passwordInput.length);
    console.log('Expected length:', ADMIN_PASSWORD?.length || 0);
    
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setAuthError('');
      const timestamp = Date.now().toString();
      sessionStorage.setItem('voxnow_admin_authenticated', 'true');
      sessionStorage.setItem('voxnow_admin_auth_timestamp', timestamp);
      console.log('Authentication successful');
    } else {
      setAuthError('Mot de passe incorrect');
      console.log('Authentication failed - password mismatch');
      // Add delay to prevent brute force attacks
      setTimeout(() => {}, 1000);
    }
    setPasswordInput('');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('voxnow_admin_authenticated');
    sessionStorage.removeItem('voxnow_admin_auth_timestamp');
    navigate('/');
  };

  const loadUsers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch(ADMIN_FUNCTION_BASE_URL, {
        method: 'GET',
        headers: getAuthHeaders()
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setUsers(data.users || []);
    } catch (err) {
      console.error('Error loading users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const createUser = async () => {
    if (!createData.email || !createData.password) {
      setError('Email et mot de passe requis');
      return;
    }

    setFormLoading(true);
    setError('');

    try {
      const response = await fetch(ADMIN_FUNCTION_BASE_URL, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(createData)
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || data.details?.message || 'Failed to create user');
      }

      setShowCreateModal(false);
      setCreateData({ email: '', password: '', full_name: '', phone: '' });
      setShowCreatePassword(false); // Reset password visibility
      await loadUsers();
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setFormLoading(false);
    }
  };

  const updateUser = async () => {
    if (!selectedUser) return;

    setFormLoading(true);
    setError('');

    try {
      const response = await fetch(`${ADMIN_FUNCTION_BASE_URL}/${selectedUser.id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updateData)
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || data.details?.message || 'Failed to update user');
      }

      setShowEditModal(false);
      setSelectedUser(null);
      setUpdateData({});
      setShowEditPassword(false); // Reset password visibility
      await loadUsers();
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setFormLoading(false);
    }
  };

  const deleteUser = async () => {
    if (!selectedUser) return;

    setFormLoading(true);
    setError('');

    try {
      const response = await fetch(`${ADMIN_FUNCTION_BASE_URL}/${selectedUser.id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });

      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || data.details?.message || 'Failed to delete user');
      }

      setShowDeleteModal(false);
      setSelectedUser(null);
      await loadUsers();
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setFormLoading(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Jamais';
    try {
      return new Date(dateString).toLocaleString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const openEditModal = (user: User) => {
    setSelectedUser(user);
    setUpdateData({
      email: user.email,
      full_name: user.full_name || '',
      phone: user.phone || ''
    });
    setShowEditPassword(false); // Reset password visibility
    setShowEditModal(true);
  };

  const openDeleteModal = (user: User) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  // Password Authentication Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Administration VoxNow</h1>
            <p className="text-gray-600">Accès restreint - Mot de passe requis</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe administrateur
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePasswordAuth()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent pr-12"
                  placeholder="Entrez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {authError && (
                <p className="mt-2 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  {authError}
                </p>
              )}
            </div>

            <button
              onClick={handlePasswordAuth}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4 rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 font-medium flex items-center justify-center"
            >
              <Lock className="h-5 w-5 mr-2" />
              Accéder
            </button>

            <button
              onClick={() => navigate('/')}
              className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              Retour à l'accueil
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Admin Interface
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="https://res.cloudinary.com/drdqov4zs/image/upload/v1741862267/My%20Brand/LOGO_VoxNow_d6fbzq.png"
                alt="VoxNow Logo"
                className="h-10"
              />
              <div>
                <h1 className="text-xl font-bold text-red-600">Administration</h1>
                <p className="text-sm text-gray-600">Gestion des utilisateurs</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Shield className="h-4 w-4 mr-1" />
                Admin
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Déconnexion
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisateurs actifs</p>
                <p className="text-2xl font-bold text-green-600">
                  {users.filter(u => !u.banned_until).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Comptes démo</p>
                <p className="text-2xl font-bold text-orange-600">
                  {users.filter(u => u.demo_user).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <UserPlus className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-xl font-bold text-gray-900">Utilisateurs</h2>
              <p className="text-gray-600">Gérer les comptes utilisateur de la plateforme</p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={loadUsers}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Users className="h-4 w-4 mr-2" />
                )}
                Actualiser
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(true);
                  setShowCreatePassword(false); // Reset password visibility
                }}
                className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </button>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Users Table */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
              <span className="ml-2 text-gray-600">Chargement des utilisateurs...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aucun utilisateur trouvé</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Nom complet</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Téléphone</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Statut</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Dernière connexion</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Créé le</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="font-medium text-gray-900">{user.email}</div>
                            {user.demo_user && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 mt-1">
                                DÉMO
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {user.full_name || <span className="text-gray-400 italic">Non défini</span>}
                      </td>
                      <td className="px-6 py-4">
                        {user.phone ? (
                          <div className="flex items-center text-gray-900">
                            <Phone className="h-4 w-4 text-gray-400 mr-2" />
                            {user.phone}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">Non défini</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {user.email_confirmed_at ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-green-700 font-medium">Confirmé</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-red-700 font-medium">Non confirmé</span>
                            </>
                          )}
                        </div>
                        {user.banned_until && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 mt-1">
                            BANNI
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(user.last_sign_in_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {formatDate(user.created_at)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                            title="Modifier"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(user)}
                            className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Create User Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Créer un utilisateur</h3>
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowCreatePassword(false); // Reset password visibility
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={createData.email}
                    onChange={(e) => setCreateData({ ...createData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="user@example.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mot de passe *</label>
                  <div className="relative">
                    <input
                      type={showCreatePassword ? 'text' : 'password'}
                      value={createData.password}
                      onChange={(e) => setCreateData({ ...createData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent pr-12"
                      placeholder="Mot de passe fort"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCreatePassword(!showCreatePassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showCreatePassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={createData.full_name}
                    onChange={(e) => setCreateData({ ...createData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Nom et prénom"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={createData.phone}
                    onChange={(e) => setCreateData({ ...createData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="+32 123 456 789"
                  />
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setShowCreatePassword(false); // Reset password visibility
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={createUser}
                  disabled={formLoading}
                  className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
                >
                  {formLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Créer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Edit User Modal */}
        {showEditModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Modifier l'utilisateur</h3>
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowEditPassword(false); // Reset password visibility
                  }}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={updateData.email || ''}
                    onChange={(e) => setUpdateData({ ...updateData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nouveau mot de passe</label>
                  <div className="relative">
                    <input
                      type={showEditPassword ? 'text' : 'password'}
                      value={updateData.password || ''}
                      onChange={(e) => setUpdateData({ ...updateData, password: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                      placeholder="Laisser vide pour conserver"
                    />
                    <button
                      type="button"
                      onClick={() => setShowEditPassword(!showEditPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showEditPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet</label>
                  <input
                    type="text"
                    value={updateData.full_name || ''}
                    onChange={(e) => setUpdateData({ ...updateData, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={updateData.phone || ''}
                    onChange={(e) => setUpdateData({ ...updateData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="email_confirm"
                    checked={updateData.email_confirm || false}
                    onChange={(e) => setUpdateData({ ...updateData, email_confirm: e.target.checked })}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="email_confirm" className="ml-2 block text-sm text-gray-700">
                    Email confirmé
                  </label>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowEditModal(false);
                    setShowEditPassword(false); // Reset password visibility
                  }}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={updateUser}
                  disabled={formLoading}
                  className="flex-1 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center"
                >
                  {formLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Sauvegarder
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delete User Modal */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-gray-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-red-600">Supprimer l'utilisateur</h3>
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-4">
                  Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-800 font-medium">{selectedUser.email}</p>
                  <p className="text-red-600 text-sm">{selectedUser.full_name || 'Nom non défini'}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Annuler
                </button>
                <button
                  onClick={deleteUser}
                  disabled={formLoading}
                  className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium flex items-center justify-center"
                >
                  {formLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Trash2 className="h-5 w-5 mr-2" />
                      Supprimer
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
