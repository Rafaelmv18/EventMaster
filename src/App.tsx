import { useState } from 'react';
import { Home } from './components/Home';
import { EventDetails } from './components/EventDetails';
import { Checkout } from './components/Checkout';
import { OrganizerDashboard } from './components/OrganizerDashboard';
import { GlobalAdminDashboard } from './components/GlobalAdminDashboard';
import { MyTickets } from './components/MyTickets';
import { Navbar } from './components/Navbar';
import { Auth } from './components/Auth';
import { Settings } from './components/Settings';
import { OrganizerRequest } from './components/OrganizerRequest';
import { StaffCheckIn } from './components/StaffCheckIn';
import { Toaster } from './components/ui/sonner';

export type UserRole = 'user' | 'organizer' | 'admin' | 'staff';
export type Page = 'home' | 'event-details' | 'checkout' | 'organizer' | 'admin' | 'my-tickets' | 'auth' | 'settings' | 'event-analytics' | 'organizer-request' | 'staff-checkin';

export interface TicketBatch {
  id: string;
  name: string;
  price: number;
  quantity: number;
  availableQuantity: number;
  startDate: string;
  endDate: string;
}

export interface TicketType {
  id: string;
  name: string;
  price: number;
  availableTickets: number;
  totalTickets: number;
  description?: string;
  allowHalfPrice?: boolean;
  batches?: TicketBatch[];
}

export interface Buyer {
  id: string;
  name: string;
  email: string;
  phone: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  city?: string;
  purchaseDate: string;
  channel: 'desktop' | 'mobile' | 'app';
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  price: number;
  category: string;
  image: string;
  availableTickets: number;
  totalTickets: number;
  ticketTypes?: TicketType[];
  status?: 'pending' | 'approved' | 'rejected';
  visible?: boolean;
}

export interface CartItem {
  event: Event;
  quantity: number;
  ticketType?: TicketType;
  buyer?: Buyer;
  purchaseId?: string;
  refundStatus?: 'none' | 'requested' | 'approved' | 'rejected';
  refundRequestDate?: string;
}

// Eventos de exemplo para demonstração
const MOCK_PURCHASED_TICKETS: CartItem[] = [
  {
    event: {
      id: '1',
      title: 'Festival de Música Eletrônica 2025',
      description: 'Os maiores DJs do mundo em um único lugar.',
      date: '2025-12-15',
      time: '20:00',
      location: 'Estádio Nacional, São Paulo',
      price: 150,
      category: 'Música',
      image: 'music festival concert',
      availableTickets: 450,
      totalTickets: 500,
      status: 'approved'
    },
    quantity: 2,
    ticketType: {
      id: '1',
      name: 'Pista',
      price: 150,
      availableTickets: 200,
      totalTickets: 250,
      description: 'Acesso à área de pista',
      allowHalfPrice: true
    },
    purchaseId: 'PUR-001'
  },
  {
    event: {
      id: '2',
      title: 'Teatro: O Fantasma da Ópera',
      description: 'O clássico musical da Broadway chega ao Brasil.',
      date: '2025-11-20',
      time: '19:30',
      location: 'Teatro Municipal, Rio de Janeiro',
      price: 120,
      category: 'Teatro',
      image: 'theater stage performance',
      availableTickets: 80,
      totalTickets: 200
    },
    quantity: 2,
    ticketType: {
      id: '2',
      name: 'Plateia',
      price: 200,
      availableTickets: 50,
      totalTickets: 120,
      description: 'Assentos na plateia central',
      allowHalfPrice: true
    },
    purchaseId: 'PUR-002'
  },
  {
    event: {
      id: '4',
      title: 'Conferência Tech Brasil 2025',
      description: 'O maior evento de tecnologia do país.',
      date: '2026-03-20',
      time: '09:00',
      location: 'Centro de Convenções, Brasília',
      price: 350,
      category: 'Tecnologia',
      image: 'technology conference',
      availableTickets: 150,
      totalTickets: 300
    },
    quantity: 1,
    ticketType: {
      id: '1',
      name: 'VIP',
      price: 350,
      availableTickets: 50,
      totalTickets: 100,
      description: 'Acesso VIP com networking exclusivo',
      allowHalfPrice: false
    },
    purchaseId: 'PUR-003'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [userRole, setUserRole] = useState<UserRole>('user');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [purchasedTickets, setPurchasedTickets] = useState<CartItem[]>(MOCK_PURCHASED_TICKETS);
  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleEventSelect = (event: Event) => {
    setSelectedEvent(event);
    if (userRole === 'organizer') {
      setEditingEventId(event.id);
      setCurrentPage('organizer');
    } else if (userRole === 'admin') {
      setCurrentPage('home'); // Admin não edita diretamente, apenas aprova
    } else {
      setCurrentPage('event-details');
    }
  };

  const handleBuyTickets = (event: Event, quantity: number, ticketType?: TicketType) => {
    setCart([{ event, quantity, ticketType }]);
    setCurrentPage('checkout');
  };

  const handleCheckoutComplete = () => {
    setPurchasedTickets([...purchasedTickets, ...cart]);
    setCart([]);
    setCurrentPage('my-tickets');
  };

  const toggleRole = () => {
    // Cicla entre user -> organizer -> admin -> staff -> user
    if (userRole === 'user') {
      setUserRole('organizer');
    } else if (userRole === 'organizer') {
      setUserRole('admin');
    } else if (userRole === 'admin') {
      setUserRole('staff');
    } else {
      setUserRole('user');
    }
    setCurrentPage('home');
  };

  const handleLogin = (email: string) => {
    setUserEmail(email);
    setIsLoggedIn(true);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUserEmail(null);
    setIsLoggedIn(false);
    setUserRole('user');
    setCurrentPage('home');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        userRole={userRole}
        toggleRole={toggleRole}
        ticketCount={purchasedTickets.length}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
      />
      
      <main>
        {currentPage === 'home' && (
          <Home
            userRole={userRole}
            onEventSelect={handleEventSelect}
          />
        )}
        
        {currentPage === 'event-details' && selectedEvent && (
          <EventDetails
            event={selectedEvent}
            onBuyTickets={handleBuyTickets}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'checkout' && cart.length > 0 && (
          <Checkout
            cart={cart}
            onComplete={handleCheckoutComplete}
            onBack={() => setCurrentPage('event-details')}
          />
        )}
        
        {currentPage === 'admin' && userRole === 'admin' && (
          <GlobalAdminDashboard
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'organizer' && userRole === 'organizer' && (
          <OrganizerDashboard
            editingEventId={editingEventId}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'my-tickets' && (
          <MyTickets
            tickets={purchasedTickets}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'auth' && (
          <Auth
            onLogin={handleLogin}
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'settings' && (
          <Settings
            userEmail={userEmail || undefined}
            onBack={() => setCurrentPage('home')}
            onLogout={handleLogout}
          />
        )}
        
        {currentPage === 'organizer-request' && (
          <OrganizerRequest
            onBack={() => setCurrentPage('home')}
          />
        )}
        
        {currentPage === 'staff-checkin' && (
          <StaffCheckIn
            onBack={() => setCurrentPage('home')}
          />
        )}
      </main>
      <Toaster />
    </div>
  );
}