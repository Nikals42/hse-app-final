import { vi, beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";
import prisma from "../lib/prisma.js";

vi.mock("../lib/prisma.js", () => ({
  default: mockDeep(),
}));

export const prismaMock = prisma;

beforeEach(() => {
  mockReset(prismaMock);
});
