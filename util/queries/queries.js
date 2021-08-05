//  prisma client
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

const deleteProject = (id) => {
  return prisma.project.delete({
    where: {
      id: parseInt(id),
    },
  });
};

/**
 * tasks(docs) related querries
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
module.exports = {
  findAllProjects,
  findProjectById,
  createProject,
  updateProject,
  deleteProject,
  findAllTasks,
  findTaskById,
};
