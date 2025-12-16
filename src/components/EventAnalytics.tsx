import { useState } from 'react';
import { ArrowLeft, Download, TrendingUp, Users, DollarSign, Ticket, Smartphone, Monitor, TabletSmartphone, Calendar } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Badge } from './ui/badge';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { Event, Buyer } from '../App';

interface EventAnalyticsProps {
  event: Event;
  onBack: () => void;
}

// Mock data para demonstração
const generateMockBuyers = (eventId: string): Buyer[] => {
  const names = ['Ana Silva', 'Bruno Costa', 'Carlos Oliveira', 'Diana Santos', 'Eduardo Lima', 'Fernanda Alves', 'Gabriel Souza', 'Helena Pereira', 'Igor Martins', 'Julia Rodrigues', 'Lucas Ferreira', 'Mariana Castro', 'Nicolas Barbosa', 'Olivia Ribeiro', 'Pedro Gomes'];
  const cities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Brasília', 'Curitiba', 'Porto Alegre', 'Salvador'];
  const channels: ('desktop' | 'mobile' | 'app')[] = ['desktop', 'mobile', 'app'];
  const genders: ('male' | 'female' | 'other')[] = ['male', 'female', 'other'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `buyer-${eventId}-${i}`,
    name: names[i % names.length],
    email: `${names[i % names.length].toLowerCase().replace(' ', '.')}@email.com`,
    phone: `(11) ${90000 + i}-${1000 + i}`,
    age: 18 + Math.floor(Math.random() * 50),
    gender: genders[Math.floor(Math.random() * genders.length)],
    city: cities[Math.floor(Math.random() * cities.length)],
    purchaseDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    channel: channels[Math.floor(Math.random() * channels.length)]
  }));
};

const generateSalesData = () => {
  return Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
    vendas: Math.floor(Math.random() * 50) + 10,
    receita: (Math.floor(Math.random() * 50) + 10) * 150
  }));
};

export function EventAnalytics({ event, onBack }: EventAnalyticsProps) {
  const [buyers] = useState<Buyer[]>(generateMockBuyers(event.id));
  const [salesData] = useState(generateSalesData());

  // Cálculos
  const soldTickets = event.totalTickets - event.availableTickets;
  const grossRevenue = soldTickets * event.price;
  const platformFee = grossRevenue * 0.15; // 15% de taxa
  const netRevenue = grossRevenue - platformFee;

  // Vendas por tipo de ingresso
  const ticketTypesSales = event.ticketTypes?.map(type => ({
    name: type.name,
    sold: type.totalTickets - type.availableTickets,
    total: type.totalTickets,
    revenue: (type.totalTickets - type.availableTickets) * type.price
  })) || [];

  // Análise de canais
  const channelData = [
    { name: 'Desktop', value: buyers.filter(b => b.channel === 'desktop').length, icon: Monitor },
    { name: 'Mobile', value: buyers.filter(b => b.channel === 'mobile').length, icon: Smartphone },
    { name: 'App', value: buyers.filter(b => b.channel === 'app').length, icon: TabletSmartphone }
  ];

  // Análise demográfica
  const genderData = [
    { name: 'Masculino', value: buyers.filter(b => b.gender === 'male').length },
    { name: 'Feminino', value: buyers.filter(b => b.gender === 'female').length },
    { name: 'Outro', value: buyers.filter(b => b.gender === 'other').length }
  ];

  const ageGroups = [
    { name: '18-25', value: buyers.filter(b => b.age && b.age >= 18 && b.age <= 25).length },
    { name: '26-35', value: buyers.filter(b => b.age && b.age >= 26 && b.age <= 35).length },
    { name: '36-45', value: buyers.filter(b => b.age && b.age >= 36 && b.age <= 45).length },
    { name: '46+', value: buyers.filter(b => b.age && b.age >= 46).length }
  ];

  const cityData = buyers.reduce((acc, buyer) => {
    if (buyer.city) {
      acc[buyer.city] = (acc[buyer.city] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topCities = Object.entries(cityData)
    .map(([city, count]) => ({ city, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

  const exportBuyersList = () => {
    const csv = [
      ['Nome', 'Email', 'Telefone', 'Idade', 'Gênero', 'Cidade', 'Data da Compra', 'Canal'].join(','),
      ...buyers.map(b => [
        b.name,
        b.email,
        b.phone,
        b.age || 'N/A',
        b.gender === 'male' ? 'M' : b.gender === 'female' ? 'F' : 'O',
        b.city || 'N/A',
        new Date(b.purchaseDate).toLocaleDateString('pt-BR'),
        b.channel
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `compradores-${event.title.replace(/\s+/g, '-').toLowerCase()}.csv`;
    a.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="size-4" />
        Voltar ao Dashboard
      </Button>

      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">{event.title}</h1>
        <p className="text-gray-600">Análise detalhada de vendas e audiência</p>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Receita Bruta</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">R$ {grossRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total de vendas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Receita Líquida</CardTitle>
            <TrendingUp className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-green-600">R$ {netRevenue.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Após taxas da plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Ingressos Vendidos</CardTitle>
            <Ticket className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl">{soldTickets}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.round((soldTickets / event.totalTickets) * 100)}% de ocupação
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm">Taxa da Plataforma</CardTitle>
            <DollarSign className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl text-red-600">R$ {platformFee.toLocaleString('pt-BR')}</div>
            <p className="text-xs text-muted-foreground mt-1">
              15% sobre vendas
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="sales" className="space-y-6">
        <TabsList>
          <TabsTrigger value="sales">Vendas</TabsTrigger>
          <TabsTrigger value="tickets">Ingressos por Lote</TabsTrigger>
          <TabsTrigger value="demographics">Perfil dos Compradores</TabsTrigger>
          <TabsTrigger value="channels">Canais de Acesso</TabsTrigger>
          <TabsTrigger value="buyers">Lista de Compradores</TabsTrigger>
        </TabsList>

        {/* Tab: Curva de Vendas */}
        <TabsContent value="sales" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Curva de Vendas</CardTitle>
              <CardDescription>Histórico de vendas nos últimos 30 dias</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" />
                  <YAxis yAxisId="right" orientation="right" />
                  <Tooltip />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="vendas" stroke="#6366f1" name="Ingressos Vendidos" strokeWidth={2} />
                  <Line yAxisId="right" type="monotone" dataKey="receita" stroke="#10b981" name="Receita (R$)" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Ingressos por Lote */}
        <TabsContent value="tickets" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Vendas por Tipo de Ingresso</CardTitle>
              <CardDescription>Distribuição de vendas entre os diferentes lotes</CardDescription>
            </CardHeader>
            <CardContent>
              {ticketTypesSales.length > 0 ? (
                <>
                  <div className="space-y-4 mb-6">
                    {ticketTypesSales.map((type, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <Badge style={{ backgroundColor: COLORS[index % COLORS.length] }}>{type.name}</Badge>
                            <span className="text-sm text-gray-600">
                              {type.sold} / {type.total} vendidos
                            </span>
                          </div>
                          <span className="text-sm">
                            R$ {type.revenue.toLocaleString('pt-BR')}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="h-2 rounded-full"
                            style={{
                              width: `${(type.sold / type.total) * 100}%`,
                              backgroundColor: COLORS[index % COLORS.length]
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={ticketTypesSales}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="sold" fill="#6366f1" name="Vendidos" />
                      <Bar dataKey="total" fill="#e5e7eb" name="Total" />
                    </BarChart>
                  </ResponsiveContainer>
                </>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  Este evento não possui tipos de ingressos configurados
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Perfil dos Compradores */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Gênero</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribuição por Faixa Etária</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageGroups}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#6366f1" name="Compradores" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Top 5 Cidades</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {topCities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                          <span className="text-sm text-indigo-600">{index + 1}</span>
                        </div>
                        <span>{item.city}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{item.count} compradores</span>
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-indigo-600 h-2 rounded-full"
                            style={{ width: `${(item.count / buyers.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Tab: Canais de Acesso */}
        <TabsContent value="channels" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channelData.map((channel, index) => {
              const Icon = channel.icon;
              const percentage = ((channel.value / buyers.length) * 100).toFixed(1);
              return (
                <Card key={index}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm">{channel.name}</CardTitle>
                    <Icon className="size-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl mb-2">{channel.value}</div>
                    <div className="text-xs text-muted-foreground">{percentage}% do total</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                      <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Canais</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab: Lista de Compradores */}
        <TabsContent value="buyers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Lista Completa de Compradores</CardTitle>
                  <CardDescription>Total de {buyers.length} compradores</CardDescription>
                </div>
                <Button onClick={exportBuyersList} className="gap-2">
                  <Download className="size-4" />
                  Exportar CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Telefone</TableHead>
                      <TableHead>Cidade</TableHead>
                      <TableHead>Data da Compra</TableHead>
                      <TableHead>Canal</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {buyers.slice(0, 20).map((buyer) => (
                      <TableRow key={buyer.id}>
                        <TableCell>{buyer.name}</TableCell>
                        <TableCell className="text-sm text-gray-600">{buyer.email}</TableCell>
                        <TableCell className="text-sm">{buyer.phone}</TableCell>
                        <TableCell>{buyer.city}</TableCell>
                        <TableCell className="text-sm">
                          {new Date(buyer.purchaseDate).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {buyer.channel === 'desktop' && 'Desktop'}
                            {buyer.channel === 'mobile' && 'Mobile'}
                            {buyer.channel === 'app' && 'App'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {buyers.length > 20 && (
                <p className="text-sm text-gray-500 mt-4 text-center">
                  Mostrando 20 de {buyers.length} compradores. Exporte o CSV para ver a lista completa.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
