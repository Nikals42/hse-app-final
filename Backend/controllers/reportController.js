import { newReport } from "../repositories/reportRepository.js";
import Joi from "joi";

// input validation
const inputValidation = Joi.object({
  ProjectID: Joi.number().integer().required(),
  HSEAudits: Joi.number().integer().required().allow(""),
  trainingHours: Joi.number().required().allow(""),
  jobSafetyAnalysis: Joi.number().integer().required().allow(""),
  toolboxTalks: Joi.number().integer().required().allow(""),
  safetyWalks: Joi.number().integer().required().allow(""),
  workingHours: Joi.number().integer().required().allow(""),
  timestamp: Joi.date(),
  contractor: Joi.number().integer().required(),
});

export const report = async (req, res) => {
  const { error, value } = inputValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ error: errorMessage });
  }

  // creating new HSE report
  try {
    const result = await newReport(value);
    if (result == null) {
      return res.status(404).json({ ok: false });
    }
    return res.status(201).json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
