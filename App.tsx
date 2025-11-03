
import React, { useState, useEffect } from 'react';
import { AuthInput } from './components/AuthInput';
import { Itinerary } from './components/Itinerary';
import { MailIcon } from './components/icons/MailIcon';
import { LockIcon } from './components/icons/LockIcon';
import { GoogleIcon } from './components/icons/GoogleIcon';
import { useWeather } from './hooks/useWeather';
import { DynamicBackground } from './components/DynamicBackground';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const { timeOfDay, weather } = useWeather();
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
  
  const renderLoginScreen = () => {
    return (
      <div className="relative z-10 grid w-full min-h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex-col items-start justify-center hidden p-12 md:flex">
          <div className="max-w-md">
            <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-6xl">
              RDJ NO CHILE
            </h1>
            <p className="mt-4 text-lg text-slate-300">
              Entre na sua conta para continuar a planejar sua aventura no Chile.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center w-full min-h-screen p-4 sm:p-8">
            <main className="w-full max-w-md bg-black/10 rounded-2xl p-8 space-y-6 border border-white/20">
              <div className="text-center md:hidden">
                  <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">RDJ NO CHILE</h1>
                  <p className="mt-2 text-base text-slate-300">Entre na sua conta.</p>
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

                <AuthInput
                    id="password"
                    label="Senha"
                    type="password"
                    placeholder="Sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    icon={<LockIcon />}
                />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <input
                      id="remember-me"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-500 text-primary-500 focus:ring-primary-500 bg-transparent"
                    />
                    <label htmlFor="remember-me" className="font-medium text-slate-300">
                      Lembrar-me
                    </label>
                  </div>
                  <a href="#" className="font-medium text-primary-400 hover:text-primary-300">
                      Esqueceu a senha?
                  </a>
                </div>
                
                {error && <p className="text-xs text-red-500 text-center font-medium">{error}</p>}

                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-bold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900 shadow-lg shadow-primary-500/40 hover:-translate-y-0.5 glow-shadow-primary"
                >
                  Entrar
                </button>
              </form>

              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-600"></div>
                </div>
                <div className="relative bg-black/20 backdrop-blur-sm px-2 text-xs text-slate-400">ou entre com</div>
              </div>

              <button
                type="button"
                className="w-full flex items-center justify-center py-2.5 px-4 bg-white/20 border border-white/30 text-white text-sm font-semibold rounded-xl hover:bg-white/30 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-offset-slate-900"
              >
                <GoogleIcon className="mr-3" />
                Entrar com Google
              </button>
          </main>
        </div>
      </div>
    );
  };
  
  return (
    <div className="relative min-h-screen w-full font-sans text-white">
      {!isLoggedIn && <DynamicBackground timeOfDay={timeOfDay} weather={weather} />}
      {isLoggedIn 
        ? <Itinerary 
            onLogout={handleLogout} 
            isDarkMode={isDarkMode} 
            setIsDarkMode={setIsDarkMode} 
            isNight={isNight} 
          />
        : renderLoginScreen()
      }
    </div>
  );
}

export default App;
