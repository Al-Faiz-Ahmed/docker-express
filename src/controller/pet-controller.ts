import type { NextFunction, Request, Response } from "express";
import { db } from "../database";
import { pets } from "../database/schema/pets";
import { GlobalError } from "../middleware/global-error";
import { eq } from "drizzle-orm";

export const getPetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id: string | number = req.params.id || "";
  if (!id) {
    next(
      new GlobalError(
        422,
        `Id is not provided inside URL`,
        "ID IN PARAMS REQUIRED"
      )
    );
  }

  if (Object.is(Number(id), NaN) === true) {
    next(
      new GlobalError(
        400,
        `ID should be a natural number`,
        "ID SHOULD BE A NUMBER"
      )
    );
  }

  id = Number(id);

  try {
    const pet = await db.select().from(pets).where(eq(pets.id, id));
    if (pet.length === 0) {
      next(
        new GlobalError(
          404,
          `None of the Pet belongs to this id #${id}`,
          "PET NOT FOUND"
        )
      );
    }
    res.json({
      status: "ok",
      message: "Pet found Successfully",
      data: pet,
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};

export const deletePetById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let id: string | number = req.params.id || "";
  if (!id) {
    next(
      new GlobalError(
        422,
        `Id is not provided inside URL`,
        "ID IN PARAMS REQUIRED"
      )
    );
  }

  if (Object.is(Number(id), NaN) === true) {
    next(
      new GlobalError(
        400,
        `ID should be a natural number`,
        "ID SHOULD BE A NUMBER"
      )
    );
  }

  id = Number(id);

  try {
    const pet = await db
      .delete(pets)
      .where(eq(pets.id, id))
      .returning({ petName: pets.petName });
    if (pet.length === 0) {
      return next(
        new GlobalError(
          404,
          `None of the Pet belongs to this id #${id}`,
          "PET NOT FOUND"
        )
      );
    }
    res.json({
      status: "ok",
      message: "Pet remove Successfully",
      data: pet,
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }

  
};

export const createPet = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const parsedBody = req.body;
  if (!parsedBody)
    return next(
      new GlobalError(
        400,
        `The JSON data is not well format`,
        `INVALID JSON FORMAT`
      )
    );

  const { name, breed } = parsedBody;
  if (!name)
    return next(
      new GlobalError(
        422,
        `Name property is required to create Pet`,
        `NAME PROPERTY REQUIRED`
      )
    );

  try {
    const create_Pet_Res = await db
      .insert(pets)
      .values({ petName: name, breed })
      .returning();
    res.status(201).json({
      data: create_Pet_Res,
      message: `Your Pet with name ${name} created Successfully`,
      status: "OK",
      error: null,
    });
  } catch (err) {
    next(new GlobalError(500, `details ${err}`, "SERVER INTERNAL ERROR"));
  }
};
