import React, { useState, useMemo } from "react";

const IconCircleX = ({ className = "w-5 h-5 text-red-500" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M7.5 7.5l5 5m0-5l-5 5"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const IconCircleCheck = ({ className = "w-5 h-5 text-green-500" }) => (
  <svg className={className} viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="9" fill="currentColor" opacity="0.15" />
    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6.5 10.5l2.5 2.5L13.5 8"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconChevron = ({ open }) => (
  <svg
    className={`w-5 h-5 text-gray-500 transition-transform ${
      open ? "rotate-180" : ""
    }`}
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.24 4.5a.75.75 0 01-1.08 0l-4.24-4.5a.75.75 0 01.02-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

const AnswerReview = ({ answers = [], questions = [] }) => {
  const [openMap, setOpenMap] = useState({});

  const normalizedAnswers = useMemo(() => answers, [answers]);

  const getAnswerFor = (q, idx) => {
    const direct = normalizedAnswers[idx];
    if (direct) return direct;
    if (q?.id) {
      return (
        normalizedAnswers.find(
          (a) => a?.soal_id?.toString() === q.id?.toString()
        ) || {}
      );
    }
    return {};
  };

  return (
    <div className="space-y-4">
      {questions.map((q, idx) => {
        const ans = getAnswerFor(q, idx);
        const isCorrect = !!ans?.correct;
        const userAnswer = ans?.user_answer || "";
        const correctChoice = q?.multiple_choice?.find?.((c) => c.correct);
        const correctAnswer =
          correctChoice?.option || correctChoice?.answer || "";
        const explanation =
          ans?.explanation ||
          correctChoice?.explanation ||
          q?.explanation ||
          "";

        const open = !!openMap[idx];
        const toggle = () =>
          setOpenMap((prev) => ({ ...prev, [idx]: !prev[idx] }));

        const cardBorder = isCorrect ? "border-green-500/80" : "border-red-500";
        const IconStatus = isCorrect ? IconCircleCheck : IconCircleX;

        return (
          <div
            key={q?.id || idx}
            className={`rounded-2xl shadow-sm border-l-4 ${cardBorder} bg-white overflow-hidden`}
          >
            <button
              type="button"
              onClick={toggle}
              className="w-full flex items-start gap-3 p-4 sm:p-5 text-left"
            >
              <div className="mt-1">
                <IconStatus />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1">
                  Q{idx + 1}: {q?.assessment || "Pertanyaan"}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  Your answer: {userAnswer || "-"}
                </p>
              </div>
              <IconChevron open={open} />
            </button>

            {open && (
              <div className="border-t border-gray-100 pt-4 pb-5 px-4 sm:px-5">
                <p className="text-sm font-semibold text-gray-700 mb-3">
                  Pilihan Jawaban:
                </p>
                <div className="space-y-2">
                  {(q?.multiple_choice || []).map((opt, optIdx) => {
                    const isOptCorrect = !!opt.correct;
                    const isOptSelected =
                      userAnswer &&
                      opt?.option?.toString().trim() ===
                        userAnswer.toString().trim();

                    let bg = "bg-gray-50";
                    let border = "border-gray-200";
                    let text = "text-gray-800";
                    let rightIcon = null;

                    if (isOptCorrect) {
                      bg = "bg-green-50";
                      border = "border-green-300";
                      text = "text-green-800";
                      rightIcon = (
                        <IconCircleCheck className="w-4 h-4 text-green-600" />
                      );
                    }
                    if (!isOptCorrect && isOptSelected) {
                      bg = "bg-red-50";
                      border = "border-red-300";
                      text = "text-red-700";
                      rightIcon = (
                        <IconCircleX className="w-4 h-4 text-red-600" />
                      );
                    }

                    return (
                      <div
                        key={opt?.id || optIdx}
                        className={`border ${border} ${bg} rounded-xl px-4 py-3 flex items-start gap-3`}
                      >
                        <div className="font-semibold text-gray-600">
                          {String.fromCharCode(65 + optIdx)}.
                        </div>
                        <div className={`flex-1 ${text}`}>
                          {opt?.option || "-"}
                        </div>
                        {rightIcon && <div>{rightIcon}</div>}
                      </div>
                    );
                  })}
                </div>

                {(explanation || !isCorrect) && (
                  <div className="mt-4 space-y-3">
                    {explanation && (
                      <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3">
                        <p className="font-semibold text-blue-800 mb-1">
                          Penjelasan:
                        </p>
                        <p className="text-sm text-blue-900">{explanation}</p>
                      </div>
                    )}
                    {!isCorrect && correctAnswer && (
                      <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                        <p className="text-sm text-red-700 font-semibold mb-1">
                          ✕ Jawaban Anda Salah
                        </p>
                        <p className="text-sm text-red-800">
                          Jawaban yang benar:{" "}
                          <span className="font-semibold">{correctAnswer}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AnswerReview;
