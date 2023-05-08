import { Request, Response, NextFunction } from "express";
import { verify, JwtPayload } from "jsonwebtoken";
import { IS_PROD } from "./isProd";

export const ACCESS_TOKEN_SECRET = IS_PROD
  ? process.env.ACCESS_TOKEN_SECRET
  : "secret";

export const SEMAPHORE_GROUP_URL = process.env.SEMAPHORE_GROUP_URL

export const SEMAPHORE_ADMIN_GROUP_URL = "http://localhost:3002/semaphore/4";
  
export const PASSPORT_SERVER = process.env.PASSPORT_SERVER ;

export interface GroupJwtPayload extends JwtPayload {
  groupUrl: string
}

export const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    verify(token, ACCESS_TOKEN_SECRET!, (err, group) => {
      if (err) {
        return res.sendStatus(403);
      }

      const payload = group as GroupJwtPayload;

      // Maybe we want to gate?
      // if (SEMAPHORE_GROUP_URL.includes(payload.groupUrl)) {
      //     return res.sendStatus(403);
      // }

      next();
    });
  } else {
    res.sendStatus(401);
  }
}
