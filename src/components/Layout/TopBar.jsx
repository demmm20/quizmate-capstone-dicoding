import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import Button from "../common/Button";
import { UserContext } from "../../context/UserContext";
import ThemeToggle from "../common/ThemeToggle";
import SettingsDropdown from "../common/SettingsDropdown";

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const { preferences, changeTheme, changeFontSize } = useContext(UserContext);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleThemeToggle = () => {
    const newTheme = preferences.theme === "light" ? "dark" : "light";
    changeTheme(newTheme);
  };

  const handleFontSizeChange = (e) => {
    changeFontSize(e.target.value);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        preferences.theme === "light"
          ? "bg-gray-50 text-gray-900 shadow-md"
          : "bg-gray-900 text-white shadow-xl"
      }`}
    >
      <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20">
        <div className="flex justify-between items-center h-16">
          <button onClick={() => navigate("/home")}>
            <img
              src="/public/assets/images/QuizMate Header.png"
              className="w-52 h-44 cursor-pointer"
              alt="logo-header"
            />
          </button>

          <div className="hidden md:flex items-center gap-6 relative">
            <ThemeToggle
              isDark={preferences.theme === "dark"}
              onToggle={handleThemeToggle}
            />

            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => {
                    setProfileOpen(!profileOpen);
                    setSettingsOpen(false);
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <div className="text-right">
                    <p className="font-semibold text-sm">{`Halo, ${
                      user?.name || "User"
                    }`}</p>
                    <p className="text-xs text-gray-400">
                      {user?.name}@email.com
                    </p>
                  </div>

                  <div className="w-10 h-10 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-700 font-semibold">
                      {user?.name?.[0]?.toUpperCase() || "U"}
                    </span>
                  </div>
                </button>

                {profileOpen && (
                  <div
                    className={`absolute right-0 mt-2 w-48 rounded-xl shadow-lg border ${
                      preferences.theme === "dark"
                        ? "bg-gray-800 border-gray-700 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <div className="px-4 py-3 border-b border-gray-300 dark:border-gray-700">
                      <p className="font-semibold text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-400">
                        {user?.name}@email.com
                      </p>
                    </div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-500 hover:bg-red-100 dark:hover:bg-red-900"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => {
                setSettingsOpen(!settingsOpen);
                setProfileOpen(false);
              }}
              className="relative flex items-center justify-center hover:opacity-80 bg"
            >
              <img
                src="/public/assets/images/icon-settings.png"
                className="w-7 h-7"
                alt="icon-settings"
              />
              <span className="text-xs"></span>
            </button>

            {settingsOpen && (
              <div
                className={`absolute right-1 top-12 w-70 rounded-xl shadow-lg border p-4 z-50 ${
                  preferences.theme === "dark"
                    ? "bg-gray-800 border-gray-700 text-white"
                    : "bg-white border-gray-200 text-gray-900"
                }`}
              >
                <SettingsDropdown />
              </div>
            )}
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-200 dark:text-gray-200 hover:text-gray-100 transition"
            >
              {mobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pt-4 pb-4 border-t border-gray-300 dark:border-gray-700 space-y-3">
            <ThemeToggle
              isDark={preferences.theme === "dark"}
              onToggle={handleThemeToggle}
            />

            <select
              value={preferences.font_size}
              onChange={handleFontSizeChange}
              className="px-4 py-2"
            >
              <option value="sm">Small</option>
              <option value="md">Medium</option>
              <option value="lg">Large</option>
            </select>

            <SettingsDropdown />

            {isAuthenticated && (
              <Button
                onClick={handleLogout}
                fullWidth
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Logout
              </Button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
