import { pid } from "node:process";
import prisma from "./prisma.js";

export const apiProjects = async function () {
  try {
    // const response = await fetch('https://hse-app-backend.vercel.app/api')
    const response = await fetch("http://localhost:3000/api/nc_tool");
    const json = await response.json();
    for (const project of json.data) {
      const name = project.projectCode;
      await prisma.project.upsert({
        where: {
          name: name,
        },
        update: {},
        create: {
          name: name,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const apiContractors = async function () {
  const response = await fetch("http://localhost:3000/api/nc_tool");
  const json = await response.json();
  for (const contractor of json.data) {
    const name = contractor.contractor;
    await prisma.contractors.upsert({
      where: {
        name: name,
      },
      update: {},
      create: {
        name: name,
      },
    });
  }
};

export const apiLaggingIndicators = async function () {
  try {
    // const response = await fetch('https://hse-app-backend.vercel.app/api')
    const response = await fetch("http://localhost:3000/api/nc_tool");
    const json = await response.json();
    for (const project of json.data) {
      const projectName = project.projectCode;
      const findProjectId = await prisma.project.findUnique({
        where: {
          name: projectName,
        },
        select: {
          id: true,
        },
      });
      const contractorName = project.contractor;
      const findContractorId = await prisma.contractors.findUnique({
        where: {
          name: contractorName,
        },
        select: {
          id: true,
        },
      });
      const projectId = findProjectId.id;
      const contractorId = findContractorId.id;
      let LWC = project.LWC;
      let FA = project.FA;
      let MTI = project.MTI;
      let RTW = project.RTW;
      let Fatality = project.Fatality;
      let PPD = project.PPD;
      let PTD = project.PTD;
      let timeStamp = project.timeStamp;

      await prisma.lagging_Indicators.create({
        data: {
          projectId: Number(projectId),
          contractorId: Number(contractorId),
          LWC: Number(LWC),
          FA: Number(FA),
          MTI: Number(MTI),
          RTW: Number(RTW),
          Fatality: Number(Fatality),
          PPD: Number(PPD),
          PTD: Number(PTD),
          timeStamp: new Date(timeStamp),
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
