const express = require("express");
const tasksRoute = require("./routes/api/Tasks");
const tasksDocsRoute = require("./routes/api/TasksDocs");
const queries = require("./util/queries/queries");
const utils = require("./util/util");
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

// get all projects
app.get("/projects", utils.getProjects);

// get single project

app.get("/projects/:id", utils.getSingleProject);

// create project
app.post("/projects/", utils.createProject);

// edit project
app.put("/projects/:id", utils.editProject);

// Delete project

app.delete("/projects/:id", utils.deleteProject);

app.use("/", tasksRoute);
// api as per docs

app.use("/", tasksDocsRoute);
app.listen(port, () => console.log(`Listening at port:${port}`));
