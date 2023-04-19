import { PollType, UserType } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { sha256 } from "js-sha256";
import stableStringify from "json-stable-stringify";
import { ApplicationContext } from "../../types";
import { SEMAPHORE_ADMIN_GROUP_URL } from "../../util/auth";
import { prisma } from "../../util/prisma";
import { fetchAndVerifyName } from "../../util/util";
import { verifyGroupProof, verifySignatureProof } from "../../util/verify";

/**
 * The endpoints in this function accepts proof (pcd) in the request.
 * It verifies the proof before proceed. So in this case no other type of auth (e.g. jwt)
 * is needed.
 */
export function initPCDRoutes(
  app: express.Application,
  _context: ApplicationContext
): void {

  app.post("/rsvp", async (req: Request, res: Response, next: NextFunction) => {
    //To RSVP, no zk needed
    const request = req.body as RSVPRequest;

    const rsvpEmail = request.email;
    let found = prisma.rsvp.findUnique({
      where:{
        email: rsvpEmail
      }
    });

    if (found !== null){
      throw new Error("User already RSVP-ed");
    }

    prisma.rsvp.create({
      data:{
        name: request.name,
        telegram: request.telegram,
        email: request.telegram,
        eventId: request.eventId,
      }
    })
    res.send("RSVP-ed");

  });
  app.post("/create-event", async (req: Request, res: Response, next: NextFunction) => {
    const request = req.body as CreateEventRequest;
    
    const signal : CreateEventSignal = {
      name: request.name,
      description: request.description,
    }

    const signalHash = sha256(stableStringify(signal));

    // const nullifier = await verifyGroupProof(
    //   "URL_PLACEHOLDER",
    //   request.proof
    // );
    //add zk later

    prisma.event.create({
      data:{
        name: request.name,
        description: request.description,
        deadline: request.expiry
      }
    })

  });
  
}

export type RSVPRequest = {
  name: string;
  telegram: string;
  uuid: string | undefined;
  email: string;
  eventId: string
};

export type CreateEventRequest = {
  name: string;
  description: string;
  spotsAvailable: number;
  hostuuid: string;
  hostCommitment: string;
  expiry: Date;
};

export type CreateEventSignal = {
  name: string,
  description: string
};

export type VoteRequest = {
  pollId: string;
  voterType: UserType;
  voterSemaphoreGroupUrl: string | undefined;
  voterCommitment: string | undefined;
  voterUuid: string | undefined;
  voteIdx: number;
  proof: string;
};




export type VoteSignal = {
  pollId: string;
  voteIdx: number;
};

export type CreatePollRequest = {
  pollsterType: UserType;
  pollsterSemaphoreGroupUrl: string | undefined;
  pollsterCommitment: string | undefined;
  pollsterUuid: string | undefined;
  pollType: PollType;
  body: string;
  expiry: Date;
  options: string[];
  voterSemaphoreGroupUrls: string[];
  proof: string;
};

export type PollSignal = {
  // nullifier: string;
  pollType: PollType;
  body: string;
  expiry: Date;
  options: string[];
  voterSemaphoreGroupUrls: string[];
};
