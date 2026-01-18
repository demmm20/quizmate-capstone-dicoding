
import React from "react";

const Loading = ({
  size = "md", 
  text = "Memuat...",
  fullScreen = false,
  useImage = false,
  imageSrc = "/assets/images/QuizMate Icon.png",
  imageAlt = "Loading",
  bgImage = "/assets/images/bg-pattern.svg",
}) => {
  const imageSizes = {
    sm: "h-16 w-16",
    md: "h-40 w-40",
    lg: "h-20 w-20",
  };

  const loader = (
    <div className="relative z-10 flex flex-col items-center justify-center gap-6">
      {useImage && (
        <img
          src={imageSrc}
          alt={imageAlt}
          className={`${
            imageSizes[size] || imageSizes.md
          } object-contain animate-spin`}
          draggable={false}
        />
      )}

      {text && (
        <p className="text-gray-700 text-center text-base font-medium">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden">
        <div className="relative z-10 bg-white rounded-3xl shadow-2xl px-20 py-15">
          {loader}
        </div>
      </div>
    );
  }

  return loader;
};

export default Loading;
