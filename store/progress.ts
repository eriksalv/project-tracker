import create from "zustand";

export interface ProgressState {
  isAnimating: boolean;
  setIsAnimating: (isAnimating: boolean) => void;
}

const getDefaultInitialState = () => ({
  isAnimating: false,
});

const useProgressStore = create<ProgressState, any>((set) => ({
  ...getDefaultInitialState(),
  setIsAnimating: (isAnimating: boolean) => {
    set({ isAnimating });
  },
}));

export default useProgressStore;
