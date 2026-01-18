import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import Button from "../components/common/Button";
import Card from "../components/common/Card";
import Loading from "../components/common/Loading";
import { Alert } from "../components/common";
import { UserContext } from "../context/UserContext";

const HeroSection = ({
  module,
  completionPercentage,
  onStartTutorial,
  tutorials,
}) => {
  if (!module) return null;

  const { preferences } = useContext(UserContext);

  const handleBelajarSekarang = () => {
    if (tutorials && tutorials.length > 0) {
      onStartTutorial(tutorials[0].id);
    }
  };

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 pt-25">
      <div
        className={`flex flex-col md:flex-row items-center mb-8 gap-10 p-10 drop-shadow-xl border-l rounded-lg shadow-md transition-all duration-500 ease-in-out ${
          preferences.theme === "dark"
            ? "text-white bg-gray-800 border-gray-800 shadow-gray-900"
            : "text-gray-900 bg-white border-gray-200"
        }`}
      >
        <div className="transition-all transform duration-500 ease-in-out hover:scale-105 w-full md:w-120 h-auto">
          <img
            src="/assets/images/fotomodul.png"
            alt="Course Thumbnail"
            className="w-full h-auto rounded-lg object-cover max-w-full"
          />
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div>
            <p className="font-medium text-sm mb-2">
              4.87
              <span className="text-yellow-500 text-xl ml-2">★ ★ ★ ★ ★</span>
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold">{module.title}</h2>
          </div>

          <div className="space-x-3 mb-2">
            {["AI", "Machine Learning", "Data Science"].map((tag) => (
              <span
                key={tag}
                className={`py-1 px-4 rounded-2xl text-sm transition-all duration-300 ease-in-out ${
                  preferences.theme === "dark"
                    ? "text-white bg-blue-500 hover:bg-blue-700"
                    : "text-blue-800 bg-blue-200 hover:bg-blue-400"
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <span className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-300 ease-in-out">
            <img
              src="/assets/images/icon-study.png"
              alt="Level Icon"
              className="w-5 h-5 transition-transform duration-300 hover:scale-110"
            />
            <p>Level: Dasar</p>
          </span>

          <span className="flex items-center space-x-2 text-sm text-gray-500 transition-all duration-300 ease-in-out">
            <img
              src="/assets/images/icon-calender.png"
              alt="Calendar Icon"
              className="w-5 h-5 transition-transform duration-300 hover:scale-110"
            />
            <p>Estimasi Waktu Belajar: 40 Jam</p>
          </span>

          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Progres Kursus:
            </p>
            <div className="flex items-center justify-between w-full">
              <div className="w-full bg-gray-300 dark:bg-gray-700 h-1 rounded-full mr-4">
                <div
                  className="bg-blue-600 dark:bg-blue-500 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                ></div>
              </div>
              <div className="flex gap-2 w-full">
                <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {completionPercentage}% Selesai
                </span>
                <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                  Waktu Belajar: 21 Jam
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-2">
            <button
              onClick={handleBelajarSekarang}
              className="bg-blue-500 text-white hover:bg-blue-600 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium cursor-pointer"
            >
              Mulai Belajar
            </button>
            <button className="border-2 border-blue-400 hover:text-white hover:bg-blue-500 text-blue-400 px-7 py-2 rounded-xl w-full sm:w-auto transition-colors duration-300 ease-in-out font-medium cursor-pointer">
              Informasi Kelas
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

      const BenefitsSection = ({ benefits }) => {
        const { preferences } = useContext(UserContext);

        return (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2
              className={`text-2xl font-bold mb-8 text-center lg:text-left ${
                preferences.theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Fitur & Manfaat Kelas
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 lg:gap-8 items-stretch">
              {benefits.map((benefit) => (
                <div
                  key={benefit.id}
                  className={`flex flex-col h-full items-center text-center backdrop-blur rounded-xl shadow-sm p-4 sm:p-5 border-1 hover:shadow-xl transform duration-500 ease-in-out hover:scale-105 ${
                    preferences?.theme === "dark"
                      ? "text-white bg-gray-700 border-gray-700"
                      : "text-gray-900 border-gray-200 bg-white"
                  }`}
                >
                  <div className="w-12 h-12 mb-3 bg-blue-100 dark:bg-blue-500 rounded-lg flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-white">
                    {benefit.icon}
                  </div>
                  <h3
                    className={`font-semibold ${
                      preferences?.theme === "dark" ? "text-white" : "text-gray-900"
                    } mb-2 min-h-[48px] flex items-center justify-center`}
                  >
                    {benefit.title}
                  </h3>
                  <p
                    className={`text-sm ${
                      preferences?.theme === "dark"
                        ? "text-gray-300"
                        : "text-gray-600"
                    } leading-relaxed`}
                  >
                    {benefit.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        );
      };

const DescriptionSection = ({ module }) => {
  const { preferences } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState("deskripsi");

  if (!module) return null;

  const tabs = [
    { id: "deskripsi", label: "Deskripsi Kelas" },
    { id: "testimoni", label: "Testimoni" },
    { id: "faq", label: "FAQ" },
  ];

  const contributors = [
    {
      id: 1,
      name: "Dr. Rina Wijaya",
      role: "Instruktur Utama",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rina",
    },
    {
      id: 2,
      name: "Prof. Eko Susanto",
      role: "Reviewer Materi",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Eko",
    },
    {
      id: 3,
      name: "Mira Amelia, M.Sc.",
      role: "Asisten Instruktur",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mira",
    },
  ];
  const isDark = preferences?.theme === "dark";

  return (
    <div className="max-w-10xl mx-auto px-4 sm:px-6 lg:px-20 py-12 ">
      <div className="mb-8">
        <div
          className={`flex justify-center gap-0 rounded-lg p-1 max-w-20xl mx-auto ${
            isDark ? "bg-gray-700 " : "bg-gray-200"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-6 font-medium transition-all rounded-md ${
                activeTab === tab.id
                  ? isDark
                    ? "bg-gray-800 text-white shadow-md"
                    : "bg-white text-gray-900 shadow-sm"
                  : isDark
                  ? "text-gray-300 hover:text-white"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-12">
        {activeTab === "deskripsi" && (
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Deskripsi
            </h2>

            <div
              className={`space-y-4 ${
                isDark ? "text-gray-300" : "text-gray-700"
              }`}
            >
              <p>
                Selamat datang di kelas 'Belajar Dasar AI', kursus komprehensif
                yang dirancang untuk memperkenalkan Anda pada dunia kecerdasan
                buatan dari nol. Kursus ini sangat cocok untuk pemula yang ingin
                memahami konsep dasar, algoritma, dan aplikasi AI modern tanpa
                memerlukan latar belakang teknis yang mendalam.
              </p>

              <p>
                Materi dirancang menjadi yang terstruktur, Anda akan belajar:
              </p>

              <ul className="list-none space-y-2 ml-4">
                <li>• Konsep dasar Artificial Intelligence</li>
                <li>• Machine Learning dan penerapannya</li>
                <li>• Data Science fundamental</li>
                <li>• Best practices dalam AI development</li>
                <li>• Real-world use cases dan applications</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === "testimoni" && (
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              Testimoni
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              Belum ada testimoni tersedia.
            </p>
          </div>
        )}

        {activeTab === "faq" && (
          <div>
            <h2
              className={`text-2xl font-bold mb-6 ${
                isDark ? "text-white" : "text-gray-900"
              }`}
            >
              FAQ
            </h2>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>
              Belum ada FAQ tersedia.
            </p>
          </div>
        )}
      </div>

      <section>
        <h2
          className={`text-2xl font-bold mb-6 ${
            isDark ? "text-white" : "text-gray-900"
          }`}
        >
          Kontributor Kelas
        </h2>
        <div className="flex flex-col md:flex-row gap-6">
          {contributors.map((contributor) => (
            <div
              key={contributor.id}
              className={`flex items-center gap-4 hover:shadow-md p-4 rounded-lg transition-all duration-300 cursor-pointer border flex-1 group ${
                isDark
                  ? "bg-gray-700 hover:bg-gray-800 border-gray-600  hover:border-gray-500"
                  : "bg-white hover:bg-gray-50 hover:border-gray-300 border-gray-200"
              }`}
            >
              <img
                src={contributor.avatar}
                alt={contributor.name}
                className="w-16 h-16 rounded-full bg-gray-200 group-hover:scale-110 transition-transform duration-300"
              />
              <div>
                <h3
                  className={`font-semibold  group-hover:text-blue-600 transition-colors ${
                    isDark ? "text-white" : "text-gray-900"
                  }`}
                >
                  {contributor.name}
                </h3>
                <p
                  className={`text-sm ${
                    isDark ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {contributor.role}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};


const ClassDetailPage = () => {
  const navigate = useNavigate();
  const { modules, tutorials, loading, error, fetchModules, fetchTutorials } =
    useLearning();
  const { getCompletionPercentage } = useProgress();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  useEffect(() => {
    if (modules.length > 0) {
      fetchTutorials(modules[0].id);
    }
  }, [modules, fetchTutorials]);

  const handleStartTutorial = (tutorialId) => {
    navigate(`/learning/${tutorialId}`);
  };

  if (loading) {
    return (
      <LayoutWrapper>
        <Loading fullScreen text="Memuat kelas..." />
      </LayoutWrapper>
    );
  }

  if (error) {
    return (
      <LayoutWrapper>
        <div className="flex items-center justify-center min-h-screen">
          <Card className="max-w-md text-center">
            <Alert type="error" title="Error" message={error} />
            <Button
              onClick={() => fetchModules()}
              variant="primary"
              className="mt-4"
            >
              Coba Lagi
            </Button>
          </Card>
        </div>
      </LayoutWrapper>
    );
  }

  const completionPercentage = getCompletionPercentage();
  const currentModule = modules[0];

  const benefits = [
    {
      id: 1,
      icon: "📜",
      title: "Sertifikat Kelulusan",
      desc: "Dapatkan sertifikat resmi setelah menyelesaikan kursus.",
    },
    {
      id: 2,
      icon: "💬",
      title: "Forum Diskusi",
      desc: "Berinteraksi dengan instruktur dan sesama siswa.",
    },
    {
      id: 3,
      icon: "📚",
      title: "Modul Lengkap",
      desc: "Akses materi belajar interaktif dan terstruktur.",
    },
    {
      id: 4,
      icon: "✏️",
      title: "Uji & Latihan",
      desc: "Uji pemahaman Anda dengan berbagai soal latihan.",
    },
    {
      id: 5,
      icon: "🎯",
      title: "Ujian Akhir",
      desc: "Evaluasi komprehensif untuk mengukur pencapaian materi.",
    },
  ];

  return (
    <LayoutWrapper>
      {currentModule && (
        <>
          <HeroSection
            module={currentModule}
            completionPercentage={completionPercentage}
            onStartTutorial={handleStartTutorial}
            tutorials={tutorials}
          />

          <BenefitsSection benefits={benefits} />

          <DescriptionSection module={currentModule} />
        </>
      )}
    </LayoutWrapper>
  );
};

export default ClassDetailPage;
