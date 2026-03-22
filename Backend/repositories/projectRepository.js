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

export const getProjectData = async (req) => {
  const projectId = Number(req.projectId);

  const projectData = await prisma.lagging_Indicators.groupBy({
    by: ["contractorId", "projectId"],
    where: { projectId },
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

  const contractorIds = projectData.map((d) => d.contractorId);
  const contractors = await prisma.contractors.findMany({
    where: { id: { in: contractorIds } },
    select: { id: true, name: true },
  });
  const contractorMap = new Map(contractors.map((c) => [c.id, c.name]));

  return projectData.map((d) => ({
    projectId: d.projectId,
    contractorId: d.contractorId,
    contractorName: contractorMap.get(d.contractorId),
    LWC: d._sum.LWC,
    FA: d._sum.FA,
    MTI: d._sum.MTI,
    RTW: d._sum.RTW,
    Fatality: d._sum.Fatality,
    PPD: d._sum.PPD,
    PTD: d._sum.PTD,
  }));
};
