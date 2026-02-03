import {
  getContractors,
  getProjectData,
  getProjects,
} from "../repositories/projectRepository.js";

// for Frontend to retrieve project names and id
export const readAll = async (req, res) => {
  try {
    const projects = await getProjects();
    return res.json(projects);
  } catch (error) {
    console.log(error);
  }
};

// for Frontend to retrieve contractors working in a project
export const readContractors = async (req, res) => {
  try {
    const contractors = await getContractors(req);
    return res.json(contractors);
  } catch (error) {
    console.log(error);
  }
};

// for Frontend to retrieve project names, id and lagging indicators
export const readData = async (req, res) => {
  try {
    const projectData = await getProjectData();
    return res.json(projectData);
  } catch (error) {
    console.log(error);
  }
};
