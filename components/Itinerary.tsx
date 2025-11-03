import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { itineraryData } from '../data/itineraryData';
import { ProgressBar } from './ProgressBar';
import { Modal } from './Modal';
import { LuggageChecklist } from './LuggageChecklist';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { EmptyCircleIcon } from './icons/EmptyCircleIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { InfoIcon } from './icons/InfoIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { RoteiroIcon } from './icons/RoteiroIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { FlightIcon } from './icons/FlightIcon';
import { FlightReminders } from './FlightReminders';
import { useFlightReminders } from '../hooks/useFlightReminders';
import { DollarSignIcon } from './icons/DollarSignIcon';
import { CurrencyConverter } from './CurrencyConverter';


interface ItineraryProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isNight: boolean;
}

type ActiveTab = 'roteiro' | 'mala' | 'voos' | 'cambio';

interface Link {
  uri: string;
  title: string;
}

interface ModalState {
  isOpen: boolean;
  isLoading: boolean;
  content: {
    text: string;
    links: Link[];
  };
  error: string;
}

export const Itinerary: React.FC<ItineraryProps> = ({ onLogout, isDarkMode, setIsDarkMode, isNight }) => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [openDayIndex, setOpenDayIndex] = useState<number | null>(0);
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('roteiro');
  
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isLoading: false,
    content: { text: '', links: [] },
    error: ''
  });
  
  const { reminders, setNotified } = useFlightReminders();

  // Notification checking logic
  useEffect(() => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return; // Don't run if notifications are not supported or permission is not granted
    }

    const checkReminders = () => {
      const now = new Date().getTime();
      reminders.forEach(reminder => {
        if (reminder.notified) return;

        const flightTime = new Date(reminder.dateTime).getTime();
        const reminderTime = flightTime - (reminder.reminderMinutes * 60 * 1000);

        // Notify if reminder time is in the past, but flight is in the future
        if (now >= reminderTime && now < flightTime) {
          const title = reminder.type === 'departure' ? `Lembrete de Saída: Voo ${reminder.flightNumber}` : `Lembrete de Chegada: Voo ${reminder.flightNumber}`;
          const body = `Seu voo está programado para ${new Date(reminder.dateTime).toLocaleTimeString('pt-BR', {timeStyle: 'short'})}.`;
          
          new Notification(title, {
            body: body,
            icon: '/vite.svg' // Using the default app icon
          });

          setNotified(reminder.id);
        }
      });
    };

    const intervalId = setInterval(checkReminders, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [reminders, setNotified]);


  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('santiagoItineraryProgress');
      if (savedProgress) {
        setCheckedItems(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Failed to parse progress from localStorage", error);
    }
  }, []);

  const handleToggleDay = (index: number) => {
    setOpenDayIndex(openDayIndex === index ? null : index);
  };

  const handleCheckItem = (dayIndex: number, eventIndex: number) => {
    const key = `${dayIndex}-${eventIndex}`;
    const newCheckedItems = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newCheckedItems);
    localStorage.setItem('santiagoItineraryProgress', JSON.stringify(newCheckedItems));
  };
  
  const handleOpenSantiagoMap = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=Santiago,Chile`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGetInfo = async (description: string) => {
    setModalState({ isOpen: true, isLoading: true, content: { text: '', links: [] }, error: '' });
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      let userLocation = null;
      if (navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
          });
          userLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          };
        } catch (e) {
          console.warn("Geolocation failed, falling back to Santiago.", e);
          userLocation = { latitude: -33.4489, longitude: -70.6693 };
        }
      } else {
        userLocation = { latitude: -33.4489, longitude: -70.6693 };
      }

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Forneça informações úteis para um turista sobre "${description}" em Santiago, Chile, em português do Brasil. Seja conciso e foque em dicas práticas como horários de funcionamento, melhores épocas para visitar ou atrações próximas.`,
        config: {
          tools: [{ googleMaps: {} }],
          toolConfig: {
            retrievalConfig: userLocation ? { latLng: userLocation } : undefined,
          },
        },
      });

      const text = response.text;
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

      const links = groundingChunks
        .map((chunk: any) => chunk.maps)
        .filter(Boolean)
        .map((maps: any) => ({
          uri: maps.uri,
          title: maps.title,
        }));

      setModalState({ isOpen: true, isLoading: false, content: { text, links }, error: '' });
    } catch (err) {
      console.error("Error fetching info from Gemini:", err);
      setModalState({
        isOpen: true,
        isLoading: false,
        content: { text: '', links: [] },
        error: 'Falha ao buscar informações. Por favor, tente novamente.'
      });
    }
  };

  const totalEvents = itineraryData.reduce((acc, day) => acc + day.events.length, 0);
  const completedEvents = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalEvents > 0 ? (completedEvents / totalEvents) * 100 : 0;

  const quotes = [
    "Uma grande aventura te espera em Santiago!",
    "Criando memórias que vão durar para sempre.",
    "Aproveitando cada momento desta viagem incrível!",
    "Quase lá! A melhor parte ainda está por vir.",
    "Roteiro completo! Uma viagem para guardar no coração."
  ];
  let currentQuote = quotes[0];
  if (progress >= 100) currentQuote = quotes[4];
  else if (progress >= 75) currentQuote = quotes[3];
  else if (progress >= 50) currentQuote = quotes[2];
  else if (progress >= 25) currentQuote = quotes[1];

  const renderDayList = () => (
    <div className="space-y-3 p-2 sm:p-4">
      {itineraryData.map((day, dayIndex) => {
        const isOpen = openDayIndex === dayIndex;
        const DayIcon = day.icon;
        return (
          <div key={dayIndex} className={`bg-white dark:bg-slate-800 rounded-2xl shadow-md overflow-hidden transition-all duration-300 border dark:border-slate-200/80 dark:border-slate-700/80 ${isOpen ? 'ring-2 ring-primary-500/50' : ''}`}>
            <div
              className="flex items-center p-4 cursor-pointer"
              onClick={() => handleToggleDay(dayIndex)}
              aria-expanded={isOpen}
              aria-controls={`day-${dayIndex}-content`}
              role="button"
            >
              <div className="mr-4 p-3 bg-gradient-to-br from-primary-500 to-secondary-400 rounded-lg shadow-lg shadow-primary-500/30">
                  <DayIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                  <h2 className="font-bold text-base text-slate-900 dark:text-slate-100">{`${day.day} – ${day.date}`}</h2>
                  <h3 className="font-semibold text-sm text-primary-700 dark:text-primary-400">{day.title}</h3>
              </div>
              <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <div
              id={`day-${dayIndex}-content`}
              className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
              <div className="px-4 pb-4">
                <ul className="space-y-1 border-t border-slate-200 dark:border-slate-700/50 pt-3">
                  {day.events.map((event, eventIndex) => {
                    const key = `${dayIndex}-${eventIndex}`;
                    const isChecked = !!checkedItems[key];
                    return (
                      <li
                        key={eventIndex}
                        className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-300 group ${isChecked ? 'bg-secondary-50 text-slate-500 line-through dark:bg-secondary-950/30 dark:text-slate-500' : 'hover:bg-slate-100 dark:hover:bg-slate-700/50'}`}
                        onClick={() => handleCheckItem(dayIndex, eventIndex)}
                      >
                        <div>{isChecked ? <CheckCircleIcon /> : <EmptyCircleIcon />}</div>
                        <span className={`w-14 text-xs font-semibold ${isChecked ? 'text-slate-500' : 'text-slate-700 dark:text-slate-300'}`}>{event.time}</span>
                        <span className="flex-1 flex justify-between items-center text-sm text-slate-800 dark:text-slate-200">
                          {event.description}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGetInfo(event.description); }}
                            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700"
                            aria-label={`Get more info about ${event.description}`}
                          >
                            <InfoIcon />
                          </button>
                        </span>
                      </li>
                    )
                  })}
                </ul>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'roteiro':
        return (
          <>
            <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-700/50 shrink-0">
                <ProgressBar progress={progress} quote={currentQuote} />
            </div>
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
                {renderDayList()}
            </div>
          </>
        );
      case 'mala':
        return (
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
                <LuggageChecklist />
            </div>
        );
      case 'voos':
        return (
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
                <FlightReminders />
            </div>
        );
      case 'cambio':
        return (
            <div className="flex-1 overflow-y-auto no-scrollbar bg-slate-50 dark:bg-slate-900/50">
                <CurrencyConverter />
            </div>
        );
      default:
        return null;
    }
  };

  return (
    <>
      <main className="w-full h-screen flex flex-col bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200">
        <header className="relative border-b border-slate-200 dark:border-slate-700 shrink-0">
            <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: "url('https://images.unsplash.com/photo-1557974040-3bec341da09b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170')" }}
            >
                <div className="absolute inset-0 bg-black/40" />
            </div>
            <div className="relative p-4 sm:p-5 flex flex-col items-center gap-4">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-center text-white drop-shadow-md">
                    <span>Roteiro Chile 🇨🇱</span>
                </h1>
                <div className="w-full flex justify-between items-center">
                    <button
                        onClick={onLogout}
                        className="py-1.5 px-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs font-bold rounded-lg transition-colors duration-300 border border-white/30"
                    >
                        Sair
                    </button>
                    <div className="flex items-center gap-2 sm:gap-3">
                        <button
                        onClick={handleOpenSantiagoMap}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white"
                        aria-label="Abrir mapa de Santiago"
                        title="Abrir mapa de Santiago"
                        >
                        <MapPinIcon className="w-5 h-5" />
                        </button>
                        <button
                        onClick={() => setIsEmergencyModalOpen(true)}
                        className="p-2 rounded-lg bg-red-500/50 hover:bg-red-500/60 backdrop-blur-sm transition-colors text-white"
                        aria-label="Contatos de Emergência"
                        title="Contatos de Emergência"
                        >
                        <AlertTriangleIcon className="w-5 h-5" />
                        </button>
                        <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm transition-colors text-white disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label="Toggle dark mode"
                        disabled={isNight}
                        title={isNight ? "Modo escuro ativado automaticamente à noite" : "Alternar modo claro/escuro"}
                        >
                        {isDarkMode ? <SunIcon /> : <MoonIcon />}
                        </button>
                    </div>
                </div>
            </div>
        </header>

        <div className="flex border-b border-slate-200 dark:border-slate-700 shrink-0">
            <button
                onClick={() => setActiveTab('roteiro')}
                className={`flex-1 flex justify-center items-center gap-2 p-3 text-sm font-semibold transition-colors ${activeTab === 'roteiro' ? 'text-secondary-500 dark:text-secondary-400 border-b-2 border-secondary-400 bg-secondary-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-500/5'}`}
            >
                <RoteiroIcon className="w-5 h-5" />
                Roteiro
            </button>
            <button
                onClick={() => setActiveTab('mala')}
                className={`flex-1 flex justify-center items-center gap-2 p-3 text-sm font-semibold transition-colors ${activeTab === 'mala' ? 'text-secondary-500 dark:text-secondary-400 border-b-2 border-secondary-400 bg-secondary-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-500/5'}`}
            >
                <BriefcaseIcon className="w-5 h-5" />
                Mala
            </button>
             <button
                onClick={() => setActiveTab('voos')}
                className={`flex-1 flex justify-center items-center gap-2 p-3 text-sm font-semibold transition-colors ${activeTab === 'voos' ? 'text-secondary-500 dark:text-secondary-400 border-b-2 border-secondary-400 bg-secondary-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-500/5'}`}
            >
                <FlightIcon className="w-5 h-5" />
                Voos
            </button>
            <button
                onClick={() => setActiveTab('cambio')}
                className={`flex-1 flex justify-center items-center gap-2 p-3 text-sm font-semibold transition-colors ${activeTab === 'cambio' ? 'text-secondary-500 dark:text-secondary-400 border-b-2 border-secondary-400 bg-secondary-500/10' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-500/5'}`}
            >
                <DollarSignIcon className="w-5 h-5" />
                Câmbio
            </button>
        </div>
        
        {renderContent()}

      </main>
      
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
        isLoading={modalState.isLoading}
        error={modalState.error}
        content={modalState.content}
      />
      <Modal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        title="Contatos de Emergência"
      >
        <div className="space-y-2 text-slate-700 dark:text-slate-300 text-xs sm:text-sm">
            <p><strong>Polícia (Carabineros):</strong> <a href="tel:133" className="text-primary-600 dark:text-primary-400 hover:underline">133</a></p>
            <p><strong>Ambulância (SAMU):</strong> <a href="tel:131" className="text-primary-600 dark:text-primary-400 hover:underline">131</a></p>
            <p><strong>Bombeiros:</strong> <a href="tel:132" className="text-primary-600 dark:text-primary-400 hover:underline">132</a></p>
            
            <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700/50">
              <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Consulado-Geral do Brasil em Santiago</h4>
              <p><strong>Endereço:</strong> Los Militares 6191, Térreo, Las Condes, Santiago</p>
              <p><strong>Telefone (horário comercial):</strong> <a href="tel:+56228205800" className="text-primary-600 dark:text-primary-400 hover:underline">+56 2 2820-5800</a></p>
              <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30">
                <p>
                  <strong className="text-red-600 dark:text-red-400">Telefone de Plantão (EMERGÊNCIAS):</strong><br/>
                  <a href="tel:+56993345103" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">+56 9 9334-5103</a>
                </p>
                <span className="text-xs block text-slate-500 dark:text-slate-400 mt-1">Somente para emergências graves com cidadãos brasileiros (acidentes, mortes, prisões).</span>
              </div>
            </div>
        </div>
      </Modal>
    </>
  );
};