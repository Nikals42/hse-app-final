import { check } from "../repositories/loginRepository.js";
import * as callAPI from "../lib/callAPI.js";

export const login = async (req, res) => {
  try {
    const { username } = req.body;
    const result = await check(username);
    if (!result.ok) {
      return res.status(404).json(result);
    } else {
      await callAPI.apiProjects();
      await callAPI.apiLaggingIndicators();
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};
