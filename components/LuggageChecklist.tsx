import React, { useState, useEffect, useMemo } from 'react';
import { luggageData } from '../data/luggageData';
import { ProgressBar } from './ProgressBar';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { EmptyCircleIcon } from './icons/EmptyCircleIcon';
import { ChevronDownIcon } from './icons/ChevronDownIcon';

export const LuggageChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<{ [key: string]: boolean }>({});
  const [openCategoryIndex, setOpenCategoryIndex] = useState<number | null>(0);

  useEffect(() => {
    try {
      const savedProgress = localStorage.getItem('santiagoLuggageChecklist');
      if (savedProgress) {
        setCheckedItems(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error("Failed to parse luggage progress from localStorage", error);
    }
  }, []);

  const handleToggleCategory = (index: number) => {
    setOpenCategoryIndex(openCategoryIndex === index ? null : index);
  };

  const handleCheckItem = (categoryIndex: number, subCategoryIndex: number, itemIndex: number) => {
    const key = `${categoryIndex}-${subCategoryIndex}-${itemIndex}`;
    const newCheckedItems = { ...checkedItems, [key]: !checkedItems[key] };
    setCheckedItems(newCheckedItems);
    localStorage.setItem('santiagoLuggageChecklist', JSON.stringify(newCheckedItems));
  };

  const { totalItems, completedItems, progress } = useMemo(() => {
    const total = luggageData.reduce((acc, category) =>
      acc + category.subcategories.reduce((subAcc, sub) => subAcc + sub.items.length, 0), 0);
    const completed = Object.values(checkedItems).filter(Boolean).length;
    const prog = total > 0 ? (completed / total) * 100 : 0;
    return { totalItems: total, completedItems: completed, progress: prog };
  }, [checkedItems]);
  
  const quote = progress === 100 ? "Tudo pronto para a viagem!" : `Faltam ${totalItems - completedItems} itens.`;

  return (
    <div>
        <div className="p-4 sm:p-5 border-b border-gray-200 dark:border-gray-700/50 shrink-0">
            <ProgressBar progress={progress} quote={quote} />
        </div>
        <div className="space-y-3 p-2 sm:p-3">
        {luggageData.map((category, categoryIndex) => {
            const isOpen = openCategoryIndex === categoryIndex;
            return (
            <div key={categoryIndex} className="bg-gradient-to-br from-white/60 to-gray-50/60 dark:from-slate-800/60 dark:to-slate-900/50 backdrop-blur-sm rounded-xl shadow-md overflow-hidden transition-all duration-300 border dark:border-slate-700/80">
                <div
                className="flex items-center p-4 cursor-pointer"
                onClick={() => handleToggleCategory(categoryIndex)}
                >
                <div className="flex-1">
                    <h2 className="font-bold text-base text-gray-900 dark:text-gray-100">{category.title}</h2>
                </div>
                <ChevronDownIcon className={`transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                </div>
                <div
                    className={`transition-all duration-500 ease-in-out overflow-hidden ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
                >
                    <div className="px-4 pb-4">
                        {category.subcategories.map((sub, subCategoryIndex) => (
                            <div key={subCategoryIndex} className="pt-3 border-t border-gray-200 dark:border-gray-700/50 first:border-t-0 first:pt-0">
                                <h3 className="font-semibold text-sm text-brand-700 dark:text-brand-400 mb-2">{sub.title}</h3>
                                <ul className="space-y-1">
                                    {sub.items.map((item, itemIndex) => {
                                        const key = `${categoryIndex}-${subCategoryIndex}-${itemIndex}`;
                                        const isChecked = !!checkedItems[key];
                                        return (
                                            <li
                                                key={itemIndex}
                                                className={`flex items-center gap-3 cursor-pointer p-1.5 rounded-lg transition-all duration-300 ${isChecked ? 'text-gray-500 line-through dark:text-gray-500' : 'hover:bg-gray-500/5 dark:hover:bg-white/10'}`}
                                                onClick={() => handleCheckItem(categoryIndex, subCategoryIndex, itemIndex)}
                                            >
                                                <div>{isChecked ? <CheckCircleIcon /> : <EmptyCircleIcon />}</div>
                                                <span className="flex-1 text-sm text-gray-800 dark:text-gray-200">{item.name}</span>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            );
        })}
        </div>
    </div>
  );
};
