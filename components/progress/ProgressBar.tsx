import { Progress } from "@mantine/core";
import React from "react";
import { useNProgress } from "@tanem/react-nprogress";

const ProgressBar: React.FC<{ isAnimating: boolean }> = ({ isAnimating }) => {
  const { progress, animationDuration, isFinished } = useNProgress({
    isAnimating,
  });

  return (
    <Progress
      value={progress * 100}
      animate
      size="sm"
      sx={{
        zIndex: 100,
        position: "fixed",
        width: "100vw",
        left: 0,
        top: 0,
        opacity: isFinished ? 0 : 1,
        transition: `opacity ${animationDuration}ms linear`,
      }}
    />
  );
};

export default ProgressBar;
