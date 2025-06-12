import { EventCategory } from "./events";

export interface MapLocation {
    lat: number;
    lng: number;
}

export interface MapBounds {
    northeast: MapLocation;
    southwest: MapLocation;
}

export interface MapEvent {
    id: string;
    title: string;
    location: MapLocation;
    address: string;
    startTime: Date;
    category: EventCategory;
    attendeeCount: number;
    price: number;
    currency: string;
}

export interface MapState {
    currentLocation: MapLocation | null;
    mapRegion: {
        latitude: number;
        longitude: number;
        latitudeDelta: number;
        longitudeDelta: number;
    };
    nearbyEvents: MapEvent[];
    selectedEventId: string | null;
    isLoading: boolean;
    error: string | null;
    searchRadius: number; // in km
}