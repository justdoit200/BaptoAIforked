import React, { useState } from 'react';
import { ArrowRight, AlertCircle } from 'lucide-react';

interface MinimalAuthPageProps {
  onSignIn: (email: string, password: string) => Promise<boolean>;
  onSignUp: (name: string, email: string, password: string) => Promise<boolean>;
  isLoading: boolean;
  error?: string;
}

export const MinimalAuthPage: React.FC<MinimalAuthPageProps> = ({
  onSignIn,
  onSignUp,
  isLoading,
  error
}) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [localError, setLocalError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');

    if (!formData.email || !formData.password) {
      setLocalError('EMAIL AND PASSWORD REQUIRED');
      return;
    }

    if (formData.password.length < 6) {
      setLocalError('PASSWORD MUST BE AT LEAST 6 CHARACTERS');
      return;
    }

    if (isSignUp && !formData.name) {
      setLocalError('NAME REQUIRED');
      return;
    }

    const success = isSignUp
      ? await onSignUp(formData.name, formData.email, formData.password)
      : await onSignIn(formData.email, formData.password);

    if (!success) {
      setLocalError(error || 'AUTHENTICATION FAILED');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) {
      setLocalError('');
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-24">
      <div className="w-full max-w-md">
        <div className="text-center mb-48">
          <h1 className="text-4xl font-mono tracking-tight mb-8">BAPTO AI</h1>
          <p className="font-mono text-sm text-gray-600">REALTIME VOICE INTERFACE</p>
        </div>

        <div className="border border-black p-32">
          <h2 className="font-mono text-sm mb-24">
            {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-24">
            {isSignUp && (
              <div>
                <label className="block font-mono text-xs text-gray-600 mb-8">
                  NAME
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-16 py-12 border border-gray-400 focus:border-black font-mono text-sm"
                  placeholder="ENTER NAME"
                  required={isSignUp}
                />
              </div>
            )}

            <div>
              <label className="block font-mono text-xs text-gray-600 mb-8">
                EMAIL
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="w-full px-16 py-12 border border-gray-400 focus:border-black font-mono text-sm"
                placeholder="ENTER EMAIL"
                required
              />
            </div>

            <div>
              <label className="block font-mono text-xs text-gray-600 mb-8">
                PASSWORD
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className="w-full px-16 py-12 border border-gray-400 focus:border-black font-mono text-sm"
                placeholder="ENTER PASSWORD"
                required
              />
            </div>

            {(localError || error) && (
              <div className="p-16 bg-red-50 border border-red-600">
                <div className="flex items-center gap-8">
                  <AlertCircle className="w-16 h-16 text-red-600 flex-shrink-0" />
                  <p className="font-mono text-xs text-red-600">
                    {localError || error}
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white font-mono text-sm px-24 py-16 hover:bg-gray-800 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-8"
            >
              {isLoading ? (
                'PROCESSING...'
              ) : (
                <>
                  {isSignUp ? 'CREATE ACCOUNT' : 'SIGN IN'}
                  <ArrowRight className="w-16 h-16" />
                </>
              )}
            </button>
          </form>

          <div className="mt-24 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setLocalError('');
                setFormData({ name: '', email: '', password: '' });
              }}
              className="font-mono text-xs text-gray-600 hover:text-black transition-colors"
            >
              {isSignUp ? 'ALREADY HAVE AN ACCOUNT? SIGN IN' : 'NO ACCOUNT? SIGN UP'}
            </button>
          </div>
        </div>

        <div className="mt-24 text-center">
          <p className="font-mono text-xs text-gray-500">
            GPT REALTIME API
          </p>
        </div>
      </div>
    </div>
  );
};
