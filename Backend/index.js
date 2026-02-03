// npx prisma migrate dev --name
// npx prisma generate
// npx prisma db seed

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

app.get("/api/nc_tool", apiController.api);
app.get("/projects", projectController.readAll);
app.get("/projects/contractors", projectController.readContractors);
app.get("/projects/data", projectController.readData);

app.post("/report", reportController.report);
app.post("/login", loginController.login);

app.listen(PORT, () => {
  console.log(`Server running`);
});
