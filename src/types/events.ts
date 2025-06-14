export interface Event {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  endTime: Date;
  location: {
    address: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  creator: string;
  category: EventCategory;
  price: number;
  currency: string;
  maxAttendees?: number;
  currentAttendees: number;
  nftTicketAddress?: string;
  imageUrl?: string;
  tags: string[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type EventCategory = 'music' | 'culture' | 'nightlife' | 'sports' | 'business' | 'technology' | 'food' | 'art';

export interface EventTicket {
  id: string;
  eventId: string;
  ticketId: string;
  owner: string;
  purchasedAt: Date;
  price: number;
  currency: string;
  isUsed: boolean;
  usedAt?: Date;
  transferHistory: TicketTransfer[];
}

export interface TicketTransfer {
  from: string;
  to: string;
  timestamp: Date;
  txHash: string;
}

export interface EventsState {
  events: Record<string, Event>;
  myTickets: Record<string, EventTicket>;
  isLoading: boolean;
  error: string | null;
  filters: EventFilters;
  searchQuery: string;
}

export interface EventFilters {
  category?: EventCategory;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  location?: {
    lat: number;
    lng: number;
    radius: number; // in km
  };
}