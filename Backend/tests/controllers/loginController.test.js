import { vi, describe, it, expect, beforeEach } from "vitest";
import { login } from "../../controllers/loginController.js";
import * as loginRepository from "../../repositories/loginRepository.js";

vi.mock("../../repositories/loginRepository.js");

describe("loginController tests", () => {
  let req, res;

  beforeEach(() => {
    vi.clearAllMocks();
    req = { body: {} };
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    };
  });

  it("valid user, status code 200", async () => {
    loginRepository.check.mockResolvedValueOnce({ ok: true });

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ ok: true });
  });

  it("invalid user, status code 404", async () => {
    loginRepository.check.mockResolvedValueOnce({ ok: false });

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ ok: false });
  });

  it("error, status code 500", async () => {
    loginRepository.check.mockRejectedValueOnce(new Error("Error"));

    await login(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Error" });
  });
});
