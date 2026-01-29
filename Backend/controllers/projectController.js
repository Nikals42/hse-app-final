import {
  getProjectData,
  getProjects,
} from "../repositories/projectRepository.js";

export const readAll = async (req, res) => {
  try {
    const projects = await getProjects();
    return res.json(projects);
  } catch (error) {
    console.log(error);
  }
};

export const readData = async (req, res) => {
  try {
    const projectData = await getProjectData();
    return res.json(projectData);
  } catch (error) {
    console.log(error);
  }
};
