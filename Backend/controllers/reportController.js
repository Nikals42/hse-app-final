import { newReport } from "../repositories/reportRepository.js";

// new HSE reports
export const report = async (req, res) => {
  try {
    const send = await newReport(req);
    return res.json(send);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message || "Failed to create report" });
  }
};
