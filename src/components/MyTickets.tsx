import { ArrowLeft, Calendar, MapPin, Download, QrCode, Ticket as TicketIcon, History } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { toast } from 'sonner@2.0.3';
import { PurchaseHistory } from './PurchaseHistory';
import type { CartItem } from '../App';

interface MyTicketsProps {
  tickets: CartItem[];
  onBack: () => void;
}

export function MyTickets({ tickets, onBack }: MyTicketsProps) {
  const [activeTab, setActiveTab] = useState<'tickets' | 'history'>('tickets');

  // Filtrar apenas ingressos de eventos futuros (não realizados)
  const activeTickets = tickets.filter(item => {
    const eventDate = new Date(item.event.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to compare only dates
    return eventDate >= today;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="size-4" />
        Voltar
      </Button>

      <h1 className="text-gray-900 mb-6">Área do Cliente</h1>

      <div className="bg-white rounded-lg border mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'tickets'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <TicketIcon className="size-5" />
            <span>Meus Ingressos</span>
            {activeTickets.length > 0 && (
              <Badge variant={activeTab === 'tickets' ? 'default' : 'secondary'} className="ml-2">
                {activeTickets.length}
              </Badge>
            )}
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 px-6 py-4 flex items-center justify-center gap-2 transition-colors ${
              activeTab === 'history'
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <History className="size-5" />
            <span>Histórico de Compras</span>
          </button>
        </div>
      </div>

      {activeTab === 'tickets' ? (
        <TicketsTab tickets={activeTickets} onBack={onBack} />
      ) : (
        <PurchaseHistory onBack={() => {}} hideBackButton />
      )}
    </div>
  );
}

interface TicketsTabProps {
  tickets: CartItem[];
  onBack: () => void;
}

function TicketsTab({ tickets, onBack }: TicketsTabProps) {
  return (
    <>
      {tickets.length === 0 ? (
        <div className="bg-white rounded-lg border p-12 text-center">
          <QrCode className="size-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Nenhum ingresso ativo</h2>
          <p className="text-gray-600 mb-6">
            Você não tem ingressos para eventos futuros. Explore nossos eventos!
          </p>
          <Button onClick={onBack}>
            Ver Eventos
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {tickets.map((item, index) => (
            <TicketCard key={index} item={item} ticketNumber={index + 1} />
          ))}
        </div>
      )}
    </>
  );
}

interface TicketCardProps {
  item: CartItem;
  ticketNumber: number;
}

function TicketCard({ item, ticketNumber }: TicketCardProps) {
  const [refundStatus, setRefundStatus] = useState<'none' | 'requested' | 'approved' | 'rejected'>(
    item.refundStatus || 'none'
  );
  const { event, quantity, ticketType } = item;
  const isUpcoming = new Date(event.date) > new Date();
  const price = ticketType ? ticketType.price : event.price;
  const totalPrice = price * quantity;

  // Política de reembolso: permitir reembolso até 7 dias antes do evento
  const eventDate = new Date(event.date);
  const today = new Date();
  const daysUntilEvent = Math.ceil((eventDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  const canRequestRefund = isUpcoming && daysUntilEvent >= 7 && refundStatus === 'none';

  const handleRequestRefund = () => {
    setRefundStatus('requested');
    toast.success('Solicitação de reembolso enviada com sucesso!', {
      description: 'Nossa equipe irá analisar sua solicitação em até 48 horas.'
    });
  };

  const getRefundBadge = () => {
    switch (refundStatus) {
      case 'requested':
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">Reembolso Solicitado</Badge>;
      case 'approved':
        return <Badge variant="outline" className="text-green-600 border-green-600">Reembolso Aprovado</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="text-red-600 border-red-600">Reembolso Recusado</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg border overflow-hidden">
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant={isUpcoming ? 'default' : 'secondary'}>
                {isUpcoming ? 'Próximo' : 'Realizado'}
              </Badge>
              {getRefundBadge()}
            </div>
            <h2 className="text-gray-900 mb-1">{event.title}</h2>
            <div className="flex items-center gap-2">
              <p className="text-gray-600">{event.category}</p>
              {ticketType && (
                <>
                  <span className="text-gray-400">•</span>
                  <Badge variant="outline" className="text-indigo-600 border-indigo-600">
                    {ticketType.name}
                  </Badge>
                </>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-500">Pedido #{ticketNumber.toString().padStart(6, '0')}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-start gap-3">
            <Calendar className="size-5 text-indigo-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Data</div>
              <div className="text-gray-900">
                {new Date(event.date).toLocaleDateString('pt-BR')}
              </div>
              <div className="text-sm text-gray-600">{event.time}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <MapPin className="size-5 text-indigo-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Local</div>
              <div className="text-gray-900">{event.location}</div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <QrCode className="size-5 text-indigo-600 mt-0.5" />
            <div>
              <div className="text-sm text-gray-500">Ingressos</div>
              <div className="text-gray-900">{quantity}x Ingresso(s)</div>
              <div className="text-sm text-gray-600">R$ {totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {refundStatus === 'requested' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-yellow-800">
              Sua solicitação de reembolso está em análise. Você receberá uma resposta em até 48 horas.
            </p>
          </div>
        )}

        {refundStatus === 'approved' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-green-800">
              Seu reembolso foi aprovado! O valor de R$ {(totalPrice * 0.9).toFixed(2)} (90% do valor total) será creditado em até 7 dias úteis.
            </p>
          </div>
        )}

        {refundStatus === 'rejected' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-red-800">
              Sua solicitação de reembolso foi recusada. Entre em contato com o suporte para mais informações.
            </p>
          </div>
        )}

        {isUpcoming && refundStatus === 'none' && (
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-24 h-24 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                <QrCode className="size-12 text-gray-400" />
              </div>
              <div className="flex-1">
                <div className="text-gray-900 mb-1">QR Code de Acesso</div>
                <p className="text-sm text-gray-600">
                  Apresente este QR Code na entrada do evento para validar seu ingresso.
                </p>
              </div>
            </div>
          </div>
        )}

        {!canRequestRefund && isUpcoming && refundStatus === 'none' && daysUntilEvent < 7 && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-sm text-blue-800">
              <strong>Política de Reembolso:</strong> Reembolsos só podem ser solicitados até 7 dias antes do evento. 
              Você tem {daysUntilEvent} dia(s) restante(s) até o evento.
            </p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          {isUpcoming && refundStatus === 'none' && (
            <>
              <Button variant="outline" className="gap-2">
                <Download className="size-4" />
                Baixar Ingresso
              </Button>
              <Button variant="outline" className="gap-2">
                <QrCode className="size-4" />
                Ver QR Code
              </Button>
            </>
          )}
          <Button variant="outline">
            Ver Detalhes
          </Button>
          
          {canRequestRefund && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="text-red-600 hover:text-red-700">
                  Solicitar Reembolso
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Solicitar Reembolso</AlertDialogTitle>
                  <AlertDialogDescription>
                    Você tem certeza que deseja solicitar o reembolso deste ingresso?
                    <br /><br />
                    <strong>Valor a ser reembolsado:</strong> R$ {(totalPrice * 0.9).toFixed(2)} (90% do valor total)
                    <br />
                    <strong>Taxa de processamento:</strong> R$ {(totalPrice * 0.1).toFixed(2)} (10%)
                    <br /><br />
                    O reembolso será processado em até 7 dias úteis após a aprovação.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRequestRefund} className="bg-red-600 hover:bg-red-700">
                    Confirmar Reembolso
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </div>
  );
}