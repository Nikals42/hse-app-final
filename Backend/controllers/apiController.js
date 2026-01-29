import { data } from "../data.js";

export const api = async (req, res) => {
  try {
    return res.json(data);
  } catch (error) {
    console.log(error);
  }
};
