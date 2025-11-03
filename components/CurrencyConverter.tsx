import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { ChileFlagIcon } from './icons/ChileFlagIcon';
import { BrazilFlagIcon } from './icons/BrazilFlagIcon';

const exchangeRateSchema = {
    type: Type.OBJECT,
    properties: {
        rate: {
            type: Type.NUMBER,
            description: "A taxa de câmbio de 1 Peso Chileno (CLP) para Real Brasileiro (BRL). Apenas o número."
        },
    },
    required: ['rate']
};

export const CurrencyConverter: React.FC = () => {
    const [clpAmount, setClpAmount] = useState('1000');
    const [brlAmount, setBrlAmount] = useState('');
    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
    const [isBrlLastEdited, setIsBrlLastEdited] = useState(false);

    const fetchRate = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: "Qual é a taxa de câmbio atual de Peso Chileno (CLP) para Real Brasileiro (BRL)?",
                config: {
                    responseMimeType: "application/json",
                    responseSchema: exchangeRateSchema,
                },
            });

            const data = JSON.parse(response.text.trim());
            if (data.rate && typeof data.rate === 'number') {
                setExchangeRate(data.rate);
                setLastUpdated(new Date());
            } else {
                throw new Error("Resposta da API inválida.");
            }
        } catch (err) {
            console.error("Error fetching exchange rate:", err);
            setError("Não foi possível buscar a taxa de câmbio. Tente novamente.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRate();
    }, [fetchRate]);
    
    useEffect(() => {
        if (exchangeRate !== null) {
            if (isBrlLastEdited) {
                const brl = parseFloat(brlAmount) || 0;
                const clp = brl / exchangeRate;
                setClpAmount(brl > 0 ? clp.toFixed(2) : '');
            } else {
                const clp = parseFloat(clpAmount) || 0;
                const brl = clp * exchangeRate;
                setBrlAmount(clp > 0 ? brl.toFixed(2) : '');
            }
        }
    }, [exchangeRate]);


    const handleClpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClpAmount(value);
        setIsBrlLastEdited(false);

        if (exchangeRate !== null) {
            const clpValue = parseFloat(value);
            if (!isNaN(clpValue)) {
                setBrlAmount((clpValue * exchangeRate).toFixed(2));
            } else {
                setBrlAmount('');
            }
        }
    };

    const handleBrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBrlAmount(value);
        setIsBrlLastEdited(true);

        if (exchangeRate !== null) {
            const brlValue = parseFloat(value);
            if (!isNaN(brlValue)) {
                setClpAmount((brlValue / exchangeRate).toFixed(2));
            } else {
                setClpAmount('');
            }
        }
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Conversor de Moeda</h3>
            {isLoading && (
                <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary-400"></div>
                </div>
            )}
            {error && !isLoading && (
                 <div className="text-center p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-500/30 rounded-lg">
                    <p className="text-red-700 dark:text-red-300 text-sm mb-3">{error}</p>
                    <button onClick={fetchRate} className="py-1.5 px-4 bg-secondary-500 text-white text-xs font-bold rounded-lg hover:bg-secondary-600">
                        Tentar Novamente
                    </button>
                </div>
            )}
            {exchangeRate !== null && !isLoading && (
                <div className="space-y-4 animate-fade-in">
                    <div className="text-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                            1 CLP ≈ {exchangeRate.toFixed(4)} BRL
                        </p>
                        {lastUpdated && <p className="text-xs text-slate-500 dark:text-slate-400">
                           Última atualização: {lastUpdated.toLocaleTimeString('pt-BR')}
                        </p>}
                    </div>

                    <div className="space-y-3">
                        <div>
                            <label htmlFor="clp" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                <ChileFlagIcon /> Peso Chileno (CLP)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">$</span>
                                <input
                                    id="clp"
                                    type="number"
                                    value={clpAmount}
                                    onChange={handleClpChange}
                                    placeholder="1000"
                                    className="w-full pl-7 pr-4 py-3 text-lg font-bold bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none"
                                />
                            </div>
                        </div>
                        <div>
                             <label htmlFor="brl" className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
                                <BrazilFlagIcon /> Real Brasileiro (BRL)
                            </label>
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">R$</span>
                                <input
                                    id="brl"
                                    type="number"
                                    value={brlAmount}
                                    onChange={handleBrlChange}
                                    placeholder="0,00"
                                    className="w-full pl-10 pr-4 py-3 text-lg font-bold bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-400 outline-none"
                                />
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
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                  -webkit-appearance: none; 
                  margin: 0; 
                }
                input[type=number] {
                  -moz-appearance: textfield;
                }
            `}</style>
        </div>
    );
};
