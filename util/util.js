const queries = require("./queries/queries");

// get all projects
async function getProjects(req, res) {
  try {
    let projects = await queries.findAllProjects();
    res.json(projects);
  } catch (error) {
    console.log(error);
  }
}

// get single project
async function getSingleProject(req, res) {
  const projectId = parseInt(req.params.id);
  try {
    const project = await queries.findProjectById(projectId);

    if (project) {
      res.json(project);
    } else {
      res
        .status(404)
        .json({ msg: `project with id: ${projectId} does not exist` });
    }
  } catch (error) {
    console.log(error);
  }
}

// create project
async function createProject(req, res) {
  const { name, color } = req.body;
  console.log("resq", req.body);

  if (!name) {
    return res.status(400).json({ msg: "Please include name " });
  }
  try {
    const project = await queries.createProject(name, color);
    res.status(200).send({ msg: "project added sucessfully", project });
  } catch (err) {
    console.log(err);
  }
}

// edit projects
async function editProject(req, res) {
  const projectId = parseInt(req.params.id);

  const { name, color } = req.body;
  console.log("updated name", name, color);

  if (!name && !color) {
    return res.json({ msg: "please enter the fields to be changed" });
  }

  // check if it exists
  try {
    const project = await queries.findProjectById(projectId);
    console.log("proj", project);
    if (project) {
      //check for empty fields

      // update project

      await queries.updateProject(project, projectId, name, color);
      res.json({ msg: "updated sucessfully" });
    } else {
      res
        .status(404)
        .json({ msg: `project with id: ${projectId} does not exist` });
    }
  } catch (error) {
    console.log(error);
  }
}

// Delete

async function deleteProject(req, res) {
  const projectId = parseInt(req.params.id);
  const project = queries.findProjectById(projectId);
  if (project) {
    // delete proj
    try {
      await queries.deleteProject(projectId);
    } catch (error) {
      console.log(error);
    }

    res.json({ msg: "project deleted sucessfully" });
  } else {
    res
      .status(404)
      .json({ msg: `project with id: ${projectId} does not exist` });
  }
}

module.exports = {
  getProjects,
  getSingleProject,
  createProject,
  editProject,
  deleteProject,
};
