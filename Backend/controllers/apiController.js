import { data } from "../lagging_indicators_api.js";

// API for Projects
export const api = async (req, res) => {
  try {
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};
