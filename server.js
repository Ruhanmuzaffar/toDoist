const express = require("express");
const tasksRoute = require("./routes/api/Tasks");
const tasksDocsRoute = require("./routes/api/TasksDocs");
const queries = require("./util/queries/queries");

const app = express();

const port = process.env.PORT || 5000;

// cors
const cors = require("cors");
app.use(cors());

//body parser

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("<h1>Welcome</h1>");
});
app.get("/projects", getProjects);

async function getProjects(req, res) {
  try {
    let projects = await queries.findAllProjects();
    res.json(projects);
  } catch (error) {
    console.log(error);
  }
}

// get single project

app.get("/projects/:id", getSingleProject);

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
app.post("/projects/", createProject);

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
app.put("/projects/:id", editProject);

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

app.delete("/projects/:id", deleteProject);
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
app.use("/", tasksRoute);
// api as per docs

app.use("/", tasksDocsRoute);
app.listen(port, () => console.log(`Listening at port:${port}`));
