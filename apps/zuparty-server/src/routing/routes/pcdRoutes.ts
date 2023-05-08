// import { PollType, UserType } from "@prisma/client";
import express, { NextFunction, Request, Response } from "express";
import {v4 as uuidv4} from 'uuid';
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

    let curEvent = await prisma.event.findUnique({
      where:{
        id: uuid
      }
    })
    if(curEvent !== null){
      curEvent.location = "SECRET"
    }

    res.json({
      event: curEvent
    });

  })

  app.post("/event/:eventId/location", async (req: Request, res: Response, next: NextFunction) => {
    let uuid = req.params.eventId; 

    const request = req.body as LocationRequest; 

    try{
      const signal: RSVPSignal = {
        id: uuid
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

      let rsvpFound = await prisma.rSVP.findUnique({
        where:{
          nullifier: nullifier
        },
        include:{
          Event: true
        }
      });

      if(rsvpFound !== null){
        if(!rsvpFound.approved)rsvpFound.Event = null;
      }

      res.json({"found": rsvpFound});

    }catch(e){
      console.log("ERROR");
      res.json({"found":null});
    }
  });

// you can see RSVPs but only if you're owner
  app.post("/rsvps/:eventId", async (req: Request, res: Response, next: NextFunction) => {
    let uuid = req.params.eventId; 

    let curEvent = await prisma.event.findUnique({
      where:{
        id: uuid
      },
      include: {
        rsvps: true,
      }
    });

    if(curEvent === null){
      res.status(404).json({"data": 404})
      return;
    }

    const signal: EventSignal = {
      name: curEvent.name,
      description: curEvent.description,
      expiry: curEvent.expiry,
    }

    const signalHash = sha256(stableStringify(signal));

    const nullifier = await verifyGroupProof(
      SEMAPHORE_GROUP_URL!, 
      req.body.proof as string,
      {
        signal: signalHash,
        allowedGroups: [SEMAPHORE_GROUP_URL!],
        claimedExtNullifier: signalHash
      }
      );

      if(curEvent.nullifier !== nullifier){
        res.status(404).json({"data":null})
        return;
      }

      res.json({"data":curEvent.rsvps});

  });

  app.post("/rsvp/:rsvpId/approve", async (req: Request, res: Response, next: NextFunction) => {
    let uuid = req.params.rsvpId; 

    let curRsvp = await prisma.rSVP.findUnique({
      where:{
        id: uuid
      },
      include: {
        Event: true
      }
    });

    if(curRsvp === null){
      res.status(404).json({"data": 404})
      return;
    }

    let curEvent = curRsvp.Event;

    if(curEvent === null){
      res.status(404).json({"data": 404})
      return;
    }

    const signal: EventSignal = {
      name: curEvent.name,
      description: curEvent.description,
      expiry: curEvent.expiry,
    }

    const signalHash = sha256(stableStringify(signal));

    const nullifier = await verifyGroupProof(
      SEMAPHORE_GROUP_URL!, 
      req.body.proof as string,
      {
        signal: signalHash,
        allowedGroups: [SEMAPHORE_GROUP_URL!],
        claimedExtNullifier: signalHash
      }
      );

      if(curEvent.nullifier !== nullifier){
        res.status(404).json({"data":null})
        return;
      }

      await prisma.rSVP.update({where: {id: uuid}, data:{
        approved: true
      }})

      await prisma.event.update({where: {id: curEvent.id}, data:{spotsTaken: curEvent.spotsTaken+1}});
      res.json({"data": 200});
  });

  app.post("/rsvp/:rsvpId", async (req: Request, res: Response, next: NextFunction) => {
    let uuid = req.params.rsvpId; 

    let curRsvp = await prisma.rSVP.findUnique({
      where:{
        id: uuid,
      },
      include: {
        Event: true,
      }
    });


    if(curRsvp === null){
      res.status(404).json({"data": 404})
      return;
    }

    if(curRsvp.checkedin){
      res.status(200).json({"data":"already_checked_in"});
      return;
    }


    let curEvent = curRsvp.Event;

    if(curEvent === null){
      res.status(404).json({"data": 404})
      return;
    }

    const signal: EventSignal = {
      name: curEvent.name,
      description: curEvent.description,
      expiry: curEvent.expiry,
    }

    const signalHash = sha256(stableStringify(signal));

    const nullifier = await verifyGroupProof(
      SEMAPHORE_GROUP_URL!, 
      req.body.proof as string,
      {
        signal: signalHash,
        allowedGroups: [SEMAPHORE_GROUP_URL!],
        claimedExtNullifier: signalHash
      }
      );

      if(curEvent.nullifier !== nullifier){
        res.status(404).json({"data":null})
        return;
      }

      await prisma.rSVP.update({where: {id: uuid}, data:{
        checkedin: true
      }});

      res.json({"data":200});

  });


  app.post("/rsvp", async (req: Request, res: Response, next: NextFunction) => {
    //To RSVP, no zk needed
    try{
      const request = req.body as RSVPRequest;

      const signal: RSVPSignal = {
        id: request.eventId
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

      await prisma.rSVP.create({
        data:{
          name: request.name,
          telegram: request.telegram,
          email: request.email,
          eventId: request.eventId,
          nullifier: nullifier
        }
      })
      res.json({rsvp: 200});
  }catch (e){
    console.log("ERROR");
    next(e);
  }

  });

  app.post("/create-event", async (req: Request, res: Response, next: NextFunction) => {
    const request = req.body as CreateEventRequest;
    
    const signal : EventSignal = {
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
        expiry: request.expiry,
        location: request.location,
        spotsAvailable: +request.spotsAvailable,
        nullifier: nullifier,
      }
    })

    res.json({eventId: createdEvent.id});
  });
};

export type RSVPSignal = {
  id: string;
}

export type LocationRequest = {
  proof: string;
}

export type RSVPRequest = {
  name: string;
  telegram: string;
  email: string;
  eventId: string;
  proof: string;
};

export type CreateEventRequest = {
  name: string;
  description: string;
  location: string;
  spotsAvailable: number;
  expiry: Date;
  proof: string
};

export type EventSignal = {
  name: string,
  description: string,
  expiry: Date,
};
