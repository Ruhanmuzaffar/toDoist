const express = require("express");
const queries = require("../../util/queries/queries");
const utils = require("../../util/util");
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
