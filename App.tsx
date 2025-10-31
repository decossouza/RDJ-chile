import React, { useState, useEffect } from 'react';
import { AuthInput } from './components/AuthInput';
import { Itinerary } from './components/Itinerary';
import { MailIcon } from './components/icons/MailIcon';
import { LockIcon } from './components/icons/LockIcon';
import { GoogleIcon } from './components/icons/GoogleIcon';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isNight, setIsNight] = useState(false);

  // Effect to check time of day and set initial dark mode
  useEffect(() => {
    const checkTimeAndSetMode = () => {
      const hour = new Date().getHours();
      const night = hour < 6 || hour >= 20;
      setIsNight(night);

      if (night) {
        setIsDarkMode(true);
      } else {
        try {
          const savedMode = localStorage.getItem('santiagoDarkMode');
          setIsDarkMode(savedMode ? JSON.parse(savedMode) : false);
        } catch {
          setIsDarkMode(false);
        }
      }
    };

    checkTimeAndSetMode();
    const intervalId = setInterval(checkTimeAndSetMode, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, []);
  
  // Effect to apply dark mode class and save preference
  useEffect(() => {
    const element = document.documentElement;
    if (isDarkMode) {
      element.classList.add('dark');
    } else {
      element.classList.remove('dark');
    }
    
    // Only save manual changes to local storage (i.e., when it's not night)
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
    if (email === 'Deco' && password === 'Deco') {
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
      <main className="relative z-10 w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 space-y-6 border border-gray-200 dark:border-slate-700">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight">RDJ</h1>
          <h2 className="mt-2 text-2xl font-semibold text-gray-800 dark:text-gray-200">Bem-vindo(a) de volta!</h2>
          <p className="mt-1 text-base text-gray-600 dark:text-gray-400">Acesse sua conta para ver os detalhes da viagem</p>
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
                <label htmlFor="password" className="block text-sm font-medium text-gray-800 dark:text-gray-300">
                    Senha
                </label>
                <a href="#" className="text-sm text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300 font-medium">
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
          
          {error && <p className="text-sm text-red-600 text-center font-medium">{error}</p>}

          <button
            type="submit"
            className="w-full py-3 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 shadow-lg"
          >
            Entrar
          </button>
        </form>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          <div className="relative bg-white dark:bg-slate-800 px-2 text-sm text-gray-500 dark:text-gray-400">ou</div>
        </div>

        <button
          type="button"
          className="w-full flex items-center justify-center py-3 px-4 bg-gray-50 border border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 dark:bg-slate-700 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-600"
        >
          <GoogleIcon className="mr-3" />
          Entrar com Google
        </button>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Não tem uma conta?{' '}
          <a href="#" className="font-bold text-brand-600 hover:text-brand-500 dark:text-brand-400 dark:hover:text-brand-300">
            Cadastre-se
          </a>
        </p>
      </main>
    );
  };
  
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 font-sans bg-white dark:bg-slate-900">
      {renderContent()}
    </div>
  );
}

export default App;