import { vi, describe, it, expect, beforeEach } from "vitest";
import { readAll, readData } from "../../controllers/projectController.js";
import * as projectRepository from "../../repositories/projectRepository.js";

vi.mock("../../repositories/projectRepository.js");

describe("projectController tests", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });
  describe("getProjects tests", () => {
    it("return all projects, status code 200", async () => {
      projectRepository.getProjects.mockResolvedValueOnce([{ id: 1 }]);

      await readAll(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("error, status code 500", async () => {
      projectRepository.getProjects.mockRejectedValueOnce(new Error("Error"));

      await readAll(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error" });
    });
  });

  describe("getProjectData tests", () => {
    it("return requested project data, status code 200", async () => {
      projectRepository.getProjectData.mockResolvedValueOnce([{ id: 1 }]);

      await readData(req, res);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
    });

    it("error, status code 500", async () => {
      projectRepository.getProjectData.mockRejectedValueOnce(
        new Error("Error"),
      );

      await readData(req, res);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error" });
    });
  });
});
