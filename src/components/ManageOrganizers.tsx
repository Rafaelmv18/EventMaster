import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Eye, Mail, Phone, FileText, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { toast } from 'sonner';

interface OrganizerRequest {
  id: string;
  organizationName: string;
  email: string;
  phone: string;
  cnpj: string;
  description: string;
  website?: string;
  address?: string;
  requestDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Organizer {
  id: string;
  organizationName: string;
  email: string;
  phone: string;
  cnpj: string;
  approvedDate: string;
  totalEvents: number;
  totalRevenue: number;
  status: 'active' | 'suspended';
}

const MOCK_REQUESTS: OrganizerRequest[] = [
  {
    id: '1',
    organizationName: 'Produtora ABC Eventos',
    email: 'contato@abceventos.com.br',
    phone: '(11) 98888-8888',
    cnpj: '12.345.678/0001-90',
    description: 'Produtora especializada em eventos corporativos e festivais de música eletrônica com mais de 10 anos de experiência no mercado.',
    website: 'https://www.abceventos.com.br',
    address: 'Av. Paulista, 1000 - São Paulo, SP',
    requestDate: '2025-11-20',
    status: 'pending'
  },
  {
    id: '2',
    organizationName: 'Teatro Nacional',
    email: 'admin@teatronacional.com',
    phone: '(21) 97777-7777',
    cnpj: '98.765.432/0001-10',
    description: 'Teatro com 50 anos de história, focado em espetáculos culturais e peças clássicas.',
    website: 'https://www.teatronacional.com',
    address: 'Centro - Rio de Janeiro, RJ',
    requestDate: '2025-11-18',
    status: 'pending'
  }
];

const MOCK_ORGANIZERS: Organizer[] = [
  {
    id: '1',
    organizationName: 'Live Nation Brasil',
    email: 'contato@livenation.com.br',
    phone: '(11) 99999-9999',
    cnpj: '11.111.111/0001-11',
    approvedDate: '2025-01-15',
    totalEvents: 45,
    totalRevenue: 1250000,
    status: 'active'
  },
  {
    id: '2',
    organizationName: 'Rock World',
    email: 'info@rockworld.com.br',
    phone: '(11) 98888-8888',
    cnpj: '22.222.222/0001-22',
    approvedDate: '2025-03-10',
    totalEvents: 28,
    totalRevenue: 850000,
    status: 'active'
  }
];

export function ManageOrganizers({ onBack }: { onBack: () => void }) {
  const [requests, setRequests] = useState<OrganizerRequest[]>(MOCK_REQUESTS);
  const [organizers, setOrganizers] = useState<Organizer[]>(MOCK_ORGANIZERS);
  const [selectedRequest, setSelectedRequest] = useState<OrganizerRequest | null>(null);
  const [currentTab, setCurrentTab] = useState('pending');

  const handleApprove = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'approved' } : r
    ));

    const newOrganizer: Organizer = {
      id: Date.now().toString(),
      organizationName: request.organizationName,
      email: request.email,
      phone: request.phone,
      cnpj: request.cnpj,
      approvedDate: new Date().toISOString().split('T')[0],
      totalEvents: 0,
      totalRevenue: 0,
      status: 'active'
    };

    setOrganizers([newOrganizer, ...organizers]);
    setSelectedRequest(null);
    toast.success(`${request.organizationName} foi aprovado como organizador!`);
  };

  const handleReject = (requestId: string) => {
    const request = requests.find(r => r.id === requestId);
    if (!request) return;

    setRequests(requests.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' } : r
    ));
    setSelectedRequest(null);
    toast.info(`Solicitação de ${request.organizationName} foi rejeitada.`);
  };

  const handleSuspend = (organizerId: string) => {
    if (confirm('Tem certeza que deseja suspender este organizador?')) {
      setOrganizers(organizers.map(o =>
        o.id === organizerId ? { ...o, status: 'suspended' } : o
      ));
      toast.info('Organizador suspenso com sucesso.');
    }
  };

  const handleActivate = (organizerId: string) => {
    setOrganizers(organizers.map(o =>
      o.id === organizerId ? { ...o, status: 'active' } : o
    ));
    toast.success('Organizador reativado com sucesso.');
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const approvedRequests = requests.filter(r => r.status === 'approved');
  const rejectedRequests = requests.filter(r => r.status === 'rejected');
  const activeOrganizers = organizers.filter(o => o.status === 'active');
  const suspendedOrganizers = organizers.filter(o => o.status === 'suspended');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <h1 className="text-gray-900 mb-2">Gerenciar Organizadores</h1>
        <p className="text-gray-600">Aprovar solicitações e gerenciar organizadores ativos</p>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="pending">
            Solicitações Pendentes ({pendingRequests.length})
          </TabsTrigger>
          <TabsTrigger value="active">
            Organizadores Ativos ({activeOrganizers.length})
          </TabsTrigger>
          <TabsTrigger value="history">
            Histórico ({approvedRequests.length + rejectedRequests.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending">
          {pendingRequests.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Nenhuma solicitação pendente
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {pendingRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="size-5 text-blue-600" />
                          {request.organizationName}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Solicitado em {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">Pendente</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="size-4" />
                        {request.email}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="size-4" />
                        {request.phone}
                      </div>
                      <div className="flex items-center gap-2 text-gray-600">
                        <FileText className="size-4" />
                        CNPJ: {request.cnpj}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => setSelectedRequest(request)}
                      >
                        <Eye className="size-4 mr-2" />
                        Ver Detalhes
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        className="flex-1 bg-green-600 hover:bg-green-700"
                        onClick={() => handleApprove(request.id)}
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Aprovar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(request.id)}
                      >
                        <XCircle className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Organização</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Contato</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Data de Aprovação</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Eventos</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Receita</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-right text-xs text-gray-500 uppercase">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {activeOrganizers.map((organizer) => (
                      <tr key={organizer.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900">{organizer.organizationName}</div>
                            <div className="text-xs text-gray-500">CNPJ: {organizer.cnpj}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{organizer.email}</div>
                            <div className="text-gray-500">{organizer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(organizer.approvedDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {organizer.totalEvents}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          R$ {organizer.totalRevenue.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="default">Ativo</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSuspend(organizer.id)}
                            >
                              Suspender
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                    {suspendedOrganizers.map((organizer) => (
                      <tr key={organizer.id} className="hover:bg-gray-50 bg-gray-50">
                        <td className="px-6 py-4">
                          <div>
                            <div className="text-sm text-gray-900">{organizer.organizationName}</div>
                            <div className="text-xs text-gray-500">CNPJ: {organizer.cnpj}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm">
                            <div className="text-gray-900">{organizer.email}</div>
                            <div className="text-gray-500">{organizer.phone}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(organizer.approvedDate).toLocaleDateString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          {organizer.totalEvents}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-900">
                          R$ {organizer.totalRevenue.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4">
                          <Badge variant="destructive">Suspenso</Badge>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleActivate(organizer.id)}
                            >
                              Reativar
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-4">
            {[...approvedRequests, ...rejectedRequests].map((request) => (
              <Card key={request.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base">{request.organizationName}</CardTitle>
                    <Badge variant={request.status === 'approved' ? 'default' : 'destructive'}>
                      {request.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                    </Badge>
                  </div>
                  <CardDescription>
                    Solicitado em {new Date(request.requestDate).toLocaleDateString('pt-BR')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Email:</span>
                      <div className="text-gray-900">{request.email}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">Telefone:</span>
                      <div className="text-gray-900">{request.phone}</div>
                    </div>
                    <div>
                      <span className="text-gray-500">CNPJ:</span>
                      <div className="text-gray-900">{request.cnpj}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Dialog de Detalhes */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes da Solicitação</DialogTitle>
              <DialogDescription>
                Informações detalhadas sobre a solicitação de organizador
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">{selectedRequest.organizationName}</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="text-gray-900">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Telefone</Label>
                    <p className="text-gray-900">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">CNPJ</Label>
                    <p className="text-gray-900">{selectedRequest.cnpj}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Data da Solicitação</Label>
                    <p className="text-gray-900">
                      {new Date(selectedRequest.requestDate).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  {selectedRequest.website && (
                    <div className="col-span-2">
                      <Label className="text-gray-500">Website</Label>
                      <p className="text-blue-600">{selectedRequest.website}</p>
                    </div>
                  )}
                  {selectedRequest.address && (
                    <div className="col-span-2">
                      <Label className="text-gray-500">Endereço</Label>
                      <p className="text-gray-900">{selectedRequest.address}</p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-gray-500">Descrição da Organização</Label>
                <p className="text-gray-900 mt-2">{selectedRequest.description}</p>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Fechar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  <XCircle className="size-4 mr-2" />
                  Rejeitar
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  <CheckCircle className="size-4 mr-2" />
                  Aprovar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={`text-sm ${className || ''}`}>{children}</div>;
}