import { useCallback, useEffect } from 'react';
import { useEventsStore } from '../store/eventsStore';
import { Event, EventFilters, EventCategory } from '../types/events';

export const useEvents = () => {
  const {
    events,
    myTickets,
    isLoading,
    error,
    filters,
    searchQuery,
    // Actions
    setLoading,
    setError,
    addEvent,
    updateEvent,
    removeEvent,
    setEvents,
    addTicket,
    updateTicket,
    setTickets,
    setFilters,
    setSearchQuery,
    clearFilters,
    // Getters
    getEvent,
    getTicket,
    getEventsByCategory,
    getUpcomingEvents,
    getPastEvents,
    getFilteredEvents,
  } = useEventsStore();

  // Load events on mount
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Mock events data - in real app, fetch from API
      const mockEvents: Event[] = [
        {
          id: 'event-1',
          title: 'The Man Exclusive 2025 | Nairobi',
          description: 'Exclusive event in Nairobi featuring top artists',
          startTime: new Date('2025-01-01T20:00:00'),
          endTime: new Date('2025-01-02T02:00:00'),
          location: {
            address: 'Jonah Jang Crescent, Nairobi',
            coordinates: { lat: -1.2921, lng: 36.8219 }
          },
          creator: '0x1234...5678',
          category: 'music',
          price: 0,
          currency: 'FREE',
          currentAttendees: 1200,
          maxAttendees: 2000,
          imageUrl: 'https://example.com/event1.jpg',
          tags: ['music', 'exclusive', 'nairobi'],
          isActive: true,
          createdAt: new Date('2024-12-01'),
          updatedAt: new Date('2024-12-01'),
        },
        // Add more mock events...
      ];

      setEvents(mockEvents);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load events';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, setEvents]);

  const createEvent = useCallback(async (eventData: Omit<Event, 'id' | 'createdAt' | 'updatedAt'>) => {
    setLoading(true);

    try {
      const event: Event = {
        ...eventData,
        id: `event-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      addEvent(event);

      return event.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create event';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError, addEvent]);

  const purchaseTicket = useCallback(async (eventId: string) => {
    const event = getEvent(eventId);
    if (!event) {
      throw new Error('Event not found');
    }

    setLoading(true);

    try {
      // Mock ticket purchase - in real app, would interact with smart contracts
      const ticket = {
        id: `ticket-${Date.now()}`,
        eventId,
        ticketId: `${eventId}-${Date.now()}`,
        owner: '0x1234...5678', // Current user address
        purchasedAt: new Date(),
        price: event.price,
        currency: event.currency,
        isUsed: false,
        transferHistory: [],
      };

      addTicket(ticket);

      // Update event attendee count
      updateEvent(eventId, {
        currentAttendees: event.currentAttendees + 1
      });

      return ticket.id;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to purchase ticket';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [getEvent, setLoading, setError, addTicket, updateEvent]);

  return {
    // State
    events: Object.values(events),
    myTickets: Object.values(myTickets),
    isLoading,
    error,
    filters,
    searchQuery,

    // Filtered data
    upcomingEvents: getUpcomingEvents(),
    pastEvents: getPastEvents(),
    filteredEvents: getFilteredEvents(),

    // Actions
    loadEvents,
    createEvent,
    purchaseTicket,

    // Event management
    getEvent,
    updateEvent,
    removeEvent,

    // Ticket management
    getTicket,
    updateTicket,

    // Category helpers
    getEventsByCategory,

    // Filters
    setFilters,
    setSearchQuery,
    clearFilters,
  };
};