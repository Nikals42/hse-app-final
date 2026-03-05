import { describe, it, expect } from "vitest";
import { prismaMock } from "../singleton.js";
import { check } from "../../repositories/loginRepository.js";

describe("loginRepository tests", () => {
  it("valid user, return { ok: true }", async () => {
    prismaMock.accounts.findUnique.mockResolvedValueOnce({
      username: "Username",
    });

    const result = await check("Username");
    expect(result).toEqual({ ok: true });
  });

  it("invalid user, return { ok: false }", async () => {
    prismaMock.accounts.findUnique.mockResolvedValueOnce(null);

    const result = await check("Username");
    expect(result).toEqual({ ok: false });
  });
});
