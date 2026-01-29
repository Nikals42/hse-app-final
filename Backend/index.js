// Instantiate Prisma Client: https://www.prisma.io/docs/getting-started/prisma-orm/quickstart/prisma-postgres
// Update Prisma schema changes to database: npx prisma migrate dev --name
// Create/update Prisma Client: npx prisma generate

import {} from "dotenv/config";
import * as projectController from "./controllers/projectController.js";
import * as apiController from "./controllers/apiController.js";
import * as reportController from "./controllers/reportController.js";
import * as loginController from "./controllers/loginController.js";

import cors from "cors";
import express from "express";
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

app.get("/api", apiController.api);
app.get("/projects", projectController.readAll);
app.get("/projects/data", projectController.readData);

app.post("/report", reportController.report);
app.post("/login", loginController.login);

app.listen(PORT, () => {
  console.log(`Server running`);
});
