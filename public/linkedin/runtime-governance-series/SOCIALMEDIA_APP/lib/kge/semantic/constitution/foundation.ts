import type {
  SemanticConstitutionEntry,
} from "./types";

export const lexiconConstitutionEntry:
  SemanticConstitutionEntry = {
    id: "semantic-entry-almojam-001",
    canonicalTerm: "المعجم",
    root: "ع-ج-م",

    category: "FOUNDATIONAL",

    definition:
      "إطار مرجعي منظم يُنشأ لضبط المعاني اللسانية عند تكاثر المنطوق وتباين الدلالة، ويعمل على إزالة الإبهام وتثبيت المعنى ومنع الانزلاق التأويلي.",

    acceptanceCriteria: [
      "يؤدي وظيفة مرجعية تتجاوز شرح الألفاظ.",
      "يضبط المعنى عند تباين الاستعمال.",
      "يحدد شروط قبول المفهوم ورفضه.",
      "يمنع تحول المنطوق إلى استعمال مبهم غير منضبط.",
    ],

    rejectionCriteria: [
      "أن يكون مجرد قائمة مفردات.",
      "أن يقتصر على الشرح الوصفي.",
      "أن يخلو من حدود المعنى وشروط القبول.",
      "أن يعامل القاموس والمعجم بوصفهما كياناً واحداً.",
    ],

    boundaries: [
      {
        id: "boundary-almojam-001",
        kind: "DISTINGUISHES_FROM",
        statement:
          "المعجم ليس قاموساً وصفياً للمفردات.",
      },
      {
        id: "boundary-almojam-002",
        kind: "REQUIRES",
        statement:
          "يستلزم المعجم تعريفاً معتمداً وحدوداً وشروط قبول ورفض.",
      },
      {
        id: "boundary-almojam-003",
        kind: "FORBIDS",
        statement:
          "يُحظر اعتماد مدخل لا يثبت معنى مفاهيمياً أو حوكمياً.",
      },
    ],

    relations: [],

    allowedContexts: [
      "المرجعية المفاهيمية",
      "حوكمة المعنى",
      "تثبيت الدلالة",
      "ضبط المصطلحات الحاكمة",
    ],

    forbiddenContexts: [
      "استخدامه مرادفاً آلياً للقاموس",
      "استخدامه للدلالة على قائمة كلمات بلا حوكمة",
    ],

    aliases: [
      "المعجم اللساني المفاهيمي المعتمد",
    ],

    tongue: "العربية",
    version: "1.0.0",
    governanceStatus: "RATIFIED",

    provenance: {
      sourceId: "alqatara-semantic-constitution",
      sourceType: "AUTHORIAL_ENTRY",
      author: "Alaa Atia",
      recordedAt: "2026-01-07T18:24:00Z",
      sourceLocation:
        "المعجم اللساني المفاهيمي المعتمد — مدخل المعجم",
    },

    createdAt: "2026-01-07T18:24:00Z",
  };
