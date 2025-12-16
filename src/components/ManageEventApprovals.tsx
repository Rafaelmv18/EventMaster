import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Eye, Calendar, MapPin, Ticket, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

interface PendingEvent {
  id: string;
  title: string;
  description: string;
  organizerName: string;
  organizerId: string;
  date: string;
  time: string;
  location: string;
  category: string;
  totalTickets: number;
  price: number;
  submittedDate: string;
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
}

const MOCK_PENDING_EVENTS: PendingEvent[] = [
  {
    id: '1',
    title: 'Rock in Rio 2026',
    description: 'O maior festival de música do Brasil retorna com atrações internacionais e nacionais de peso.',
    organizerName: 'Produtora ABC Eventos',
    organizerId: '1',
    date: '2026-09-15',
    time: '14:00',
    location: 'Cidade do Rock - Rio de Janeiro, RJ',
    category: 'Música',
    totalTickets: 100000,
    price: 450,
    submittedDate: '2025-11-22',
    status: 'pending'
  },
  {
    id: '2',
    title: 'Stand-up Comedy Night',
    description: 'Uma noite de humor com os melhores comediantes do Brasil.',
    organizerName: 'Teatro Nacional',
    organizerId: '2',
    date: '2025-12-10',
    time: '20:00',
    location: 'Teatro Municipal - São Paulo, SP',
    category: 'Teatro',
    totalTickets: 500,
    price: 80,
    submittedDate: '2025-11-21',
    status: 'pending'
  },
  {
    id: '3',
    title: 'Conferência Tech Brasil 2026',
    description: 'A maior conferência de tecnologia do país com palestrantes de empresas como Google, Amazon e Microsoft.',
    organizerName: 'Tech Events Brasil',
    organizerId: '3',
    date: '2026-03-20',
    time: '09:00',
    location: 'Centro de Convenções - Brasília, DF',
    category: 'Conferência',
    totalTickets: 5000,
    price: 350,
    submittedDate: '2025-11-20',
    status: 'pending'
  }
];

export function ManageEventApprovals({ onBack }: { onBack: () => void }) {
  const [events, setEvents] = useState<PendingEvent[]>(MOCK_PENDING_EVENTS);
  const [selectedEvent, setSelectedEvent] = useState<PendingEvent | null>(null);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const pendingEvents = events.filter(e => e.status === 'pending');
  const approvedEvents = events.filter(e => e.status === 'approved');
  const rejectedEvents = events.filter(e => e.status === 'rejected');

  const handleApprove = (eventId: string) => {
    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setEvents(events.map(e =>
      e.id === eventId ? { ...e, status: 'approved' } : e
    ));
    setSelectedEvent(null);
    toast.success(`${event.title} foi aprovado e já está visível na plataforma!`);
  };

  const handleReject = (eventId: string) => {
    if (!rejectionReason.trim()) {
      toast.error('Por favor, informe o motivo da rejeição');
      return;
    }

    const event = events.find(e => e.id === eventId);
    if (!event) return;

    setEvents(events.map(e =>
      e.id === eventId ? { ...e, status: 'rejected', rejectionReason } : e
    ));
    setSelectedEvent(null);
    setIsRejectDialogOpen(false);
    setRejectionReason('');
    toast.info(`${event.title} foi rejeitado. O organizador receberá uma notificação.`);
  };

  const openRejectDialog = (event: PendingEvent) => {
    setSelectedEvent(event);
    setIsRejectDialogOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <h1 className="text-gray-900 mb-2">Gerenciar Aprovações de Eventos</h1>
        <p className="text-gray-600">Analisar e aprovar eventos submetidos pelos organizadores</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl text-gray-900 mb-1">{pendingEvents.length}</div>
              <div className="text-sm text-gray-600">Aguardando Análise</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl text-green-600 mb-1">{approvedEvents.length}</div>
              <div className="text-sm text-gray-600">Aprovados</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="text-3xl text-red-600 mb-1">{rejectedEvents.length}</div>
              <div className="text-sm text-gray-600">Rejeitados</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Pendentes de Aprovação</CardTitle>
          <CardDescription>
            Revise os detalhes e aprove ou rejeite os eventos submetidos
          </CardDescription>
        </CardHeader>
        <CardContent>
          {pendingEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Nenhum evento aguardando aprovação
            </div>
          ) : (
            <div className="space-y-4">
              {pendingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-gray-900">{event.title}</h3>
                          <Badge>{event.category}</Badge>
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{event.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="size-4" />
                            {new Date(event.date).toLocaleDateString('pt-BR')} às {event.time}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {event.location}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Organizador</div>
                        <div className="text-sm text-gray-900">{event.organizerName}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Ingressos</div>
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <Ticket className="size-4" />
                          {event.totalTickets.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Preço</div>
                        <div className="text-sm text-gray-900 flex items-center gap-1">
                          <DollarSign className="size-4" />
                          R$ {event.price.toLocaleString('pt-BR')}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 mb-1">Receita Estimada</div>
                        <div className="text-sm text-green-600">
                          R$ {(event.totalTickets * event.price).toLocaleString('pt-BR')}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedEvent(event)}
                      >
                        <Eye className="size-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => openRejectDialog(event)}
                      >
                        <XCircle className="size-4 mr-2" />
                        Rejeitar
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700"
                        size="sm"
                        onClick={() => handleApprove(event.id)}
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Aprovar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eventos Aprovados */}
      {approvedEvents.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Eventos Aprovados Recentemente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {approvedEvents.slice(0, 5).map((event) => (
                <div key={event.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                  <div>
                    <div className="text-sm text-gray-900">{event.title}</div>
                    <div className="text-xs text-gray-500">{event.organizerName}</div>
                  </div>
                  <Badge variant="default" className="bg-green-600">Aprovado</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Eventos Rejeitados */}
      {rejectedEvents.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Eventos Rejeitados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {rejectedEvents.map((event) => (
                <div key={event.id} className="p-3 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm text-gray-900">{event.title}</div>
                      <div className="text-xs text-gray-500">{event.organizerName}</div>
                    </div>
                    <Badge variant="destructive">Rejeitado</Badge>
                  </div>
                  {event.rejectionReason && (
                    <div className="text-xs text-gray-600 mt-2">
                      <span className="font-medium">Motivo:</span> {event.rejectionReason}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Dialog de Detalhes do Evento */}
      {selectedEvent && !isRejectDialogOpen && (
        <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-2">{selectedEvent.title}</h3>
                <Badge className="mb-4">{selectedEvent.category}</Badge>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Organizador</div>
                  <div className="text-gray-900">{selectedEvent.organizerName}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Data de Submissão</div>
                  <div className="text-gray-900">
                    {new Date(selectedEvent.submittedDate).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Data do Evento</div>
                  <div className="text-gray-900">
                    {new Date(selectedEvent.date).toLocaleDateString('pt-BR')} às {selectedEvent.time}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Local</div>
                  <div className="text-gray-900">{selectedEvent.location}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Total de Ingressos</div>
                  <div className="text-gray-900">{selectedEvent.totalTickets.toLocaleString('pt-BR')}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Preço do Ingresso</div>
                  <div className="text-gray-900">R$ {selectedEvent.price.toLocaleString('pt-BR')}</div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-blue-900 mb-1">Receita Estimada</div>
                <div className="text-2xl text-blue-600">
                  R$ {(selectedEvent.totalTickets * selectedEvent.price).toLocaleString('pt-BR')}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  Comissão da plataforma (5%): R$ {((selectedEvent.totalTickets * selectedEvent.price) * 0.05).toLocaleString('pt-BR')}
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                  Fechar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setIsRejectDialogOpen(true);
                  }}
                >
                  <XCircle className="size-4 mr-2" />
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedEvent.id)}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Aprovar Evento
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Dialog de Rejeição */}
      {isRejectDialogOpen && selectedEvent && (
        <Dialog open={isRejectDialogOpen} onOpenChange={() => {
          setIsRejectDialogOpen(false);
          setRejectionReason('');
        }}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Rejeitar Evento</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <p className="text-gray-600">
                Por favor, informe o motivo da rejeição de <strong>{selectedEvent.title}</strong>.
                O organizador receberá esta informação por email.
              </p>
              <div>
                <label className="text-sm text-gray-700 mb-2 block">Motivo da Rejeição</label>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Ex: O evento não atende aos critérios de segurança da plataforma..."
                  rows={4}
                />
              </div>
              <div className="flex gap-3 justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsRejectDialogOpen(false);
                    setRejectionReason('');
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedEvent.id)}
                >
                  Confirmar Rejeição
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
