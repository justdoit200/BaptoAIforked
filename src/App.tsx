import React, { useState } from 'react';
import { MinimalAuthPage } from './components/MinimalAuthPage';
import { LayoutContainer } from './components/LayoutContainer';
import { useAuth } from './hooks/useAuth';

type AppState = 'auth' | 'app';

function App() {
  const { user, isAuthenticated, isLoading, error, signIn, signUp, signOut } = useAuth();
  const [appState, setAppState] = useState<AppState>('auth');

  React.useEffect(() => {
    if (isAuthenticated && user) {
      setAppState('app');
    } else if (!isAuthenticated) {
      setAppState('auth');
    }
  }, [isAuthenticated, user]);

  const handleSignOut = () => {
    signOut();
    setAppState('auth');
  };

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    const success = await signIn(email, password);
    return success;
  };

  const handleSignUp = async (name: string, email: string, password: string): Promise<boolean> => {
    const success = await signUp(name, email, password);
    return success;
  };

  if (appState === 'auth') {
    return (
      <MinimalAuthPage
        onSignIn={handleSignIn}
        onSignUp={handleSignUp}
        isLoading={isLoading}
        error={error}
      />
    );
  }

  if (appState === 'app' && user) {
    return (
      <LayoutContainer
        user={user}
        onSignOut={handleSignOut}
      />
    );
  }

  return null;
}

export default App;