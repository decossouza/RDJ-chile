import React from 'react';
import { PlaneIcon } from '../components/icons/PlaneIcon';
import { BuildingIcon } from '../components/icons/BuildingIcon';
import { PawPrintIcon } from '../components/icons/PawPrintIcon';
import { ShipIcon } from '../components/icons/ShipIcon';
import { MountainIcon } from '../components/icons/MountainIcon';
import { CableCarIcon } from '../components/icons/CableCarIcon';
import { ShoppingBagIcon } from '../components/icons/ShoppingBagIcon';
import { HeartIcon } from '../components/icons/HeartIcon';

interface Location {
  lat: number;
  lng: number;
}
interface Event {
  time: string;
  description: string;
  location?: Location;
}

interface ItineraryDay {
  day: string;
  date: string;
  title: string;
  icon: React.FC<{ className?: string }>;
  events: Event[];
}

export const itineraryData: ItineraryDay[] = [
  {
    day: 'Dia 1',
    date: '10/12 (quarta-feira)',
    title: 'Chegada',
    icon: PlaneIcon,
    events: [
      { time: '16:25', description: 'Saída SP (GRU)', location: { lat: -23.4356, lng: -46.4731 } },
      { time: '20:40', description: 'Chegada Santiago (SCL)', location: { lat: -33.3930, lng: -70.7858 } },
      { time: '21:30', description: 'Check-in no hotel', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '22:00', description: 'Jantar leve próximo ao hotel', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '23:00', description: 'Descanso' }
    ]
  },
  {
    day: 'Dia 2',
    date: '11/12 (quinta-feira)',
    title: 'Santiago Centro',
    icon: BuildingIcon,
    events: [
      { time: '08:00', description: 'Café da manhã no hotel', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Plaza de Armas & Catedral Metropolitana', location: { lat: -33.4379, lng: -70.6504 } },
      { time: '10:30', description: 'Museu Interativo Mirador (diversão para Joe)', location: { lat: -33.5188, lng: -70.6094 } },
      { time: '13:00', description: 'Almoço no Mercado Central', location: { lat: -33.4332, lng: -70.6508 } },
      { time: '14:30', description: 'Tarde no Cerro Santa Lucía', location: { lat: -33.4397, lng: -70.6425 } },
      { time: '17:30', description: 'Retorno ao hotel / descanso' },
      { time: '19:30', description: 'Jantar no Pátio Bellavista', location: { lat: -33.4326, lng: -70.6335 } },
      { time: '21:30', description: 'Retorno ao hotel' }
    ]
  },
  {
    day: 'Dia 3',
    date: '12/12 (sexta-feira)',
    title: 'Safari Santiago',
    icon: PawPrintIcon,
    events: [
      { time: '07:30', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '08:30', description: 'Saída para Safari Santiago', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Chegada e início do passeio', location: { lat: -34.1539, lng: -70.8359 } },
      { time: '12:30', description: 'Almoço no Safari' },
      { time: '15:30', description: 'Área kids / interação com animais' },
      { time: '17:30', description: 'Retorno ao hotel', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '19:30', description: 'Jantar leve próximo ao hotel' }
    ]
  },
  {
    day: 'Dia 4',
    date: '13/12 (sábado)',
    title: 'Valparaíso & Viña del Mar',
    icon: ShipIcon,
    events: [
      { time: '07:00', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '07:30', description: 'Saída para Valparaíso' },
      { time: '09:30', description: 'Caminhada pelos murais e casas coloridas', location: { lat: -33.0458, lng: -71.6197 } },
      { time: '12:30', description: 'Almoço com vista para o mar' },
      { time: '14:00', description: 'Passeio pela orla e praias de Viña del Mar', location: { lat: -33.0246, lng: -71.5518 } },
      { time: '17:00', description: 'Retorno para Santiago', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '19:30', description: 'Jantar leve / descanso no hotel' }
    ]
  },
  {
    day: 'Dia 5',
    date: '14/12 (domingo)',
    title: 'Parque Bicentenário + Sky Costanera',
    icon: MountainIcon,
    events: [
      { time: '08:00', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Manhã no Parque Bicentenário', location: { lat: -33.4075, lng: -70.5960 } },
      { time: '12:30', description: 'Almoço no bairro Vitacura', location: { lat: -33.4000, lng: -70.5667 } },
      { time: '14:00', description: 'Sky Costanera (mirante)', location: { lat: -33.4170, lng: -70.6067 } },
      { time: '17:30', description: 'Retorno / descanso' },
      { time: '19:30', description: 'Jantar no Costanera Center', location: { lat: -33.4170, lng: -70.6067 } }
    ]
  },
  {
    day: 'Dia 6',
    date: '15/12 (segunda-feira)',
    title: 'Cerro San Cristóbal + Teleférico',
    icon: CableCarIcon,
    events: [
      { time: '08:00', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Funicular e teleférico até o Cerro San Cristóbal', location: { lat: -33.4299, lng: -70.6339 } },
      { time: '10:00', description: 'Vista panorâmica da cidade' },
      { time: '11:00', description: 'Piquenique no parque' },
      { time: '13:00', description: 'Almoço leve / descanso' },
      { time: '14:30', description: 'Compras no Costanera Center ou Pátio Bellavista', location: { lat: -33.4170, lng: -70.6067 } },
      { time: '19:30', description: 'Jantar / retorno ao hotel' }
    ]
  },
  {
    day: 'Dia 7',
    date: '16/12 (terça-feira)',
    title: 'Dia Livre + Compras',
    icon: ShoppingBagIcon,
    events: [
      { time: '08:00', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Bairro Lastarria (café e cultura)', location: { lat: -33.4382, lng: -70.6387 } },
      { time: '11:30', description: 'Tempo livre para lembrancinhas e compras' },
      { time: '13:00', description: 'Almoço' },
      { time: '14:30', description: 'Parque Arauco (shopping com espaço kids)', location: { lat: -33.3995, lng: -70.5488 } },
      { time: '18:30', description: 'Retorno ao hotel / descanso' },
      { time: '19:30', description: 'Jantar leve' }
    ]
  },
  {
    day: 'Dia 8',
    date: '17/12 (quarta-feira)',
    title: 'Último dia inteiro',
    icon: HeartIcon,
    events: [
      { time: '08:00', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Passeio no Parque Forestal ou retorno ao centro', location: { lat: -33.4357, lng: -70.6406 } },
      { time: '12:30', description: 'Almoço tranquilo' },
      { time: '14:00', description: 'Tarde livre para revisitar algum ponto preferido' },
      { time: '17:30', description: 'Retorno ao hotel / descanso' },
      { time: '19:30', description: 'Jantar especial de despedida' }
    ]
  },
  {
    day: 'Dia 9',
    date: '18/12 (quinta-feira)',
    title: 'Retorno ao Brasil',
    icon: PlaneIcon,
    events: [
      { time: '08:00', description: 'Café da manhã', location: { lat: -33.4239, lng: -70.6070 } },
      { time: '09:00', description: 'Passeio leve (parque próximo ao hotel ou café)' },
      { time: '11:00', description: 'Check-out do hotel' },
      { time: '11:30', description: 'Almoço antecipado' },
      { time: '13:00', description: 'Transfer para o aeroporto', location: { lat: -33.3930, lng: -70.7858 } },
      { time: '--:--', description: 'Voo de volta para o Brasil' }
    ]
  }
];
