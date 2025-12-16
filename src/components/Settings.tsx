import { useState } from 'react';
import { User, Mail, Lock, Bell, CreditCard, Palette, Globe, Shield, ChevronRight, Moon, Sun } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface SettingsProps {
  onBack: () => void;
  userEmail?: string;
  onLogout?: () => void;
}

export function Settings({ onBack, userEmail, onLogout }: SettingsProps) {
  const [profile, setProfile] = useState({
    name: 'João Silva',
    email: userEmail || 'joao.silva@email.com',
    phone: '+55 11 98765-4321',
    bio: 'Apaixonado por eventos de música e tecnologia.'
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsNotifications: false,
    eventReminders: true,
    promotions: true,
    newsletter: false
  });

  const [preferences, setPreferences] = useState({
    language: 'pt-BR',
    timezone: 'America/Sao_Paulo',
    currency: 'BRL',
    theme: 'light'
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    loginAlerts: true,
    sessionTimeout: '30'
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Perfil atualizado com sucesso!');
  };

  const handleSaveNotifications = () => {
    alert('Preferências de notificação atualizadas!');
  };

  const handleSavePreferences = () => {
    alert('Preferências gerais atualizadas!');
  };

  const handleSaveSecurity = () => {
    alert('Configurações de segurança atualizadas!');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Button variant="ghost" onClick={onBack} className="mb-4">
          ← Voltar
        </Button>
        <h1 className="text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">
          Gerencie suas preferências e configurações da conta
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid grid-cols-2 lg:grid-cols-4 w-full">
          <TabsTrigger value="profile" className="gap-2">
            <User className="size-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="size-4" />
            <span className="hidden sm:inline">Notificações</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="gap-2">
            <Palette className="size-4" />
            <span className="hidden sm:inline">Preferências</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="size-4" />
            <span className="hidden sm:inline">Segurança</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais e de contato
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="flex items-center gap-6">
                  <div className="size-24 rounded-full bg-indigo-100 flex items-center justify-center">
                    <User className="size-12 text-indigo-600" />
                  </div>
                  <div className="space-y-2">
                    <Button type="button" variant="outline" size="sm">
                      Alterar foto
                    </Button>
                    <p className="text-xs text-gray-500">
                      JPG, GIF ou PNG. Máximo de 1MB.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="name">Nome completo</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Telefone</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">Biografia</Label>
                  <Textarea
                    id="bio"
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Breve descrição sobre você
                  </p>
                </div>

                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={onBack}>
                    Cancelar
                  </Button>
                  <Button type="submit">Salvar alterações</Button>
                </div>
              </form>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cartões Salvos</CardTitle>
              <CardDescription>
                Gerencie seus métodos de pagamento
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <CreditCard className="size-8 text-gray-400" />
                  <div>
                    <div className="text-gray-900">•••• •••• •••• 4242</div>
                    <div className="text-sm text-gray-500">Expira em 12/2025</div>
                  </div>
                </div>
                <Button variant="ghost" size="sm">Remover</Button>
              </div>
              <Button variant="outline" className="w-full">
                + Adicionar novo cartão
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Notificação</CardTitle>
              <CardDescription>
                Escolha como você quer receber notificações
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por e-mail</Label>
                    <p className="text-sm text-gray-500">
                      Receba atualizações e confirmações por e-mail
                    </p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações push</Label>
                    <p className="text-sm text-gray-500">
                      Receba notificações push no navegador
                    </p>
                  </div>
                  <Switch
                    checked={notifications.pushNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, pushNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificações por SMS</Label>
                    <p className="text-sm text-gray-500">
                      Receba lembretes importantes via SMS
                    </p>
                  </div>
                  <Switch
                    checked={notifications.smsNotifications}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, smsNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Lembretes de eventos</Label>
                    <p className="text-sm text-gray-500">
                      Receba lembretes antes dos eventos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.eventReminders}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, eventReminders: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Promoções e ofertas</Label>
                    <p className="text-sm text-gray-500">
                      Receba ofertas especiais e descontos
                    </p>
                  </div>
                  <Switch
                    checked={notifications.promotions}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, promotions: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Newsletter</Label>
                    <p className="text-sm text-gray-500">
                      Receba nossa newsletter mensal
                    </p>
                  </div>
                  <Switch
                    checked={notifications.newsletter}
                    onCheckedChange={(checked) =>
                      setNotifications({ ...notifications, newsletter: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveNotifications}>Salvar preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências Gerais</CardTitle>
              <CardDescription>
                Personalize sua experiência no site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="language">
                    <Globe className="size-4 inline mr-2" />
                    Idioma
                  </Label>
                  <Select value={preferences.language} onValueChange={(value) => setPreferences({ ...preferences, language: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pt-BR">Português (Brasil)</SelectItem>
                      <SelectItem value="en-US">English (US)</SelectItem>
                      <SelectItem value="es-ES">Español</SelectItem>
                      <SelectItem value="fr-FR">Français</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="timezone">Fuso horário</Label>
                  <Select value={preferences.timezone} onValueChange={(value) => setPreferences({ ...preferences, timezone: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="America/Sao_Paulo">São Paulo (BRT)</SelectItem>
                      <SelectItem value="America/New_York">New York (EST)</SelectItem>
                      <SelectItem value="Europe/London">London (GMT)</SelectItem>
                      <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="currency">Moeda</Label>
                  <Select value={preferences.currency} onValueChange={(value) => setPreferences({ ...preferences, currency: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (R$)</SelectItem>
                      <SelectItem value="USD">Dólar ($)</SelectItem>
                      <SelectItem value="EUR">Euro (€)</SelectItem>
                      <SelectItem value="GBP">Libra (£)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="theme">Tema</Label>
                  <Select value={preferences.theme} onValueChange={(value) => setPreferences({ ...preferences, theme: value })}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center gap-2">
                          <Sun className="size-4" />
                          Claro
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center gap-2">
                          <Moon className="size-4" />
                          Escuro
                        </div>
                      </SelectItem>
                      <SelectItem value="auto">Automático</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-gray-900">Categorias favoritas</h3>
                <div className="flex flex-wrap gap-2">
                  {['Música', 'Teatro', 'Comédia', 'Tecnologia', 'Dança', 'Esportes'].map((category) => (
                    <button
                      key={category}
                      className="px-4 py-2 rounded-full border border-indigo-600 text-indigo-600 hover:bg-indigo-50 transition-colors"
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSavePreferences}>Salvar preferências</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>
                Gerencie as configurações de segurança da sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-gray-900 mb-4">Alterar senha</h3>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="current-password">Senha atual</Label>
                    <Input
                      id="current-password"
                      type="password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="new-password">Nova senha</Label>
                    <Input
                      id="new-password"
                      type="password"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirm-password">Confirmar nova senha</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      className="mt-1"
                    />
                  </div>
                  <Button variant="outline">Alterar senha</Button>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Autenticação de dois fatores</Label>
                    <p className="text-sm text-gray-500">
                      Adicione uma camada extra de segurança
                    </p>
                  </div>
                  <Switch
                    checked={security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, twoFactorAuth: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertas de login</Label>
                    <p className="text-sm text-gray-500">
                      Receba alertas quando houver login de novos dispositivos
                    </p>
                  </div>
                  <Switch
                    checked={security.loginAlerts}
                    onCheckedChange={(checked) =>
                      setSecurity({ ...security, loginAlerts: checked })
                    }
                  />
                </div>

                <Separator />

                <div>
                  <Label htmlFor="session-timeout">Tempo de sessão (minutos)</Label>
                  <Select
                    value={security.sessionTimeout}
                    onValueChange={(value) => setSecurity({ ...security, sessionTimeout: value })}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="60">1 hora</SelectItem>
                      <SelectItem value="120">2 horas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-gray-900">Sessões ativas</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-gray-900">Chrome - Windows</div>
                      <div className="text-sm text-gray-500">São Paulo, Brasil • Agora</div>
                    </div>
                    <div className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                      Atual
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <div className="text-gray-900">Safari - iPhone</div>
                      <div className="text-sm text-gray-500">São Paulo, Brasil • 2 horas atrás</div>
                    </div>
                    <Button variant="ghost" size="sm">Encerrar</Button>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button onClick={handleSaveSecurity}>Salvar configurações</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900">Zona de Perigo</CardTitle>
              <CardDescription className="text-red-700">
                Ações irreversíveis relacionadas à sua conta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900">Desativar conta</h4>
                  <p className="text-sm text-gray-600">
                    Sua conta será desativada temporariamente
                  </p>
                </div>
                <Button variant="outline">Desativar</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-gray-900">Excluir conta</h4>
                  <p className="text-sm text-gray-600">
                    Excluir permanentemente sua conta e todos os dados
                  </p>
                </div>
                <Button variant="destructive" onClick={onLogout}>Excluir conta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}