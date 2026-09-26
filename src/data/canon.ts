export type CanonBook = {
  osis: string;
  name: string;
  testament: "OT" | "NT";
  chapters: number;
  aliases: string[];
};

export const CANON: CanonBook[] = [
  {
    "osis": "Gen",
    "name": "Genesis",
    "testament": "OT",
    "chapters": 50,
    "aliases": [
      "genesis",
      "gen",
      "ge",
      "gn"
    ]
  },
  {
    "osis": "Exod",
    "name": "Exodus",
    "testament": "OT",
    "chapters": 40,
    "aliases": [
      "exodus",
      "exod",
      "exo",
      "ex"
    ]
  },
  {
    "osis": "Lev",
    "name": "Leviticus",
    "testament": "OT",
    "chapters": 27,
    "aliases": [
      "leviticus",
      "lev",
      "le",
      "lv"
    ]
  },
  {
    "osis": "Num",
    "name": "Numbers",
    "testament": "OT",
    "chapters": 36,
    "aliases": [
      "numbers",
      "num",
      "nu",
      "nm"
    ]
  },
  {
    "osis": "Deut",
    "name": "Deuteronomy",
    "testament": "OT",
    "chapters": 34,
    "aliases": [
      "deuteronomy",
      "deut",
      "dt"
    ]
  },
  {
    "osis": "Josh",
    "name": "Joshua",
    "testament": "OT",
    "chapters": 24,
    "aliases": [
      "joshua",
      "josh",
      "jos"
    ]
  },
  {
    "osis": "Judg",
    "name": "Judges",
    "testament": "OT",
    "chapters": 21,
    "aliases": [
      "judges",
      "judg",
      "jdg",
      "jg"
    ]
  },
  {
    "osis": "Ruth",
    "name": "Ruth",
    "testament": "OT",
    "chapters": 4,
    "aliases": [
      "ruth",
      "ru"
    ]
  },
  {
    "osis": "1Sam",
    "name": "1 Samuel",
    "testament": "OT",
    "chapters": 31,
    "aliases": [
      "1samuel",
      "1sam",
      "1sa",
      "isamuel"
    ]
  },
  {
    "osis": "2Sam",
    "name": "2 Samuel",
    "testament": "OT",
    "chapters": 24,
    "aliases": [
      "2samuel",
      "2sam",
      "2sa",
      "iisamuel"
    ]
  },
  {
    "osis": "1Kgs",
    "name": "1 Kings",
    "testament": "OT",
    "chapters": 22,
    "aliases": [
      "1kings",
      "1kgs",
      "1ki",
      "ikings"
    ]
  },
  {
    "osis": "2Kgs",
    "name": "2 Kings",
    "testament": "OT",
    "chapters": 25,
    "aliases": [
      "2kings",
      "2kgs",
      "2ki",
      "iikings"
    ]
  },
  {
    "osis": "1Chr",
    "name": "1 Chronicles",
    "testament": "OT",
    "chapters": 29,
    "aliases": [
      "1chronicles",
      "1chr",
      "1ch",
      "ichronicles"
    ]
  },
  {
    "osis": "2Chr",
    "name": "2 Chronicles",
    "testament": "OT",
    "chapters": 36,
    "aliases": [
      "2chronicles",
      "2chr",
      "2ch",
      "iichronicles"
    ]
  },
  {
    "osis": "Ezra",
    "name": "Ezra",
    "testament": "OT",
    "chapters": 10,
    "aliases": [
      "ezra",
      "ezr"
    ]
  },
  {
    "osis": "Neh",
    "name": "Nehemiah",
    "testament": "OT",
    "chapters": 13,
    "aliases": [
      "nehemiah",
      "neh",
      "ne"
    ]
  },
  {
    "osis": "Esth",
    "name": "Esther",
    "testament": "OT",
    "chapters": 10,
    "aliases": [
      "esther",
      "esth",
      "est",
      "es"
    ]
  },
  {
    "osis": "Job",
    "name": "Job",
    "testament": "OT",
    "chapters": 42,
    "aliases": [
      "job",
      "jb"
    ]
  },
  {
    "osis": "Ps",
    "name": "Psalms",
    "testament": "OT",
    "chapters": 150,
    "aliases": [
      "psalms",
      "ps",
      "psalm",
      "psa"
    ]
  },
  {
    "osis": "Prov",
    "name": "Proverbs",
    "testament": "OT",
    "chapters": 31,
    "aliases": [
      "proverbs",
      "prov",
      "prv",
      "pr"
    ]
  },
  {
    "osis": "Eccl",
    "name": "Ecclesiastes",
    "testament": "OT",
    "chapters": 12,
    "aliases": [
      "ecclesiastes",
      "eccl",
      "ecc",
      "ec",
      "qoheleth"
    ]
  },
  {
    "osis": "Song",
    "name": "Song of Solomon",
    "testament": "OT",
    "chapters": 8,
    "aliases": [
      "songofsolomon",
      "song",
      "songofsongs",
      "canticles",
      "sos"
    ]
  },
  {
    "osis": "Isa",
    "name": "Isaiah",
    "testament": "OT",
    "chapters": 66,
    "aliases": [
      "isaiah",
      "isa",
      "is"
    ]
  },
  {
    "osis": "Jer",
    "name": "Jeremiah",
    "testament": "OT",
    "chapters": 52,
    "aliases": [
      "jeremiah",
      "jer",
      "je"
    ]
  },
  {
    "osis": "Lam",
    "name": "Lamentations",
    "testament": "OT",
    "chapters": 5,
    "aliases": [
      "lamentations",
      "lam",
      "la"
    ]
  },
  {
    "osis": "Ezek",
    "name": "Ezekiel",
    "testament": "OT",
    "chapters": 48,
    "aliases": [
      "ezekiel",
      "ezek",
      "eze",
      "ezk"
    ]
  },
  {
    "osis": "Dan",
    "name": "Daniel",
    "testament": "OT",
    "chapters": 12,
    "aliases": [
      "daniel",
      "dan",
      "da",
      "dn"
    ]
  },
  {
    "osis": "Hos",
    "name": "Hosea",
    "testament": "OT",
    "chapters": 14,
    "aliases": [
      "hosea",
      "hos",
      "ho"
    ]
  },
  {
    "osis": "Joel",
    "name": "Joel",
    "testament": "OT",
    "chapters": 3,
    "aliases": [
      "joel",
      "joe",
      "jl"
    ]
  },
  {
    "osis": "Amos",
    "name": "Amos",
    "testament": "OT",
    "chapters": 9,
    "aliases": [
      "amos",
      "am"
    ]
  },
  {
    "osis": "Obad",
    "name": "Obadiah",
    "testament": "OT",
    "chapters": 1,
    "aliases": [
      "obadiah",
      "obad",
      "ob"
    ]
  },
  {
    "osis": "Jonah",
    "name": "Jonah",
    "testament": "OT",
    "chapters": 4,
    "aliases": [
      "jonah",
      "jon",
      "jnh"
    ]
  },
  {
    "osis": "Mic",
    "name": "Micah",
    "testament": "OT",
    "chapters": 7,
    "aliases": [
      "micah",
      "mic",
      "mi"
    ]
  },
  {
    "osis": "Nah",
    "name": "Nahum",
    "testament": "OT",
    "chapters": 3,
    "aliases": [
      "nahum",
      "nah",
      "na"
    ]
  },
  {
    "osis": "Hab",
    "name": "Habakkuk",
    "testament": "OT",
    "chapters": 3,
    "aliases": [
      "habakkuk",
      "hab"
    ]
  },
  {
    "osis": "Zeph",
    "name": "Zephaniah",
    "testament": "OT",
    "chapters": 3,
    "aliases": [
      "zephaniah",
      "zeph",
      "zep"
    ]
  },
  {
    "osis": "Hag",
    "name": "Haggai",
    "testament": "OT",
    "chapters": 2,
    "aliases": [
      "haggai",
      "hag",
      "hg"
    ]
  },
  {
    "osis": "Zech",
    "name": "Zechariah",
    "testament": "OT",
    "chapters": 14,
    "aliases": [
      "zechariah",
      "zech",
      "zec",
      "zc"
    ]
  },
  {
    "osis": "Mal",
    "name": "Malachi",
    "testament": "OT",
    "chapters": 4,
    "aliases": [
      "malachi",
      "mal",
      "ml"
    ]
  },
  {
    "osis": "Matt",
    "name": "Matthew",
    "testament": "NT",
    "chapters": 28,
    "aliases": [
      "matthew",
      "matt",
      "mt"
    ]
  },
  {
    "osis": "Mark",
    "name": "Mark",
    "testament": "NT",
    "chapters": 16,
    "aliases": [
      "mark",
      "mrk",
      "mk",
      "mr"
    ]
  },
  {
    "osis": "Luke",
    "name": "Luke",
    "testament": "NT",
    "chapters": 24,
    "aliases": [
      "luke",
      "luk",
      "lk"
    ]
  },
  {
    "osis": "John",
    "name": "John",
    "testament": "NT",
    "chapters": 21,
    "aliases": [
      "john",
      "joh",
      "jn"
    ]
  },
  {
    "osis": "Acts",
    "name": "Acts",
    "testament": "NT",
    "chapters": 28,
    "aliases": [
      "acts",
      "act",
      "ac"
    ]
  },
  {
    "osis": "Rom",
    "name": "Romans",
    "testament": "NT",
    "chapters": 16,
    "aliases": [
      "romans",
      "rom",
      "ro",
      "rm"
    ]
  },
  {
    "osis": "1Cor",
    "name": "1 Corinthians",
    "testament": "NT",
    "chapters": 16,
    "aliases": [
      "1corinthians",
      "1cor",
      "1co",
      "icorinthians"
    ]
  },
  {
    "osis": "2Cor",
    "name": "2 Corinthians",
    "testament": "NT",
    "chapters": 13,
    "aliases": [
      "2corinthians",
      "2cor",
      "2co",
      "iicorinthians"
    ]
  },
  {
    "osis": "Gal",
    "name": "Galatians",
    "testament": "NT",
    "chapters": 6,
    "aliases": [
      "galatians",
      "gal",
      "ga"
    ]
  },
  {
    "osis": "Eph",
    "name": "Ephesians",
    "testament": "NT",
    "chapters": 6,
    "aliases": [
      "ephesians",
      "eph"
    ]
  },
  {
    "osis": "Phil",
    "name": "Philippians",
    "testament": "NT",
    "chapters": 4,
    "aliases": [
      "philippians",
      "phil",
      "php"
    ]
  },
  {
    "osis": "Col",
    "name": "Colossians",
    "testament": "NT",
    "chapters": 4,
    "aliases": [
      "colossians",
      "col"
    ]
  },
  {
    "osis": "1Thess",
    "name": "1 Thessalonians",
    "testament": "NT",
    "chapters": 5,
    "aliases": [
      "1thessalonians",
      "1thess",
      "1th",
      "ithessalonians"
    ]
  },
  {
    "osis": "2Thess",
    "name": "2 Thessalonians",
    "testament": "NT",
    "chapters": 3,
    "aliases": [
      "2thessalonians",
      "2thess",
      "2th",
      "iithessalonians"
    ]
  },
  {
    "osis": "1Tim",
    "name": "1 Timothy",
    "testament": "NT",
    "chapters": 6,
    "aliases": [
      "1timothy",
      "1tim",
      "1ti",
      "itimothy"
    ]
  },
  {
    "osis": "2Tim",
    "name": "2 Timothy",
    "testament": "NT",
    "chapters": 4,
    "aliases": [
      "2timothy",
      "2tim",
      "2ti",
      "iitimothy"
    ]
  },
  {
    "osis": "Titus",
    "name": "Titus",
    "testament": "NT",
    "chapters": 3,
    "aliases": [
      "titus",
      "tit"
    ]
  },
  {
    "osis": "Phlm",
    "name": "Philemon",
    "testament": "NT",
    "chapters": 1,
    "aliases": [
      "philemon",
      "phlm",
      "phm"
    ]
  },
  {
    "osis": "Heb",
    "name": "Hebrews",
    "testament": "NT",
    "chapters": 13,
    "aliases": [
      "hebrews",
      "heb"
    ]
  },
  {
    "osis": "Jas",
    "name": "James",
    "testament": "NT",
    "chapters": 5,
    "aliases": [
      "james",
      "jas",
      "jm"
    ]
  },
  {
    "osis": "1Pet",
    "name": "1 Peter",
    "testament": "NT",
    "chapters": 5,
    "aliases": [
      "1peter",
      "1pet",
      "1pe",
      "ipeter"
    ]
  },
  {
    "osis": "2Pet",
    "name": "2 Peter",
    "testament": "NT",
    "chapters": 3,
    "aliases": [
      "2peter",
      "2pet",
      "2pe",
      "iipeter"
    ]
  },
  {
    "osis": "1John",
    "name": "1 John",
    "testament": "NT",
    "chapters": 5,
    "aliases": [
      "1john",
      "1jn",
      "ijohn"
    ]
  },
  {
    "osis": "2John",
    "name": "2 John",
    "testament": "NT",
    "chapters": 1,
    "aliases": [
      "2john",
      "2jn",
      "iijohn"
    ]
  },
  {
    "osis": "3John",
    "name": "3 John",
    "testament": "NT",
    "chapters": 1,
    "aliases": [
      "3john",
      "3jn",
      "iiijohn"
    ]
  },
  {
    "osis": "Jude",
    "name": "Jude",
    "testament": "NT",
    "chapters": 1,
    "aliases": [
      "jude",
      "jud"
    ]
  },
  {
    "osis": "Rev",
    "name": "Revelation",
    "testament": "NT",
    "chapters": 22,
    "aliases": [
      "revelation",
      "rev",
      "revelations",
      "re"
    ]
  }
];
