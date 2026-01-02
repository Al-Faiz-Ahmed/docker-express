import type { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { pets } from "../database/schema/pets";
import { GlobalError } from "../middleware/global-error";
import { sql } from "drizzle-orm";

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
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};

export const seedPets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const createPets = await db.insert(pets).values([
      { petName: "Eagle", breed: "Golden Eagle" },
      { petName: "Parrot", breed: "African Grey" },
      { petName: "Lion", breed: "African Lion" },
      { petName: "Bear", breed: "Grizzly Bear" },
      { petName: "Cat", breed: "Persian" },
      { petName: "Dog", breed: "Saluki" },
      { petName: "Rabbit", breed: "Angora" },
      { petName: "Eagle", breed: "Bald Eagle" },
      { petName: "Parrot", breed: "Macaw" },
      { petName: "Cheetah", breed: "African Cheetah" },
      { petName: "Falcon", breed: "Peregrine Falcon" },
      { petName: "Tiger", breed: "Bengal Tiger" },
      { petName: "Horse", breed: "Arabian Horse" },
      { petName: "Camel", breed: "Dromedary" },
      { petName: "Wolf", breed: "Arabian Wolf" },
    ]);
    res.status(201).json({
      data: createPets,
      message: "15 Pets seeded successfully",
      status: "OK",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};

export const deletePets = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await db.delete(pets)
    res.status(200).json({
      data: null,
      message: "All Pets Delete successfully",
      status: "OK",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};

export const truncatePetsTable = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await db.execute(sql`TRUNCATE TABLE pets`);
    res.status(200).json({
      data: null,
      message: "Pets table truncated successfully",
      status: "OK",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};
