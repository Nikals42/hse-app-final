import { vi, describe, it, expect, beforeEach } from "vitest";
import { report } from "../../controllers/reportController.js";
import * as reportRepository from "../../repositories/reportRepository.js";

vi.mock("../../repositories/reportRepository.js");

describe("reportController tests", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it("HSE report created, status code 201", async () => {
    reportRepository.newReport.mockResolvedValueOnce({ ok: true });

    await report(req, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("HSE report creation failed, status code 404", async () => {
    reportRepository.newReport.mockResolvedValueOnce({ ok: false });

    await report(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ ok: false });
  });

  it("error, status code 500", async () => {
    reportRepository.newReport.mockRejectedValueOnce(new Error("Error"));

    await report(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error" });
  });
});
