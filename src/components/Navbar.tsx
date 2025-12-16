import {
  Ticket,
  Home,
  LayoutDashboard,
  ShoppingBag,
  User,
  Settings as SettingsIcon,
  LogIn,
  LogOut,
  Building2,
  QrCode,
} from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import type { Page, UserRole } from "../App";

interface NavbarProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  userRole: UserRole;
  toggleRole: () => void;
  ticketCount: number;
  isLoggedIn?: boolean;
  onLogout?: () => void;
}

export function Navbar({
  currentPage,
  setCurrentPage,
  userRole,
  toggleRole,
  ticketCount,
  isLoggedIn = true,
  onLogout,
}: NavbarProps) {
  const getRoleLabel = () => {
    if (userRole === "admin") return "Administrador";
    if (userRole === "organizer") return "Organizador";
    if (userRole === "staff") return "Staff/Check-in";
    return "Usuário";
  };

  const getNextRole = () => {
    if (userRole === "user") return "Organizador";
    if (userRole === "organizer") return "Admin";
    if (userRole === "admin") return "Staff";
    return "Usuário";
  };

  return (
    <nav className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button
              onClick={() => setCurrentPage("home")}
              className="flex items-center gap-2"
            >
              <Ticket className="size-8 text-indigo-600" />
              <span className="text-xl text-indigo-600">
                EventMaster
              </span>
            </button>

            <div className="hidden md:flex items-center gap-4">
              <Button
                variant={
                  currentPage === "home" ? "default" : "ghost"
                }
                onClick={() => setCurrentPage("home")}
                className="gap-2"
              >
                <Home className="size-4" />
                Eventos
              </Button>

              {userRole === "admin" && (
                <Button
                  variant={
                    currentPage === "admin"
                      ? "default"
                      : "ghost"
                  }
                  onClick={() => setCurrentPage("admin")}
                  className="gap-2"
                >
                  <LayoutDashboard className="size-4" />
                  Painel Admin
                </Button>
              )}

              {userRole === "organizer" && (
                <Button
                  variant={
                    currentPage === "organizer"
                      ? "default"
                      : "ghost"
                  }
                  onClick={() => setCurrentPage("organizer")}
                  className="gap-2"
                >
                  <Building2 className="size-4" />
                  Meus Eventos
                </Button>
              )}

              {userRole === "staff" && (
                <Button
                  variant={
                    currentPage === "staff-checkin"
                      ? "default"
                      : "ghost"
                  }
                  onClick={() =>
                    setCurrentPage("staff-checkin")
                  }
                  className="gap-2"
                >
                  <QrCode className="size-4" />
                  Check-in
                </Button>
              )}

              {userRole === "user" && (
                <>
                  <Button
                    variant={
                      currentPage === "my-tickets"
                        ? "default"
                        : "ghost"
                    }
                    onClick={() => setCurrentPage("my-tickets")}
                    className="gap-2 relative"
                  >
                    <ShoppingBag className="size-4" />
                    Área do Cliente
                    {ticketCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="ml-1 px-1.5 py-0 text-xs"
                      >
                        {ticketCount}
                      </Badge>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage("organizer-request")
                    }
                    className="gap-2"
                  >
                    <Building2 className="size-4" />
                    Seja Organizador
                  </Button>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentPage("settings")}
                  className="gap-2"
                >
                  <SettingsIcon className="size-4" />
                  <span className="hidden sm:inline">
                    Configurações
                  </span>
                </Button>

                <div className="text-right hidden sm:block">
                  <div className="text-xs text-gray-500">
                    Visualizando como
                  </div>
                  <div className="text-sm text-gray-900">
                    {getRoleLabel()}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRole}
                  className="gap-2"
                >
                  <User className="size-4" />
                  Trocar para {getNextRole()}
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="gap-2"
                >
                  <LogOut className="size-4" />
                  Sair
                </Button>
              </>
            ) : (
              <Button
                onClick={() => setCurrentPage("auth")}
                className="gap-2"
              >
                <LogIn className="size-4" />
                Entrar / Cadastrar
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}