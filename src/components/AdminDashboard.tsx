import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, Users, Ticket, DollarSign, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from './ui/dialog';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { EventAnalytics } from './EventAnalytics';
import type { Event, TicketType } from '../App';

const MOCK_ADMIN_EVENTS: Event[] = [
  {
    id: '1',
    title: 'Festival de Música Eletrônica 2025',
    description: 'Os maiores DJs do mundo em um único lugar.',
    date: '2025-12-15',
    time: '20:00',
    location: 'Estádio Nacional, São Paulo',
    price: 150,
    category: 'Música',
    image: '',
    availableTickets: 450,
    totalTickets: 500,
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
    description: 'O clássico musical da Broadway.',
    date: '2025-11-20',
    time: '19:30',
    location: 'Teatro Municipal, Rio de Janeiro',
    price: 200,
    category: 'Teatro',
    image: '',
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
  }
];

export function AdminDashboard({ editingEventId, onBack }: { editingEventId?: string | null; onBack?: () => void }) {
  const [events, setEvents] = useState<Event[]>(MOCK_ADMIN_EVENTS);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEventForAnalytics, setSelectedEventForAnalytics] = useState<Event | null>(null);

  // Effect to open edit dialog when editingEventId is provided
  useEffect(() => {
    if (editingEventId) {
      const eventToEdit = events.find(e => e.id === editingEventId);
      if (eventToEdit) {
        setEditingEvent(eventToEdit);
      }
    }
  }, [editingEventId, events]);

  const totalRevenue = events.reduce((acc, e) => 
    acc + (e.totalTickets - e.availableTickets) * e.price, 0
  );
  const totalTicketsSold = events.reduce((acc, e) => 
    acc + (e.totalTickets - e.availableTickets), 0
  );
  const totalTicketsAvailable = events.reduce((acc, e) => 
    acc + e.totalTickets, 0
  );
  const occupancyRate = Math.round((totalTicketsSold / totalTicketsAvailable) * 100);

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const handleToggleVisibility = (eventId: string) => {
    // In a real app, this would toggle event visibility
    alert('Função de visibilidade do evento');
  };

  // Show analytics if an event is selected
  if (selectedEventForAnalytics) {
    return (
      <EventAnalytics
        event={selectedEventForAnalytics}
        onBack={() => setSelectedEventForAnalytics(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-gray-900 mb-2">Painel Administrativo - EventMaster</h1>
          <p className="text-gray-600">Dashboard global com todos os eventos da plataforma</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Criar Evento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Criar Novo Evento</DialogTitle>
              <DialogDescription>Insira os detalhes do evento para criá-lo.</DialogDescription>
            </DialogHeader>
            <EventForm
              onClose={() => setIsCreateDialogOpen(false)}
              onSave={(event) => {
                setEvents([...events, { ...event, id: Date.now().toString() }]);
                setIsCreateDialogOpen(false);
              }}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toLocaleString('pt-BR')}`}
          icon={<DollarSign className="size-6" />}
          trend="+12.5%"
          trendUp
        />
        <StatCard
          title="Ingressos Vendidos"
          value={totalTicketsSold.toString()}
          icon={<Ticket className="size-6" />}
          trend="+8.2%"
          trendUp
        />
        <StatCard
          title="Total de Eventos"
          value={events.length.toString()}
          icon={<Users className="size-6" />}
          trend="+2"
          trendUp
        />
        <StatCard
          title="Taxa de Ocupação"
          value={`${occupancyRate}%`}
          icon={<TrendingUp className="size-6" />}
          trend="+5.3%"
          trendUp
        />
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-gray-900">Eventos</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Evento
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Local
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Vendas
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Receita
                </th>
                <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {events.map((event) => {
                const soldTickets = event.totalTickets - event.availableTickets;
                const soldPercentage = Math.round((soldTickets / event.totalTickets) * 100);
                const revenue = soldTickets * event.price;

                return (
                  <tr key={event.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-gray-900">{event.title}</div>
                      <div className="text-sm text-gray-500">{event.category}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {new Date(event.date).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-sm text-gray-500">{event.time}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 text-sm max-w-xs truncate">
                        {event.location}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        {soldTickets} / {event.totalTickets}
                      </div>
                      <div className="text-sm text-gray-500">{soldPercentage}%</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900">
                        R$ {revenue.toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={soldPercentage > 80 ? 'destructive' : 'default'}>
                        {soldPercentage > 80 ? 'Quase esgotado' : 'Disponível'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedEventForAnalytics(event)}
                          title="Ver Análises"
                        >
                          <BarChart3 className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleToggleVisibility(event.id)}
                        >
                          <Eye className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setEditingEvent(event)}
                        >
                          <Edit className="size-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteEvent(event.id)}
                        >
                          <Trash2 className="size-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Dialog */}
      {editingEvent && (
        <Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
              <DialogDescription>Atualize os detalhes do evento.</DialogDescription>
            </DialogHeader>
            <EventForm
              event={editingEvent}
              onClose={() => setEditingEvent(null)}
              onSave={(updatedEvent) => {
                setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
                setEditingEvent(null);
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend: string;
  trendUp: boolean;
}

function StatCard({ title, value, icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="text-gray-600 text-sm">{title}</div>
        <div className="text-indigo-600">{icon}</div>
      </div>
      <div className="text-gray-900 text-2xl mb-2">{value}</div>
      <div className={`text-sm ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
        {trend} vs mês anterior
      </div>
    </div>
  );
}

interface EventFormProps {
  event?: Event;
  onClose: () => void;
  onSave: (event: Event) => void;
}

function EventForm({ event, onClose, onSave }: EventFormProps) {
  const [formData, setFormData] = useState<Event>(event || {
    id: '',
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    price: 0,
    category: 'Música',
    image: '',
    availableTickets: 0,
    totalTickets: 0,
    ticketTypes: []
  });

  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(event?.ticketTypes || []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Calculate total tickets and available tickets from ticket types if they exist
    if (ticketTypes.length > 0) {
      const totalFromTypes = ticketTypes.reduce((sum, type) => sum + type.totalTickets, 0);
      const availableFromTypes = ticketTypes.reduce((sum, type) => sum + type.availableTickets, 0);
      const minPrice = Math.min(...ticketTypes.map(t => t.price));
      onSave({ ...formData, totalTickets: totalFromTypes, availableTickets: availableFromTypes, price: minPrice, ticketTypes });
    } else {
      onSave({ ...formData, ticketTypes: [] });
    }
  };

  const handleChange = (field: keyof Event, value: any) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleAddTicketType = () => {
    const newTicketType: TicketType = {
      id: Date.now().toString(),
      name: '',
      price: 0,
      availableTickets: 0,
      totalTickets: 0,
      description: ''
    };
    setTicketTypes([...ticketTypes, newTicketType]);
  };

  const handleRemoveTicketType = (id: string) => {
    setTicketTypes(ticketTypes.filter(t => t.id !== id));
  };

  const handleTicketTypeChange = (id: string, field: keyof TicketType, value: any) => {
    setTicketTypes(ticketTypes.map(t => 
      t.id === id ? { ...t, [field]: value } : t
    ));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Título do Evento</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Descrição</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          required
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="date">Data</Label>
          <Input
            id="date"
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            required
          />
        </div>

        <div>
          <Label htmlFor="time">Horário</Label>
          <Input
            id="time"
            type="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="location">Local</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => handleChange('location', e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select value={formData.category} onValueChange={(value) => handleChange('category', value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Música">Música</SelectItem>
              <SelectItem value="Teatro">Teatro</SelectItem>
              <SelectItem value="Comédia">Comédia</SelectItem>
              <SelectItem value="Tecnologia">Tecnologia</SelectItem>
              <SelectItem value="Dança">Dança</SelectItem>
              <SelectItem value="Esportes">Esportes</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="price">Preço (R$)</Label>
          <Input
            id="price"
            type="number"
            value={formData.price}
            onChange={(e) => handleChange('price', parseFloat(e.target.value))}
            required
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="totalTickets">Total de Ingressos</Label>
          <Input
            id="totalTickets"
            type="number"
            value={formData.totalTickets}
            onChange={(e) => {
              const total = parseInt(e.target.value);
              handleChange('totalTickets', total);
              if (!event) {
                handleChange('availableTickets', total);
              }
            }}
            required
            min="1"
          />
        </div>

        <div>
          <Label htmlFor="availableTickets">Ingressos Disponíveis</Label>
          <Input
            id="availableTickets"
            type="number"
            value={formData.availableTickets}
            onChange={(e) => handleChange('availableTickets', parseInt(e.target.value))}
            required
            min="0"
            max={formData.totalTickets}
          />
        </div>
      </div>

      <div className="border-t pt-4 mt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Tipos de Ingressos</h3>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddTicketType}
            className="gap-2"
          >
            <Plus className="size-4" />
            Adicionar Tipo
          </Button>
        </div>
        
        {ticketTypes.length === 0 && (
          <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg">
            Adicione tipos de ingressos para oferecer diferentes categorias (VIP, Camarote, Pista, etc.)
          </div>
        )}
        
        <div className="space-y-4">
          {ticketTypes.map((ticketType, index) => (
            <div key={ticketType.id} className="bg-gray-50 p-4 rounded-lg border">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-700">Tipo {index + 1}</span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemoveTicketType(ticketType.id)}
                >
                  <Trash2 className="size-4 text-red-600" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor={`ticketType-name-${ticketType.id}`}>Nome do Ingresso</Label>
                  <Input
                    id={`ticketType-name-${ticketType.id}`}
                    value={ticketType.name}
                    onChange={(e) => handleTicketTypeChange(ticketType.id, 'name', e.target.value)}
                    placeholder="ex: VIP, Camarote, Pista"
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor={`ticketType-price-${ticketType.id}`}>Preço (R$)</Label>
                  <Input
                    id={`ticketType-price-${ticketType.id}`}
                    type="number"
                    value={ticketType.price}
                    onChange={(e) => handleTicketTypeChange(ticketType.id, 'price', parseFloat(e.target.value))}
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`ticketType-totalTickets-${ticketType.id}`}>Total de Ingressos</Label>
                  <Input
                    id={`ticketType-totalTickets-${ticketType.id}`}
                    type="number"
                    value={ticketType.totalTickets}
                    onChange={(e) => {
                      const total = parseInt(e.target.value);
                      handleTicketTypeChange(ticketType.id, 'totalTickets', total);
                      if (!event) {
                        handleTicketTypeChange(ticketType.id, 'availableTickets', total);
                      }
                    }}
                    required
                    min="1"
                  />
                </div>
                
                <div>
                  <Label htmlFor={`ticketType-availableTickets-${ticketType.id}`}>Ingressos Disponíveis</Label>
                  <Input
                    id={`ticketType-availableTickets-${ticketType.id}`}
                    type="number"
                    value={ticketType.availableTickets}
                    onChange={(e) => handleTicketTypeChange(ticketType.id, 'availableTickets', parseInt(e.target.value))}
                    required
                    min="0"
                    max={ticketType.totalTickets}
                  />
                </div>
                
                <div className="col-span-2">
                  <Label htmlFor={`ticketType-description-${ticketType.id}`}>Descrição</Label>
                  <Input
                    id={`ticketType-description-${ticketType.id}`}
                    value={ticketType.description}
                    onChange={(e) => handleTicketTypeChange(ticketType.id, 'description', e.target.value)}
                    placeholder="Descreva os benefícios deste tipo de ingresso"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1">
          {event ? 'Salvar Alterações' : 'Criar Evento'}
        </Button>
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}