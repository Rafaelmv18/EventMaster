import { useState } from 'react';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import type { CartItem } from '../App';

interface CheckoutProps {
  cart: CartItem[];
  onComplete: () => void;
  onBack: () => void;
}

export function Checkout({ cart, onComplete, onBack }: CheckoutProps) {
  const [paymentMethod, setPaymentMethod] = useState('credit');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    cpf: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  const subtotal = cart.reduce((acc, item) => {
    const price = item.ticketType ? item.ticketType.price : item.event.price;
    return acc + (price * item.quantity);
  }, 0);
  const serviceFee = subtotal * 0.1;
  const total = subtotal + serviceFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate payment processing
    setTimeout(() => {
      onComplete();
    }, 1000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

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

      <h1 className="text-gray-900 mb-8">Finalizar Compra</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-gray-900 mb-4">Informações Pessoais</h2>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>

                <div>
                  <Label htmlFor="cpf">CPF</Label>
                  <Input
                    id="cpf"
                    type="text"
                    required
                    value={formData.cpf}
                    onChange={(e) => handleInputChange('cpf', e.target.value)}
                    placeholder="000.000.000-00"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-gray-900 mb-4">Método de Pagamento</h2>
              
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="mb-6">
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="credit" id="credit" />
                  <Label htmlFor="credit" className="flex-1 cursor-pointer">
                    Cartão de Crédito
                  </Label>
                  <CreditCard className="size-5 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="debit" id="debit" />
                  <Label htmlFor="debit" className="flex-1 cursor-pointer">
                    Cartão de Débito
                  </Label>
                  <CreditCard className="size-5 text-gray-400" />
                </div>
                
                <div className="flex items-center space-x-2 p-4 border rounded-lg">
                  <RadioGroupItem value="pix" id="pix" />
                  <Label htmlFor="pix" className="flex-1 cursor-pointer">
                    PIX
                  </Label>
                </div>
              </RadioGroup>

              {(paymentMethod === 'credit' || paymentMethod === 'debit') && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardNumber">Número do Cartão</Label>
                    <Input
                      id="cardNumber"
                      type="text"
                      required
                      value={formData.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                    />
                  </div>

                  <div>
                    <Label htmlFor="cardName">Nome no Cartão</Label>
                    <Input
                      id="cardName"
                      type="text"
                      required
                      value={formData.cardName}
                      onChange={(e) => handleInputChange('cardName', e.target.value)}
                      placeholder="Nome como está no cartão"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiryDate">Validade</Label>
                      <Input
                        id="expiryDate"
                        type="text"
                        required
                        value={formData.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                        placeholder="MM/AA"
                        maxLength={5}
                      />
                    </div>

                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        type="text"
                        required
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="123"
                        maxLength={3}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'pix' && (
                <div className="text-gray-600 text-sm bg-gray-50 p-4 rounded-lg">
                  <p>Após confirmar o pedido, você receberá um QR Code para pagamento via PIX.</p>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Lock className="size-4" />
              <span>Seus dados estão seguros e criptografados</span>
            </div>
          </form>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border p-6 sticky top-24">
            <h2 className="text-gray-900 mb-4">Resumo do Pedido</h2>
            
            <div className="space-y-4 mb-6">
              {cart.map((item, index) => (
                <div key={index} className="pb-4 border-b">
                  <div className="text-gray-900 mb-1">{item.event.title}</div>
                  {item.ticketType && (
                    <div className="text-sm text-indigo-600 mb-1">
                      {item.ticketType.name}
                    </div>
                  )}
                  <div className="text-sm text-gray-600 mb-2">
                    {item.quantity}x R$ {item.ticketType ? item.ticketType.price : item.event.price}
                  </div>
                  <div className="text-gray-900">
                    R$ {((item.ticketType ? item.ticketType.price : item.event.price) * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>R$ {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Taxa de serviço</span>
                <span>R$ {serviceFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900 text-xl">R$ {total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={handleSubmit}
            >
              Confirmar Pagamento
            </Button>

            <div className="mt-4 text-xs text-gray-500 text-center">
              Ao confirmar, você concorda com nossos Termos de Uso
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}