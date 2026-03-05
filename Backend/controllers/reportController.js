import { newReport } from "../repositories/reportRepository.js";

// new HSE reports
export const report = async (req, res) => {
  try {
    const result = await newReport(req);
    if (!result.ok) {
      return res.status(404).json(result);
    } else {
      return res.status(201).json({ ok: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
