// ──────────────────────────────────────────────────────────────────────────────
// The 300-Valley Journey ("300 vodiy sayohati")
//
// 30 juz (pora) = 30 regions, each region holds 10 valleys → 300 valleys total.
// A memorizer crosses valleys purely by cumulative memorized-ayah count
// (total_verses from /api/me). Each valley unlocks a story; the first juz (10
// valleys) ships with full Qur'an narratives + sources, the rest are "coming
// soon" and filled in over time.
// ──────────────────────────────────────────────────────────────────────────────

export const TOTAL_AYAHS = 6236;
export const NUM_VALLEYS = 300;
export const JUZ_COUNT = 30;
export const VALLEYS_PER_JUZ = 10;

// Traditional juz names (by their opening words). Used as region headers.
export const JUZ_NAMES = [
  "Alif Lām Mīm", "Sayaqūl", "Tilkar-Rusul", "Lan Tanālū", "Wal-Muḥsanāt",
  "Lā Yuḥibbullāh", "Wa Idhā Samiʿū", "Wa Law Annanā", "Qālal-Malaʾ", "Waʿlamū",
  "Yaʿtadhirūn", "Wa Mā Min Dābbah", "Wa Mā Ubarriʾu", "Rubamā", "Subḥānalladhī",
  "Qāla Alam", "Iqtaraba", "Qad Aflaḥa", "Wa Qālalladhīna", "Aman Khalaqa",
  "Utlu Mā Ūḥiya", "Wa Man Yaqnut", "Wa Mā Liya", "Faman Aẓlam", "Ilayhi Yuraddu",
  "Ḥā Mīm", "Qāla Famā Khaṭbukum", "Qad Samiʿallāh", "Tabārakalladhī", "ʿAmma",
];

export type StoryType = "qissa" | "hikmat" | "sarguzasht";

export interface Story {
  name: string;   // valley name shown on the map
  type: StoryType;
  title: string;
  body: string;
  source: string; // "Manba" — Qur'an reference or hadith collection
}

export interface Valley {
  id: number;          // 1..300
  juz: number;         // 1..30
  indexInJuz: number;  // 1..10
  startAyah: number;   // cumulative count to enter this valley
  endAyah: number;     // cumulative count to complete it
  name: string;
  hasStory: boolean;
}

export type ValleyStatus = "completed" | "current" | "locked";

// ── Stories for Juz 1 (valleys 1–10) ───────────────────────────────────────────
// A narrative arc following the actual content of Juz 1: Al-Fātiha + the opening
// of Al-Baqarah (the creation of Adam, Banī Isrāʾīl, the Cow, the Kaʿba). Every
// entry cites its Qur'an source.
export const STORIES: Record<number, Story> = {
  1: {
    name: "Boshlanish vodiysi",
    type: "qissa",
    title: "Fotiha — yo'l boshi",
    body:
      "Sayohat Qur'onning ochilishi — Fotiha bilan boshlanadi. Yetti oyat butun " +
      "Qur'on mazmunini jamlaydi: hamd, rahmat va to'g'ri yo'lga yo'llanma — " +
      "«Bizni to'g'ri yo'lga boshla» (1:6). Har bir yodlovchi shu duo bilan yo'lga chiqadi.",
    source: "Qur'on, Al-Fotiha (1:1–7). Payg'ambar ﷺ: «Fotiha — Qur'onning onasi» (Termiziy, 3124).",
  },
  2: {
    name: "Uch toifa vodiysi",
    type: "qissa",
    title: "Uch toifa odam",
    body:
      "Baqara surasi insonlarni uch toifaga ajratadi: taqvodorlar (g'aybga iymon " +
      "keltirib, namoz o'qib, infoq qiladiganlar), kofirlar va munofiqlar. Yo'lda " +
      "kim bo'lishni inson shu yerda tanlaydi.",
    source: "Qur'on, Al-Baqara (2:1–20).",
  },
  3: {
    name: "Odam vodiysi",
    type: "qissa",
    title: "Odam va ismlar ilmi",
    body:
      "Alloh farishtalarga: «Men yerda xalifa yarataman», dedi. Farishtalar hayron " +
      "bo'lishdi, ammo Alloh Odamga barcha narsalarning ismlarini o'rgatib, uning " +
      "ilmdagi ustunligini ko'rsatdi.",
    source: "Qur'on, Al-Baqara (2:30–33).",
  },
  4: {
    name: "Sajda vodiysi",
    type: "qissa",
    title: "Sajda va kibr",
    body:
      "Alloh farishtalarga Odamga sajda qilishni buyurdi. Hammasi sajda qildi — " +
      "faqat Iblis kibr qilib bosh tortdi va kofirlardan bo'ldi. Kibr — yo'ldagi " +
      "birinchi to'siq.",
    source: "Qur'on, Al-Baqara (2:34); qiyos: Al-A'rof (7:11–13).",
  },
  5: {
    name: "Jannat vodiysi",
    type: "qissa",
    title: "Taqiqlangan daraxt",
    body:
      "Odam va Havvo jannatga joylashtirildi, faqat bir daraxtga yaqinlashish man " +
      "etildi. Shayton ularni aldadi, ular xato qilib yerga tushirildi — ammo umid uzilmadi.",
    source: "Qur'on, Al-Baqara (2:35–39).",
  },
  6: {
    name: "Tavba vodiysi",
    type: "hikmat",
    title: "Qabul bo'lgan tavba",
    body:
      "Odam Robbisidan kalimalarni qabul qilib tavba qildi, Alloh esa tavbasini " +
      "qabul etdi: «Albatta, U tavbalarni ko'p qabul qiluvchi, rahmlidir» (2:37). " +
      "Xato qilgan har bir sayyoh uchun eshik ochiq.",
    source: "Qur'on, Al-Baqara (2:37).",
  },
  7: {
    name: "Ahd vodiysi",
    type: "hikmat",
    title: "Ahdga vafo",
    body:
      "Alloh Bani Isroilga bergan ne'matlarini eslatib, ahdga vafoga chaqiradi: " +
      "«Mening ahdimga vafo qilinglar, Men ham ahdimga vafo qilaman» (2:40). Sabr va " +
      "namoz bilan yordam so'raladi (2:45).",
    source: "Qur'on, Al-Baqara (2:40–48).",
  },
  8: {
    name: "Dengiz vodiysi",
    type: "qissa",
    title: "Dengiz yorildi",
    body:
      "Alloh Bani Isroilni Fir'avn zulmidan qutqardi: dengizni yorib, ularni omon " +
      "o'tkazdi va Fir'avn qavmini g'arq qildi. Najot — Alloh qudratining belgisi.",
    source: "Qur'on, Al-Baqara (2:49–50).",
  },
  9: {
    name: "Sigir vodiysi",
    type: "qissa",
    title: "Suraga nom bergan qissa",
    body:
      "Bani Isroilga bir sigirni so'yish buyurildi. Ular ko'p savol berib ishni " +
      "qiyinlashtirishdi, oxiri so'yishdi. O'ldirilgan kishi shu sigir bilan " +
      "tiriltirilib, qotil oshkor bo'ldi — shuning uchun sura «Baqara» (Sigir) ataladi.",
    source: "Qur'on, Al-Baqara (2:67–73).",
  },
  10: {
    name: "Ka'ba vodiysi",
    type: "qissa",
    title: "Ka'ba ko'tarildi",
    body:
      "Ibrohim va Ismoil (a.s.) Ka'ba poydevorini ko'tarib duo qildilar: «Robbimiz, " +
      "bizdan qabul et... va bizga ibodat joylarini ko'rsat» (2:127–128). Bu yer — " +
      "duolar qabul bo'ladigan markaz.",
    source: "Qur'on, Al-Baqara (2:124–129).",
  },
};

// Cumulative ayah count required to *complete* valley n (1-indexed).
function endThreshold(n: number): number {
  return Math.round((n * TOTAL_AYAHS) / NUM_VALLEYS);
}

export const VALLEYS: Valley[] = Array.from({ length: NUM_VALLEYS }, (_, i) => {
  const id = i + 1;
  const story = STORIES[id];
  return {
    id,
    juz: Math.floor(i / VALLEYS_PER_JUZ) + 1,
    indexInJuz: (i % VALLEYS_PER_JUZ) + 1,
    startAyah: i === 0 ? 0 : endThreshold(i),
    endAyah: endThreshold(id),
    name: story?.name ?? `${id}-vodiy`,
    hasStory: !!story,
  };
});

export function valleyStatus(v: Valley, totalAyahs: number): ValleyStatus {
  if (totalAyahs >= v.endAyah) return "completed";
  if (totalAyahs >= v.startAyah) return "current";
  return "locked";
}

export function currentValley(totalAyahs: number): Valley {
  return (
    VALLEYS.find((v) => valleyStatus(v, totalAyahs) === "current") ??
    VALLEYS[VALLEYS.length - 1]
  );
}

export function completedCount(totalAyahs: number): number {
  return VALLEYS.filter((v) => totalAyahs >= v.endAyah).length;
}

export const STORY_TYPE_LABEL: Record<StoryType, string> = {
  qissa: "📖 Qur'on qissasi",
  hikmat: "💡 Hikmat",
  sarguzasht: "🗺️ Sarguzasht",
};
