import { ZUPARTY_SERVER_URL } from "../src/util";
import { CreateEventRequest, LocationRequest, RsvpListRequest } from "./types";

export async function login(
  semaphoreGroupUrl: string,
  pcdStr: string
): Promise<any> {
  const parsedPcd = JSON.parse(decodeURIComponent(pcdStr));

  const request = {
    semaphoreGroupUrl,
    proof: parsedPcd.pcd
  };
  const url = `${ZUPARTY_SERVER_URL}login`;

  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export async function createEvent(
  request: CreateEventRequest
): Promise<Response> {
  const url = `${ZUPARTY_SERVER_URL}create-event`;

  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(request),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export async function getLocation(
  proof: LocationRequest, eventId: string
): Promise<any> {
  const url = `${ZUPARTY_SERVER_URL}event/${eventId}/location`;
  return await fetch(url, {
    method: "POST",
    body: JSON.stringify(proof),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });
}

export async function getRsvpList(
  proof: RsvpListRequest, eventId: string
): Promise<any> {
  const url = `${ZUPARTY_SERVER_URL}rsvps/${eventId}`;
  const res = await fetch(url, {
    method: "POST",
    body: JSON.stringify(proof),
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  });

  return res;
}