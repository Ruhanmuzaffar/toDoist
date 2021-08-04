const express = require("express");

// prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();
//body parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/:projectId/tasks", getTasks);

async function getTasks(req, res) {
  const projectId = req.params.projectId;

  const allTasks = await prisma.tasks.findMany({
    where: {
      project_id: parseInt(projectId),
    },
  });

  if (allTasks.length > 0) {
    res.json(allTasks);
  } else {
    res.status(404).json({ msg: "task not found" });
  }
}

// get single task

app.get("/:projectId/tasks/:id", getSingleTask);

async function getSingleTask(req, res) {
  const taskId = req.params.id;

  const singleTask = await prisma.tasks.findUnique({
    where: {
      id: parseInt(taskId),
    },
  });

  if (singleTask) {
    res.json(singleTask);
  } else {
    res.status(400).json({ msg: "task does not exist" });
  }
}

// create task

app.post("/:projectId/tasks", createTask);

async function createTask(req, res) {
  // handle foreign key constraint
  const projectId = req.params.projectId;
  const { content, description } = req.body;

  if (!content) {
    return res.status(400).json({
      msg: "Please add task content",
    });
  }
  // put into tasks with project id from projectId
  await prisma.tasks.create({
    data: {
      content,
      description: description ? description : "",
      project_id: parseInt(projectId),
    },
  });
  res.json({ msg: "task created sucessfully" });
}

// delete task
app.delete("/:projectId/tasks/:id", deteteTask);

async function deteteTask(req, res) {
  const taskId = req.params.id;

  const singleTask = await prisma.tasks.findUnique({
    where: {
      id: parseInt(taskId),
    },
  });
  console.log("single task>>", singleTask);
  if (singleTask) {
    //delete task
    await prisma.tasks.delete({
      where: {
        id: parseInt(taskId),
      },
    });
    res.json({ msg: "task deleted sucessfully" });
  } else {
    res.status(400).json({ msg: "task does not exist" });
  }
}

// update task

app.put("/:projectId/tasks/:id", editTask);

async function editTask(req, res) {
  const taskId = parseInt(req.params.id);

  // check if it exists

  const { content, description } = req.body;
  console.log("updated content", content);

  if (!content) {
    return res.json({
      msg: "please enter the task content ",
    });
  }

  const task = await prisma.tasks.findUnique({
    where: {
      id: taskId,
    },
  });


  if (task) {
    // update project
    await prisma.tasks.update({
      where: {
        id: parseInt(taskId),
      },
      data: {
        content: content ? content : task.content,
        description: description ? description : task.description,
      },
    });
    res.json({ msg: "updated sucessfully" });
  } else {
    res.status(404).json({ msg: `task with id: ${taskId} does not exist` });
  }
}

module.exports = app;
