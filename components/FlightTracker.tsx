import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { FlightIcon } from './icons/FlightIcon';
import { PlaneTakeoffIcon } from './icons/PlaneTakeoffIcon';

interface FlightInfo {
    airline: string;
    flightNumber: string;
    status: string;
    departure: {
        airport: string;
        iata: string;
        terminal?: string;
        gate?: string;
        scheduledTime: string;
        actualTime?: string;
    };
    arrival: {
        airport: string;
        iata: string;
        terminal?: string;
        gate?: string;
        scheduledTime: string;
        actualTime?: string;
    };
}

const formatTime = (isoString?: string) => {
    if (!isoString) return '--:--';
    try {
        // Adjusting for local timezone display. Assuming API provides UTC or timezone-aware strings.
        return new Date(isoString).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch {
        return '--:--';
    }
};

const getStatusClasses = (status: string) => {
    const s = status.toLowerCase();
    if (s.includes('horário') || s.includes('on time')) {
        return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    }
    if (s.includes('atrasado') || s.includes('delayed')) {
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    }
    if (s.includes('cancelado') || s.includes('cancelled')) {
        return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    }
    return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
};

const getFlightProgress = (status: string): number => {
    const s = status.toLowerCase();
    if (s.includes('pousou') || s.includes('landed') || s.includes('chegou') || s.includes('arrived')) return 100;
    if (s.includes('em voo') || s.includes('in air')) return 50;
    if (s.includes('decolou') || s.includes('departed')) return 20;
    if (s.includes('atrasado') || s.includes('delayed')) return 10;
    if (s.includes('no portão') || s.includes('at gate')) return 5;
    return 0;
}

const flightStatusSchema = {
    type: Type.OBJECT,
    description: "Contém informações detalhadas e em tempo real sobre um voo específico.",
    properties: {
        airline: { type: Type.STRING, description: "Nome completo da companhia aérea (ex: LATAM Airlines)." },
        flightNumber: { type: Type.STRING, description: "Apenas o número do voo, sem o código da companhia (ex: 606)." },
        status: { type: Type.STRING, description: "Status atual do voo. Exemplos: 'No Horário', 'Atrasado', 'Em Voo', 'Pousou', 'Cancelado'." },
        departure: {
            type: Type.OBJECT,
            description: "Detalhes sobre a partida do voo.",
            properties: {
                airport: { type: Type.STRING, description: "Nome completo do aeroporto de partida." },
                iata: { type: Type.STRING, description: "Código IATA de 3 letras do aeroporto de partida (ex: GRU)." },
                terminal: { type: Type.STRING, description: "Terminal de partida. Retornar string vazia se não disponível." },
                gate: { type: Type.STRING, description: "Portão de embarque. Retornar string vazia se não disponível." },
                scheduledTime: { type: Type.STRING, description: "Horário de partida programado, em formato ISO 8601 UTC." },
                actualTime: { type: Type.STRING, description: "Horário de partida real ou estimado, em formato ISO 8601 UTC. Retornar string vazia se não disponível." },
            },
            required: ['airport', 'iata', 'scheduledTime']
        },
        arrival: {
            type: Type.OBJECT,
            description: "Detalhes sobre a chegada do voo.",
            properties: {
                airport: { type: Type.STRING, description: "Nome completo do aeroporto de chegada." },
                iata: { type: Type.STRING, description: "Código IATA de 3 letras do aeroporto de chegada (ex: SCL)." },
                terminal: { type: Type.STRING, description: "Terminal de chegada. Retornar string vazia se não disponível." },
                gate: { type: Type.STRING, description: "Portão de desembarque. Retornar string vazia se não disponível." },
                scheduledTime: { type: Type.STRING, description: "Horário de chegada programado, em formato ISO 8601 UTC." },
                actualTime: { type: Type.STRING, description: "Horário de chegada real ou estimado, em formato ISO 8601 UTC. Retornar string vazia se não disponível." },
            },
            required: ['airport', 'iata', 'scheduledTime']
        },
    },
    required: ['airline', 'flightNumber', 'status', 'departure', 'arrival']
};

export const FlightTracker: React.FC = () => {
    const [flightNumber, setFlightNumber] = useState('LA606');
    const [flightData, setFlightData] = useState<FlightInfo | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTrackFlight = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!flightNumber) {
            setError('Por favor, insira um número de voo.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setFlightData(null);

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: `Com base nas informações de voo mais recentes disponíveis publicamente, forneça os detalhes do voo ${flightNumber}. Sua resposta deve ser um objeto JSON que corresponda exatamente ao schema fornecido. Priorize a precisão em tempo real para status, portões e horários.`,
                config: {
                    responseMimeType: "application/json",
                    responseSchema: flightStatusSchema,
                },
            });
            
            const jsonText = response.text.trim();
            const data = JSON.parse(jsonText);
            setFlightData(data);

        } catch (err) {
            console.error("Error tracking flight:", err);
            setError('Não foi possível encontrar informações para este voo. Verifique o número e tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-4 border-b border-slate-200 dark:border-slate-700/50">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Monitoramento de Voo</h3>
            <form onSubmit={handleTrackFlight} className="flex items-center gap-2">
                <input
                    type="text"
                    value={flightNumber}
                    onChange={e => setFlightNumber(e.target.value.toUpperCase())}
                    placeholder="Ex: LA606"
                    className="flex-1 p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none placeholder:text-slate-400"
                />
                <button type="submit" disabled={isLoading} className="py-2 px-4 bg-gradient-to-r from-secondary-500 to-secondary-600 text-white text-sm font-semibold rounded-lg hover:from-secondary-600 hover:to-secondary-700 disabled:opacity-50 disabled:cursor-wait">
                    {isLoading ? 'Buscando...' : 'Rastrear'}
                </button>
            </form>

            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-400"></div>
                </div>
            )}
            {error && <p className="text-red-500 text-center text-sm font-medium">{error}</p>}
            
            {flightData && (
                 <div className="bg-white/50 dark:bg-slate-800/50 rounded-lg p-4 border dark:border-slate-700 animate-fade-in">
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <p className="text-xs text-slate-500 dark:text-slate-400">{flightData.airline}</p>
                            <h4 className="font-bold text-lg text-slate-800 dark:text-slate-200">{flightData.departure.iata} → {flightData.arrival.iata}</h4>
                        </div>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full ${getStatusClasses(flightData.status)}`}>
                            {flightData.status}
                        </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 mb-4">
                        <div className="text-center">
                            <p className="font-bold text-2xl text-slate-700 dark:text-slate-300">{flightData.departure.iata}</p>
                        </div>
                        <div className="flex-1 flex items-center">
                            <div className="w-full h-1 bg-slate-300 dark:bg-slate-600 rounded-full relative">
                                <div className="absolute -top-2.5 transition-all duration-1000" style={{ left: `calc(${getFlightProgress(flightData.status)}% - 12px)` }}>
                                    <FlightIcon className="w-6 h-6 text-primary-500 transform -rotate-45" />
                                </div>
                            </div>
                        </div>
                        <div className="text-center">
                             <p className="font-bold text-2xl text-slate-700 dark:text-slate-300">{flightData.arrival.iata}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="space-y-2">
                             <div className="flex items-start gap-2">
                                <PlaneTakeoffIcon className="w-5 h-5 text-secondary-500 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">Partida</p>
                                    <p className="text-slate-600 dark:text-slate-400">{flightData.departure.airport}</p>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {flightData.departure.terminal && `Terminal ${flightData.departure.terminal}, `}
                                        {flightData.departure.gate && `Portão ${flightData.departure.gate}`}
                                    </p>
                                    <p className="text-slate-500 dark:text-slate-400/80">
                                        Prog: {formatTime(flightData.departure.scheduledTime)}
                                        {flightData.departure.actualTime && <span className="font-bold text-secondary-600 dark:text-secondary-400 ml-2">{formatTime(flightData.departure.actualTime)}</span>}
                                    </p>
                                </div>
                             </div>
                        </div>
                         <div className="space-y-2 text-right">
                             <div className="flex items-start justify-end gap-2">
                                <div>
                                    <p className="font-semibold text-slate-800 dark:text-slate-200">Chegada</p>
                                    <p className="text-slate-600 dark:text-slate-400">{flightData.arrival.airport}</p>
                                    <p className="text-slate-600 dark:text-slate-400">
                                        {flightData.arrival.terminal && `Terminal ${flightData.arrival.terminal}, `}
                                        {flightData.arrival.gate && `Portão ${flightData.arrival.gate}`}
                                    </p>
                                     <p className="text-slate-500 dark:text-slate-400/80">
                                        Prog: {formatTime(flightData.arrival.scheduledTime)}
                                        {flightData.arrival.actualTime && <span className="font-bold text-secondary-600 dark:text-secondary-400 ml-2">{formatTime(flightData.arrival.actualTime)}</span>}
                                    </p>
                                </div>
                                <FlightIcon className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
                             </div>
                        </div>
                    </div>
                </div>
            )}
            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fadeIn 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
};
