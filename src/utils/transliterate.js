// O'zbek lotin yozuvidan kirill yozuviga o'giruvchi funksiya.
// Yangi qo'shiladigan har qanday matn ham shu funksiya orqali avtomatik
// kirillchaga o'giriladi (LanguageContext DOM matnlarini shu bilan ishlaydi).

const APOSTROPHES = new Set(["'", "ʻ", "ʼ", "‘", "’", "ʻ"]);

const DIGRAPHS = [
  ["sh", "ш"],
  ["ch", "ч"],
  ["yo", "ё"],
  ["yu", "ю"],
  ["ya", "я"],
];

const SINGLE = {
  a: "а", b: "б", d: "д", e: "е", f: "ф", g: "г", h: "ҳ", i: "и",
  j: "ж", k: "к", l: "л", m: "м", n: "н", o: "о", p: "п", q: "қ",
  r: "р", s: "с", t: "т", u: "у", v: "в", x: "х", y: "й", z: "з", c: "ц",
};

function applyCase(char, sourceChar) {
  return sourceChar === sourceChar.toUpperCase() && sourceChar !== sourceChar.toLowerCase()
    ? char.toUpperCase()
    : char;
}

const WORD_RE = /[A-Za-z]+(?:['ʻʼ‘’][A-Za-z]+)*/g;

export function transliterate(text) {
  if (!text) return text;
  return text.replace(WORD_RE, (word) => transliterateWord(word));
}

function transliterateWord(text) {
  let result = "";
  let i = 0;

  while (i < text.length) {
    const c = text[i];
    const cLower = c.toLowerCase();
    const next = text[i + 1];

    // o' / g' — apostrofli undoshlar
    if ((cLower === "o" || cLower === "g") && next && APOSTROPHES.has(next)) {
      const mapped = cLower === "o" ? "ў" : "ғ";
      result += applyCase(mapped, c);
      i += 2;
      continue;
    }

    // sh, ch, yo, yu, ya
    if (next) {
      const pair = (cLower + next.toLowerCase());
      const digraph = DIGRAPHS.find(([latin]) => latin === pair);
      if (digraph) {
        result += applyCase(digraph[1], c);
        i += 2;
        continue;
      }
    }

    // tutuq belgisi (ajratuvchi apostrof), masalan: san'at, mas'ul
    if (APOSTROPHES.has(c)) {
      result += "ъ";
      i += 1;
      continue;
    }

    const mapped = SINGLE[cLower];
    if (mapped) {
      result += applyCase(mapped, c);
      i += 1;
      continue;
    }

    // raqam, bo'shliq, tinish belgilari va boshqa alifbolar o'zgarishsiz qoladi
    result += c;
    i += 1;
  }

  return result;
}
