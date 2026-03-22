import { check } from "../repositories/loginRepository.js";
import Joi from "joi";

// input validation
const inputValidation = Joi.object({
  username: Joi.string().required(),
});

export const login = async (req, res) => {
  const { error, value } = inputValidation.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    const errorMessage = error.details[0].message;
    return res.status(400).json({ error: errorMessage });
  }

  // simple username based login
  try {
    const { username } = value;
    const result = await check(username);
    if (result == null) {
      return res.status(404).json({ ok: false });
    } else {
      return res.status(200).json({ ok: true });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
