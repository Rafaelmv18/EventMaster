import { useState } from 'react';
import { ArrowLeft, Download, Filter, Calendar, CreditCard, Ticket, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface Purchase {
  id: string;
  eventTitle: string;
  eventDate: string;
  eventLocation: string;
  purchaseDate: string;
  ticketType: string;
  quantity: number;
  unitPrice: number;
  totalAmount: number;
  paymentMethod: 'credit_card' | 'pix';
  status: 'confirmed' | 'cancelled' | 'refunded' | 'pending';
  usedTickets: number;
  refundAmount?: number;
  refundDate?: string;
  isHalfPrice?: boolean;
}

const MOCK_PURCHASES: Purchase[] = [
  {
    id: 'PUR-001',
    eventTitle: 'Festival de Música Eletrônica 2025',
    eventDate: '2025-12-15',
    eventLocation: 'Estádio Nacional, São Paulo',
    purchaseDate: '2025-11-10',
    ticketType: 'Pista',
    quantity: 2,
    unitPrice: 150,
    totalAmount: 300,
    paymentMethod: 'credit_card',
    status: 'confirmed',
    usedTickets: 0,
    isHalfPrice: false
  },
  {
    id: 'PUR-002',
    eventTitle: 'Teatro: O Fantasma da Ópera',
    eventDate: '2025-11-20',
    eventLocation: 'Teatro Municipal, Rio de Janeiro',
    purchaseDate: '2025-10-15',
    ticketType: 'Plateia',
    quantity: 2,
    unitPrice: 200,
    totalAmount: 400,
    paymentMethod: 'pix',
    status: 'confirmed',
    usedTickets: 2,
    isHalfPrice: true
  },
  {
    id: 'PUR-003',
    eventTitle: 'Stand-Up Comedy Night',
    eventDate: '2025-10-25',
    eventLocation: 'Arena Comedy Club, Curitiba',
    purchaseDate: '2025-10-01',
    ticketType: 'Geral',
    quantity: 1,
    unitPrice: 80,
    totalAmount: 80,
    paymentMethod: 'credit_card',
    status: 'refunded',
    usedTickets: 0,
    refundAmount: 72,
    refundDate: '2025-10-18',
    isHalfPrice: false
  },
  {
    id: 'PUR-004',
    eventTitle: 'Conferência Tech Brasil 2025',
    eventDate: '2025-09-20',
    eventLocation: 'Centro de Convenções, Brasília',
    purchaseDate: '2025-08-15',
    ticketType: 'VIP',
    quantity: 1,
    unitPrice: 350,
    totalAmount: 350,
    paymentMethod: 'pix',
    status: 'confirmed',
    usedTickets: 1,
    isHalfPrice: false
  }
];

interface PurchaseHistoryProps {
  onBack: () => void;
  hideBackButton?: boolean;
}

export function PurchaseHistory({ onBack, hideBackButton = false }: PurchaseHistoryProps) {
  const [purchases] = useState<Purchase[]>(MOCK_PURCHASES);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPayment, setFilterPayment] = useState<string>('all');

  const filteredPurchases = purchases.filter(purchase => {
    const statusMatch = filterStatus === 'all' || purchase.status === filterStatus;
    const paymentMatch = filterPayment === 'all' || purchase.paymentMethod === filterPayment;
    return statusMatch && paymentMatch;
  });

  const activeTicketsCount = purchases
    .filter(p => p.status === 'confirmed' && p.usedTickets < p.quantity)
    .reduce((sum, p) => sum + (p.quantity - p.usedTickets), 0);

  const getStatusBadge = (status: Purchase['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default" className="bg-green-600">Confirmado</Badge>;
      case 'cancelled':
        return <Badge variant="destructive">Cancelado</Badge>;
      case 'refunded':
        return <Badge variant="secondary">Reembolsado</Badge>;
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-500">Pendente</Badge>;
      default:
        return null;
    }
  };

  const getPaymentMethodLabel = (method: Purchase['paymentMethod']) => {
    return method === 'credit_card' ? 'Cartão de Crédito' : 'PIX';
  };

  return (
    <div className={hideBackButton ? "" : "min-h-screen bg-gray-50 py-8"}>
      <div className={hideBackButton ? "" : "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"}>
        {!hideBackButton && (
          <Button variant="ghost" onClick={onBack} className="mb-6">
            <ArrowLeft className="size-4 mr-2" />
            Voltar
          </Button>
        )}

        <div className="mb-8">
          <div>
            {!hideBackButton && <h1 className="text-gray-900 mb-2">Histórico de Compras</h1>}
            <p className="text-gray-600">Acompanhe todas as suas compras e reembolsos</p>
          </div>
        </div>

        {/* Filtros */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="size-5" />
              Filtros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-700 mb-2 block">Status</label>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="confirmed">Confirmados</SelectItem>
                    <SelectItem value="refunded">Reembolsados</SelectItem>
                    <SelectItem value="cancelled">Cancelados</SelectItem>
                    <SelectItem value="pending">Pendentes</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <label className="text-sm text-gray-700 mb-2 block">Forma de Pagamento</label>
                <Select value={filterPayment} onValueChange={setFilterPayment}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="credit_card">Cartão de Crédito</SelectItem>
                    <SelectItem value="pix">PIX</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button variant="outline">
                  <Download className="size-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Compras */}
        <div className="space-y-4">
          {filteredPurchases.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-gray-500">
                Nenhuma compra encontrada com os filtros selecionados
              </CardContent>
            </Card>
          ) : (
            filteredPurchases.map((purchase) => (
              <Card key={purchase.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{purchase.eventTitle}</CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-2">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-4" />
                          {new Date(purchase.eventDate).toLocaleDateString('pt-BR')}
                        </span>
                        <span>{purchase.eventLocation}</span>
                      </CardDescription>
                    </div>
                    {getStatusBadge(purchase.status)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">ID da Compra</div>
                      <div className="text-sm text-gray-900">{purchase.id}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Data da Compra</div>
                      <div className="text-sm text-gray-900">
                        {new Date(purchase.purchaseDate).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Tipo de Ingresso</div>
                      <div className="text-sm text-gray-900">
                        {purchase.isHalfPrice 
                          ? `${purchase.ticketType} (Meia-Entrada)` 
                          : `${purchase.ticketType} - Inteira`}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Quantidade</div>
                      <div className="text-sm text-gray-900">{purchase.quantity} ingresso(s)</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Valor Unitário</div>
                      <div className="text-sm text-gray-900">
                        R$ {purchase.unitPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Valor Total</div>
                      <div className="text-sm text-gray-900">
                        R$ {purchase.totalAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Forma de Pagamento</div>
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <CreditCard className="size-4" />
                        {getPaymentMethodLabel(purchase.paymentMethod)}
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 mb-1">Ingressos Utilizados</div>
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        {purchase.usedTickets > 0 ? (
                          <>
                            <CheckCircle className="size-4 text-green-600" />
                            {purchase.usedTickets}/{purchase.quantity}
                          </>
                        ) : (
                          <>
                            <Clock className="size-4 text-amber-600" />
                            Não utilizado
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {purchase.status === 'refunded' && purchase.refundAmount && (
                    <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-sm text-amber-900">Reembolso Processado</div>
                          <div className="text-xs text-amber-700">
                            {purchase.refundDate && new Date(purchase.refundDate).toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div className="text-amber-900">
                          R$ {purchase.refundAmount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    {purchase.status === 'confirmed' && purchase.usedTickets === 0 && (
                      <Button size="sm" variant="outline">
                        Ver Ingressos
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Download className="size-4 mr-2" />
                      Baixar Comprovante
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
