import React, { useContext } from "react";
import { UserContext } from "../../context/UserContext";

const SettingsDropdown = () => {
  const { preferences, changeFont, changeFontSize, changeLayoutWidth } =
    useContext(UserContext);

  const FONT_OPTIONS = [
    { key: "poppins", label: "Poppins (Default)", server: "sans" },
    { key: "serif", label: "Serif", server: "serif" },
    { key: "mono", label: "Monospace", server: "mono" },
  ];

  return (
    <div className="flex flex-col gap-4 h-auto w-full max-w-xs overflow-hidden p-4 rounded-lg z-50">
      <div>
        <p className="text-sm font-semibold mb-1">Jenis Font</p>
        <div className="flex flex-col gap-1">
          {FONT_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => changeFont(opt.server)}
              className={`py-1 px-2 rounded-lg text-left ${
                preferences.font === opt.server
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Ukuran Font</p>
        <div className="flex gap-2">
          {["sm", "md", "lg"].map((size) => (
            <button
              key={size}
              onClick={() => changeFontSize(size)}
              className={`py-1 px-3 rounded-lg ${
                preferences.font_size === size
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {size === "sm" && "Kecil"}
              {size === "md" && "Sedang"}
              {size === "lg" && "Besar"}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold mb-1">Lebar Bacaan</p>
        <div className="flex gap-2">
          {["fluid", "boxed"].map((width) => (
            <button
              key={width}
              onClick={() => changeLayoutWidth(width)}
              className={`py-1 px-3 rounded-lg ${
                preferences.layout_width === width
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {width === "fluid" && "Full-width"}
              {width === "boxed" && "Medium-width"}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsDropdown;
