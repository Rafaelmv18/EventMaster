import { useState } from 'react';
import { Search, Filter, Calendar, MapPin, Users } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import type { Event, UserRole } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface HomeProps {
  userRole: UserRole;
  onEventSelect: (event: Event) => void;
}

const MOCK_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Festival de Música Eletrônica 2025',
    description: 'Os maiores DJs do mundo em um único lugar. Uma experiência inesquecível com o melhor da música eletrônica.',
    date: '2025-12-15',
    time: '20:00',
    location: 'Estádio Nacional, São Paulo',
    price: 150,
    category: 'Música',
    image: 'music festival concert',
    availableTickets: 450,
    totalTickets: 500,
    status: 'approved',
    ticketTypes: [
      {
        id: '1',
        name: 'Pista',
        price: 150,
        availableTickets: 200,
        totalTickets: 250,
        description: 'Acesso à área de pista'
      },
      {
        id: '2',
        name: 'Camarote',
        price: 300,
        availableTickets: 150,
        totalTickets: 200,
        description: 'Acesso ao camarote com open bar'
      },
      {
        id: '3',
        name: 'VIP',
        price: 500,
        availableTickets: 100,
        totalTickets: 50,
        description: 'Área VIP com acesso exclusivo aos artistas'
      }
    ]
  },
  {
    id: '2',
    title: 'Teatro: O Fantasma da Ópera',
    description: 'O clássico musical da Broadway chega ao Brasil com elenco internacional.',
    date: '2025-11-20',
    time: '19:30',
    location: 'Teatro Municipal, Rio de Janeiro',
    price: 120,
    category: 'Teatro',
    image: 'theater stage performance',
    availableTickets: 80,
    totalTickets: 200,
    ticketTypes: [
      {
        id: '1',
        name: 'Balcão',
        price: 120,
        availableTickets: 30,
        totalTickets: 80,
        description: 'Assentos no balcão superior'
      },
      {
        id: '2',
        name: 'Plateia',
        price: 200,
        availableTickets: 50,
        totalTickets: 120,
        description: 'Assentos na plateia central'
      }
    ]
  },
  {
    id: '3',
    title: 'Stand-Up Comedy Night',
    description: 'Uma noite de muito humor com os melhores comediantes do país.',
    date: '2025-11-25',
    time: '21:00',
    location: 'Arena Comedy Club, Curitiba',
    price: 80,
    category: 'Comédia',
    image: 'comedy show audience',
    availableTickets: 120,
    totalTickets: 150
  },
  {
    id: '4',
    title: 'Conferência Tech Innovation 2025',
    description: 'Os maiores nomes da tecnologia compartilhando insights sobre IA, blockchain e o futuro digital.',
    date: '2025-12-01',
    time: '09:00',
    location: 'Centro de Convenções, Brasília',
    price: 350,
    category: 'Tecnologia',
    image: 'technology conference people',
    availableTickets: 200,
    totalTickets: 300
  },
  {
    id: '5',
    title: 'Show Rock Nacional',
    description: 'As melhores bandas de rock brasileiro em um festival épico.',
    date: '2025-12-10',
    time: '18:00',
    location: 'Parque Municipal, Belo Horizonte',
    price: 120,
    category: 'Música',
    image: 'rock concert crowd',
    availableTickets: 800,
    totalTickets: 1000
  },
  {
    id: '6',
    title: 'Ballet: O Quebra-Nozes',
    description: 'Apresentação especial de fim de ano do clássico ballet.',
    date: '2025-12-20',
    time: '20:00',
    location: 'Teatro Nacional, Porto Alegre',
    price: 180,
    category: 'Dança',
    image: 'ballet dance performance',
    availableTickets: 90,
    totalTickets: 120
  }
];

export function Home({ userRole, onEventSelect }: HomeProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Filtrar eventos baseado no papel do usuário
  const visibleEvents = MOCK_EVENTS.filter(event => {
    // Admin vê todos os eventos
    if (userRole === 'admin') return true;
    // Organizador e usuário veem apenas eventos aprovados
    return event.status === 'approved' || !event.status;
  });

  const filteredEvents = visibleEvents.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(visibleEvents.map(e => e.category)))];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">
          {userRole === 'admin' ? 'Gerenciar Eventos' : 'Descubra Eventos Incríveis'}
        </h1>
        <p className="text-gray-600">
          {userRole === 'admin' 
            ? 'Visualize e gerencie todos os eventos da plataforma'
            : 'Encontre os melhores shows, teatro, esportes e muito mais'}
        </p>
      </div>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
          <Input
            type="text"
            placeholder="Buscar eventos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <Filter className="size-4 mr-2" />
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            {categories.filter(c => c !== 'all').map(category => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Admin Stats - Only for Admin */}
      {userRole === 'admin' && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-gray-600 text-sm mb-1">Total de Eventos</div>
            <div className="text-gray-900 text-2xl">{MOCK_EVENTS.length}</div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-gray-600 text-sm mb-1">Ingressos Vendidos</div>
            <div className="text-gray-900 text-2xl">
              {MOCK_EVENTS.reduce((acc, e) => acc + (e.totalTickets - e.availableTickets), 0)}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-gray-600 text-sm mb-1">Receita Total</div>
            <div className="text-gray-900 text-2xl">
              R$ {MOCK_EVENTS.reduce((acc, e) => acc + (e.totalTickets - e.availableTickets) * e.price, 0).toLocaleString('pt-BR')}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg border">
            <div className="text-gray-600 text-sm mb-1">Taxa de Ocupação</div>
            <div className="text-gray-900 text-2xl">
              {Math.round(
                (MOCK_EVENTS.reduce((acc, e) => acc + (e.totalTickets - e.availableTickets), 0) /
                MOCK_EVENTS.reduce((acc, e) => acc + e.totalTickets, 0)) * 100
              )}%
            </div>
          </div>
        </div>
      )}

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map(event => (
          <EventCard
            key={event.id}
            event={event}
            userRole={userRole}
            onSelect={onEventSelect}
          />
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Nenhum evento encontrado.</p>
        </div>
      )}
    </div>
  );
}

interface EventCardProps {
  event: Event;
  userRole: UserRole;
  onSelect: (event: Event) => void;
}

function EventCard({ event, userRole, onSelect }: EventCardProps) {
  const soldPercentage = ((event.totalTickets - event.availableTickets) / event.totalTickets) * 100;
  const isAlmostSoldOut = soldPercentage > 80;

  return (
    <div
      className="bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onSelect(event)}
    >
      <div className="aspect-video w-full bg-gray-200 relative overflow-hidden">
        <ImageWithFallback
          src={`https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80`}
          alt={event.title}
          className="w-full h-full object-cover"
        />
        <Badge className="absolute top-3 right-3 bg-white text-gray-900">
          {event.category}
        </Badge>
        {isAlmostSoldOut && (
          <Badge variant="destructive" className="absolute top-3 left-3">
            Últimos Ingressos!
          </Badge>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-gray-900 mb-2 line-clamp-2">
          {event.title}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {event.description}
        </p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="size-4" />
            <span>{new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="size-4" />
            <span className="line-clamp-1">{event.location}</span>
          </div>
          
          {userRole === 'admin' && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Users className="size-4" />
              <span>{event.totalTickets - event.availableTickets} / {event.totalTickets} vendidos</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div>
            <div className="text-xs text-gray-500">A partir de</div>
            <div className="text-gray-900 text-xl">R$ {event.price}</div>
          </div>
          
          <Button>
            {userRole === 'admin' ? 'Gerenciar' : 'Ver Detalhes'}
          </Button>
        </div>
      </div>
    </div>
  );
}