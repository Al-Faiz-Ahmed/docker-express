import type { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { pets } from "../database/schema/pets";
import { GlobalError } from "../middleware/global-error";

export const getAllPets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const petsResponse = await db.select().from(pets);
    res.json({
      data: petsResponse,
      message: "All Pets fetched Successfully",
      status: "OK",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `Error From Server: Reason ${err}`));
  }
};

export const seedPets = async (req: Request, res: Response) => {};
