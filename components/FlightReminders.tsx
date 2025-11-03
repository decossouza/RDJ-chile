import React, { useState, useEffect } from 'react';
import { useFlightReminders, FlightReminder, FlightType } from '../hooks/useFlightReminders';
import { Modal } from './Modal';
import { PlusCircleIcon } from './icons/PlusCircleIcon';
import { EditIcon } from './icons/EditIcon';
import { TrashIcon } from './icons/TrashIcon';

const ReminderForm: React.FC<{
    reminder?: FlightReminder | null;
    onSave: (reminder: Omit<FlightReminder, 'id' | 'notified'>) => void;
    onClose: () => void;
}> = ({ reminder, onSave, onClose }) => {
    const [type, setType] = useState<FlightType>(reminder?.type || 'departure');
    const [flightNumber, setFlightNumber] = useState(reminder?.flightNumber || '');
    const [dateTime, setDateTime] = useState(reminder ? reminder.dateTime.substring(0, 16) : '');
    const [reminderMinutes, setReminderMinutes] = useState(reminder?.reminderMinutes || 180);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            type,
            flightNumber,
            dateTime: new Date(dateTime).toISOString(),
            reminderMinutes: Number(reminderMinutes),
        });
        onClose();
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <select value={type} onChange={e => setType(e.target.value as FlightType)} className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none">
                <option value="departure">Saída</option>
                <option value="arrival">Chegada</option>
            </select>
            <input type="text" placeholder="Número do Voo (ex: LA8011)" value={flightNumber} onChange={e => setFlightNumber(e.target.value)} required className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none" />
            <input type="datetime-local" value={dateTime} onChange={e => setDateTime(e.target.value)} required className="w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none" />
            
            <div>
                <label htmlFor="reminderMinutes" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lembrar com antecedência:</label>
                <select id="reminderMinutes" value={reminderMinutes} onChange={e => setReminderMinutes(Number(e.target.value))} className="mt-1 w-full p-2 bg-gray-100 dark:bg-slate-700 rounded-md border border-gray-300 dark:border-slate-600 focus:ring-2 focus:ring-secondary-400 outline-none">
                    <option value={30}>30 minutos</option>
                    <option value={60}>1 hora</option>
                    <option value={120}>2 horas</option>
                    <option value={180}>3 horas</option>
                    <option value={240}>4 horas</option>
                </select>
            </div>

            <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={onClose} className="py-2 px-4 text-sm font-semibold rounded-lg hover:bg-gray-500/10 dark:hover:bg-white/10">Cancelar</button>
                <button type="submit" className="py-2 px-4 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-semibold rounded-lg hover:from-primary-600 hover:to-primary-700">Salvar</button>
            </div>
        </form>
    );
};

const ReminderCard: React.FC<{
    reminder: FlightReminder;
    onEdit: (reminder: FlightReminder) => void;
    onDelete: (id: string) => void;
}> = ({ reminder, onEdit, onDelete }) => {
    const isPast = new Date(reminder.dateTime) < new Date();
    const reminderTime = new Date(new Date(reminder.dateTime).getTime() - reminder.reminderMinutes * 60000);

    return (
        <div className={`p-4 rounded-lg shadow-sm border dark:border-slate-700 flex flex-col justify-between transition-opacity ${isPast ? 'opacity-50 bg-gray-100 dark:bg-slate-800/50' : 'bg-white dark:bg-slate-800'}`}>
            <div>
                <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-800 dark:text-gray-200">{reminder.type === 'departure' ? 'Saída' : 'Chegada'}: {reminder.flightNumber}</h4>
                    {isPast && <span className="text-xs font-semibold text-white bg-slate-500 rounded-full px-2 py-0.5">Concluído</span>}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-300">{new Date(reminder.dateTime).toLocaleString('pt-BR', { dateStyle: 'full', timeStyle: 'short' })}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400 mt-1">Lembrete às: {reminderTime.toLocaleTimeString('pt-BR', { timeStyle: 'short' })}</p>
            </div>
            <div className="flex items-center justify-end gap-1 mt-3 pt-3 border-t border-gray-200 dark:border-slate-700/50">
                <button onClick={() => onEdit(reminder)} className="p-2 rounded-full hover:bg-gray-500/10" title="Editar"><EditIcon className="w-4 h-4 text-gray-600 dark:text-gray-400" /></button>
                <button onClick={() => onDelete(reminder.id)} className="p-2 rounded-full hover:bg-red-500/10" title="Excluir"><TrashIcon className="w-4 h-4 text-red-500" /></button>
            </div>
        </div>
    );
};


export const FlightReminders: React.FC = () => {
    const { reminders, addReminder, updateReminder, deleteReminder, isLoading } = useFlightReminders();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingReminder, setEditingReminder] = useState<FlightReminder | null>(null);
    const [notificationPermission, setNotificationPermission] = useState('default');

     useEffect(() => {
        if (typeof Notification !== 'undefined') {
             setNotificationPermission(Notification.permission);
        }
    }, []);

    const requestNotificationPermission = () => {
        if (typeof Notification === 'undefined') {
            alert('Este navegador não suporta notificações.');
            return;
        }
        Notification.requestPermission().then(permission => {
            setNotificationPermission(permission);
        });
    };

    const handleAddReminder = () => {
        setEditingReminder(null);
        setIsModalOpen(true);
    };

    const handleEditReminder = (reminder: FlightReminder) => {
        setEditingReminder(reminder);
        setIsModalOpen(true);
    };

    const handleSaveReminder = (reminderData: Omit<FlightReminder, 'id' | 'notified'>) => {
        if (editingReminder) {
            updateReminder(editingReminder.id, reminderData);
        } else {
            addReminder(reminderData);
        }
    };
    
    const handleDeleteReminder = (id: string) => {
        if (window.confirm("Tem certeza que deseja excluir este lembrete?")) {
            deleteReminder(id);
        }
    };
    
    const sortedReminders = [...reminders].sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    if (isLoading) {
        return <div className="p-6 text-center text-gray-500 dark:text-gray-400">Carregando lembretes...</div>;
    }

    return (
        <div className="p-4 space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">Lembretes de Voo</h3>
                <button onClick={handleAddReminder} className="flex items-center gap-1.5 text-sm font-semibold text-secondary-600 dark:text-secondary-400 hover:text-secondary-500 p-2 rounded-lg hover:bg-secondary-500/10">
                    <PlusCircleIcon className="w-5 h-5" /> Adicionar
                </button>
            </div>
            
            {notificationPermission !== 'granted' && (
                 <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-500/30 text-yellow-800 dark:text-yellow-200 text-sm">
                    <p className="font-semibold mb-2">Notificações desativadas</p>
                    <p className="mb-3">Para receber os lembretes, você precisa permitir as notificações no seu navegador.</p>
                    <button onClick={requestNotificationPermission} className="py-1 px-3 bg-yellow-400/50 text-yellow-900 font-bold rounded-md hover:bg-yellow-400/70">Ativar notificações</button>
                </div>
            )}

            {reminders.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sortedReminders.map(reminder => (
                        <ReminderCard key={reminder.id} reminder={reminder} onEdit={handleEditReminder} onDelete={handleDeleteReminder} />
                    ))}
                </div>
            ) : (
                <div className="text-center p-6 bg-gray-500/5 dark:bg-white/5 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nenhum lembrete de voo adicionado.</p>
                </div>
            )}

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingReminder ? 'Editar Lembrete' : 'Adicionar Lembrete'}
            >
                <ReminderForm
                    reminder={editingReminder}
                    onSave={handleSaveReminder}
                    onClose={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};
