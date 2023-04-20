import express, { NextFunction, Request, Response } from "express";
import { sign } from "jsonwebtoken";
import { ApplicationContext } from "../../types";
import { ACCESS_TOKEN_SECRET, authenticateJWT } from "../../util/auth";
import { prisma } from "../../util/prisma";
import { verifyGroupProof } from "../../util/verify";

export function initAuthedRoutes(
  app: express.Application,
  _context: ApplicationContext
): void {
  // app.post(
  //   "/login",
  //   async (req: Request, res: Response, next: NextFunction) => {
  //     const request = req.body as LoginRequest;

  //     try {
  //       await verifyGroupProof(request.semaphoreGroupUrl, request.proof, {});

  //       const accessToken = sign(
  //         { groupUrl: request.semaphoreGroupUrl },
  //         ACCESS_TOKEN_SECRET!
  //       );

  //       res.status(200).json({ accessToken });
  //     } catch (e) {
  //       console.error(e);
  //       next(e);
  //     }
  //   }
  // );

  // app.get("/polls", authenticateJWT, async (req: Request, res: Response) => {
  //   // TODO: do we need pagination

  //   const polls = await prisma.poll.findMany({
  //     include: {
  //       votes: true,
  //     },
  //     orderBy: { expiry: "asc" },
  //   });
  //   res.status(200).json({ polls });
  // });
}

export interface LoginRequest {
  loginCommitment: string;
  passuuid: string;
  proof: string;
}
