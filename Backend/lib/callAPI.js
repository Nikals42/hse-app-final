import prisma from "./prisma.js";

export const apiProjects = async function () {
  try {
    // const response = await fetch('https://hse-app-backend.vercel.app/api')
    const response = await fetch("http://localhost:3000/api");
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

export const apiLaggingIndicators = async function () {
  try {
    // const response = await fetch('https://hse-app-backend.vercel.app/api')
    const response = await fetch("http://localhost:3000/api");
    const json = await response.json();
    for (const project of json.data) {
      const name = project.projectCode;
      const findId = await prisma.project.findUnique({
        where: {
          name: name,
        },
        select: {
          id: true,
        },
      });
      const id = findId.id;
      let countLTI;
      let countFA;
      let countMTI;
      let countRTW;
      let countFatality;
      let countPPD;
      let countPTD;
      const indicators = project.laggingIndicators;
      for (const indicator of indicators) {
        if (
          indicator.text ==
          "[LTI] Lost time incident (Doctor / medic involved, > 1 day of sick leave)"
        ) {
          countLTI = indicator.count;
        }
        if (
          indicator.text ==
          "[FA] First Aid (Self-care, No doctor / medic involved)"
        ) {
          countFA = indicator.count;
        }
        if (
          indicator.text ==
          "[MTI] Medical treatment injury (doctor / medic involved)"
        ) {
          countMTI = indicator.count;
        }
        if (
          indicator.text ==
          "[RTW] Restricted to work (Doctor / medic involved, Is able to work, but cannot continue same work)"
        ) {
          countRTW = indicator.count;
        }
        if (indicator.text == "Fatality") {
          countFatality = indicator.count;
        }
        if (
          indicator.text ==
          "Permanent partial disability (Can continue on same work but with limitations. Loss of finger)"
        ) {
          countPPD = indicator.count;
        }
        if (
          indicator.text ==
          "Permanent total disability (Cannot continue on the same work. Loss of hand)"
        ) {
          countPTD = indicator.count;
        }
      }
      await prisma.lagging_Indicators.upsert({
        where: {
          projectId: id,
        },
        update: {
          projectId: Number(id),
          LTI: Number(countLTI),
          FA: Number(countFA),
          MTI: Number(countMTI),
          RTW: Number(countRTW),
          Fatality: Number(countFatality),
          PPD: Number(countPPD),
          PTD: Number(countPTD),
        },
        create: {
          projectId: Number(id),
          LTI: Number(countLTI),
          FA: Number(countFA),
          MTI: Number(countMTI),
          RTW: Number(countRTW),
          Fatality: Number(countFatality),
          PPD: Number(countPPD),
          PTD: Number(countPTD),
        },
      });
    }
  } catch (error) {
    console.log(error);
  }
};
