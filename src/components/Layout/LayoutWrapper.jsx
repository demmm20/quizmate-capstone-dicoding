import React, { useContext, useMemo } from "react";
import Navbar from "./TopBar";
import Footer from "./Footer";
import { UserContext } from "../../context/UserContext";

const LayoutWrapper = ({
  children,
  showNavbar = true,
  showFooter = true,
  fullHeight = false,
  sidePanel = null,
  bottomBar = null,
  contentClassName = "",
  embed = false,
}) => {
  const { preferences } = useContext(UserContext);

  const FONT_CLASS_MAP = {
    sans: "font-poppins",
    serif: "font-serif",
    mono: "font-mono",
  };
  const FONT_SIZE_MAP = { sm: "text-sm", md: "text-base", lg: "text-lg" };
  const LAYOUT_WIDTH_MAP = { fluid: "max-w-full", boxed: "max-w-6xl" };

  const fontClass = FONT_CLASS_MAP[preferences.font] || "font-poppins";
  const fontSizeClass = FONT_SIZE_MAP[preferences.font_size] || "text-base";
  const layoutWidthClass =
    LAYOUT_WIDTH_MAP[preferences.layout_width] || "max-w-full";

  const hideChrome = embed;
  const hasBottomBar = !hideChrome && !!bottomBar;

  const bgColor = preferences?.theme === "dark" ? "#0b1622" : "#f0f4ff";
  const mainClasses = useMemo(
    () =>
      `${
        fullHeight ? "flex-1 overflow-hidden" : "flex-1"
      } ${contentClassName} ${hasBottomBar ? "pb-24" : ""}`,
    [fullHeight, contentClassName, hasBottomBar]
  );

  return (
    <div
      className={`${fontClass} ${fontSizeClass} relative min-h-screen transition-all duration-300 ${
        fullHeight ? "h-full" : ""
      }`}
      style={{ backgroundColor: bgColor }}
    >
      <img
        src="/assets/images/bg-pattern.svg"
        alt="bg-pattern"
        aria-hidden="true"
        className="pointer-events-none select-none fixed inset-0 w-full h-full object-cover opacity-20 z-0"
      />

      <div
        className={`relative z-10 flex flex-col min-h-screen transition-all duration-500 ${layoutWidthClass} mx-auto`}
      >
        {!hideChrome && showNavbar && <Navbar />}

        <div className={`relative ${fullHeight ? "flex" : ""}`}>
          <main className={mainClasses}>
            {fullHeight ? (
              children
            ) : (
              <div className="container mx-auto px-4">{children}</div>
            )}
          </main>

          {!hideChrome && sidePanel}
        </div>
      </div>

      {!embed && showFooter && <Footer />}
      {!hideChrome && bottomBar}
    </div>
  );
};

export default LayoutWrapper;
