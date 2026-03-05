import {
  getProjectData,
  getProjects,
} from "../repositories/projectRepository.js";

// for Frontend to retrieve project names and id
export const readAll = async (req, res) => {
  try {
    const projects = await getProjects();
    return res.status(200).json(projects);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// for Frontend to retrieve lagging indicators
export const readData = async (req, res) => {
  try {
    const projectData = await getProjectData(req);
    return res.status(200).json(projectData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};
