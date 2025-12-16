import { useState } from 'react';
import { QrCode, CheckCircle, XCircle, Users, Clock, Search, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';
import { toast } from 'sonner@2.0.3';

interface CheckInRecord {
  id: string;
  ticketId: string;
  buyerName: string;
  ticketType: string;
  checkInTime: string;
  staffMember: string;
  manualEntry: boolean;
}

interface EventStats {
  totalTickets: number;
  checkedIn: number;
  pending: number;
  percentageCheckedIn: number;
}

const MOCK_EVENT = {
  id: '1',
  name: 'Festival de Música Eletrônica 2025',
  date: '2025-12-15',
  location: 'Estádio Nacional, São Paulo',
  doors: '18:00',
  start: '20:00'
};

const MOCK_STATS: EventStats = {
  totalTickets: 500,
  checkedIn: 327,
  pending: 173,
  percentageCheckedIn: 65.4
};

const MOCK_RECENT_CHECKINS: CheckInRecord[] = [
  {
    id: '1',
    ticketId: 'TKT-001234',
    buyerName: 'João Silva',
    ticketType: 'Pista',
    checkInTime: new Date().toISOString(),
    staffMember: 'Maria Santos',
    manualEntry: false
  },
  {
    id: '2',
    ticketId: 'TKT-001235',
    buyerName: 'Ana Costa',
    ticketType: 'VIP',
    checkInTime: new Date(Date.now() - 120000).toISOString(),
    staffMember: 'Maria Santos',
    manualEntry: false
  },
  {
    id: '3',
    ticketId: 'TKT-001236',
    buyerName: 'Carlos Oliveira',
    ticketType: 'Camarote',
    checkInTime: new Date(Date.now() - 240000).toISOString(),
    staffMember: 'Pedro Lima',
    manualEntry: true
  }
];

export function StaffCheckIn({ onBack }: { onBack: () => void }) {
  const [qrCode, setQrCode] = useState('');
  const [stats, setStats] = useState<EventStats>(MOCK_STATS);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>(MOCK_RECENT_CHECKINS);
  const [isScanning, setIsScanning] = useState(false);

  const handleScanQRCode = (code: string) => {
    setIsScanning(true);

    // Simular validação
    setTimeout(() => {
      const isValid = Math.random() > 0.2; // 80% de chance de ser válido
      const wasUsed = Math.random() > 0.9; // 10% de chance de já ter sido usado

      if (wasUsed) {
        toast.error('Ingresso já utilizado!', {
          description: 'Este ingresso já fez check-in anteriormente.'
        });
      } else if (isValid) {
        const newCheckIn: CheckInRecord = {
          id: Date.now().toString(),
          ticketId: code,
          buyerName: 'Novo Participante',
          ticketType: ['Pista', 'VIP', 'Camarote'][Math.floor(Math.random() * 3)],
          checkInTime: new Date().toISOString(),
          staffMember: 'Maria Santos',
          manualEntry: false
        };

        setRecentCheckIns([newCheckIn, ...recentCheckIns]);
        setStats({
          ...stats,
          checkedIn: stats.checkedIn + 1,
          pending: stats.pending - 1,
          percentageCheckedIn: ((stats.checkedIn + 1) / stats.totalTickets) * 100
        });

        toast.success('Check-in realizado com sucesso!', {
          description: `${newCheckIn.buyerName} - ${newCheckIn.ticketType}`
        });
      } else {
        toast.error('QR Code inválido!', {
          description: 'Este código não pertence a um ingresso válido.'
        });
      }

      setQrCode('');
      setIsScanning(false);
    }, 1000);
  };

  const handleManualEntry = () => {
    const buyerName = prompt('Nome do comprador:');
    const ticketId = prompt('ID do ingresso:');

    if (buyerName && ticketId) {
      const newCheckIn: CheckInRecord = {
        id: Date.now().toString(),
        ticketId: ticketId,
        buyerName: buyerName,
        ticketType: 'Pista',
        checkInTime: new Date().toISOString(),
        staffMember: 'Maria Santos',
        manualEntry: true
      };

      setRecentCheckIns([newCheckIn, ...recentCheckIns]);
      setStats({
        ...stats,
        checkedIn: stats.checkedIn + 1,
        pending: stats.pending - 1,
        percentageCheckedIn: ((stats.checkedIn + 1) / stats.totalTickets) * 100
      });

      toast.success('Entrada manual autorizada!', {
        description: `${buyerName} - Entrada liberada pela equipe`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          ← Voltar
        </Button>

        {/* Cabeçalho do Evento */}
        <Card className="mb-6 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-900">{MOCK_EVENT.name}</CardTitle>
            <CardDescription className="text-blue-700">
              {new Date(MOCK_EVENT.date).toLocaleDateString('pt-BR')} • {MOCK_EVENT.location}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4 text-sm text-blue-800">
              <div>
                <Clock className="size-4 inline mr-1" />
                Abertura: {MOCK_EVENT.doors}
              </div>
              <div>
                Início: {MOCK_EVENT.start}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estatísticas em Tempo Real */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Total de Ingressos</CardTitle>
              <Users className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">{stats.totalTickets}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Check-ins Realizados</CardTitle>
              <CheckCircle className="size-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-green-600">{stats.checkedIn}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stats.percentageCheckedIn.toFixed(1)}% do total
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Pendentes</CardTitle>
              <Clock className="size-4 text-amber-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-amber-600">{stats.pending}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm">Taxa de Ocupação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl text-gray-900">{stats.percentageCheckedIn.toFixed(1)}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all" 
                  style={{ width: `${stats.percentageCheckedIn}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Scanner de QR Code */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="size-5" />
                Validar QR Code
              </CardTitle>
              <CardDescription>
                Escaneie ou digite o código do ingresso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertCircle className="size-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  Digite o código ou use um leitor de QR Code para validar os ingressos
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Digite ou escaneie o código QR"
                    value={qrCode}
                    onChange={(e) => setQrCode(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && qrCode) {
                        handleScanQRCode(qrCode);
                      }
                    }}
                    disabled={isScanning}
                  />
                  <Button 
                    onClick={() => handleScanQRCode(qrCode)}
                    disabled={!qrCode || isScanning}
                  >
                    {isScanning ? 'Validando...' : 'Validar'}
                  </Button>
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white px-2 text-gray-500">ou</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleManualEntry}
                >
                  <AlertCircle className="size-4 mr-2" />
                  Autorizar Entrada Manual
                </Button>
              </div>

              {/* Simulador de Câmera */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <QrCode className="size-16 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-500">
                  Área de escaneamento do QR Code
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  Use a câmera do dispositivo para escanear
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Check-ins Recentes */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="size-5" />
                Check-ins Recentes
              </CardTitle>
              <CardDescription>
                Últimas entradas validadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-[400px] overflow-y-auto">
                {recentCheckIns.map((checkIn) => (
                  <div 
                    key={checkIn.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <div className="text-sm text-gray-900">{checkIn.buyerName}</div>
                        {checkIn.manualEntry && (
                          <Badge variant="secondary" className="text-xs">Manual</Badge>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {checkIn.ticketType} • {checkIn.ticketId}
                      </div>
                      <div className="text-xs text-gray-400">
                        {new Date(checkIn.checkInTime).toLocaleTimeString('pt-BR')}
                      </div>
                    </div>
                    <CheckCircle className="size-5 text-green-600" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Buscar Ingresso Específico */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="size-5" />
              Buscar Ingresso
            </CardTitle>
            <CardDescription>
              Procure um ingresso específico por ID ou nome do comprador
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <Input
                placeholder="Digite o ID do ingresso ou nome do comprador"
              />
              <Button>
                <Search className="size-4 mr-2" />
                Buscar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
