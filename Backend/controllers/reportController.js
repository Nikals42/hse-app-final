import { newReport } from "../repositories/reportRepository.js";

export const report = async (req, res) => {
  try {
    const send = await newReport(req);
    return res.json(send);
  } catch (error) {
    console.log(error);
  }
};
