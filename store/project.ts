import create from "zustand";
import { Project } from "../types/client";

export interface ProjectState {
  project: Project | null;
  setProject: (project: Project | null) => void;
}

const getDefaultInitialState = () => ({
  project: null,
  projects: null,
});

const useProjectStore = create<ProjectState, any>((set) => ({
  ...getDefaultInitialState(),
  setProject: (project: Project | null) => {
    set({ project });
  },
}));

export default useProjectStore;
