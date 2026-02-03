import { check } from "../repositories/loginRepository.js";

// simple username based login
export const login = async (req, res) => {
  try {
    const { username } = req.body;
    const result = await check(username);
    if (!result.ok) {
      return res.status(404).json(result);
    } else {
      return res.status(200).json(result);
    }
  } catch (error) {
    console.log(error);
  }
};
