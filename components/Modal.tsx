import React from 'react';

interface Link {
  uri: string;
  title: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  isLoading?: boolean;
  error?: string;
  content?: {
    text: string;
    links: Link[];
  };
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title = "Informações Adicionais", children, isLoading, error, content }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div 
        className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col transform transition-all duration-300 scale-95 opacity-0 animate-fade-in-scale"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
          <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">{title}</h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition p-1 rounded-full"
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto text-sm">
          {children ?? (
            <>
              {isLoading && (
                <div className="flex justify-center items-center flex-col gap-4 py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
                  <p className="text-slate-600 dark:text-slate-400">Buscando informações...</p>
                </div>
              )}
              {error && <p className="text-red-500 text-center font-medium">{error}</p>}
              {!isLoading && !error && content && (
                <div>
                  <p className="whitespace-pre-wrap text-slate-700 dark:text-slate-300">{content.text}</p>
                  {content.links.length > 0 && (
                    <div className="mt-6 pt-4 border-t dark:border-slate-700">
                      <h4 className="font-semibold mb-2 text-slate-800 dark:text-slate-200">Links úteis:</h4>
                      <ul className="list-disc list-inside space-y-2">
                        {content.links.map((link, index) => (
                          <li key={index}>
                            <a href={link.uri} target="_blank" rel="noopener noreferrer" className="text-brand-600 hover:underline hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300">
                              {link.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <style>{`
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in-scale {
          animation: fadeInScale 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};