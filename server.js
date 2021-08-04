const express = require("express");

// prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

const port = 5000;

//body parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", getProjects);

async function getProjects(req, res) {
  let posts = await prisma.project.findMany();
  console.log("posts.>>", posts);

  console.log("posts>>", posts);

  res.json(posts);
}

// get single project

app.get("/:id", getSingleProject);

async function getSingleProject(req, res) {
  const projectId = parseInt(req.params.id);
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (project) {
    res.json(project);
  } else {
    res
      .status(404)
      .json({ msg: `project with id: ${projectId} does not exist` });
  }
}

// create project
app.post("/", createProject);

async function createProject(req, res) {
  const { name, color } = req.body;

  if (!name || !color) {
    return res.status(400).json({ msg: "Please include name and color" });
  }
  await prisma.project.create({
    data: {
      name,
      color: parseInt(color),
    },
  });

  res.status(200).send({ msg: "project added sucessfully" });
}

// edit projects
app.put("/:id", editProject);

async function editProject(req, res) {
  const projectId = parseInt(req.params.id);

  // check if it exists

  const { name, color } = req.body;
  console.log("updated name", name);

  if (!name && !color) {
    return res.json({ msg: "please enter the fields to be changed" });
  }

  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  console.log("proj", project);
  if (project) {
    // update project
    await prisma.project.update({
      where: {
        id: parseInt(projectId),
      },
      data: {
        name: name ? name : project.name,
        color: color ? color : project.color,
      },
    });
    res.json({ msg: "updated sucessfully" });
  } else {
    res
      .status(404)
      .json({ msg: `project with id: ${projectId} does not exist` });
  }
}

// Delete

app.delete("/:id", deleteProject);
async function deleteProject(req, res) {
  const projectId = parseInt(req.params.id);
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });
  if (project) {
    // delete proj
    await prisma.project.delete({
      where: {
        id: parseInt(projectId),
      },
    });
    res.json({ msg: "project deleted sucessfully" });
  } else {
    res
      .status(404)
      .json({ msg: `project with id: ${projectId} does not exist` });
  }
}
app.listen(port, () => console.log(`Listening at port:${port}`));
