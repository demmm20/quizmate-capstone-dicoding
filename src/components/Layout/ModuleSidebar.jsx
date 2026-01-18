import React, { useContext, useState, useMemo, useEffect } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import { UserContext } from "../../context/UserContext";
import { quizDone } from "../../utils/accessControl";

const ModuleSidebar = ({
  items = [], // Flat items dari buildSidebarItems lama
  modules, // Optional: nested modules structure
  extraItems, // Optional: quiz final & dashboard
  currentId,
  currentType = "tutorial",
  onSelect,
  isOpen,
  onToggle,
}) => {
  const { preferences } = useContext(UserContext);

  // State untuk expand/collapse
  const [expandedModules, setExpandedModules] = useState({});
  const [expandedSubmodules, setExpandedSubmodules] = useState({});

  // Konversi flat items ke nested structure jika diperlukan
  const nestedData = useMemo(() => {
    // Jika sudah ada modules & extraItems, gunakan itu
    if (modules && extraItems) {
      return { modules, extraItems };
    }

    // Jika masih flat items, konversi ke nested
    const tutorialItems = items.filter((item) => item.type === "tutorial");
    const quizItems = items.filter((item) => item.type === "quiz-sub");
    const finalItems = items.filter(
      (item) => item.type === "quiz-final" || item.type === "dashboard"
    );

    const moduleStructure = [
      {
        id: 1,
        title: "Pengenalan & Sejarah AI",
        type: "module",
        submodules: tutorialItems.map((tut, idx) => {
          const quizItem = quizItems.find((q) => q.id === tut.id);
          return {
            id: `1.${idx + 1}`,
            tutorialId: tut.id,
            title: tut.label,
            type: "submodule",
            isLocked: !tut.progressAllowed,
            progressAllowed: tut.progressAllowed,
            quiz: quizItem
              ? {
                  id: `1.${idx + 1}`,
                  tutorialId: quizItem.id,
                  title: quizItem.label,
                  type: "quiz-sub",
                  isLocked: !quizItem.progressAllowed,
                  progressAllowed: quizItem.progressAllowed,
                }
              : null,
          };
        }),
      },
    ];

    return {
      modules: moduleStructure,
      extraItems: finalItems.map((item) => ({
        ...item,
        isLocked: !item.progressAllowed,
      })),
    };
  }, [items, modules, extraItems]);

  useEffect(() => {
    const autoExpandedSubs = {};
    const autoExpandedModules = {};

    nestedData.modules.forEach((module) => {
      module.submodules?.forEach((sub) => {
        if (sub.quiz && quizDone(sub.tutorialId)) {
          autoExpandedSubs[sub.id] = true;
          autoExpandedModules[module.id] = true;
        }
      });
    });

    setExpandedSubmodules((prev) => ({
      ...autoExpandedSubs,
      ...prev,
    }));

    setExpandedModules((prev) => ({
      ...autoExpandedModules,
      ...prev,
    }));
  }, [nestedData]);

  const toggleModuleExpand = (moduleId) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const toggleSubmoduleExpand = (submoduleId, e) => {
    e.stopPropagation();
    setExpandedSubmodules((prev) => ({
      ...prev,
      [submoduleId]: !prev[submoduleId],
    }));
  };

  const handleSubmoduleClick = (submodule) => {
    if (!submodule.isLocked) {
      onSelect({
        type: "tutorial",
        id: submodule.tutorialId,
        label: submodule.title,
      });
      if (window.innerWidth < 1024) onToggle();
    }
  };

  const handleQuizClick = (quiz, e) => {
    e.stopPropagation();
    if (!quiz.isLocked) {
      onSelect({
        type: "quiz-sub",
        id: quiz.tutorialId,
        label: quiz.title,
      });
      if (window.innerWidth < 1024) onToggle();
    }
  };

  const handleExtraItemClick = (item) => {
    if (!item.isLocked) {
      onSelect(item);
      if (window.innerWidth < 1024) onToggle();
    }
  };

  const isDark = preferences?.theme === "dark";

  // Render Quiz Item
  const renderQuizItem = (quiz) => {
    const isActive =
      currentType === "quiz-sub" && currentId === quiz.tutorialId;

    return (
      <div
        key={`quiz-${quiz.id}`}
        onClick={(e) => handleQuizClick(quiz, e)}
        className={`py-2 px-3 ml-12 rounded cursor-pointer transition-all flex items-center gap-2 ${
          quiz.isLocked
            ? "opacity-50 cursor-not-allowed"
            : isActive
            ? isDark
              ? "bg-blue-900 text-blue-300"
              : "bg-blue-50 text-blue-600"
            : isDark
            ? "hover:bg-gray-700 text-gray-300"
            : "hover:bg-gray-100 text-gray-600"
        }`}
      >
        <p
          className={`text-sm leading-snug ${
            isActive ? "text-blue-600 font-medium" : "text-gray-600"
          }`}
        >
          {quiz.title}
        </p>
        {quiz.isLocked && (
          <LockClosedIcon className="w-4 h-4 text-orange-300 ml-auto flex-shrink-0" />
        )}
      </div>
    );
  };

  // Render Submodule
  const renderSubmodule = (submodule) => {
    const isSubmoduleExpanded = expandedSubmodules[submodule.id];
    const isActive =
      currentType === "tutorial" && currentId === submodule.tutorialId;

    return (
      <div key={submodule.id}>
        <div
          onClick={() => handleSubmoduleClick(submodule)}
          className={`px-3 py-2 ml-4 rounded cursor-pointer transition-all flex items-center justify-between ${
            submodule.isLocked
              ? "opacity-60 cursor-not-allowed"
              : isActive
              ? "bg-blue-50"
              : "hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={(e) => toggleSubmoduleExpand(submodule.id, e)}
              className="p-0.5 hover:bg-gray-200 rounded transition flex-shrink-0"
            >
              {isSubmoduleExpanded ? (
                <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRightIcon className="w-4 h-4 text-gray-500" />
              )}
            </button>
            <p
              className={`text-sm leading-snug truncate ${
                isActive ? "text-blue-600 font-semibold" : "text-gray-700"
              }`}
            >
              {submodule.title}
            </p>
          </div>
          {submodule.isLocked && (
            <LockClosedIcon className="w-5 h-5 text-orange-300 ml-2 flex-shrink-0" />
          )}
        </div>

        {isSubmoduleExpanded &&
          submodule.quiz &&
          renderQuizItem(submodule.quiz)}
      </div>
    );
  };

  // Render Module
  const renderModule = (module) => {
    const isModuleExpanded = expandedModules[module.id];

    return (
      <div key={module.id} className="mb-1">
        <div
          onClick={() => toggleModuleExpand(module.id)}
          className="py-2 px-3 rounded cursor-pointer transition-all flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-2 flex-1">
            {isModuleExpanded ? (
              <ChevronDownIcon className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronRightIcon className="w-4 h-4 text-gray-500" />
            )}
            <p
              className={`text-sm font-semibold ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              {module.title}
            </p>
          </div>
        </div>

        {isModuleExpanded &&
          module.submodules &&
          module.submodules.length > 0 && (
            <div className="border-l-2 border-gray-200 ml-4">
              {module.submodules.map((sub) => renderSubmodule(sub))}
            </div>
          )}
      </div>
    );
  };

  // Render Extra Items (Quiz Final & Dashboard)
  const renderExtraItem = (item) => {
    const isActive =
      item.type === currentType &&
      (item.id === currentId ||
        item.id === "quiz-final" ||
        item.id === "dashboard");

    return (
      <div key={item.id} className="mb-1">
        <button
          disabled={item.isLocked}
          onClick={() => handleExtraItemClick(item)}
          className={`w-full text-left px-4 py-3 rounded-lg transition-all flex items-center justify-between ${
            isActive
              ? "bg-blue-50 border border-blue-300"
              : "hover:bg-gray-100 border border-transparent"
          } ${
            item.isLocked ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <span className="text-xl font-bold">
              {isActive ? "" : item.progressAllowed ? "●" : "○"}
            </span>
            <div className="flex-1 min-w-0">
              <p
                className={`text-sm font-medium truncate ${
                  isActive
                    ? isDark
                      ? "text-blue-500"
                      : "text-blue-600"
                    : isDark
                    ? "text-blue-300"
                    : "text-gray-900"
                }`}
              >
                {item.label}
              </p>
              <p className="text-xs text-gray-500">{item.desc}</p>
            </div>
          </div>
          {item.isLocked && (
            <LockClosedIcon className="w-5 h-5 text-orange-300 ml-2 flex-shrink-0" />
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      {/* Toggle Button */}
      <div
        onClick={onToggle}
        className={`fixed top-24 z-30 p-2 bg-blue-900 w-8 text-2xl cursor-pointer rounded-full transition-all duration-300 ${
          isOpen ? "right-80 translate-x-4" : "-right-3 rounded-r translate-x-0"
        }`}
      >
        {isOpen ? (
          <ChevronRightIcon color="white" />
        ) : (
          <ChevronLeftIcon color="white" />
        )}
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-transparent z-30 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Container */}
      <div
        className={`fixed h-full top-0 right-0 w-80 pt-32 px-6 overflow-y-auto z-20 transform transition-transform duration-300 ease-in-out ${
          isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        } ${isOpen ? "translate-x-0" : "translate-x-120"}`}
      >
        {/* Header */}
        <div className="mb-2 pt-8 lg:pt-0">
          <h3
            className={`text-lg font-bold ${
              isDark ? "text-white" : "text-gray-900"
            }`}
          >
            Daftar Modul
          </h3>
        </div>

        {/* Module List */}
        <div className="space-y-1 pb-6">
          {nestedData.modules.map((module) => renderModule(module))}
        </div>

        {/* Extra Items (Quiz Final & Dashboard) */}
        {nestedData.extraItems && nestedData.extraItems.length > 0 && (
          <div className="border-t border-gray-200 pt-4 space-y-2 pb-20">
            {nestedData.extraItems.map((item) => renderExtraItem(item))}
          </div>
        )}
      </div>
    </>
  );
};

export default ModuleSidebar;
