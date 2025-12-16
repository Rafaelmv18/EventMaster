import { useState } from 'react';
import { Building2, Mail, Phone, FileText, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { toast } from 'sonner@2.0.3';

interface OrganizerRequestProps {
  onBack: () => void;
}

export function OrganizerRequest({ onBack }: OrganizerRequestProps) {
  const [formData, setFormData] = useState({
    organizationName: '',
    email: '',
    phone: '',
    cnpj: '',
    description: '',
    website: '',
    address: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.organizationName || !formData.email || !formData.phone || !formData.cnpj) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    toast.success('Solicitação enviada com sucesso! Aguarde a análise dos administradores.');
    
    // Reseta o formulário
    setFormData({
      organizationName: '',
      email: '',
      phone: '',
      cnpj: '',
      description: '',
      website: '',
      address: ''
    });
    
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button
          variant="ghost"
          onClick={onBack}
          className="mb-6"
        >
          <ArrowLeft className="size-4 mr-2" />
          Voltar
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-6 text-blue-600" />
              Solicitação de Cadastro como Organizador
            </CardTitle>
            <CardDescription>
              Preencha os dados da sua organização para solicitar acesso como organizador de eventos.
              Nossa equipe irá analisar sua solicitação em até 48 horas.
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="organizationName">
                    Nome da Organização *
                  </Label>
                  <Input
                    id="organizationName"
                    value={formData.organizationName}
                    onChange={(e) => setFormData({ ...formData, organizationName: e.target.value })}
                    placeholder="Ex: Produtora ABC Eventos"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ *</Label>
                  <Input
                    id="cnpj"
                    value={formData.cnpj}
                    onChange={(e) => setFormData({ ...formData, cnpj: e.target.value })}
                    placeholder="00.000.000/0000-00"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="size-4 inline mr-1" />
                    Email Corporativo *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contato@empresa.com.br"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">
                    <Phone className="size-4 inline mr-1" />
                    Telefone *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="(11) 98888-8888"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website (opcional)</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://www.seusite.com.br"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Endereço</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Rua, número, cidade - UF"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">
                  <FileText className="size-4 inline mr-1" />
                  Descrição da Organização
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Conte-nos sobre sua empresa, tipos de eventos que organiza, experiência no mercado, etc."
                  rows={6}
                />
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-blue-900 mb-2">Benefícios como Organizador</h3>
                <ul className="text-blue-800 space-y-1 text-sm">
                  <li>✓ Criação e gerenciamento ilimitado de eventos</li>
                  <li>✓ Dashboard com análises detalhadas de vendas</li>
                  <li>✓ Exportação de lista de compradores</li>
                  <li>✓ Relatórios de receita e ocupação em tempo real</li>
                  <li>✓ Controle de tipos de ingressos e preços</li>
                  <li>✓ Suporte prioritário da plataforma</li>
                </ul>
              </div>

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Enviar Solicitação
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
