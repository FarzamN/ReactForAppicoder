let mockProjects = [
  {
    id: "1",
    name: "Website Redesign",
    owner: "Alice",
    status: "active",
    progress: 70,
    createdAt: "2024-12-01",
  },
  {
    id: "2",
    name: "Mobile App",
    owner: "Bob",
    status: "completed",
    progress: 100,
    createdAt: "2024-11-15",
  },
  {
    id: "3",
    name: "Admin Dashboard",
    owner: "Charlie",
    status: "pending",
    progress: 20,
    createdAt: "2025-01-05",
  },
];

export function fetchProjectsApi() {
  return new Promise((resolve) => {
    setTimeout(() => resolve([...mockProjects]), 500);
  });
}

export function saveProjectApi(project) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (project.id) {
        mockProjects = mockProjects.map((p) =>
          p.id === project.id ? project : p,
        );
      } else {
        project = {
          ...project,
          id: Date.now().toString(),
          tasks: [],
        };
        mockProjects.push(project);
      }
      resolve(project);
    }, 500);
  });
}

export function toggleTaskApi(taskId) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      Math.random() < 0.9 ? resolve() : reject();
    }, 500);
  });
}

export function saveTaskApi(projectId, task) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        ...task,
        id: task.id || Date.now().toString(),
      });
    }, 400);
  });
}
