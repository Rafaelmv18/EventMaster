import { useState } from 'react';
import { Users, CheckCircle, XCircle, TrendingUp, DollarSign, Ticket, Settings, FileText, AlertTriangle, BarChart3 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { ManageOrganizers } from './ManageOrganizers';
import { ManageEventApprovals } from './ManageEventApprovals';
import { ManageCommissions } from './ManageCommissions';
import { GlobalReports } from './GlobalReports';
import { RoleExplainer } from './RoleExplainer';

interface OrganizerRequest {
  id: string;
  organizationName: string;
  email: string;
  phone: string;
  cnpj: string;
  description: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PendingEvent {
  id: string;
  title: string;
  organizerName: string;
  date: string;
  category: string;
  totalTickets: number;
  price: number;
  submittedDate: string;
}

interface PaymentDispute {
  id: string;
  eventTitle: string;
  organizerName: string;
  buyerName: string;
  amount: number;
  reason: string;
  date: string;
  status: 'open' | 'resolved';
}

const MOCK_ORGANIZER_REQUESTS: OrganizerRequest[] = [
  {
    id: '1',
    organizationName: 'Produtora ABC Eventos',
    email: 'contato@abceventos.com.br',
    phone: '(11) 98888-8888',
    cnpj: '12.345.678/0001-90',
    description: 'Produtora especializada em eventos corporativos e festivais de música eletrônica',
    requestDate: '2025-11-20',
    status: 'pending'
  },
  {
    id: '2',
    organizationName: 'Teatro Nacional',
    email: 'admin@teatronacional.com',
    phone: '(21) 97777-7777',
    cnpj: '98.765.432/0001-10',
    description: 'Teatro com 50 anos de história, focado em espetáculos culturais',
    requestDate: '2025-11-18',
    status: 'pending'
  }
];

const MOCK_PENDING_EVENTS: PendingEvent[] = [
  {
    id: '1',
    title: 'Rock in Rio 2026',
    organizerName: 'Produtora ABC Eventos',
    date: '2026-09-15',
    category: 'Música',
    totalTickets: 100000,
    price: 450,
    submittedDate: '2025-11-22'
  },
  {
    id: '2',
    title: 'Stand-up Comedy Night',
    organizerName: 'Teatro Nacional',
    date: '2025-12-10',
    category: 'Teatro',
    totalTickets: 500,
    price: 80,
    submittedDate: '2025-11-21'
  }
];

const MOCK_DISPUTES: PaymentDispute[] = [
  {
    id: '1',
    eventTitle: 'Festival de Música Eletrônica 2025',
    organizerName: 'Produtora ABC Eventos',
    buyerName: 'João Silva',
    amount: 150,
    reason: 'Solicitação de reembolso fora do prazo',
    date: '2025-11-23',
    status: 'open'
  }
];

export function GlobalAdminDashboard({ onBack }: { onBack?: () => void }) {
  const [currentTab, setCurrentTab] = useState('overview');
  const [organizerRequests] = useState<OrganizerRequest[]>(MOCK_ORGANIZER_REQUESTS);
  const [pendingEvents] = useState<PendingEvent[]>(MOCK_PENDING_EVENTS);
  const [disputes] = useState<PaymentDispute[]>(MOCK_DISPUTES);

  // Estatísticas globais
  const totalOrganizers = 45;
  const totalEvents = 234;
  const totalRevenue = 2450000;
  const platformCommission = totalRevenue * 0.05;
  const totalTicketsSold = 87500;
  const pendingRequestsCount = organizerRequests.filter(r => r.status === 'pending').length;
  const pendingEventsCount = pendingEvents.length;
  const openDisputesCount = disputes.filter(d => d.status === 'open').length;

  if (currentTab === 'organizers') {
    return <ManageOrganizers onBack={() => setCurrentTab('overview')} />;
  }

  if (currentTab === 'event-approvals') {
    return <ManageEventApprovals onBack={() => setCurrentTab('overview')} />;
  }

  if (currentTab === 'commissions') {
    return <ManageCommissions onBack={() => setCurrentTab('overview')} />;
  }

  if (currentTab === 'reports') {
    return <GlobalReports onBack={() => setCurrentTab('overview')} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Painel Administrativo Global - EventMaster</h1>
        <p className="text-gray-600">Gerenciamento completo da plataforma</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="organizers">
            Organizadores
            {pendingRequestsCount > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingRequestsCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="event-approvals">
            Aprovações
            {pendingEventsCount > 0 && (
              <Badge variant="destructive" className="ml-2">{pendingEventsCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="commissions">Comissões</TabsTrigger>
          <TabsTrigger value="reports">Relatórios</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Explicação da Nova Arquitetura */}
          <RoleExplainer />

          {/* Estatísticas Principais */}
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
                  Comissão: R$ {platformCommission.toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Organizadores Ativos</CardTitle>
                <Users className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">{totalOrganizers}</div>
                <p className="text-xs text-amber-600 mt-1">
                  {pendingRequestsCount} solicitações pendentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Total de Eventos</CardTitle>
                <Ticket className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">{totalEvents}</div>
                <p className="text-xs text-amber-600 mt-1">
                  {pendingEventsCount} aguardando aprovação
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Ingressos Vendidos</CardTitle>
                <TrendingUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  {totalTicketsSold.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Todas as categorias
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
              <CardDescription>Acesso rápido às funções administrativas principais</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentTab('organizers')}
              >
                <Users className="size-5" />
                <span className="text-sm">Gerenciar Organizadores</span>
                {pendingRequestsCount > 0 && (
                  <Badge variant="destructive" className="text-xs">{pendingRequestsCount} novos</Badge>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentTab('event-approvals')}
              >
                <CheckCircle className="size-5" />
                <span className="text-sm">Aprovar Eventos</span>
                {pendingEventsCount > 0 && (
                  <Badge variant="destructive" className="text-xs">{pendingEventsCount} pendentes</Badge>
                )}
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentTab('commissions')}
              >
                <Settings className="size-5" />
                <span className="text-sm">Configurar Comissões</span>
              </Button>

              <Button 
                variant="outline" 
                className="h-20 flex flex-col gap-2"
                onClick={() => setCurrentTab('reports')}
              >
                <FileText className="size-5" />
                <span className="text-sm">Relatórios Globais</span>
              </Button>
            </CardContent>
          </Card>

          {/* Itens Pendentes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Solicitações de Organizadores */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="size-5" />
                  Solicitações Pendentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                {organizerRequests.filter(r => r.status === 'pending').length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma solicitação pendente
                  </p>
                ) : (
                  <div className="space-y-3">
                    {organizerRequests
                      .filter(r => r.status === 'pending')
                      .slice(0, 3)
                      .map((request) => (
                        <div key={request.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="text-sm text-gray-900">{request.organizationName}</div>
                            <div className="text-xs text-gray-500">{request.email}</div>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => setCurrentTab('organizers')}
                          >
                            Analisar
                          </Button>
                        </div>
                      ))}
                    {organizerRequests.filter(r => r.status === 'pending').length > 3 && (
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => setCurrentTab('organizers')}
                      >
                        Ver todas ({organizerRequests.filter(r => r.status === 'pending').length})
                      </Button>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Disputas de Pagamento */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-amber-600" />
                  Disputas de Pagamento
                </CardTitle>
              </CardHeader>
              <CardContent>
                {openDisputesCount === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-4">
                    Nenhuma disputa aberta
                  </p>
                ) : (
                  <div className="space-y-3">
                    {disputes
                      .filter(d => d.status === 'open')
                      .slice(0, 3)
                      .map((dispute) => (
                        <div key={dispute.id} className="flex items-center justify-between p-3 bg-amber-50 rounded-lg border border-amber-200">
                          <div>
                            <div className="text-sm text-gray-900">{dispute.eventTitle}</div>
                            <div className="text-xs text-gray-500">
                              {dispute.buyerName} - R$ {dispute.amount}
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            Analisar
                          </Button>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Eventos Aguardando Aprovação */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5" />
                Eventos Aguardando Aprovação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {pendingEventsCount === 0 ? (
                <p className="text-sm text-gray-500 text-center py-4">
                  Nenhum evento aguardando aprovação
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Evento</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Organizador</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Data</th>
                        <th className="px-4 py-3 text-left text-xs text-gray-500 uppercase">Ingressos</th>
                        <th className="px-4 py-3 text-right text-xs text-gray-500 uppercase">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {pendingEvents.slice(0, 5).map((event) => (
                        <tr key={event.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="text-sm text-gray-900">{event.title}</div>
                            <div className="text-xs text-gray-500">{event.category}</div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{event.organizerName}</td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {new Date(event.date).toLocaleDateString('pt-BR')}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {event.totalTickets.toLocaleString('pt-BR')}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex justify-end gap-2">
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => setCurrentTab('event-approvals')}
                              >
                                Analisar
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {pendingEventsCount > 5 && (
                    <Button 
                      variant="ghost" 
                      className="w-full mt-4"
                      onClick={() => setCurrentTab('event-approvals')}
                    >
                      Ver todos ({pendingEventsCount})
                    </Button>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Gráfico de Receita por Categoria */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="size-5" />
                Receita por Categoria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Música</span>
                    <span>R$ 980.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '40%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Teatro</span>
                    <span>R$ 735.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-600 h-2 rounded-full" style={{ width: '30%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Esporte</span>
                    <span>R$ 490.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: '20%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Conferência</span>
                    <span>R$ 245.000</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-amber-600 h-2 rounded-full" style={{ width: '10%' }} />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}