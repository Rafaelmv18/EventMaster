import { useState } from 'react';
import { Calendar, MapPin, Clock, Users, ArrowLeft, Plus, Minus } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Label } from './ui/label';
import type { Event, TicketType } from '../App';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface EventDetailsProps {
  event: Event;
  onBuyTickets: (event: Event, quantity: number, ticketType?: TicketType) => void;
  onBack: () => void;
}

export function EventDetails({ event, onBuyTickets, onBack }: EventDetailsProps) {
  const [quantity, setQuantity] = useState(1);
  const [selectedTicketType, setSelectedTicketType] = useState<TicketType | undefined>(
    event.ticketTypes && event.ticketTypes.length > 0 ? event.ticketTypes[0] : undefined
  );
  const [isHalfPrice, setIsHalfPrice] = useState(false);

  const handleIncrement = () => {
    const maxTickets = selectedTicketType 
      ? Math.min(10, selectedTicketType.availableTickets)
      : Math.min(10, event.availableTickets);
    if (quantity < maxTickets) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const basePrice = selectedTicketType ? selectedTicketType.price : event.price;
  const currentPrice = isHalfPrice ? basePrice * 0.5 : basePrice;
  const currentAvailableTickets = selectedTicketType 
    ? selectedTicketType.availableTickets 
    : event.availableTickets;
  const totalPrice = currentPrice * quantity;
  const soldPercentage = ((event.totalTickets - currentAvailableTickets) / event.totalTickets) * 100;
  const allowHalfPrice = selectedTicketType?.allowHalfPrice || false;

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="aspect-video w-full bg-gray-200 rounded-lg overflow-hidden mb-6">
            <ImageWithFallback
              src={`https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1200&q=80`}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="mb-4">
            <Badge className="mb-3">{event.category}</Badge>
            <h1 className="text-gray-900 mb-4">{event.title}</h1>
            <p className="text-gray-600">
              {event.description}
            </p>
          </div>

          <div className="bg-white rounded-lg border p-6 mb-6">
            <h2 className="text-gray-900 mb-4">Informações do Evento</h2>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="size-5 text-indigo-600 mt-0.5" />
                <div>
                  <div className="text-gray-900">Data</div>
                  <div className="text-gray-600 text-sm">
                    {new Date(event.date).toLocaleDateString('pt-BR', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="size-5 text-indigo-600 mt-0.5" />
                <div>
                  <div className="text-gray-900">Horário</div>
                  <div className="text-gray-600 text-sm">{event.time}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MapPin className="size-5 text-indigo-600 mt-0.5" />
                <div>
                  <div className="text-gray-900">Local</div>
                  <div className="text-gray-600 text-sm">{event.location}</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Users className="size-5 text-indigo-600 mt-0.5" />
                <div>
                  <div className="text-gray-900">Disponibilidade</div>
                  <div className="text-gray-600 text-sm">
                    {currentAvailableTickets} ingressos disponíveis de {event.totalTickets}
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-indigo-600 h-2 rounded-full"
                      style={{ width: `${soldPercentage}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border p-6">
            <h2 className="text-gray-900 mb-4">Sobre o Evento</h2>
            <div className="text-gray-600 space-y-4">
              <p>
                Este é um evento imperdível que promete proporcionar uma experiência única e memorável 
                para todos os participantes. Com uma produção de alta qualidade e atenção aos detalhes, 
                garantimos um evento seguro e bem organizado.
              </p>
              <p>
                <strong>Classificação:</strong> Livre para todos os públicos
              </p>
              <p>
                <strong>Política de entrada:</strong> É necessário apresentar ingresso digital ou impresso 
                e documento de identificação com foto na entrada.
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar - Purchase Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            {/* Ticket Type Selection */}
            {event.ticketTypes && event.ticketTypes.length > 0 && (
              <div className="mb-6 pb-6 border-b">
                <label className="text-gray-900 text-sm mb-3 block">
                  Tipo de Ingresso
                </label>
                <RadioGroup 
                  value={selectedTicketType?.id} 
                  onValueChange={(value) => {
                    const ticketType = event.ticketTypes?.find(t => t.id === value);
                    setSelectedTicketType(ticketType);
                    setQuantity(1);
                    setIsHalfPrice(false);
                  }}
                >
                  {event.ticketTypes.map((ticketType) => {
                    const isAvailable = ticketType.availableTickets > 0;
                    return (
                      <div 
                        key={ticketType.id} 
                        className={`flex items-start p-3 border rounded-lg mb-2 ${
                          selectedTicketType?.id === ticketType.id ? 'border-indigo-600 bg-indigo-50' : 'border-gray-200'
                        } ${
                          !isAvailable ? 'opacity-50' : 'cursor-pointer hover:border-indigo-300'
                        }`}
                      >
                        <RadioGroupItem 
                          value={ticketType.id} 
                          id={ticketType.id} 
                          disabled={!isAvailable}
                          className="mt-1"
                        />
                        <Label 
                          htmlFor={ticketType.id} 
                          className="flex-1 ml-3 cursor-pointer"
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-gray-900">{ticketType.name}</span>
                            <span className="text-gray-900">R$ {ticketType.price.toFixed(2)}</span>
                          </div>
                          {ticketType.description && (
                            <div className="text-sm text-gray-600 mb-1">
                              {ticketType.description}
                            </div>
                          )}
                          <div className="text-xs text-gray-500">
                            {isAvailable 
                              ? `${ticketType.availableTickets} disponíveis` 
                              : 'Esgotado'
                            }
                          </div>
                        </Label>
                      </div>
                    );
                  })}
                </RadioGroup>
              </div>
            )}

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Valor do ingresso</div>
              <div className="text-gray-900 text-3xl">R$ {currentPrice.toFixed(2)}</div>
            </div>
            
            <div className="mb-6">
              <label className="text-gray-900 text-sm mb-3 block">
                Quantidade de ingressos
              </label>
              
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                >
                  <Minus className="size-4" />
                </Button>
                
                <div className="flex-1 text-center">
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const val = parseInt(e.target.value);
                      if (val >= 1 && val <= Math.min(10, currentAvailableTickets)) {
                        setQuantity(val);
                      }
                    }}
                    className="w-full text-center border rounded-md py-2 text-gray-900"
                    min="1"
                    max={Math.min(10, currentAvailableTickets)}
                  />
                </div>
                
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleIncrement}
                  disabled={quantity >= Math.min(10, currentAvailableTickets)}
                >
                  <Plus className="size-4" />
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                Máximo de {Math.min(10, currentAvailableTickets)} ingressos por compra
              </div>
            </div>

            {allowHalfPrice && (
              <div className="mb-6">
                <label className="text-gray-900 text-sm mb-3 block">
                  Opções de Preço
                </label>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="full"
                    id="full"
                    checked={!isHalfPrice}
                    onValueChange={() => setIsHalfPrice(false)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="full"
                    className="flex-1 ml-3 cursor-pointer"
                  >
                    Preço Completo
                  </Label>
                </div>
                <div className="flex items-center gap-3">
                  <RadioGroupItem
                    value="half"
                    id="half"
                    checked={isHalfPrice}
                    onValueChange={() => setIsHalfPrice(true)}
                    className="mt-1"
                  />
                  <Label
                    htmlFor="half"
                    className="flex-1 ml-3 cursor-pointer"
                  >
                    Preço Reduzido (50%)
                  </Label>
                </div>
              </div>
            )}

            <div className="border-t pt-4 mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">R$ {totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Taxa de serviço</span>
                <span className="text-gray-900">R$ {(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900 text-xl">
                  R$ {(totalPrice * 1.1).toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => onBuyTickets(event, quantity, selectedTicketType)}
              disabled={currentAvailableTickets === 0}
            >
              {currentAvailableTickets === 0 ? 'Esgotado' : 'Comprar Ingressos'}
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Compra 100% segura e protegida
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}