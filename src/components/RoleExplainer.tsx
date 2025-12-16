import { Users, Building2, Shield, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

export function RoleExplainer() {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl text-gray-900 mb-4">
            Sistema de Três Níveis de Acesso
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            A plataforma EventMaster possui três níveis distintos de acesso, cada um com funcionalidades específicas
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Usuário */}
          <Card className="hover:shadow-xl transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="size-6 text-blue-600" />
                </div>
                <CardTitle>Usuário</CardTitle>
              </div>
              <CardDescription>
                Compra ingressos e gerencia suas reservas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Navegar e pesquisar eventos</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Comprar ingressos com cartão ou PIX</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Visualizar ingressos com QR code</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Solicitar reembolsos (7 dias antes)</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Solicitar cadastro como organizador</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Organizador */}
          <Card className="hover:shadow-xl transition-shadow border-indigo-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <Building2 className="size-6 text-indigo-600" />
                </div>
                <CardTitle>Organizador</CardTitle>
              </div>
              <CardDescription>
                Cria e gerencia eventos na plataforma
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Criar eventos ilimitados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Dashboard com análises de vendas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Gerenciar tipos de ingressos e preços</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Exportar lista de compradores</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Relatórios detalhados por evento</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Eventos aguardam aprovação admin</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Admin */}
          <Card className="hover:shadow-xl transition-shadow border-purple-200">
            <CardHeader>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Shield className="size-6 text-purple-600" />
                </div>
                <CardTitle>Administrador</CardTitle>
              </div>
              <CardDescription>
                Gerencia toda a plataforma e organizadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Gerenciar solicitações de organizadores</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Aprovar/rejeitar eventos criados</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Configurar comissões e taxas</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Relatórios globais da plataforma</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Tratar disputas de pagamento</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="size-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-700">Suspender/reativar organizadores</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 bg-white rounded-lg p-6 border border-gray-200">
          <h3 className="text-gray-900 mb-3 text-center">Fluxo de Aprovação</h3>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <div className="text-center">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 mb-2">
                <Users className="size-6 text-blue-600 mx-auto" />
              </div>
              <div className="text-sm text-gray-700">Usuário solicita</div>
              <div className="text-xs text-gray-500">cadastro organizador</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-2">
                <Shield className="size-6 text-purple-600 mx-auto" />
              </div>
              <div className="text-sm text-gray-700">Admin aprova</div>
              <div className="text-xs text-gray-500">ou rejeita</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="text-center">
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200 mb-2">
                <Building2 className="size-6 text-indigo-600 mx-auto" />
              </div>
              <div className="text-sm text-gray-700">Organizador cria</div>
              <div className="text-xs text-gray-500">eventos</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="text-center">
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200 mb-2">
                <Shield className="size-6 text-purple-600 mx-auto" />
              </div>
              <div className="text-sm text-gray-700">Admin aprova</div>
              <div className="text-xs text-gray-500">eventos</div>
            </div>
            
            <div className="text-2xl text-gray-400">→</div>
            
            <div className="text-center">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200 mb-2">
                <Check className="size-6 text-green-600 mx-auto" />
              </div>
              <div className="text-sm text-gray-700">Evento visível</div>
              <div className="text-xs text-gray-500">para usuários</div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Use o botão "Trocar para..." no menu superior para alternar entre as diferentes visões
          </p>
        </div>
      </div>
    </div>
  );
}
