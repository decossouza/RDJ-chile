
import React, { useState, useEffect } from 'react';
import { AuthInput } from './components/AuthInput';
import { Itinerary } from './components/Itinerary';
import { MailIcon } from './components/icons/MailIcon';
import { LockIcon } from './components/icons/LockIcon';
import { GoogleIcon } from './components/icons/GoogleIcon';
import { useWeather } from './hooks/useWeather';

const Stars = () => (
  <div className="absolute inset-0">
      <div id="stars"></div>
      <div id="stars2"></div>
      <div id="stars3"></div>
  </div>
);

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // FIX: Added missing '=' for useState hook. This was causing a cascade of parsing errors on preceding lines.
  const [isDarkMode, setIsDarkMode] = useState(false);
  const { timeOfDay } = useWeather();
  const isNight = timeOfDay === 'Night';

  useEffect(() => {
    if (isNight) {
      setIsDarkMode(true);
    } else {
      try {
        const savedMode = localStorage.getItem('santiagoDarkMode');
        setIsDarkMode(savedMode ? JSON.parse(savedMode) : false);
      } catch {
        setIsDarkMode(false);
      }
    }
  }, [timeOfDay]);
  
  // Effect to apply dark mode class and save preference
  useEffect(() => {
    const element = document.documentElement;
    if (isDarkMode) {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
    
    // Only save preference if it's not night, to allow day-time toggling
    if (!isNight) {
        try {
            localStorage.setItem('santiagoDarkMode', JSON.stringify(isDarkMode));
        } catch (error) {
            console.error("Failed to save dark mode to localStorage", error);
        }
    }
  }, [isDarkMode, isNight]);


  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === 'Deco' && password === 'Deco') || (email === 'Rafa' && password === 'Rafa')) {
      setIsLoggedIn(true);
      setError('');
    } else {
      setError('Usuário ou senha inválidos.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };
  
  const renderContent = () => {
    if (isLoggedIn) {
      return (
        <Itinerary 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode} 
          setIsDarkMode={setIsDarkMode} 
          isNight={isNight} 
        />
      );
    }

    return (
      <main className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 space-y-6 border border-slate-200 dark:border-slate-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 tracking-tight">RDJ no Chile</h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Acesse sua conta para ver os detalhes da viagem.</p>
        </div>

        <form className="space-y-6" onSubmit={handleLogin}>
          <AuthInput
            id="email"
            label="Usuário"
            type="text"
            placeholder="Seu usuário"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={<MailIcon />}
          />

          <div>
             <div className="flex justify-between items-baseline">
                <label htmlFor="password" className="block text-sm font-medium text-slate-800 dark:text-slate-300">
                    Senha
                </label>
                <a href="#" className="text-xs text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
                    Esqueceu a senha?
                </a>
             </div>
             <div className="mt-1">
                <AuthInput
                    id="password"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockIcon />}
                    label="" // Pass empty label as it's handled above
                />
             </div>
          </div>
          
          {error && <p className="text-xs text-red-600 text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-800 shadow-lg shadow-brand-500/30 hover:-translate-y-0.5"
          >
            Entrar
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
          </div>
          <div className="relative bg-white dark:bg-slate-800 px-2 text-xs text-slate-500 dark:text-slate-400">ou</div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center py-2.5 px-4 bg-slate-50 dark:bg-slate-700/60 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 text-sm font-semibold rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 dark:focus:ring-offset-slate-800"
        >
          <GoogleIcon className="mr-3" />
          Entrar com Google
        </button>
      </main>
    );
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans relative overflow-hidden bg-slate-100 dark:bg-slate-900">
      <div className="absolute inset-0 z-0">
        {/* Day */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-sky-200 to-slate-50 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: timeOfDay === 'Day' ? 1 : 0 }}
        />
        {/* Sunset */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-yellow-200 via-orange-300 to-pink-300 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: timeOfDay === 'Sunset' ? 1 : 0 }}
        />
        {/* Night */}
        <div
          className="absolute inset-0 bg-gradient-to-b from-slate-900 to-slate-800 transition-opacity duration-[1500ms] ease-in-out"
          style={{ opacity: timeOfDay === 'Night' ? 1 : 0 }}
        >
          <Stars />
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default App;
