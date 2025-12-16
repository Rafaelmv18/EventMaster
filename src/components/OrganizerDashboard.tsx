import { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Eye, EyeOff, TrendingUp, Users, Ticket, DollarSign, BarChart3, AlertCircle, Upload, X } from 'lucide-react';
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
import { Alert, AlertDescription } from './ui/alert';
import { BatchManager } from './BatchManager';
import type { Event, TicketType, TicketBatch } from '../App';

const MOCK_ORGANIZER_EVENTS: Event[] = [
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
    description: 'O clássico musical da Broadway.',
    date: '2025-11-20',
    time: '19:30',
    location: 'Teatro Municipal, Rio de Janeiro',
    price: 200,
    category: 'Teatro',
    image: '',
    availableTickets: 80,
    totalTickets: 200,
    status: 'pending',
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

interface EventFormData extends Omit<Event, 'id' | 'availableTickets'> {
  ticketTypes?: TicketType[];
}

export function OrganizerDashboard({ editingEventId, onBack, organizationName = "Minha Organização" }: { 
  editingEventId?: string | null; 
  onBack?: () => void;
  organizationName?: string;
}) {
  const [events, setEvents] = useState<Event[]>(MOCK_ORGANIZER_EVENTS);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [selectedEventForAnalytics, setSelectedEventForAnalytics] = useState<Event | null>(null);
  const [currentTab, setCurrentTab] = useState('overview');

  useEffect(() => {
    if (editingEventId) {
      const eventToEdit = events.find(e => e.id === editingEventId);
      if (eventToEdit) {
        setEditingEvent(eventToEdit);
      }
    }
  }, [editingEventId, events]);

  const approvedEvents = events.filter(e => e.status === 'approved');
  const pendingEvents = events.filter(e => e.status === 'pending');

  const totalRevenue = approvedEvents.reduce((acc, e) => 
    acc + (e.totalTickets - e.availableTickets) * e.price, 0
  );
  const totalTicketsSold = approvedEvents.reduce((acc, e) => 
    acc + (e.totalTickets - e.availableTickets), 0
  );
  const totalTicketsAvailable = approvedEvents.reduce((acc, e) => 
    acc + e.totalTickets, 0
  );
  const occupancyRate = totalTicketsAvailable > 0 ? Math.round((totalTicketsSold / totalTicketsAvailable) * 100) : 0;

  const platformFee = totalRevenue * 0.05; 
  const netRevenue = totalRevenue - platformFee;

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      setEvents(events.filter(e => e.id !== eventId));
    }
  };

  const handleToggleVisibility = (eventId: string) => {
    setEvents(events.map(e => 
      e.id === eventId ? { ...e, visible: !e.visible } : e
    ));
  };

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
          <h1 className="text-gray-900 mb-2">Dashboard do Organizador</h1>
          <p className="text-gray-600">{organizationName}</p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="size-4" />
              Criar Evento
            </Button>
          </DialogTrigger>
          <EventFormDialog
            onClose={() => setIsCreateDialogOpen(false)}
            onSave={(eventData) => {
              const newEvent: Event = {
                ...eventData,
                id: Date.now().toString(),
                availableTickets: eventData.totalTickets,
                status: 'pending'
              };
              setEvents([newEvent, ...events]);
              setIsCreateDialogOpen(false);
            }}
          />
        </Dialog>

        {editingEvent && (
          <Dialog open={!!editingEvent} onOpenChange={(open) => !open && setEditingEvent(null)}>
            <EventFormDialog
              event={editingEvent}
              onClose={() => setEditingEvent(null)}
              onSave={(eventData) => {
                setEvents(events.map(e => 
                  e.id === editingEvent.id 
                    ? { ...eventData, id: e.id, availableTickets: e.availableTickets, status: e.status }
                    : e
                ));
                setEditingEvent(null);
              }}
            />
          </Dialog>
        )}
      </div>

      {pendingEvents.length > 0 && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="size-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Você tem {pendingEvents.length} evento(s) aguardando aprovação dos administradores
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="approved">
            Eventos Aprovados ({approvedEvents.length})
          </TabsTrigger>
          <TabsTrigger value="pending">
            Aguardando Aprovação ({pendingEvents.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Receita Total</CardTitle>
                <DollarSign className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  R$ {totalRevenue.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  Líquido: R$ {netRevenue.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Ingressos Vendidos</CardTitle>
                <Ticket className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  {totalTicketsSold}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  de {totalTicketsAvailable} disponíveis
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Taxa de Ocupação</CardTitle>
                <TrendingUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  {occupancyRate}%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full" 
                    style={{ width: `${occupancyRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Taxa da Plataforma</CardTitle>
                <BarChart3 className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  R$ {platformFee.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  5% sobre vendas
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <EventsTable 
                events={events.slice(0, 5)} 
                onEdit={setEditingEvent}
                onDelete={handleDeleteEvent}
                onToggleVisibility={handleToggleVisibility}
                onViewAnalytics={setSelectedEventForAnalytics}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="approved">
          <EventsTable 
            events={approvedEvents} 
            onEdit={setEditingEvent}
            onDelete={handleDeleteEvent}
            onToggleVisibility={handleToggleVisibility}
            onViewAnalytics={setSelectedEventForAnalytics}
          />
        </TabsContent>

        <TabsContent value="pending">
          {pendingEvents.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Nenhum evento aguardando aprovação
              </CardContent>
            </Card>
          ) : (
            <EventsTable 
              events={pendingEvents} 
              onEdit={setEditingEvent}
              onDelete={handleDeleteEvent}
              onToggleVisibility={handleToggleVisibility}
              onViewAnalytics={setSelectedEventForAnalytics}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function EventsTable({ 
  events, 
  onEdit, 
  onDelete, 
  onToggleVisibility,
  onViewAnalytics
}: { 
  events: Event[]; 
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
  onToggleVisibility: (eventId: string) => void;
  onViewAnalytics: (event: Event) => void;
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50 border-b">
          <tr>
            <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Evento
            </th>
            <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Data
            </th>
            <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Vendidos / Total
            </th>
            <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">
              Receita
            </th>
            <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {events.map((event) => {
            const ticketsSold = event.totalTickets - event.availableTickets;
            const revenue = ticketsSold * event.price;
            
            return (
              <tr key={event.id} className="hover:bg-gray-50">
                <td className="px-4 py-4">
                  <div>
                    <div className="text-gray-900">{event.title}</div>
                    <div className="text-sm text-gray-500">{event.location}</div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {new Date(event.date).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-4 py-4">
                  <Badge variant={event.status === 'approved' ? 'default' : 'secondary'}>
                    {event.status === 'approved' ? 'Aprovado' : 'Pendente'}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-sm text-gray-500">
                  {ticketsSold} / {event.totalTickets}
                </td>
                <td className="px-4 py-4 text-sm text-gray-900">
                  R$ {revenue.toLocaleString('pt-BR')}
                </td>
                <td className="px-4 py-4">
                  <div className="flex justify-end gap-2">
                    {event.status === 'approved' && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewAnalytics(event)}
                      >
                        <BarChart3 className="size-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(event)}
                    >
                      <Edit className="size-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleVisibility(event.id)}
                    >
                      {event.visible !== false ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(event.id)}
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
  );
}

function EventFormDialog({ 
  event, 
  onClose, 
  onSave 
}: { 
  event?: Event; 
  onClose: () => void; 
  onSave: (event: EventFormData) => void;
}) {
  const [formData, setFormData] = useState<EventFormData>(
    event || {
      title: '',
      description: '',
      date: '',
      time: '',
      location: '',
      price: 0,
      category: 'Música',
      image: '',
      totalTickets: 0,
      ticketTypes: []
    }
  );
  
  const [ticketTypes, setTicketTypes] = useState<TicketType[]>(event?.ticketTypes || []);
  const [allowHalfPrice, setAllowHalfPrice] = useState(false);
  const [cardBannerPreview, setCardBannerPreview] = useState<string>(event?.image || '');
  const [detailsBannerPreview, setDetailsBannerPreview] = useState<string>('');

  const handleCardBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCardBannerPreview(result);
        setFormData({ ...formData, image: result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDetailsBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setDetailsBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeCardBanner = () => {
    setCardBannerPreview('');
    setFormData({ ...formData, image: '' });
  };

  const removeDetailsBanner = () => {
    setDetailsBannerPreview('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Calculate total tickets from ticket types if they exist
    let finalData = { ...formData };
    
    if (ticketTypes.length > 0) {
      const totalFromTypes = ticketTypes.reduce((sum, type) => sum + type.totalTickets, 0);
      const minPrice = Math.min(...ticketTypes.map(t => t.price));
      finalData = { 
        ...formData, 
        totalTickets: totalFromTypes, 
        price: minPrice,
        ticketTypes: ticketTypes.map(tt => ({
          ...tt,
          allowHalfPrice
        }))
      };
    }
    
    onSave(finalData);
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
    <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto w-full">
      <DialogHeader>
        <DialogTitle>{event ? 'Editar Evento' : 'Criar Novo Evento'}</DialogTitle>
        <DialogDescription>
          {event ? 'Suas alterações serão salvas imediatamente.' : 'Seu evento será enviado para aprovação dos administradores antes de ficar visível na plataforma.'}
        </DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="title">Título do Evento</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              required
            />
          </div>
          
          <div className="md:col-span-2">
            <Label htmlFor="location">Local</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Categoria</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Música">Música</SelectItem>
                <SelectItem value="Teatro">Teatro</SelectItem>
                <SelectItem value="Esporte">Esporte</SelectItem>
                <SelectItem value="Conferência">Conferência</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="totalTickets">Total de Ingressos</Label>
            <Input
              id="totalTickets"
              type="number"
              value={formData.totalTickets}
              onChange={(e) => setFormData({ ...formData, totalTickets: parseInt(e.target.value) })}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="price">Preço Base (R$)</Label>
            <Input
              id="price"
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <Label className="text-base mb-3 block">Banners do Evento</Label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Banner do Card (pequeno) */}
            <div>
              <Label htmlFor="cardBanner" className="text-sm text-gray-700">
                Banner do Card <span className="text-gray-500">(pequeno)</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Aparece na listagem de eventos
              </p>
              
              {cardBannerPreview ? (
                <div className="relative group">
                  <img 
                    src={cardBannerPreview} 
                    alt="Preview do banner do card" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeCardBanner}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label 
                  htmlFor="cardBanner"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <Upload className="size-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Clique para fazer upload</span>
                  <input
                    id="cardBanner"
                    type="file"
                    accept="image/*"
                    onChange={handleCardBannerChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Banner de Detalhes (maior) */}
            <div>
              <Label htmlFor="detailsBanner" className="text-sm text-gray-700">
                Banner de Detalhes <span className="text-gray-500">(grande)</span>
              </Label>
              <p className="text-xs text-gray-500 mb-2">
                Aparece na página de detalhes do evento
              </p>
              
              {detailsBannerPreview ? (
                <div className="relative group">
                  <img 
                    src={detailsBannerPreview} 
                    alt="Preview do banner de detalhes" 
                    className="w-full h-32 object-cover rounded-lg border"
                  />
                  <button
                    type="button"
                    onClick={removeDetailsBanner}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ) : (
                <label 
                  htmlFor="detailsBanner"
                  className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-indigo-500 transition-colors"
                >
                  <Upload className="size-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Clique para fazer upload</span>
                  <input
                    id="detailsBanner"
                    type="file"
                    accept="image/*"
                    onChange={handleDetailsBannerChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Label className="text-base">Tipos de Ingressos</Label>
              <p className="text-sm text-gray-500 mt-1">
                Configure diferentes categorias de ingressos (Pista, VIP, Camarote, etc.)
              </p>
            </div>
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
            <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-lg border border-dashed">
              Nenhum tipo de ingresso configurado. Use o botão acima para adicionar categorias.
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor={`ticket-name-${ticketType.id}`}>Nome do Ingresso</Label>
                    <Input
                      id={`ticket-name-${ticketType.id}`}
                      type="text"
                      placeholder="ex: Pista, VIP, Camarote"
                      value={ticketType.name}
                      onChange={(e) => handleTicketTypeChange(ticketType.id, 'name', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor={`ticket-price-${ticketType.id}`}>Preço (R$)</Label>
                    <Input
                      id={`ticket-price-${ticketType.id}`}
                      type="number"
                      placeholder="150.00"
                      value={ticketType.price}
                      onChange={(e) => handleTicketTypeChange(ticketType.id, 'price', parseFloat(e.target.value))}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`ticket-total-${ticketType.id}`}>Total de Ingressos</Label>
                    <Input
                      id={`ticket-total-${ticketType.id}`}
                      type="number"
                      placeholder="100"
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
                    <Label htmlFor={`ticket-available-${ticketType.id}`}>Disponíveis</Label>
                    <Input
                      id={`ticket-available-${ticketType.id}`}
                      type="number"
                      placeholder="100"
                      value={ticketType.availableTickets}
                      onChange={(e) => handleTicketTypeChange(ticketType.id, 'availableTickets', parseInt(e.target.value))}
                      required
                      min="0"
                      max={ticketType.totalTickets}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <Label htmlFor={`ticket-desc-${ticketType.id}`}>Descrição</Label>
                    <Textarea
                      id={`ticket-desc-${ticketType.id}`}
                      placeholder="Descreva os benefícios deste tipo de ingresso"
                      value={ticketType.description}
                      onChange={(e) => handleTicketTypeChange(ticketType.id, 'description', e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>

                {/* Batch Manager */}
                <BatchManager
                  ticketTypeId={ticketType.id}
                  batches={ticketType.batches || []}
                  onBatchesChange={(batches) => handleTicketTypeChange(ticketType.id, 'batches', batches)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t pt-4 mt-6">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="allowHalfPrice"
              checked={allowHalfPrice}
              onChange={(e) => setAllowHalfPrice(e.target.checked)}
              className="rounded border-gray-300"
            />
            <Label htmlFor="allowHalfPrice" className="cursor-pointer">
              Permitir compra de meia-entrada (50% do valor)
            </Label>
          </div>
          <p className="text-xs text-gray-500 ml-6 mt-1">
            Estudantes, idosos e PCDs poderão comprar ingressos com desconto de 50%
          </p>
        </div>

        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {event ? 'Salvar Alterações' : 'Criar Evento'}
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}