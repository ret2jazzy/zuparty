export enum PollType {
  REFERENDUM = "REFERENDUM",
}

export enum UserType {
  ANON = "ANON",
  NONANON = "NONANON",
}

export type EventSignal = {
  name: string;
  description: string;
  expiry: Date;
};

export type VoteRequest = {
  pollId: string;
  voterType: UserType;
  voterSemaphoreGroupUrl?: string;
  voterCommitment?: string;
  voterUuid?: string;
  voteIdx: number;
  proof: string;
};

export type VoteSignal = {
  pollId: string;
  voteIdx: number;
};

export type CreatePollRequest = {
  pollsterType: UserType;
  pollsterSemaphoreGroupUrl?: string;
  pollsterCommitment?: string;
  pollsterUuid?: string;
  pollType: PollType;
  body: string;
  expiry: Date;
  options: string[];
  voterSemaphoreGroupUrls: string[];
  proof: string;
};

export type ZuEvent = {
  id?: string;
  createdAt?: string;
  deadline?: string
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