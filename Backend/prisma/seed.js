import prisma from "../lib/prisma.js";
import * as callAPI from "../lib/callAPI.js";

async function main() {
  await prisma.accounts.upsert({
    where: {
      username: "Almaco26",
    },
    update: {},
    create: {
      username: "Almaco26",
    },
  });
  await callAPI.apiProjects();
  await callAPI.apiContractors();
  await callAPI.apiProjectContractor();
  await callAPI.apiLaggingIndicators();
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
