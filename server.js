const express = require("express");
const tasksRoute = require("./routes/api/Tasks");
const tasksDocsRoute = require("./routes/api/TasksDocs");

// prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const app = express();

const port = 5000;

//body parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome");
});
app.get("/projects", getProjects);

async function getProjects(req, res) {
  let posts = await prisma.project.findMany();

  res.json(posts);
}

// get single project

app.get("/projects/:id", getSingleProject);

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
app.post("/projects/", createProject);

async function createProject(req, res) {
  const { name, color } = req.body;
  console.log("resq", req.body);

  if (!name) {
    return res.status(400).json({ msg: "Please include name " });
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
app.put("/projects/:id", editProject);

async function editProject(req, res) {
  const projectId = parseInt(req.params.id);

  const { name, color } = req.body;
  console.log("updated name", name, color);

  if (!name && !color) {
    return res.json({ msg: "please enter the fields to be changed" });
  }

  // check if it exists
  const project = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  console.log("proj", project);
  if (project) {
    //check for empty fields

    // update project
    await prisma.project.update({
      where: {
        id: parseInt(projectId),
      },
      data: {
        name: name ? name : project.name,
        color: color ? parseInt(color) : project.color,
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

app.delete("/projects/:id", deleteProject);
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

app.use("/", tasksRoute);
// api as per docs

app.use("/", tasksDocsRoute);
app.listen(port, () => console.log(`Listening at port:${port}`));
