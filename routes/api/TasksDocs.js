const express = require("express");
const utils = require("../../util/util");

const app = express();
//body parser

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 *
 * Apis like that of documentation
 */


// get all tasks

app.get("/tasks", utils.getAllTasks);

// get single task

app.get("/tasks/:id", utils.getSingleTask);

// create task

app.post("/tasks", utils.createTask);

// delete task
app.delete("/tasks/:id", utils.deleteTask);

// update task

app.put("/tasks/:id", utils.editTask);

module.exports = app;
