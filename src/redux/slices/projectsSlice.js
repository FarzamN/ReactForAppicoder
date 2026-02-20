import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  toggleTaskApi,
  saveProjectApi,
  fetchProjectsApi,
  saveTaskApi,
} from "../../api/projects.api";

export const fetchProjects = createAsyncThunk("projects/fetch", async () => {
  return await fetchProjectsApi();
});

export const saveProject = createAsyncThunk(
  "projects/save",
  async (project) => {
    return await saveProjectApi(project);
  },
);
export const saveTask = createAsyncThunk(
  "projects/saveTask",
  async ({ projectId, task }) => {
    return await saveTaskApi(projectId, task);
  },
);
export const toggleTask = createAsyncThunk(
  "projects/toggleTask",
  async ({ projectId, taskId }, { rejectWithValue }) => {
    try {
      await toggleTaskApi(taskId);
      return { projectId, taskId };
    } catch {
      return rejectWithValue({ projectId, taskId });
    }
  },
);

const projectsSlice = createSlice({
  name: "projects",
  initialState: {
    list: [],
    loading: false,
    error: null,
    search: "",
    statusFilter: "all",
  },
  reducers: {
    setSearch(state, action) {
      state.search = action.payload;
    },
    setStatusFilter(state, action) {
      state.statusFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = "Failed to load projects";
      })
      .addCase(saveProject.pending, (state) => {
        state.loading = true;
      })
      .addCase(saveProject.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.list.findIndex((p) => p.id === action.payload.id);
        if (index >= 0) {
          state.list[index] = action.payload; // edit
        } else {
          state.list.push(action.payload); // create
        }
      })
      .addCase(toggleTask.pending, (state, action) => {
        const { projectId, taskId } = action.meta.arg;
        const project = state.list.find((p) => p.id === projectId);
        const task = project.tasks.find((t) => t.id === taskId);
        task.completed = !task.completed; // optimistic
      })
      .addCase(toggleTask.rejected, (state, action) => {
        const { projectId, taskId } = action.payload;
        const project = state.list.find((p) => p.id === projectId);
        const task = project.tasks.find((t) => t.id === taskId);
        task.completed = !task.completed; // rollback
      })
      .addCase(saveTask.fulfilled, (state, action) => {
        const { projectId, task } = action.meta.arg;
        const project = state.list.find((p) => p.id === projectId);

        const index = project.tasks.findIndex((t) => t.id === task.id);

        if (index >= 0) {
          project.tasks[index] = action.payload; // edit
        } else {
          project.tasks.push(action.payload); // create
        }
      });
  },
});

export const { setSearch, setStatusFilter } = projectsSlice.actions;
export default projectsSlice.reducer;
