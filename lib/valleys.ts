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

  // ── Juz 2 (valleys 11–20): Al-Baqara 142–252 ────────────────────────────────
  11: {
    name: "Qibla vodiysi",
    type: "qissa",
    title: "Qibla o'zgardi",
    body:
      "Musulmonlarning yuzi Baytul-Maqdisdan Makkadagi Masjidul-Haromga — Ka'baga " +
      "qaratildi: «Yuzingni Masjidul-Harom tomon burgin» (2:144). Bu — yangi ummatning " +
      "o'z yo'nalishini topgani belgisi edi.",
    source: "Qur'on, Al-Baqara (2:142–150).",
  },
  12: {
    name: "Sabr vodiysi",
    type: "hikmat",
    title: "Sabr va shahidlar",
    body:
      "«Sabr va namoz bilan yordam so'rang» (2:153). Alloh yo'lida o'ldirilganlarni " +
      "«o'lik demang — ular tirik, lekin sezmaysiz» (2:154). Sinov ochlik va qo'rquv " +
      "bilan keladi, sabr qilganlarga esa xushxabar bor.",
    source: "Qur'on, Al-Baqara (2:153–157).",
  },
  13: {
    name: "Yaxshilik vodiysi",
    type: "hikmat",
    title: "Haqiqiy yaxshilik (al-birr)",
    body:
      "Yaxshilik faqat yuzni sharq yo g'arbga burishda emas — balki Allohga, oxiratga, " +
      "farishtalarga iymon keltirib, sevgan molini qarindosh, yetim va miskinlarga " +
      "berish, namoz o'qib, zakot berish va ahdga vafo qilishdadir (2:177).",
    source: "Qur'on, Al-Baqara (2:177).",
  },
  14: {
    name: "Adolat vodiysi",
    type: "hikmat",
    title: "Qasosda hayot bor",
    body:
      "«Ey aql egalari, qasosda siz uchun hayot bordir — shoyad taqvodor bo'lsangiz» " +
      "(2:179). Adolat jamiyatni asraydi; afv va kelishuv esa undan-da ulug'roqdir.",
    source: "Qur'on, Al-Baqara (2:178–179).",
  },
  15: {
    name: "Ro'za vodiysi",
    type: "qissa",
    title: "Ramazon va ro'za",
    body:
      "«Ro'za sizdan oldingilarga farz qilingani kabi sizga ham farz qilindi — shoyad " +
      "taqvodor bo'lsangiz» (2:183). Ramazon — Qur'on nozil bo'lgan oy; u sabr va " +
      "yaqinlik maktabi.",
    source: "Qur'on, Al-Baqara (2:183–185).",
  },
  16: {
    name: "Haj vodiysi",
    type: "qissa",
    title: "Haj — buyuk safar",
    body:
      "«Haj va umrani Alloh uchun to'liq ado eting» (2:196). Zod-rohatning eng yaxshisi " +
      "— taqvo (2:197). Haj — butun dunyo musulmonlarini bir maqsad sari yig'adigan safar.",
    source: "Qur'on, Al-Baqara (2:196–203).",
  },
  17: {
    name: "Tolut vodiysi",
    type: "qissa",
    title: "Tolut podshoh bo'ldi",
    body:
      "Bani Isroil payg'ambaridan podshoh so'radi. Alloh Tolutni tanladi — boyligi emas, " +
      "ilm va kuchi bilan. Uning podsholigi belgisi — ichida sakina bo'lgan tobutning " +
      "qaytishi edi (2:248).",
    source: "Qur'on, Al-Baqara (2:246–248).",
  },
  18: {
    name: "Sinov vodiysi",
    type: "qissa",
    title: "Daryo sinovi",
    body:
      "Tolut askarlarini daryo bilan sinadi: «Kim undan ichsa, mendan emas». Ko'pchilik " +
      "ichdi, ozchilik sabr qildi. «Qancha kichik jamoa, Alloh izni bilan katta jamoani " +
      "yenggan!» (2:249).",
    source: "Qur'on, Al-Baqara (2:249).",
  },
  19: {
    name: "Jolut vodiysi",
    type: "qissa",
    title: "Dovud Jolutni yengdi",
    body:
      "Yosh Dovud (a.s.) ulkan Jolutni (Goliyat) sopqon toshi bilan yengdi. Alloh unga " +
      "podsholik va hikmat berdi. «Agar Alloh odamlarni bir-biri bilan to'smaganida, yer " +
      "buzilardi» (2:251).",
    source: "Qur'on, Al-Baqara (2:250–251).",
  },
  20: {
    name: "Ne'mat vodiysi",
    type: "hikmat",
    title: "Payg'ambarlar darajalari",
    body:
      "«Ana o'sha payg'ambarlarning ba'zilarini ba'zilaridan ustun qildik» (2:253). " +
      "Har biriga vahiy, mo'jiza va o'z ummati berildi — ammo manba bitta: Alloh.",
    source: "Qur'on, Al-Baqara (2:252–253).",
  },

  // ── Juz 3 (valleys 21–30): Al-Baqara 253 – Oli Imron 92 ─────────────────────
  21: {
    name: "Oyatul Kursiy vodiysi",
    type: "qissa",
    title: "Oyatlar shohi — Oyatul Kursiy",
    body:
      "«Alloh — Undan o'zga iloh yo'q, U tirik va abadiy turuvchidir. Uni mudroq ham, " +
      "uyqu ham tutmaydi... Uning Kursiysi osmonlar va yerni qamragan» (2:255). Bu — " +
      "Qur'ondagi eng buyuk oyat.",
    source: "Qur'on, Al-Baqara (2:255); Payg'ambar ﷺ uni Qur'onning eng ulug' oyati dedi (Muslim, 810).",
  },
  22: {
    name: "Erkinlik vodiysi",
    type: "hikmat",
    title: "Dinda majburlash yo'q",
    body:
      "«Dinda majburlash yo'q — to'g'ri yo'l adashishdan ajralib bo'ldi» (2:256). Iymon " +
      "— ko'ngil ishi; Alloh tog'utni inkor etib Unga ishongan kishi mustahkam halqaga " +
      "yopishgan bo'ladi.",
    source: "Qur'on, Al-Baqara (2:256).",
  },
  23: {
    name: "Munozara vodiysi",
    type: "qissa",
    title: "Ibrohim va kibrli podsho",
    body:
      "Podsho (Namrud) «Men ham tiriltiraman va o'ldiraman» dedi. Ibrohim (a.s.): «Alloh " +
      "quyoshni sharqdan chiqaradi, sen g'arbdan chiqargin-chi!» dedi — va kofir " +
      "podshoh dovdirab qoldi (2:258).",
    source: "Qur'on, Al-Baqara (2:258).",
  },
  24: {
    name: "Tiriltirish vodiysi",
    type: "qissa",
    title: "Yuz yillik uyqu",
    body:
      "Bir kishi vayrona qishloqdan o'tib: «Alloh buni qanday tiriltiradi?» dedi. Alloh " +
      "uni yuz yil o'ldirib, so'ng tiriltirdi va eshagini ko'z oldida qayta tikladi — " +
      "qiyomatga yorqin dalil (2:259).",
    source: "Qur'on, Al-Baqara (2:259).",
  },
  25: {
    name: "Iymon vodiysi",
    type: "qissa",
    title: "To'rt qush",
    body:
      "Ibrohim (a.s.): «Robbim, o'liklarni qanday tiriltirishingni ko'rsat», dedi. Alloh " +
      "to'rt qushni so'yib, tog'larga taqsimlab, chaqirishini buyurdi — ular uchib " +
      "qaytishdi. Bu — qalb taskini uchun edi (2:260).",
    source: "Qur'on, Al-Baqara (2:260).",
  },
  26: {
    name: "Saxovat vodiysi",
    type: "hikmat",
    title: "Bir don — yetti boshoq",
    body:
      "«Alloh yo'lida mol sarflaganlar misoli — bir donga o'xshaydiki, undan yetti boshoq " +
      "unib, har boshoqda yuz don bo'ladi» (2:261). Alloh xohlaganiga ko'paytiradi. " +
      "Saxovat hech qachon kambag'al qilmaydi.",
    source: "Qur'on, Al-Baqara (2:261–274).",
  },
  27: {
    name: "Ribo vodiysi",
    type: "hikmat",
    title: "Ribo taqiqlandi",
    body:
      "«Alloh savdoni halol, ribo (sudxo'rlik)ni harom qildi» (2:275). Ribo barakani " +
      "yo'qotadi, sadaqa esa ko'paytiradi (2:276). Bu — adolatli iqtisod yo'li.",
    source: "Qur'on, Al-Baqara (2:275–281).",
  },
  28: {
    name: "Xotima vodiysi",
    type: "hikmat",
    title: "Baqara xotimasi",
    body:
      "Surani ikki ulug' oyat yakunlaydi: «Alloh hech kimni toqatidan tashqari yuklamaydi» " +
      "va «Robbimiz, bizga kuchimiz yetmas narsani yuklamagin... bizni kechir, bizga rahm " +
      "qil» (2:286). Bu duo — har sayyohning qalqoni.",
    source: "Qur'on, Al-Baqara (2:285–286); bu ikki oyat fazli haqida (Bukhoriy, 5009).",
  },
  29: {
    name: "Imron vodiysi",
    type: "qissa",
    title: "Imron oilasi va Maryam",
    body:
      "Imronning rafiqasi qornidagi bolani Allohga atadi. Maryam tug'ildi va Alloh uni " +
      "go'zal qabul qilib o'stirdi; Zakariyo har kirganida uning huzuridan rizq topardi " +
      "(3:35–37).",
    source: "Qur'on, Oli Imron (3:33–37).",
  },
  30: {
    name: "Zakariyo vodiysi",
    type: "qissa",
    title: "Zakariyo va Yahyo",
    body:
      "Keksaygan Zakariyo (a.s.) farzand so'rab duo qildi. Alloh unga Yahyoni bashorat " +
      "qildi — «sayyid, iffatli va solih payg'ambar» (3:39). Umid hech qachon " +
      "kech emas.",
    source: "Qur'on, Oli Imron (3:38–41).",
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
