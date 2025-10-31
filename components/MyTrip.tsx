import React, { useState, useMemo } from 'react';
import { useTripItems, TripItem, Category } from '../hooks/useTripItems';
import { Modal } from './Modal';
import { FileTextIcon } from './icons/FileTextIcon';
import { BedIcon } from './icons/BedIcon';
import { TicketIcon } from './icons/TicketIcon';
import { PhoneIcon } from './icons/PhoneIcon';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';
import { DownloadIcon } from './icons/DownloadIcon';
import { PaperclipIcon } from './icons/PaperclipIcon';

const categoryConfig = {
    documentos: { title: 'Documentos', icon: FileTextIcon },
    reservas: { title: 'Reservas', icon: BedIcon },
    ingressos: { title: 'Ingressos', icon: TicketIcon },
    contatos: { title: 'Contatos', icon: PhoneIcon },
};

const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
    });
};

const ItemForm: React.FC<{
    item?: TripItem | null;
    category: Category;
    onSave: (item: Omit<TripItem, 'id'>) => void;
    onClose: () => void;
}> = ({ item, category, onSave, onClose }) => {
    const [title, setTitle] = useState(item?.title || '');
    const [description, setDescription] = useState(item?.description || '');
    const [date, setDate] = useState(item?.date || '');
    const [file, setFile] = useState<File | null>(null);
    const [existingFile, setExistingFile] = useState({ name: item?.fileName, type: item?.fileType, data: item?.fileData });

    const handleRemoveFile = () => {
        setFile(null);
        setExistingFile({ name: undefined, type: undefined, data: undefined });
        const fileInput = document.getElementById('file-upload') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        let filePayload: Partial<TripItem> = {};

        if (file) {
            filePayload = {
                fileName: file.name,
                fileType: file.type,
                fileData: await fileToBase64(file),
            };
        } else if (existingFile.name && existingFile.data) {
             filePayload = {
                fileName: existingFile.name,
                fileType: existingFile.type,
                fileData: existingFile.data,
            };
        } else {
             filePayload = {
                fileName: undefined,
                fileType: undefined,
                fileData: undefined,
            };
        }
        
        onSave({
            category,
            title,
            description,
            date,
            ...filePayload,
        });
        onClose();
    };

    const hasAttachment = file || existingFile.name;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Título" value={title} onChange={e => setTitle(e.target.value)} required className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none" />
            <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-brand-500 outline-none" />
            
            <div className="flex items-center justify-between gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-slate-700/50 p-2 rounded-md">
                <div className="flex items-center gap-2 truncate">
                    <PaperclipIcon className="w-5 h-5 flex-shrink-0" />
                    <label htmlFor="file-upload" className="cursor-pointer text-brand-600 dark:text-brand-400 hover:underline truncate">
                         {file ? file.name : (existingFile.name || "Anexar arquivo")}
                    </label>
                    <input id="file-upload" type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="hidden" />
                </div>
                {hasAttachment && (
                    <button type="button" onClick={handleRemoveFile} className="p-1 rounded-full hover:bg-red-500/10 flex-shrink-0" title="Remover anexo">
                        <TrashIcon className="w-4 h-4 text-red-500" />
                    </button>
                )}
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-semibold rounded-lg hover:bg-gray-500/10 dark:hover:bg-white/10">Cancelar</button>
                <button type="submit" className="py-2 px-4 bg-brand-600 text-white text-sm font-semibold rounded-lg hover:bg-brand-700">Salvar</button>
            </div>
        </form>
    );
};


const TripItemCard: React.FC<{
    item: TripItem;
    onEdit: (item: TripItem) => void;
    onDelete: (id: string) => void;
}> = ({ item, onEdit, onDelete }) => {
    
    const handleDownload = () => {
        if (!item.fileData || !item.fileName) return;
        const link = document.createElement('a');
        link.href = item.fileData;
        link.download = item.fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-white/70 dark:bg-slate-800/70 p-4 rounded-lg shadow-sm border dark:border-slate-700 flex flex-col justify-between">
            <div>
                <h4 className="font-bold text-gray-800 dark:text-gray-200">{item.title}</h4>
                {item.date && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{new Date(item.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>}
                <p className="text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">{item.description}</p>
            </div>
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200 dark:border-slate-700/50">
                {item.fileData && (
                    <button onClick={handleDownload} title={`Baixar ${item.fileName}`} className="flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 hover:underline">
                        <DownloadIcon className="w-4 h-4" /> Anexo
                    </button>
                )}
                 <div className="ml-auto flex items-center gap-1">
                    <button onClick={() => onEdit(item)} className="p-2 rounded-full hover:bg-gray-500/10" title="Editar"><EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /></button>
                    <button onClick={() => onDelete(item.id)} className="p-2 rounded-full hover:bg-red-500/10" title="Excluir"><TrashIcon className="w-4 h-4 text-red-500" /></button>
                </div>
            </div>
        </div>
    );
};

export const MyTrip: React.FC = () => {
    const { getItemsByCategory, addItem, updateItem, deleteItem, isLoading } = useTripItems();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<TripItem | null>(null);
    const [activeCategory, setActiveCategory] = useState<Category | null>(null);

    const handleAddItem = (category: Category) => {
        setActiveCategory(category);
        setEditingItem(null);
        setIsModalOpen(true);
    };

    const handleEditItem = (item: TripItem) => {
        setActiveCategory(item.category);
        setEditingItem(item);
        setIsModalOpen(true);
    };

    const handleSaveItem = (itemData: Omit<TripItem, 'id'>) => {
        if (editingItem) {
            updateItem(editingItem.id, itemData);
        } else {
            addItem(itemData);
        }
    };
    
    const handleDeleteItem = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este item?")) {
            deleteItem(id);
        }
    };

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Carregando seus itens...</div>
    }

    return (
        <div className="p-4 space-y-6">
            {(Object.keys(categoryConfig) as Category[]).map(categoryKey => {
                const { title, icon: Icon } = categoryConfig[categoryKey];
                const items = getItemsByCategory(categoryKey);

                return (
                    <section key={categoryKey}>
                        <div className="flex justify-between items-center mb-3">
                            <h3 className="flex items-center gap-2 font-bold text-lg text-gray-800 dark:text-gray-200">
                                <Icon className="w-6 h-6 text-brand-600 dark:text-brand-400" />
                                {title}
                            </h3>
                            <button onClick={() => handleAddItem(categoryKey)} className="flex items-center gap-1.5 text-sm font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-500 p-2 rounded-lg hover:bg-brand-500/10">
                                <PlusCircleIcon className="w-5 h-5" /> Adicionar
                            </button>
                        </div>
                        {items.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {items.map(item => (
                                    <TripItemCard key={item.id} item={item} onEdit={handleEditItem} onDelete={handleDeleteItem} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center p-6 bg-gray-500/5 dark:bg-white/5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                                <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum item adicionado nesta categoria.</p>
                            </div>
                        )}
                    </section>
                )
            })}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingItem ? `Editar ${categoryConfig[editingItem.category].title}` : `Adicionar ${activeCategory ? categoryConfig[activeCategory].title : ''}`}
            >
                {activeCategory && (
                    <ItemForm
                        item={editingItem}
                        category={activeCategory}
                        onSave={handleSaveItem}
                        onClose={() => setIsModalOpen(false)}
                    />
                )}
            </Modal>
        </div>
    );
};