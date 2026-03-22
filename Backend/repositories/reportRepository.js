import prisma from "../lib/prisma.js";

export const newReport = async (req) => {
  const { ProjectID, timestamp, contractor, ...data } = req;
  const {
    HSEAudits,
    safetyWalks,
    toolboxTalks,
    workingHours,
    trainingHours,
    jobSafetyAnalysis,
  } = data;
  const newReport = await prisma.hSE_Report.create({
    data: {
      projectId: Number(ProjectID),
      contractorId: Number(contractor),
      HSEAudits: Number(HSEAudits),
      safetyWalks: Number(safetyWalks),
      toolboxTalks: Number(toolboxTalks),
      workingHours: Number(workingHours),
      trainingHours: Number(trainingHours),
      jobSafetyAnalysis: Number(jobSafetyAnalysis),
      timeStamp: new Date(timestamp),
    },
  });

  if (!newReport) {
    return null;
  } else {
    return newReport;
  }
};
