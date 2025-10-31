import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import { itineraryData } from '../data/itineraryData';
import { ProgressBar } from './ProgressBar';
import { Modal } from './Modal';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { EmptyCircleIcon } from './icons/EmptyCircleIcon';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import { InfoIcon } from './icons/InfoIcon';
import { MapPinIcon } from './icons/MapPinIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { AlertTriangleIcon } from './icons/AlertTriangleIcon';
import { MapComponent } from './MapComponent';
import { RoteiroIcon } from './icons/RoteiroIcon';

interface ItineraryProps {
  onLogout: () => void;
  isDarkMode: boolean;
  setIsDarkMode: (value: boolean) => void;
  isNight: boolean;
}

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
  const [isMapView, setIsMapView] = useState(false);
  
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    isLoading: false,
    content: { text: '', links: [] },
    error: ''
  });

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
    if (isMapView) setIsMapView(false);
  };

  const handleCheckItem = (dayIndex: number, eventIndex: number) => {
    const key = `${dayIndex}-${eventIndex}`;
    const newCheckedItems = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newCheckedItems);
    localStorage.setItem('santiagoItineraryProgress', JSON.stringify(newCheckedItems));
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
    <div className="space-y-3 p-2 sm:p-3">
      {itineraryData.map((day, dayIndex) => {
        const isOpen = openDayIndex === dayIndex;
        const DayIcon = day.icon;
        return (
          <div key={dayIndex} className={`bg-white/60 dark:bg-slate-800/60 backdrop-blur-md rounded-xl shadow-md overflow-hidden transition-all duration-300 border dark:border-slate-700/80 ${isOpen ? 'border-brand-500/50 ring-2 ring-brand-500/30' : 'border-gray-200'}`}>
            <div
              className="flex items-center p-3 cursor-pointer"
              onClick={() => handleToggleDay(dayIndex)}
              aria-expanded={isOpen}
              aria-controls={`day-${dayIndex}-content`}
              role="button"
            >
              <div className="mr-4 p-3 bg-gradient-to-br from-brand-500 to-brand-600 rounded-full shadow-lg">
                  <DayIcon className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                  <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">{`${day.day} – ${day.date}`}</h2>
                  <h3 className="font-semibold text-sm text-brand-700 dark:text-brand-400">{day.title}</h3>
              </div>
               <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenDayIndex(dayIndex);
                    setIsMapView(true);
                  }}
                  className="p-2 rounded-full hover:bg-gray-500/10 transition-colors mr-2"
                  aria-label={`Abrir mapa para ${day.title}`}
                  title={`Abrir mapa para ${day.title}`}
                >
                  <MapPinIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </button>
              <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            <div
              id={`day-${dayIndex}-content`}
              className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[1000px]' : 'max-h-0'}`}
            >
              <div className="px-3 pb-3">
                <ul className="space-y-1 border-t border-gray-200 dark:border-gray-700/50 pt-3">
                  {day.events.map((event, eventIndex) => {
                    const key = `${dayIndex}-${eventIndex}`;
                    const isChecked = !!checkedItems[key];
                    return (
                      <li
                        key={eventIndex}
                        className={`flex items-center gap-2 cursor-pointer p-1.5 rounded-lg transition-all duration-300 group ${isChecked ? 'bg-brand-50 text-gray-500 line-through dark:bg-brand-950/50 dark:text-gray-500' : 'hover:bg-gray-500/5 dark:hover:bg-white/10'}`}
                        onClick={() => handleCheckItem(dayIndex, eventIndex)}
                      >
                        <div>{isChecked ? <CheckCircleIcon /> : <EmptyCircleIcon />}</div>
                        <span className={`w-14 text-xs font-semibold ${isChecked ? 'text-gray-500' : 'text-gray-700 dark:text-gray-300'}`}>{event.time}</span>
                        <span className="flex-1 flex justify-between items-center text-sm text-gray-800 dark:text-gray-200">
                          {event.description}
                          <button
                            onClick={(e) => { e.stopPropagation(); handleGetInfo(event.description); }}
                            className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity ml-2 p-1 rounded-full hover:bg-gray-500/10 dark:hover:bg-white/10"
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
    if (isMapView && openDayIndex !== null) {
      return <MapComponent dayData={itineraryData[openDayIndex]} isDarkMode={isDarkMode} />;
    }
    return renderDayList();
  };

  return (
    <>
      <main className="relative z-10 w-full max-w-5xl h-[95vh] flex flex-col bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl text-gray-800 dark:text-gray-200 border border-white/30 dark:border-slate-700/50 rounded-2xl shadow-2xl overflow-hidden">
        <header className="p-4 sm:p-5 border-b border-white/30 dark:border-gray-700/50 flex justify-between items-center shrink-0">
          <h1 className="text-lg font-bold tracking-tight flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <CalendarIcon className="w-6 h-6" /> Roteiro Chile 🇨🇱
          </h1>
          <div className="flex items-center gap-2 sm:gap-3">
            {isMapView && (
               <button
                onClick={() => setIsMapView(false)}
                className="flex items-center gap-1.5 py-1.5 px-3 bg-white/80 dark:bg-slate-800/80 hover:bg-white dark:hover:bg-slate-700 text-brand-600 dark:text-brand-400 text-xs font-bold rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md"
                title="Ver lista de atividades"
              >
                <RoteiroIcon className="w-4 h-4" />
                <span className="hidden sm:inline">Ver Lista</span>
              </button>
            )}
            
            <button
              onClick={() => setIsEmergencyModalOpen(true)}
              className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 transition-colors"
              aria-label="Contatos de Emergência"
              title="Contatos de Emergência"
            >
              <AlertTriangleIcon className="w-5 h-5 text-red-600 dark:text-red-500" />
            </button>

            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full bg-gray-500/10 hover:bg-gray-500/20 dark:bg-white/10 dark:hover:bg-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Toggle dark mode"
              disabled={isNight}
              title={isNight ? "Modo escuro ativado automaticamente à noite" : "Alternar modo claro/escuro"}
            >
              {isDarkMode ? <SunIcon /> : <MoonIcon />}
            </button>
            <button
              onClick={onLogout}
              className="py-1.5 px-3 bg-white/90 hover:bg-white text-brand-600 text-xs font-bold rounded-xl transition duration-300 ease-in-out transform hover:-translate-y-0.5 shadow-md"
            >
              Sair
            </button>
          </div>
        </header>

        
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700/50 shrink-0">
            <ProgressBar progress={progress} quote={currentQuote} />
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
            {renderContent()}
        </div>
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
        <div className="space-y-2 text-gray-700 dark:text-gray-300 text-xs sm:text-sm">
            <p><strong>Polícia (Carabineros):</strong> <a href="tel:133" className="text-brand-600 dark:text-brand-400 hover:underline">133</a></p>
            <p><strong>Ambulância (SAMU):</strong> <a href="tel:131" className="text-brand-600 dark:text-brand-400 hover:underline">131</a></p>
            <p><strong>Bombeiros:</strong> <a href="tel:132" className="text-brand-600 dark:text-brand-400 hover:underline">132</a></p>
            
            <div className="pt-3 mt-3 border-t border-gray-200 dark:border-gray-700/50">
              <h4 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">Consulado-Geral do Brasil em Santiago</h4>
              <p><strong>Endereço:</strong> Los Militares 6191, Térreo, Las Condes, Santiago</p>
              <p><strong>Telefone (horário comercial):</strong> <a href="tel:+56228205800" className="text-brand-600 dark:text-brand-400 hover:underline">+56 2 2820-5800</a></p>
              <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30">
                <p>
                  <strong className="text-red-600 dark:text-red-400">Telefone de Plantão (EMERGÊNCIAS):</strong><br/>
                  <a href="tel:+56993345103" className="text-brand-600 dark:text-brand-400 hover:underline font-semibold">+56 9 9334-5103</a>
                </p>
                <span className="text-xs block text-gray-500 dark:text-gray-400 mt-1">Somente para emergências graves com cidadãos brasileiros (acidentes, mortes, prisões).</span>
              </div>
            </div>
        </div>
      </Modal>
    </>
  );
};