import React, { useContext } from "react";
import Card from "../../common/Card";
import { UserContext } from "../../../context/UserContext";

const MaterialContent = ({ title, content, loading = false }) => {
  if (loading) {
    return (
      <Card>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </Card>
    );
  }

  const { preferences } = useContext(UserContext);
  if (!preferences) return <p>No preferences found.</p>;

  const isDark = preferences.theme === "dark";
  const cardClassName = isDark
    ? "bg-[#111b2a] text-white rounded-md border border-[#1f2a3a]"
    : "bg-white text-gray-800 rounded-md border border-gray-200";

  return (
    <Card className={cardClassName}>
      {title && (
        <h2 className={`text-2xl font-bold mb-4 ${isDark ? "text-gray-100" : "text-gray-900"}`}>
          {title}
        </h2>
      )}
      <div
        className={`prose prose-sm max-w-none ${isDark ? "text-gray-100" : ""}`}
        dangerouslySetInnerHTML={{
          __html: content || "<p>No content available</p>",
        }}
      />
    </Card>
  );
};

export default MaterialContent;