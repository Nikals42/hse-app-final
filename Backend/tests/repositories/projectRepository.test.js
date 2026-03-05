import { describe, it, expect } from "vitest";
import { prismaMock } from "../singleton.js";
import {
  getProjects,
  getProjectData,
} from "../../repositories/projectRepository.js";

describe("projectRepository tests", () => {
  describe("getProjects test", () => {
    it("return all project ids and names", async () => {
      const mockProjects = [
        { id: 1, name: "N80002" },
        { id: 2, name: "N90073" },
      ];

      prismaMock.project.findMany.mockResolvedValueOnce(mockProjects);

      const result = await getProjects();
      expect(result).toEqual(mockProjects);
    });
  });

  describe("getProjectData test", () => {
    it("return requested project's id, subcontractor id and name, and lagging indicators", async () => {
      const req = { query: { projectId: "1" } };

      const mockGroupData = [
        {
          contractorId: 1,
          projectId: 1,
          _sum: {
            LWC: 0,
            FA: 0,
            MTI: 0,
            RTW: 0,
            Fatality: 0,
            PPD: 0,
            PTD: 0,
          },
        },
        {
          contractorId: 2,
          projectId: 1,
          _sum: {
            LWC: 0,
            FA: 0,
            MTI: 0,
            RTW: 0,
            Fatality: 0,
            PPD: 0,
            PTD: 0,
          },
        },
      ];
      prismaMock.lagging_Indicators.groupBy.mockResolvedValueOnce(
        mockGroupData,
      );

      const mockContractors = [
        { id: 1, name: "Subcontractor_1" },
        { id: 2, name: "Subcontractor_2" },
      ];
      prismaMock.contractors.findMany.mockResolvedValueOnce(mockContractors);

      const result = await getProjectData(req);
      expect(result).toEqual([
        {
          projectId: 1,
          contractorId: 1,
          contractorName: "Subcontractor_1",
          LWC: 0,
          FA: 0,
          MTI: 0,
          RTW: 0,
          Fatality: 0,
          PPD: 0,
          PTD: 0,
        },
        {
          projectId: 1,
          contractorId: 2,
          contractorName: "Subcontractor_2",
          LWC: 0,
          FA: 0,
          MTI: 0,
          RTW: 0,
          Fatality: 0,
          PPD: 0,
          PTD: 0,
        },
      ]);
    });
  });
});
