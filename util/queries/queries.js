//  prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

/**
 * -------------------------------queries for projects-------------------------------------
 */

const findAllProjects = () => {
  return prisma.project.findMany();
};

const findProjectById = (id) => {
  return prisma.project.findUnique({
    where: {
      id,
    },
  });
};

const createProject = async (name, color) => {
  return prisma.project.create({
    data: {
      name,
      color: color ? parseInt(color) : 0,
    },
  });
};

const updateProject = (project, id, name, color) => {
  return prisma.project.update({
    where: {
      id,
    },
    data: {
      name: name ? name : project.name,
      color: color ? parseInt(color) : project.color,
    },
  });
};

const deleteProject = async (id) => {
  /**
   * delete all tasks in this project (cascade delete )
   * doing it manually as cascade delelte is not working
   */

  await prisma.tasks.deleteMany({
    where: {
      project_id: parseInt(id),
    },
  });

  // delete project
  await prisma.project.delete({
    where: {
      id: parseInt(id),
    },
  });
};

/**
 * --------------------------------tasks(docs) related querries-------------------------------
 *
 */

function findAllTasks() {
  return prisma.tasks.findMany();
}

function findTaskById(id) {
  return prisma.tasks.findUnique({
    where: {
      id: parseInt(id),
    },
  });
}

function createTask(content, description, project_id) {
  return prisma.tasks.create({
    data: {
      content,
      description: description ? description : "",
      project_id: parseInt(project_id),
    },
  });
}

function deleteTask(id) {
  return prisma.tasks.delete({
    where: {
      id: parseInt(id),
    },
  });
}

function editTask(task, id, content, description, completed) {
  return prisma.tasks.update({
    where: {
      id: parseInt(id),
    },
    data: {
      content: content ? content : task.content,
      description: description ? description : task.description,
      completed: completed ? completed : task.completed,
    },
  });
}
module.exports = {
  findAllProjects,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
  findAllTasks,
  findTaskById,
  createTask,
  deleteTask,
  editTask,
};
