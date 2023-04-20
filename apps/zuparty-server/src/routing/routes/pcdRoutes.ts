// import { PollType, UserType } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import { sha256 } from "js-sha256";
import stableStringify from "json-stable-stringify";
import { ApplicationContext } from "../../types";
import { SEMAPHORE_ADMIN_GROUP_URL, SEMAPHORE_GROUP_URL } from "../../util/auth";
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

  app.get("/event/:eventId", async (req: Request, res: Response, next: NextFunction) => {
    let uuid = req.params.eventId; 

    let curEvent = prisma.event.findUnique({
      where:{
        id: uuid
      }
    })
    res.json({
      event: curEvent
    });

  })

  app.post("/rsvp", async (req: Request, res: Response, next: NextFunction) => {
    //To RSVP, no zk needed
    const request = req.body as RSVPRequest;

    const rsvpEmail = request.email;
    let found = prisma.rSVP.findFirst({
      where:{
        email: rsvpEmail,
        eventId: request.eventId,
      }
    });

    if (found !== null){
      throw new Error("User already RSVP-ed");
    }

    await prisma.rSVP.create({
      data:{
        name: request.name,
        telegram: request.telegram,
        email: request.email,
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
      expiry: request.expiry,
    };

    const signalHash = sha256(stableStringify(signal));

    const nullifier = await verifyGroupProof(
      SEMAPHORE_GROUP_URL!, 
      request.proof,
      {
        signal: signalHash,
        allowedGroups: [SEMAPHORE_GROUP_URL!],
        claimedExtNullifier: signalHash
      }
      );

    let createdEvent = await prisma.event.create({
      data:{
        name: request.name,
        description: request.description,
        deadline: request.expiry,
        spotsAvailable: request.spotsAvailable,
      }
    })

    res.json({eventId: createdEvent.id});
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
  proof: string
};

export type CreateEventSignal = {
  name: string,
  description: string,
  expiry: Date,
};
