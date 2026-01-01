import express from "express";
import type { NextFunction, Request, Response } from "express";
import type { GlobalError } from "./middleware/global-error";
import petRoute from "./routes/pet-route";
import petsRoute from "./routes/pets-route";

const PORT = process.env.BACKEND_PORT || 5000;
const app = express();

app.use(express.json());
app.use("/api/pet", petRoute);
app.use("/api/pets", petsRoute);

app.get("/", (req: Request, res: Response) => {
  console.log("Page Root Accessed");
  res
    .status(200)
    .json({ message: "Home Page Accesssed and Served Successfully!" });
});

app.use((err: GlobalError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    success: false,
    error: err.name,
    message: err.message,
    data: null,
  });
});

app.listen(Number(PORT), "0.0.0.0", (err) => {
  console.log(`Server is perfectly working on http://localhost:${PORT}`);
});
