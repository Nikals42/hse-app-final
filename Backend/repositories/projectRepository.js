import prisma from "../lib/prisma.js";

export const getProjects = async () => {
  const projects = await prisma.Project.findMany({
    select: {
      id: true,
      name: true,
    },
  });

  return projects;
};

export const getProjectData = async () => {
  const projectData = await prisma.Project.findMany({
    include: {
      laggingIndicators: {
        select: {
          LTI: true,
          FA: true,
          MTI: true,
          RTW: true,
          Fatality: true,
          PPD: true,
          PTD: true,
        },
      },
    },
  });

  return projectData;
};
