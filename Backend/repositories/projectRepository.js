import prisma from "../lib/prisma.js";

export const getProjects = async () => {
  const projects = await prisma.project.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return projects;
};

export const getContractors = async (req) => {
  const { projectId } = req.body;
  const contractors = await prisma.lagging_Indicators.findMany({
    where: { projectId: projectId },
    distinct: ["contractorId"],
    select: {
      contractorId: true,
      contractor: {
        select: { name: true },
      },
    },
  });

  return contractors.map((c) => ({
    contractorId: c.contractorId,
    contractorName: c.contractor.name,
  }));
};

export const getProjectData = async (req) => {
  const { projectId } = req.body;
  const projectData = await prisma.lagging_Indicators.groupBy({
    by: ["contractorId", "projectId"],
    where: { projectId: projectId },
    _sum: {
      LWC: true,
      FA: true,
      MTI: true,
      RTW: true,
      Fatality: true,
      PPD: true,
      PTD: true,
    },
  });

  return projectData.map((d) => ({
    projectId: d.projectId,
    contractorId: d.contractorId,
    LWC: d._sum["LWC"],
    FA: d._sum["FA"],
    MTI: d._sum["MTI"],
    RTW: d._sum["RTW"],
    Fatality: d._sum["Fatality"],
    PPD: d._sum["PPD"],
    PTD: d._sum["PTD"],
  }));
};
/*
export const getProjectData = async () => {
  const projectData = await prisma.project.findMany({
    include: {
      laggingIndicators: {
        select: {
          LWC: true,
          FA: true,
          MTI: true,
          RTW: true,
          Fatality: true,
          PPD: true,
          PTD: true,
          timeStamp: true,
        },
      },
    },
  });

  return projectData;
};
*/
