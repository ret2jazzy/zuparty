export enum UserType {
  ANON = "ANON",
  NONANON = "NONANON",
}

export type EventSignal = {
  name: string;
  description: string;
  expiry: Date;
};

export type ZuEvent = {
  id?: string;
  createdAt?: string;
  expiry?: string
  name?: string;
  description?: string;
  location?: string;
  spotsAvailable?: number;
  spotsTaken?: number;
  rsvps?: RSVP[]
  userId?: string;
}

export type RSVP = {
  id?: string;
  uuid?: string;
  name?: string;
  telegram?: string;
  email?: string;
  eventId?: string;
}

export type CreateEventRequest = {
  name: string;
  description: string;
  location: string;
  spotsAvailable: number;
  expiry: Date;
  proof: string
};

export type LocationRequest = {
  proof: string;
}

export type RsvpListRequest = {
  proof: string;
}