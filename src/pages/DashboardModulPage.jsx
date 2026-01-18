import React, { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import LayoutWrapper from "../components/Layout/LayoutWrapper";
import ModuleSidebar from "../components/Layout/ModuleSidebar";
import BottomBarTwoActions from "../components/Layout/BottomBarTwoActions";
import { useLearning } from "../hooks/useLearning";
import { useProgress } from "../context/ProgressContext";
import { buildSidebarItems } from "../utils/navigationChain";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import SubmoduleScoreChart from "../components/Features/analytics/SubmoduleScoreCharts";
import { nsKey, getUserKey } from "../utils/storage";

const SUBMODULE_RESULT_KEY = "submodule-results";
const FINAL_RESULT_KEY = (userKey) => `${userKey}:quiz-final-result`;

const SUBMODULE_TITLE_MAP = {
  35363: "Penerapan AI dalam Dunia Nyata",
  35368: "Pengenalan AI",
  35373: "Taksonomi AI",
  35378: "AI Workflow",
  35383: "[Story] Belajar Mempermudah Pekerjaan dengan AI",
  35398: "Pengenalan Data",
  35403: "Kriteria Data untuk AI",
  35793: "Infrastruktur Data di Industri",
  35408: "[Story] Apa yang Diperlukan untuk Membuat AI?",
  35428: "Tipe-Tipe Machine Learning",
};

const fmtPct = (v) => (v === null || v === undefined ? "-" : `${Math.round(v)}%`);
const fmtTime = (sec) => {
  if (sec === null || sec === undefined) return "-";
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  return `${h} Jam ${m} Menit`;
};

const normalizeId = (val) => {
  if (val === undefined || val === null) return null;
  const s = String(val);
  const num = parseInt(s.replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(num) ? num : null;
};

const computePassStatus = ({ submodules = [], finalScore = 0 }) => {
  if (!submodules.length) return false;
  const passedSubs = submodules.filter((s) => (s.correct ?? 0) >= 2);
  const submoduleRatio = passedSubs.length / submodules.length;
  return submoduleRatio >= 0.75 && finalScore >= 60;
};

const loadLocalSubmodules = () => {
  try {
    const key = nsKey(SUBMODULE_RESULT_KEY);
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadLocalFinal = () => {
  try {
    const raw = localStorage.getItem(FINAL_RESULT_KEY(getUserKey()));
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getSubmoduleName = (s, i) => {
  const normId = normalizeId(s?.id);
  if (normId && SUBMODULE_TITLE_MAP[normId]) return SUBMODULE_TITLE_MAP[normId];
  if (s?.name) return s.name;
  if (s?.title) return s.title;
  if (s?.submoduleTitle) return s.submoduleTitle;
  if (s?.label) return s.label;
  return `Submodul ${i + 1}`;
};

const coerceDurationSec = (s) => {
  if (s.durationSec !== undefined && s.durationSec !== null) return s.durationSec;
  const raw = s.lama_mengerjakan || s.duration;
  const parsed = parseInt(String(raw || "").replace(/[^0-9]/g, ""), 10);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getQuizResultFromLocal = (id) => {
  try {
    const raw = localStorage.getItem(`${getUserKey()}:quiz-result-${id}`);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

const PALETTE = {
  green: "#e6f7ec",
  yellow: "#fff7da",
  orange: "#ffe6d9",
};

const colorScore = (score) => {
  if (score >= 85) return PALETTE.green;
  if (score >= 60) return PALETTE.yellow;
  return PALETTE.orange;
};

const colorTime = (sec) => {
  if (sec <= 55) return PALETTE.green;
  if (sec <= 75) return PALETTE.yellow;
  return PALETTE.orange;
};


const colorAttempts = (att) => {
  if (att <= 1) return PALETTE.green;
  if (att === 2) return PALETTE.yellow;
  return PALETTE.orange;
};


const buildRecommendations = ({ submodules, finalAnswers }) => {
  const recs = [];
  const weakSubs = [...submodules]
    .sort((a, b) => {
      const sa = a.score ?? 0;
      const sb = b.score ?? 0;
      if (sa !== sb) return sa - sb;
      const da = a.durationSec ?? 0;
      const db = b.durationSec ?? 0;
      if (da !== db) return db - da;
      const aa = a.attempts ?? 0;
      const ab = b.attempts ?? 0;
      return ab - aa;
    })
    .filter((s) => (s.score ?? 0) < 75)
    .slice(0, 3);

  weakSubs.forEach((s) => {
    recs.push(
      `Fokus ulang: ${s.name} (skor ${fmtPct(s.score)}, ${s.durationSec || 0} detik, ${s.attempts ?? 1}x).`
    );
  });

  if (Array.isArray(finalAnswers) && finalAnswers.length) {
    const group = finalAnswers
      .filter((a) => a && a.correct === false)
      .reduce((acc, a) => {
        const sid = normalizeId(a.tutorial_id) || "unknown";
        acc[sid] = acc[sid] || { count: 0, ids: [] };
        acc[sid].count += 1;
        acc[sid].ids.push(a.soal_id || a.question_id);
        return acc;
      }, {});

    const entries = Object.entries(group).map(([sid, v]) => ({
      id: sid === "unknown" ? null : Number(sid),
      count: v.count,
    }));

    const sorted = entries.sort((a, b) => b.count - a.count).slice(0, 3);
    sorted.forEach(({ id, count }) => {
      if (id) {
        const title = SUBMODULE_TITLE_MAP[id] || `Submodul ${id}`;
        recs.push(`Quiz final: ${count} jawaban salah terkait ${title}, ulangi materi tersebut.`);
      } else {
        recs.push(
          `Quiz final: ${count} jawaban salah belum terpetakan ke submodul. Cek kembali soal yang salah di review.`
        );
      }
    });
  }

  if (recs.length === 0) {
    recs.push(
      "Semua submodul sudah cukup baik. Lanjutkan ke materi berikutnya atau cek ulang quiz final untuk memperkuat pemahaman."
    );
  }

  return recs;
};

const DashboardModulPage = ({ data }) => {
  const { state } = useLocation();
  const [searchParams] = useSearchParams();
  const embed = searchParams.get("embed") === "1";
  const navigate = useNavigate();
  const { tutorials } = useLearning();
  const { getTutorialProgress } = useProgress();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [localSubs, setLocalSubs] = useState([]);
  const [finalLocal, setFinalLocal] = useState(null);

  useEffect(() => {
    setLocalSubs(loadLocalSubmodules());
    setFinalLocal(loadLocalFinal());
  }, []);

  const payload = state?.analytics || data || {};
  const submodulesRaw =
    Array.isArray(payload.submodules) && payload.submodules.length > 0
      ? payload.submodules
      : localSubs || [];

  const submodules = (Array.isArray(submodulesRaw) ? submodulesRaw : []).map((s, i) => {
    const qr = getQuizResultFromLocal(s.id) || {};
    const durLocal = coerceDurationSec(s);
    const durFallback =
      durLocal > 0
        ? durLocal
        : (() => {
            const num = Number(qr?.duration);
            if (Number.isFinite(num) && num > 0) return num;
            const txt = qr?.lama_mengerjakan;
            const parsedTxt = parseInt(String(txt || "").replace(/[^0-9]/g, ""), 10);
            return Number.isFinite(parsedTxt) ? parsedTxt : 0;
          })();

    return {
      ...s,
      name: getSubmoduleName(s, i),
      score: s.score ?? qr?.score ?? 0,
      correct: s.correct ?? qr?.benar ?? 0,
      total: s.total ?? qr?.total ?? 0,
      durationSec: durFallback,
      attempts: s.attempts ?? 1,
    };
  });

  const finalScore = payload.finalScore ?? finalLocal?.score ?? state?.score ?? 0;
  const pass = computePassStatus({ submodules, finalScore });

  const totalLearningSeconds = submodules.reduce((acc, s) => acc + (s.durationSec || 0), 0);

  const sidebarItems = useMemo(
    () => buildSidebarItems(tutorials, getTutorialProgress),
    [tutorials, getTutorialProgress]
  );

  const goBackChain = () => navigate("/quiz-final-result");

  const passIcon = pass ? "✓" : "!";
  const passIconBg = pass ? "bg-green-50 text-green-600" : "bg-amber-50 text-amber-600";
  const passText = pass ? "Lulus" : "Belum Lulus";

  const rawQuestionsMap = (() => {
    const qlist =
      finalLocal?.rawQuestions ||
      finalLocal?.questions ||
      payload?.finalQuestions ||
      [];
    const m = new Map();
    qlist.forEach((q) => {
      if (q?.id && q?.tutorial_id) m.set(q.id, q.tutorial_id);
    });
    return m;
  })();

  const finalAnswersRaw = finalLocal?.answers || finalLocal?.detail || payload.finalAnswers || [];
  const finalAnswers = finalAnswersRaw.map((a) => {
    const tid =
      a?.tutorial_id ??
      rawQuestionsMap.get(a?.soal_id) ??
      rawQuestionsMap.get(a?.question_id) ??
      null;
    return { ...a, tutorial_id: tid };
  });

  const recommendations = buildRecommendations({ submodules, finalAnswers });

  return (
    <LayoutWrapper
      embed={embed}
      showFooter={false}
      contentClassName={`pt-20 pb-24 ${sidebarOpen ? "pr-80" : ""} transition-all duration-300`}
      sidePanel={
        !embed ? (
          <div className="print-hide">
            <ModuleSidebar
              items={sidebarItems}
              currentId={null}
              onSelect={(item) => {
                if (item.type === "tutorial") navigate(`/learning/${item.id}`);
                else if (item.type === "quiz-sub") navigate(`/quiz-intro/${item.id}`);
                else if (item.type === "quiz-final") {
                  const target = finalLocal ? "/quiz-final-result" : "/quiz-final-intro";
                  navigate(target);
                } else if (item.type === "dashboard") navigate("/dashboard-modul");
              }}
              isOpen={sidebarOpen}
              onToggle={() => setSidebarOpen((p) => !p)}
            />
          </div>
        ) : null
      }
      bottomBar={
        !embed ? (
          <div className="print-hide">
            <BottomBarTwoActions
              leftLabel="← Kembali"
              rightLabel="Selesai"
              onLeft={goBackChain}
              onRight={() => navigate("/home")}
            />
          </div>
        ) : null
      }
    >
      <div id="printable-analytics" className="max-w-6xl mx-auto py-10 space-y-6 px-4">
        <div className="text-center space-y-1">
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Modul: {payload.moduleTitle || "Berkenalan dengan AI"}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="p-4 flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">%</div>
            <div>
              <p className="text-sm text-gray-500">Nilai Akhir Modul</p>
              <p className="text-xl font-semibold text-gray-900">{fmtPct(finalScore)}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${passIconBg}`}>
              {passIcon}
            </div>
            <div>
              <p className="text-sm text-gray-500">Status Kelulusan</p>
              <p className="text-xl font-semibold text-gray-900">{passText}</p>
            </div>
          </Card>

          <Card className="p-4 flex items-center gap-3 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">⏱</div>
            <div>
              <p className="text-sm text-gray-500">Total Waktu Belajar</p>
              <p className="text-xl font-semibold text-gray-900">{fmtTime(totalLearningSeconds)}</p>
            </div>
          </Card>
        </div>

        <Card className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100 min-w-0">
          <p className="font-semibold text-gray-800 mb-3">Nilai Quiz Submodul</p>
          <SubmoduleScoreChart
            data={submodules.map((s) => ({
              name: s.name,
              score: s.score ?? 0,
            }))}
          />
        </Card>

        <Card className="p-4 bg-white rounded-2xl shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-800 mb-4">Peta Kelemahan Anda</p>
          <div className="overflow-x-auto rounded-2xl shadow-sm border border-blue-100">
            <table className="min-w-full text-sm text-left border-collapse table-fixed">
              <colgroup>
                <col style={{ width: "38%" }} />
                <col style={{ width: "20%" }} />
                <col style={{ width: "22%" }} />
                <col style={{ width: "20%" }} />
              </colgroup>
              <thead>
                <tr className="bg-[#0f5eff] text-white text-base">
                  <th className="px-5 py-3 font-semibold">Materi</th>
                  <th className="px-5 py-3 font-semibold text-center">Nilai</th>
                  <th className="px-5 py-3 font-semibold text-center">Waktu</th>
                  <th className="px-5 py-3 font-semibold text-center">Percobaan</th>
                </tr>
              </thead>
              <tbody>
                {submodules.map((s, i) => {
                  const score = s.score ?? 0;
                  const dur = s.durationSec ?? 0;
                  const attempts = s.attempts ?? 1;

                  return (
                    <tr
                      key={`${s.id ?? i}`}
                      className="border-b border-[#d9e4f5] last:border-0 text-[15px]"
                    >
                      <td className="px-5 py-3 text-gray-800 align-top">{s.name}</td>
                      <td
                        className="px-5 py-3 text-gray-800 text-center"
                        style={{ backgroundColor: colorScore(score) }}
                      >
                        {fmtPct(score)}
                      </td>
                      <td
                        className="px-5 py-3 text-gray-800 text-center"
                        style={{ backgroundColor: colorTime(dur) }}
                      >
                        {dur} detik
                      </td>
                      <td
                        className="px-5 py-3 text-gray-800 text-center"
                        style={{ backgroundColor: colorAttempts(attempts) }}
                      >
                        {attempts}x
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="mt-4 text-sm text-gray-700 leading-relaxed bg-white border border-blue-100 rounded-xl p-4 shadow-sm space-y-2">
            <p className="font-semibold text-gray-800">Rekomendasi belajar</p>
            <ul className="list-disc pl-5 space-y-1">
              {recommendations.map((r, idx) => (
                <li key={idx}>{r}</li>
              ))}
            </ul>
          </div>
        </Card>

        <div className="flex justify-center print-hide">
          <Button
            variant="primary"
            className="cursor-pointer bg-[#0f5eff] hover:bg-[#0d52db] px-5 py-3 rounded-xl"
            onClick={() => window.print()}
          >
            Unduh Laporan PDF
          </Button>
        </div>
      </div>
    </LayoutWrapper>
  );
};

export default DashboardModulPage;