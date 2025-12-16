import { useState } from 'react';
import { ArrowLeft, Save, Info } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Alert, AlertDescription } from './ui/alert';
import { Slider } from './ui/slider';
import { toast } from 'sonner@2.0.3';

interface CommissionSettings {
  defaultRate: number;
  musicEvents: number;
  theaterEvents: number;
  sportsEvents: number;
  conferenceEvents: number;
  minimumCommission: number;
  paymentProcessingFee: number;
}

export function ManageCommissions({ onBack }: { onBack: () => void }) {
  const [settings, setSettings] = useState<CommissionSettings>({
    defaultRate: 5,
    musicEvents: 5,
    theaterEvents: 4,
    sportsEvents: 6,
    conferenceEvents: 5,
    minimumCommission: 2,
    paymentProcessingFee: 3.5
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSave = () => {
    toast.success('Configurações de comissões salvas com sucesso!');
    setHasChanges(false);
  };

  const updateSetting = (key: keyof CommissionSettings, value: number) => {
    setSettings({ ...settings, [key]: value });
    setHasChanges(true);
  };

  // Cálculos de exemplo
  const exampleTicketPrice = 100;
  const calculateCommission = (rate: number) => {
    return (exampleTicketPrice * rate) / 100;
  };

  const totalPlatformFee = calculateCommission(settings.defaultRate) + 
                          (exampleTicketPrice * settings.paymentProcessingFee) / 100;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <h1 className="text-gray-900 mb-2">Configurar Comissões da Plataforma</h1>
        <p className="text-gray-600">Defina as taxas e comissões aplicadas a cada tipo de evento</p>
      </div>

      <Alert className="mb-6 bg-blue-50 border-blue-200">
        <Info className="size-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          As alterações nas taxas de comissão serão aplicadas apenas a novos eventos criados após a data de alteração.
          Eventos existentes manterão as taxas originais.
        </AlertDescription>
      </Alert>

      <div className="space-y-6">
        {/* Taxa Padrão */}
        <Card>
          <CardHeader>
            <CardTitle>Taxa de Comissão Padrão</CardTitle>
            <CardDescription>
              Taxa aplicada a todos os eventos que não possuem configuração específica
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Label>Taxa Padrão (%)</Label>
                <div className="text-2xl text-gray-900">{settings.defaultRate}%</div>
              </div>
              <Slider
                value={[settings.defaultRate]}
                onValueChange={([value]) => updateSetting('defaultRate', value)}
                min={0}
                max={20}
                step={0.5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>20%</span>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-700 mb-2">Exemplo de cálculo:</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Preço do ingresso:</span>
                  <span className="text-gray-900">R$ {exampleTicketPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Comissão ({settings.defaultRate}%):</span>
                  <span className="text-gray-900">R$ {calculateCommission(settings.defaultRate).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-900 pt-2 border-t">
                  <span>Organizador recebe:</span>
                  <span>R$ {(exampleTicketPrice - calculateCommission(settings.defaultRate)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Taxas por Categoria */}
        <Card>
          <CardHeader>
            <CardTitle>Comissões por Categoria de Evento</CardTitle>
            <CardDescription>
              Configure taxas específicas para cada categoria de evento
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Música */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>🎵 Eventos de Música</Label>
                <Input
                  type="number"
                  value={settings.musicEvents}
                  onChange={(e) => updateSetting('musicEvents', parseFloat(e.target.value))}
                  className="w-20 text-center"
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>
              <Slider
                value={[settings.musicEvents]}
                onValueChange={([value]) => updateSetting('musicEvents', value)}
                min={0}
                max={20}
                step={0.5}
              />
            </div>

            {/* Teatro */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>🎭 Eventos de Teatro</Label>
                <Input
                  type="number"
                  value={settings.theaterEvents}
                  onChange={(e) => updateSetting('theaterEvents', parseFloat(e.target.value))}
                  className="w-20 text-center"
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>
              <Slider
                value={[settings.theaterEvents]}
                onValueChange={([value]) => updateSetting('theaterEvents', value)}
                min={0}
                max={20}
                step={0.5}
              />
            </div>

            {/* Esportes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>⚽ Eventos Esportivos</Label>
                <Input
                  type="number"
                  value={settings.sportsEvents}
                  onChange={(e) => updateSetting('sportsEvents', parseFloat(e.target.value))}
                  className="w-20 text-center"
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>
              <Slider
                value={[settings.sportsEvents]}
                onValueChange={([value]) => updateSetting('sportsEvents', value)}
                min={0}
                max={20}
                step={0.5}
              />
            </div>

            {/* Conferências */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label>💼 Conferências e Workshops</Label>
                <Input
                  type="number"
                  value={settings.conferenceEvents}
                  onChange={(e) => updateSetting('conferenceEvents', parseFloat(e.target.value))}
                  className="w-20 text-center"
                  min={0}
                  max={20}
                  step={0.5}
                />
              </div>
              <Slider
                value={[settings.conferenceEvents]}
                onValueChange={([value]) => updateSetting('conferenceEvents', value)}
                min={0}
                max={20}
                step={0.5}
              />
            </div>
          </CardContent>
        </Card>

        {/* Taxas Adicionais */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações Adicionais</CardTitle>
            <CardDescription>
              Outras taxas e configurações da plataforma
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <Label className="mb-3 block">Comissão Mínima (R$)</Label>
              <Input
                type="number"
                value={settings.minimumCommission}
                onChange={(e) => updateSetting('minimumCommission', parseFloat(e.target.value))}
                min={0}
                step={0.5}
              />
              <p className="text-xs text-gray-500 mt-2">
                Valor mínimo de comissão cobrada por ingresso, independente da taxa percentual
              </p>
            </div>

            <div>
              <Label className="mb-3 block">Taxa de Processamento de Pagamento (%)</Label>
              <Input
                type="number"
                value={settings.paymentProcessingFee}
                onChange={(e) => updateSetting('paymentProcessingFee', parseFloat(e.target.value))}
                min={0}
                max={10}
                step={0.1}
              />
              <p className="text-xs text-gray-500 mt-2">
                Taxa adicional para cobrir custos de gateway de pagamento (cartão de crédito, PIX, etc.)
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Resumo das Taxas */}
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">Resumo de Taxas Totais</CardTitle>
            <CardDescription className="text-blue-700">
              Taxas totais aplicadas ao organizador (incluindo processamento de pagamento)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-blue-900">Comissão da Plataforma:</span>
                <span className="text-blue-900">{settings.defaultRate}%</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-900">Taxa de Processamento:</span>
                <span className="text-blue-900">{settings.paymentProcessingFee}%</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-blue-200">
                <span className="text-blue-900">Taxa Total ao Organizador:</span>
                <span className="text-blue-900 text-lg">
                  {(settings.defaultRate + settings.paymentProcessingFee).toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-white rounded border border-blue-200">
              <div className="text-xs text-blue-700 mb-2">Exemplo para ingresso de R$ 100,00:</div>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between text-blue-800">
                  <span>Comissão plataforma:</span>
                  <span>R$ {calculateCommission(settings.defaultRate).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-800">
                  <span>Processamento:</span>
                  <span>R$ {((exampleTicketPrice * settings.paymentProcessingFee) / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-900 pt-2 border-t border-blue-200">
                  <span>Total de taxas:</span>
                  <span>R$ {totalPlatformFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-blue-900 pt-2 border-t border-blue-200">
                  <span>Organizador recebe:</span>
                  <span className="text-green-600">
                    R$ {(exampleTicketPrice - totalPlatformFee).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botões de Ação */}
        <div className="flex gap-3 justify-end">
          <Button variant="outline" onClick={onBack}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!hasChanges}
            className="gap-2"
          >
            <Save className="size-4" />
            Salvar Configurações
          </Button>
        </div>
      </div>
    </div>
  );
}
