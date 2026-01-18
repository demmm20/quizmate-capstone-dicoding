import React from "react";
import Card from "../../common/Card";
import Button from "../../common/Button";

const IconCircleCheck = ({ className = "w-7 h-7 text-green-500" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.15" />
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
    <path
      d="M8 12.5l2.5 2.5L16 9"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconCircleX = ({ className = "w-7 h-7 text-red-500" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="12" fill="currentColor" opacity="0.15" />
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="2" />
    <path d="M9 9l6 6m0-6l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const ResultCard = ({
  score = 0,
  correct = 0,
  total = 0,
  duration = "",
  isPass = false,
  onRetry,
  onReview,
  onDashboard,              
  title = "Quiz Submodul",  
  subtitle = "Penerapan AI dalam Dunia Nyata",
  dashboardLabel = "Dashboard",
  reviewLabel = "Review Soal",
  retryLabel = "Coba Lagi",
}) => {
  const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
  const statusText = isPass ? "Lulus" : "Coba Lagi";
  const statusColor = isPass ? "text-green-600" : "text-red-600";
  const StatusIcon = isPass ? IconCircleCheck : IconCircleX;

  const headerBleed = "relative -mx-4 sm:-mx-6 md:-mx-8 -mt-4 sm:-mt-6 md:-mt-8";
  const contentPadding = "px-4 sm:px-6 md:px-8";

  return (
    <Card className="overflow-hidden bg-white shadow-xl rounded-3xl p-0">
      <div className={`${headerBleed} h-12 sm:h-14 bg-gradient-to-r from-[#1e7bff] to-[#0f5eff] rounded-t-3xl`} />

      <div className={`py-6 sm:py-8 ${contentPadding}`}>
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-1">{title}</h2>
        <p className="text-center text-gray-600 mb-6">{subtitle}</p>

        <div className="flex flex-col items-center mb-8">
          <div className={`text-3xl font-bold ${statusColor} flex items-center gap-2`}>
            <StatusIcon />
            <span>{statusText}</span>
          </div>
          <p className="text-gray-600 text-sm mt-3 text-center">
            {isPass
              ? "Bagus, kamu sudah memenuhi ambang kelulusan."
              : "Anda perlu menjawab lebih banyak pertanyaan dengan benar"}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <div className="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white text-center">
            <p className="text-sm text-gray-600 mb-1">Skor Anda</p>
            <p className="text-3xl font-extrabold text-blue-700">
              {correct}/{total}
            </p>
            <p className="text-xs text-gray-500 mt-1">soal terjawab benar</p>
          </div>
          <div className="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white text-center">
            <p className="text-sm text-gray-600 mb-1">Persentase</p>
            <p className="text-3xl font-extrabold text-blue-700">{percentage}%</p>
            <div className="w-full h-2 bg-gray-200 rounded-full mt-3 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all"
                style={{ width: `${percentage}%` }}
              />
            </div>
          </div>
          <div className="border border-gray-100 rounded-2xl p-5 shadow-sm bg-white text-center">
            <p className="text-sm text-gray-600 mb-1">Durasi</p>
            <p className="text-3xl font-extrabold text-orange-500">
              {duration || "-"}
            </p>
            <p className="text-xs text-gray-500 mt-1">waktu pengerjaan</p>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          {onRetry && (
            <Button variant="secondary" className="cursor-pointer" onClick={onRetry}>
              {retryLabel}
            </Button>
          )}
          {onReview && (
            <Button variant="primary" className="cursor-pointer" onClick={onReview}>
              {reviewLabel}
            </Button>
          )}
          {onDashboard && (
            <Button variant="secondary" className="cursor-pointer" onClick={onDashboard}>
              {dashboardLabel}
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default ResultCard;