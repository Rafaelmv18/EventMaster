import { useState } from 'react';
import { ArrowLeft, Download, Calendar, TrendingUp, DollarSign, Users, Ticket, FileText } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { toast } from 'sonner@2.0.3';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 145000, commission: 7250, tickets: 3200 },
  { month: 'Fev', revenue: 168000, commission: 8400, tickets: 3800 },
  { month: 'Mar', revenue: 195000, commission: 9750, tickets: 4300 },
  { month: 'Abr', revenue: 220000, commission: 11000, tickets: 4900 },
  { month: 'Mai', revenue: 185000, commission: 9250, tickets: 4100 },
  { month: 'Jun', revenue: 210000, commission: 10500, tickets: 4700 },
  { month: 'Jul', revenue: 250000, commission: 12500, tickets: 5500 },
  { month: 'Ago', revenue: 235000, commission: 11750, tickets: 5200 },
  { month: 'Set', revenue: 198000, commission: 9900, tickets: 4400 },
  { month: 'Out', revenue: 223000, commission: 11150, tickets: 4950 },
  { month: 'Nov', revenue: 267000, commission: 13350, tickets: 5900 },
];

const CATEGORY_DATA = [
  { name: 'Música', value: 980000, color: '#3b82f6' },
  { name: 'Teatro', value: 735000, color: '#8b5cf6' },
  { name: 'Esporte', value: 490000, color: '#10b981' },
  { name: 'Conferência', value: 245000, color: '#f59e0b' }
];

const ORGANIZER_PERFORMANCE = [
  { name: 'Live Nation Brasil', events: 45, revenue: 1250000, tickets: 32500 },
  { name: 'Rock World', events: 28, revenue: 850000, tickets: 21000 },
  { name: 'Teatro Nacional', events: 35, revenue: 675000, tickets: 18500 },
  { name: 'Sports Events BR', events: 22, revenue: 540000, tickets: 14200 },
  { name: 'Tech Conferences', events: 18, revenue: 380000, tickets: 9800 }
];

const TOP_EVENTS = [
  { name: 'Rock in Rio 2025', tickets: 85000, revenue: 38250000, organizer: 'Live Nation Brasil' },
  { name: 'Festival Eletrônica SP', tickets: 45000, revenue: 6750000, organizer: 'Rock World' },
  { name: 'Jogos Pan-Americanos', tickets: 120000, revenue: 12000000, organizer: 'Sports Events BR' },
  { name: 'Tech Summit 2025', tickets: 5000, revenue: 1750000, organizer: 'Tech Conferences' },
  { name: 'Musical da Broadway', tickets: 15000, revenue: 3000000, organizer: 'Teatro Nacional' }
];

export function GlobalReports({ onBack }: { onBack: () => void }) {
  const [selectedPeriod, setSelectedPeriod] = useState('year');
  const [currentTab, setCurrentTab] = useState('overview');

  const handleExport = (reportType: string) => {
    toast.success(`Relatório de ${reportType} exportado com sucesso!`);
  };

  const totalRevenue = REVENUE_DATA.reduce((acc, item) => acc + item.revenue, 0);
  const totalCommission = REVENUE_DATA.reduce((acc, item) => acc + item.commission, 0);
  const totalTickets = REVENUE_DATA.reduce((acc, item) => acc + item.tickets, 0);
  const avgTicketPrice = totalRevenue / totalTickets;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          <ArrowLeft className="size-4 mr-2" />
          Voltar ao Dashboard
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Relatórios Globais</h1>
            <p className="text-gray-600">Análises e insights de toda a plataforma</p>
          </div>
          <div className="flex gap-3">
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="month">Último Mês</SelectItem>
                <SelectItem value="quarter">Último Trimestre</SelectItem>
                <SelectItem value="year">Último Ano</SelectItem>
                <SelectItem value="all">Todo Período</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => handleExport('completo')}>
              <Download className="size-4 mr-2" />
              Exportar PDF
            </Button>
          </div>
        </div>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="revenue">Receita</TabsTrigger>
          <TabsTrigger value="organizers">Organizadores</TabsTrigger>
          <TabsTrigger value="events">Eventos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* KPIs Principais */}
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
                  +18.2% vs período anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Comissões</CardTitle>
                <TrendingUp className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  R$ {totalCommission.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {((totalCommission / totalRevenue) * 100).toFixed(1)}% do total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Ingressos Vendidos</CardTitle>
                <Ticket className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  {totalTickets.toLocaleString('pt-BR')}
                </div>
                <p className="text-xs text-green-600 mt-1">
                  +12.5% vs período anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm">Ticket Médio</CardTitle>
                <Users className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl text-gray-900">
                  R$ {avgTicketPrice.toFixed(2)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Todas as categorias
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Gráfico de Evolução da Receita */}
          <Card>
            <CardHeader>
              <CardTitle>Evolução da Receita e Comissões</CardTitle>
              <CardDescription>Últimos 11 meses</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={REVENUE_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                  />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="revenue" 
                    stroke="#3b82f6" 
                    name="Receita Total"
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="commission" 
                    stroke="#10b981" 
                    name="Comissões"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Distribuição por Categoria */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Receita por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={CATEGORY_DATA}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {CATEGORY_DATA.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ingressos Vendidos por Mês</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="tickets" fill="#3b82f6" name="Ingressos" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Receita Mensal Detalhada</CardTitle>
                <CardDescription>Receita bruta vs comissões da plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={REVENUE_DATA}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value: number) => `R$ ${value.toLocaleString('pt-BR')}`}
                    />
                    <Legend />
                    <Bar dataKey="revenue" fill="#3b82f6" name="Receita Total" />
                    <Bar dataKey="commission" fill="#10b981" name="Comissões" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Métricas de Receita</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="text-sm text-gray-500 mb-1">Receita Bruta</div>
                  <div className="text-2xl text-gray-900">
                    R$ {totalRevenue.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Comissões Totais</div>
                  <div className="text-2xl text-green-600">
                    R$ {totalCommission.toLocaleString('pt-BR')}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 mb-1">Receita Organizadores</div>
                  <div className="text-2xl text-gray-900">
                    R$ {(totalRevenue - totalCommission).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <div className="text-sm text-gray-500 mb-1">Taxa Média</div>
                  <div className="text-xl text-gray-900">
                    {((totalCommission / totalRevenue) * 100).toFixed(2)}%
                  </div>
                </div>
                <Button 
                  className="w-full mt-4"
                  onClick={() => handleExport('receita')}
                >
                  <Download className="size-4 mr-2" />
                  Exportar Relatório
                </Button>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Receita por Categoria</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {CATEGORY_DATA.map((category) => (
                  <div key={category.name}>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-900">{category.name}</span>
                      <span className="text-gray-900">R$ {category.value.toLocaleString('pt-BR')}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="h-3 rounded-full" 
                        style={{ 
                          width: `${(category.value / CATEGORY_DATA.reduce((acc, c) => acc + c.value, 0)) * 100}%`,
                          backgroundColor: category.color
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="organizers" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance dos Organizadores</CardTitle>
                  <CardDescription>Top 5 organizadores por receita</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('organizadores')}
                >
                  <Download className="size-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Organizador</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Eventos</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ingressos</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Receita</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Comissão (5%)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {ORGANIZER_PERFORMANCE.map((org, index) => (
                      <tr key={org.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 bg-blue-100 rounded-full text-blue-600">
                              {index + 1}
                            </div>
                            <span className="text-gray-900">{org.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-900">{org.events}</td>
                        <td className="px-6 py-4 text-gray-900">{org.tickets.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 text-gray-900">
                          R$ {org.revenue.toLocaleString('pt-BR')}
                        </td>
                        <td className="px-6 py-4 text-green-600">
                          R$ {(org.revenue * 0.05).toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Comparativo de Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ORGANIZER_PERFORMANCE}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: number) => value.toLocaleString('pt-BR')}
                  />
                  <Legend />
                  <Bar dataKey="events" fill="#3b82f6" name="Eventos" />
                  <Bar dataKey="tickets" fill="#10b981" name="Ingressos (÷100)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Top Eventos por Receita</CardTitle>
                  <CardDescription>Eventos com maior faturamento</CardDescription>
                </div>
                <Button 
                  variant="outline"
                  onClick={() => handleExport('eventos')}
                >
                  <Download className="size-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Evento</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Organizador</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Ingressos</th>
                      <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase">Receita</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {TOP_EVENTS.map((event, index) => (
                      <tr key={event.name} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center justify-center size-8 bg-amber-100 rounded-full text-amber-600">
                              {index + 1}
                            </div>
                            <span className="text-gray-900">{event.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{event.organizer}</td>
                        <td className="px-6 py-4 text-gray-900">{event.tickets.toLocaleString('pt-BR')}</td>
                        <td className="px-6 py-4 text-gray-900">
                          R$ {event.revenue.toLocaleString('pt-BR')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Eventos por Categoria</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                    <span className="text-blue-900">🎵 Música</span>
                    <span className="text-blue-900">89 eventos</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded">
                    <span className="text-purple-900">🎭 Teatro</span>
                    <span className="text-purple-900">64 eventos</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded">
                    <span className="text-green-900">⚽ Esporte</span>
                    <span className="text-green-900">45 eventos</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-amber-50 rounded">
                    <span className="text-amber-900">💼 Conferência</span>
                    <span className="text-amber-900">36 eventos</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Taxa de Ocupação Média</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Música</span>
                      <span>78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '78%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Teatro</span>
                      <span>85%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-purple-600 h-3 rounded-full" style={{ width: '85%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Esporte</span>
                      <span>92%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-green-600 h-3 rounded-full" style={{ width: '92%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Conferência</span>
                      <span>68%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-amber-600 h-3 rounded-full" style={{ width: '68%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
