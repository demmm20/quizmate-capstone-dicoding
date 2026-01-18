import React, { useContext } from "react";
import Button from "../common/Button";
import { UserContext } from "../../context/UserContext";

const BottomBarTwoActions = ({ leftLabel, rightLabel, onLeft, onRight }) => {
  const { preferences } = useContext(UserContext);
  const isDark = preferences?.theme === "dark";

  const bg = isDark ? "#0b1622" : "#ffffff";
  const border = isDark ? "#142233" : "#e5e7eb";
  const text = isDark ? "#c9d1d9" : "#111827";

  return (
    <div
      className="fixed bottom-0 left-0 right-0 px-8 py-4 z-40"
      style={{
        background: bg,
        borderTop: `1px solid ${border}`,
        color: text,
      }}
    >
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <Button variant="secondary" onClick={onLeft} className="cursor-pointer">
          {leftLabel}
        </Button>
        <Button variant="primary" onClick={onRight} className="cursor-pointer">
          {rightLabel}
        </Button>
      </div>
    </div>
  );
};

export default BottomBarTwoActions;