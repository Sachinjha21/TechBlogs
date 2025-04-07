import  { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const validateForm = () => {
    if (!email || !password) {
      setError('Email and password are required');
      return false;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      setTimeout(() => {
        // For demo purposes:
        if (email === 'demo@example.com' && password === 'password') {
          const mockUser = {
            id: 'user_1',
            email,
            profileImage: 'https://images.unsplash.com/photo-1505033575518-a36ea2ef75ae?ixid=M3w3MjUzNDh8MHwxfHNlYXJjaHwxfHxwcm9maWxlJTIwcGxhY2Vob2xkZXJ8ZW58MHx8fHwxNzQ0MDUxMTY2fDA&ixlib=rb-4.0.3&fit=fillmax&h=200&w=200'
          };
          
          const mockToken = 'mock_jwt_token_' + Date.now();
          
          login(mockToken, mockUser);
          navigate('/dashboard');
        } else {
          setError('Invalid credentials. Try demo@example.com / password');
        }
      }, 1000);
    } catch (error) {
      setError('Failed to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto card mt-10">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          <span>{error}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="form-input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        
        <div className="mb-6">
          <label className="block text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      
      <div className="mt-6 text-center text-gray-600">
        Don't have an account?{' '}
        <Link to="/signup" className="text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default Login;
 