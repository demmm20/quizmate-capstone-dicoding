export const DEFAULT_MOCK_QUESTIONS = [
  {
    id: "mock-1",
    assessment: "Tahapan awal dalam AI Workflow ... disebut:",
    multiple_choice: [
      { id: 1, option: "Digitalise & Collect", correct: true, explanation: "Pengumpulan & digitalisasi data di awal." },
      { id: 2, option: "Transform", correct: false, explanation: "Tahap sesudah pengumpulan." },
      { id: 3, option: "Train", correct: false, explanation: "Pelatihan model." },
      { id: 4, option: "Execute", correct: false, explanation: "Menjalankan model." },
    ],
    time: 30000,
  },
  {
    id: "mock-2",
    assessment: "Setelah data ditransformasi, tahap berikutnya adalah:",
    multiple_choice: [
      { id: 1, option: "Execute", correct: false, explanation: "Itu tahap sesudah model jadi." },
      { id: 2, option: "Provide Insights...", correct: false, explanation: "Itu tahap akhir." },
      { id: 3, option: "Transform", correct: false, explanation: "Sudah dilakukan sebelumnya." },
      { id: 4, option: "Train", correct: true, explanation: "Pelatihan model dengan data yang sudah diproses." },
    ],
    time: 30000,
  },
  {
    id: "mock-3",
    assessment: "Mengapa perlu retraining model secara reguler?",
    multiple_choice: [
      { id: 1, option: "Agar adaptif pada perubahan data", correct: true, explanation: "Menjaga akurasi dengan data terbaru." },
      { id: 2, option: "Untuk laporan keuangan", correct: false, explanation: "Tidak terkait langsung." },
      { id: 3, option: "Menggantikan manusia", correct: false, explanation: "Bukan tujuan utama retraining." },
      { id: 4, option: "Agar jalan di hardware rendah", correct: false, explanation: "Butuh optimasi model, bukan retraining." },
    ],
    time: 30000,
  },
];

export const MOCK_QUESTIONS_BY_TUTORIAL = {
};

export const getMockQuestions = (tutorialId) => {
  const id = Number(tutorialId);
  return MOCK_QUESTIONS_BY_TUTORIAL[id] || DEFAULT_MOCK_QUESTIONS;
};

export const DEFAULT_MOCK_FEEDBACK = {
  summary: "Mode offline: hasil berbasis soal mock.",
  analysis: "Gunakan untuk preview/styling. Backend belum memberi data.",
  advice: "Coba lagi saat backend normal untuk skor resmi.",
  recommendation: "Lanjutkan belajar materi sebelum mencoba ulang.",
};