import React, { useState } from 'react';
import { ChileFlagIcon } from './icons/ChileFlagIcon';
import { BrazilFlagIcon } from './icons/BrazilFlagIcon';

// Fixed exchange rate: 1 BRL = 175 CLP
const BRL_TO_CLP_RATE = 175;

// Helper to parse numbers that might use a comma for the decimal point
const parseCurrency = (value: string): number => {
    if (!value) return 0;
    // Allow only numbers and a single comma or dot
    const sanitizedValue = value.replace(/[^0-9,.]/g, '').replace(',', '.');
    return parseFloat(sanitizedValue) || 0;
};


export const CurrencyConverter: React.FC = () => {
    const [clpAmount, setClpAmount] = useState('1000');
    const [brlAmount, setBrlAmount] = useState((1000 / BRL_TO_CLP_RATE).toFixed(2));

    const handleClpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setClpAmount(value);
        const clpValue = parseCurrency(value);
        setBrlAmount(clpValue > 0 ? (clpValue / BRL_TO_CLP_RATE).toFixed(2) : '');
    };

    const handleBrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBrlAmount(value);
        const brlValue = parseCurrency(value);
        setClpAmount(brlValue > 0 ? (brlValue * BRL_TO_CLP_RATE).toFixed(2) : '');
    };

    return (
        <div className="p-4 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Conversor de Moeda</h3>
            <div className="space-y-4 animate-fade-in">
                <div className="text-center bg-slate-100 dark:bg-slate-700/50 p-3 rounded-lg">
                    <p className="font-bold text-slate-800 dark:text-slate-200">
                        Cotação Fixa: 1 BRL = {BRL_TO_CLP_RATE} CLP
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                       Valores para referência.
                    </p>
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
                                type="text"
                                inputMode="decimal"
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
                                type="text"
                                inputMode="decimal"
                                value={brlAmount}
                                onChange={handleBrlChange}
                                placeholder="0,00"
                                className="w-full pl-10 pr-4 py-3 text-lg font-bold bg-white dark:bg-slate-800 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-primary-400 outline-none"
                            />
                        </div>
                    </div>
                </div>
            </div>
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