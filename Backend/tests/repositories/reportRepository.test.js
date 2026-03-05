import { describe, it, expect } from "vitest";
import { prismaMock } from "../singleton.js";
import { newReport } from "../../repositories/reportRepository.js";

describe("reportRepository tests", () => {
  it("HSE report created, return { ok: true}", async () => {
    const req = {
      body: {
        ProjectID: "1",
        contractor: "1",
        HSEAudits: "0",
        safetyWalks: "0",
        toolboxTalks: "0",
        workingHours: "0",
        trainingHours: "0",
        jobSafetyAnalysis: "0",
        timestamp: "2026-03-01T12:00:00Z",
      },
    };

    const mockDB = { ok: true };
    prismaMock.hSE_Report.create.mockResolvedValue(mockDB);

    const result = await newReport(req);
    expect(prismaMock.hSE_Report.create).toHaveBeenCalledWith({
      data: {
        projectId: 1,
        contractorId: 1,
        HSEAudits: 0,
        safetyWalks: 0,
        toolboxTalks: 0,
        workingHours: 0,
        trainingHours: 0,
        jobSafetyAnalysis: 0,
        timeStamp: new Date("2026-03-01T12:00:00Z"),
      },
    });
    expect(result).toEqual({ ok: true });
  });

  it("HSE report creation failed, return { ok: false}", async () => {
    const req = {
      body: {
        ProjectID: "1",
        contractor: "1",
        HSEAudits: "0",
        safetyWalks: "0",
        toolboxTalks: "0",
        workingHours: "0",
        trainingHours: "0",
        jobSafetyAnalysis: "0",
        timestamp: "2026-03-01T12:00:00Z",
      },
    };

    const mockDB = undefined;
    prismaMock.hSE_Report.create.mockResolvedValue(mockDB);

    const result = await newReport(req);
    expect(prismaMock.hSE_Report.create).toHaveBeenCalledWith({
      data: {
        projectId: 1,
        contractorId: 1,
        HSEAudits: 0,
        safetyWalks: 0,
        toolboxTalks: 0,
        workingHours: 0,
        trainingHours: 0,
        jobSafetyAnalysis: 0,
        timeStamp: new Date("2026-03-01T12:00:00Z"),
      },
    });
    expect(result).toEqual({ ok: false });
  });
});
