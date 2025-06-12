import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EventsState, Event, EventTicket, EventFilters, EventCategory } from '../types/events';

interface EventsActions {
  // Loading and error states
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Events management
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  removeEvent: (id: string) => void;
  setEvents: (events: Event[]) => void;

  // Tickets management
  addTicket: (ticket: EventTicket) => void;
  updateTicket: (id: string, updates: Partial<EventTicket>) => void;
  setTickets: (tickets: EventTicket[]) => void;

  // Filters and search
  setFilters: (filters: Partial<EventFilters>) => void;
  setSearchQuery: (query: string) => void;
  clearFilters: () => void;

  // Getters
  getEvent: (id: string) => Event | undefined;
  getTicket: (id: string) => EventTicket | undefined;
  getEventsByCategory: (category: EventCategory) => Event[];
  getUpcomingEvents: () => Event[];
  getPastEvents: () => Event[];
  getFilteredEvents: () => Event[];
}

type EventsStore = EventsState & EventsActions;

export const useEventsStore = create<EventsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      events: {},
      myTickets: {},
      isLoading: false,
      error: null,
      filters: {},
      searchQuery: '',

      // Actions
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),

      addEvent: (event) =>
        set((state) => ({
          events: { ...state.events, [event.id]: event },
        })),

      updateEvent: (id, updates) =>
        set((state) => ({
          events: {
            ...state.events,
            [id]: state.events[id] ? {
              ...state.events[id],
              ...updates,
              updatedAt: new Date(),
            } : state.events[id],
          },
        })),

      removeEvent: (id) =>
        set((state) => {
          const { [id]: removed, ...events } = state.events;
          return { events };
        }),

      setEvents: (events) =>
        set({
          events: events.reduce((acc, event) => {
            acc[event.id] = event;
            return acc;
          }, {} as Record<string, Event>),
        }),

      addTicket: (ticket) =>
        set((state) => ({
          myTickets: { ...state.myTickets, [ticket.id]: ticket },
        })),

      updateTicket: (id, updates) =>
        set((state) => ({
          myTickets: {
            ...state.myTickets,
            [id]: state.myTickets[id] ? {
              ...state.myTickets[id],
              ...updates,
            } : state.myTickets[id],
          },
        })),

      setTickets: (tickets) =>
        set({
          myTickets: tickets.reduce((acc, ticket) => {
            acc[ticket.id] = ticket;
            return acc;
          }, {} as Record<string, EventTicket>),
        }),

      setFilters: (filters) =>
        set((state) => ({
          filters: { ...state.filters, ...filters },
        })),

      setSearchQuery: (query) => set({ searchQuery: query }),

      clearFilters: () => set({ filters: {}, searchQuery: '' }),

      // Getters
      getEvent: (id) => get().events[id],
      getTicket: (id) => get().myTickets[id],

      getEventsByCategory: (category) =>
        Object.values(get().events).filter(event => event.category === category),

      getUpcomingEvents: () => {
        const now = new Date();
        return Object.values(get().events)
          .filter(event => event.startTime > now && event.isActive)
          .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      },

      getPastEvents: () => {
        const now = new Date();
        return Object.values(get().events)
          .filter(event => event.endTime < now)
          .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
      },

      getFilteredEvents: () => {
        const { events, filters, searchQuery } = get();
        let filtered = Object.values(events);

        // Apply filters
        if (filters.category) {
          filtered = filtered.filter(event => event.category === filters.category);
        }

        if (filters.dateRange) {
          filtered = filtered.filter(event =>
            event.startTime >= filters.dateRange!.start &&
            event.startTime <= filters.dateRange!.end
          );
        }

        if (filters.priceRange) {
          filtered = filtered.filter(event =>
            event.price >= filters.priceRange!.min &&
            event.price <= filters.priceRange!.max
          );
        }

        if (filters.location) {
          // Simple distance calculation - in production use proper geolocation
          filtered = filtered.filter(event => {
            const distance = Math.sqrt(
              Math.pow(event.location.coordinates.lat - filters.location!.lat, 2) +
              Math.pow(event.location.coordinates.lng - filters.location!.lng, 2)
            ) * 111; // Rough km conversion
            return distance <= filters.location!.radius;
          });
        }

        // Apply search
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          filtered = filtered.filter(event =>
            event.title.toLowerCase().includes(query) ||
            event.description.toLowerCase().includes(query) ||
            event.location.address.toLowerCase().includes(query) ||
            event.tags.some(tag => tag.toLowerCase().includes(query))
          );
        }

        return filtered.sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
      },
    }),
    {
      name: 'events-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        events: state.events,
        myTickets: state.myTickets,
        filters: state.filters,
      }),
    }
  )
);