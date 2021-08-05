const express = require("express");
const queries = require("../../util/queries/queries");
// prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
//body parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 *
 * Apis like that of documentation
 */

// get all tasks

app.get("/tasks", getAllTasks);
async function getAllTasks(req, res) {
  try {
    const allTasks = await queries.findAllTasks();
    res.json(allTasks);
  } catch (error) {
    console.log(error);
  }
}

// get single task

app.get("/tasks/:id", getSingleTask);

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

app.post("/tasks", createTask);

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
    const project = await prisma.project.findUnique({
      where: {
        id: project_id,
      },
    });

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
app.delete("/tasks/:id", deteteTask);

async function deteteTask(req, res) {
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

app.put("/tasks/:id", editTask);

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
      await queries.editTask(task,taskId,content,description)
      res.json({ msg: "updated sucessfully" });
    } else {
      res.status(404).json({ msg: `task with id: ${taskId} does not exist` });
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = app;
