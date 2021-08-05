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

// edit project
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

// Delete project

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

// get all tasks

async function getAllTasks(req, res) {
  try {
    const allTasks = await queries.findAllTasks();
    res.json(allTasks);
  } catch (error) {
    console.log(error);
  }
}

// get single task

async function getSingleTask(req, res) {
  const taskId = req.params.id;

  try {
    const singleTask = await queries.findTaskById(taskId);

    if (singleTask) {
      res.json(singleTask);
    } else {
      res.status(400).json({ msg: "task does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
}

// create task

async function createTask(req, res) {
  // handle foreign key constraint

  const { content, description, project_id } = req.body;
  console.log("body>>", req.body);

  if (!content) {
    return res.status(400).json({
      msg: "Please add task content",
    });
  }
  if (!project_id) {
    return res.status(400).json({
      msg: "Please add project to which to add task ",
    });
  }

  try {
    const project = await queries.findProjectById(project_id);

    if (project) {
      // put into tasks with project id from projectId

      const task = await queries.createTask(content, description, project_id);
      res.json({ msg: "task created sucessfully", task });
    } else {
      res.json({ msg: "Project does not exist" });
    }
  } catch (error) {}
}

// delete task

async function deleteTask(req, res) {
  const taskId = req.params.id;

  try {
    const singleTask = await queries.findTaskById(taskId);

    if (singleTask) {
      //delete task
      await queries.deleteTask(taskId);
      res.json({ msg: "task deleted sucessfully" });
    } else {
      res.status(400).json({ msg: "task does not exist" });
    }
  } catch (error) {
    console.log(error);
  }
}

// update task

async function editTask(req, res) {
  const taskId = parseInt(req.params.id);

  // check if it exists

  const { content, description } = req.body;

  if (!content) {
    return res.json({
      msg: "please enter the task content ",
    });
  }

  try {
    const task = await queries.findTaskById(taskId);

    if (task) {
      // update task
      await queries.editTask(task, taskId, content, description);
      res.json({ msg: "updated sucessfully" });
    } else {
      res.status(404).json({ msg: `task with id: ${taskId} does not exist` });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  getProjects,
  getSingleProject,
  createProject,
  editProject,
  deleteProject,
  getAllTasks,
  getSingleTask,
  createTask,
  deleteTask,
  editTask,
};
