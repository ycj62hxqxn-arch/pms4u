import type {
  SemanticConstitutionEntry,
} from "../constitution";

const SOURCE_ID =
  "alqatara-approved-conceptual-lexicon";

const AUTHOR = "Alaa Atia";
const RECORDED_AT = "2026-01-07T18:24:00Z";

export const tongueEntry:
  SemanticConstitutionEntry = {
    id: "semantic-entry-allisan-001",
    canonicalTerm: "اللسان",
    root: "ل-س-ن",

    category: "FOUNDATIONAL",

    definition:
      "البنية المنطوقة التي يقوم بها المعنى ويُدرك من خلالها، وتكون قابلة للاشتقاق المفاهيمي وتعكس نظاماً قائماً في الواقع.",

    acceptanceCriteria: [
      "أن يقوم به معنى معتبر.",
      "أن يكون مناطاً بمنطوق قابل للإدراك.",
      "أن يسمح بالاشتقاق المفاهيمي.",
      "أن يعكس بنية يمكن تمييزها في الواقع.",
    ],

    rejectionCriteria: [
      "منطوق لا ينعقد عليه معنى.",
      "استعمال مبهم يحتاج دائماً إلى إنقاذ خارجي.",
      "تحول محلي لم يبلغ معنى مستقلاً.",
    ],

    boundaries: [
      {
        id: "boundary-allisan-001",
        kind: "REQUIRES",
        statement:
          "قيام اللسان يستلزم منطوقاً يحمل معنى معتبراً.",
        relatedEntryId: "semantic-entry-almantuq-001",
      },
      {
        id: "boundary-allisan-002",
        kind: "DISTINGUISHES_FROM",
        statement:
          "اللسان ليس لهجة محلية ما لم تنتج تحولاً بنيوياً ومعنى مستقلاً.",
        relatedEntryId: "semantic-entry-allahja-001",
      },
      {
        id: "boundary-allisan-003",
        kind: "EXCLUDES",
        statement:
          "اللسان يستبعد المنطوق الذي يسقط من الاعتبار لعدم قيام المعنى.",
        relatedEntryId: "semantic-entry-allaghw-001",
      },
    ],

    relations: [
      {
        id: "relation-allisan-meaning-001",
        kind: "REQUIRES",
        targetEntryId: "semantic-entry-almaana-001",
        explanation:
          "لا يثبت اللسان داخل الدستور الدلالي دون معنى قائم به.",
      },
      {
        id: "relation-allisan-spoken-001",
        kind: "DEPENDS_ON",
        targetEntryId: "semantic-entry-almantuq-001",
        explanation:
          "المعنى اللساني مناط بالمنطوق.",
      },
      {
        id: "relation-allisan-laghw-001",
        kind: "CONTRASTS_WITH",
        targetEntryId: "semantic-entry-allaghw-001",
      },
    ],

    allowedContexts: [
      "قيام المعنى",
      "الاشتقاق المفاهيمي",
      "تحديد بنية المنطوق",
      "حوكمة المفاهيم",
    ],

    forbiddenContexts: [
      "استعمال اللسان مرادفاً لأي أصوات أو ألفاظ بلا معنى",
      "اعتبار كل تحول محلي لساناً مستقلاً",
    ],

    aliases: [
      "اللسان العربي",
      "اللسان المنطوق",
    ],

    tongue: "العربية",
    version: "1.0.0",
    governanceStatus: "RATIFIED",

    provenance: {
      sourceId: SOURCE_ID,
      sourceType: "BOOK",
      author: AUTHOR,
      recordedAt: RECORDED_AT,
      sourceLocation:
        "المعجم اللساني المفاهيمي المعتمد — مدخل اللسان",
    },

    createdAt: RECORDED_AT,
  };

export const spokenExpressionEntry:
  SemanticConstitutionEntry = {
    id: "semantic-entry-almantuq-001",
    canonicalTerm: "المنطوق",
    root: "ن-ط-ق",

    category: "FOUNDATIONAL",

    definition:
      "ما صدر باللسان وأصبح محلاً لإدراك المعنى أو الحكم على قيامه أو سقوطه.",

    acceptanceCriteria: [
      "أن يكون صادراً في صورة قابلة للإدراك.",
      "أن يمكن فحص علاقته بالمعنى.",
      "أن يمكن نسبته إلى سياق لساني محدد.",
    ],

    rejectionCriteria: [
      "ما لا يمكن تمييزه أو نسبته إلى سياق.",
      "ما يُفترض له معنى بلا أثر منطوق أو مرجعي.",
    ],

    boundaries: [
      {
        id: "boundary-almantuq-001",
        kind: "DISTINGUISHES_FROM",
        statement:
          "ليس كل منطوق معنى، فقد يسقط المنطوق من الاعتبار ويصير لغواً.",
        relatedEntryId: "semantic-entry-allaghw-001",
      },
      {
        id: "boundary-almantuq-002",
        kind: "REQUIRES",
        statement:
          "المنطوق المعتبر يحتاج إلى إمكانية فحص قيام المعنى عليه.",
        relatedEntryId: "semantic-entry-almaana-001",
      },
    ],

    relations: [
      {
        id: "relation-almantuq-meaning-001",
        kind: "DEPENDS_ON",
        targetEntryId: "semantic-entry-almaana-001",
        explanation:
          "اعتبار المنطوق لا يكتمل إلا بفحص المعنى القائم عليه.",
      },
      {
        id: "relation-almantuq-laghw-001",
        kind: "CONTRASTS_WITH",
        targetEntryId: "semantic-entry-allaghw-001",
      },
    ],

    allowedContexts: [
      "اختبار قيام المعنى",
      "تحليل الاستعمال",
      "تحديد السياق اللساني",
    ],

    forbiddenContexts: [
      "اعتبار كل منطوق معنى صحيحاً",
      "فصل المنطوق عن سياقه",
    ],

    aliases: [
      "القول المنطوق",
    ],

    tongue: "العربية",
    version: "1.0.0",
    governanceStatus: "RATIFIED",

    provenance: {
      sourceId: SOURCE_ID,
      sourceType: "BOOK",
      author: AUTHOR,
      recordedAt: RECORDED_AT,
      sourceLocation:
        "المعجم اللساني المفاهيمي المعتمد — مدخل المنطوق",
    },

    createdAt: RECORDED_AT,
  };

export const meaningEntry:
  SemanticConstitutionEntry = {
    id: "semantic-entry-almaana-001",
    canonicalTerm: "المعنى",
    root: "ع-ن-ي",

    category: "FOUNDATIONAL",

    definition:
      "الدلالة القائمة باللسان والمناطة بالمنطوق، والتي يمكن إدراكها وتثبيتها وتمييزها والاشتقاق منها داخل سياق معتبر.",

    acceptanceCriteria: [
      "أن يقوم على لسان معلوم.",
      "أن يكون مناطاً بمنطوق أو أثر مرجعي معتبر.",
      "أن يمكن تمييزه عن المعاني المجاورة.",
      "أن يكون قابلاً للتثبيت أو الاشتقاق المفاهيمي.",
    ],

    rejectionCriteria: [
      "دلالة مفترضة منفصلة عن اللسان.",
      "تأويل لا تضبطه قرينة أو مرجعية.",
      "استعمال لا يمكن تمييز حدوده.",
      "منطوق يسقط من الاعتبار ولا ينعقد عليه معنى.",
    ],

    boundaries: [
      {
        id: "boundary-almaana-001",
        kind: "REQUIRES",
        statement:
          "المعنى المعتبر قائم باللسان.",
        relatedEntryId: "semantic-entry-allisan-001",
      },
      {
        id: "boundary-almaana-002",
        kind: "REQUIRES",
        statement:
          "إدراك المعنى مناط بالمنطوق أو بأثر مرجعي معتبر.",
        relatedEntryId: "semantic-entry-almantuq-001",
      },
      {
        id: "boundary-almaana-003",
        kind: "EXCLUDES",
        statement:
          "المعنى المعتبر يستبعد اللغو.",
        relatedEntryId: "semantic-entry-allaghw-001",
      },
    ],

    relations: [
      {
        id: "relation-almaana-allisan-001",
        kind: "DEPENDS_ON",
        targetEntryId: "semantic-entry-allisan-001",
      },
      {
        id: "relation-almaana-almantuq-001",
        kind: "DEPENDS_ON",
        targetEntryId: "semantic-entry-almantuq-001",
      },
      {
        id: "relation-almaana-almojam-001",
        kind: "GOVERNED_BY",
        targetEntryId: "semantic-entry-almojam-001",
        explanation:
          "المعجم يثبت المعنى ويضبط حدوده.",
      },
    ],

    allowedContexts: [
      "التعريف المفاهيمي",
      "التثبيت المرجعي",
      "الاشتقاق",
      "الاستدلال",
    ],

    forbiddenContexts: [
      "المعنى المجرد عن اللسان",
      "التأويل غير المنضبط",
      "المساواة بين كثرة الاستعمال وصحة المعنى",
    ],

    aliases: [
      "الدلالة المعتبرة",
    ],

    tongue: "العربية",
    version: "1.0.0",
    governanceStatus: "RATIFIED",

    provenance: {
      sourceId: SOURCE_ID,
      sourceType: "BOOK",
      author: AUTHOR,
      recordedAt: RECORDED_AT,
      sourceLocation:
        "المعجم اللساني المفاهيمي المعتمد — مدخل المعنى",
    },

    createdAt: RECORDED_AT,
  };

export const futileExpressionEntry:
  SemanticConstitutionEntry = {
    id: "semantic-entry-allaghw-001",
    canonicalTerm: "اللغو",
    root: "ل-غ-و",

    category: "NEGATIVE",

    definition:
      "كل منطوق لا يقوم عليه معنى لساني معتبر، ولا ينتج دلالة مستقلة، ولا يمكن تثبيته اشتقاقياً أو مرجعياً، فيسقط من الاعتبار ولو كثر استعماله.",

    acceptanceCriteria: [
      "انفصال المنطوق عن المعنى.",
      "تعذر تثبيت الدلالة مرجعياً.",
      "عدم إمكان الاشتقاق المفاهيمي.",
      "الاحتياج الدائم إلى تفسير خارجي لإنقاذ الاستعمال.",
    ],

    rejectionCriteria: [
      "منطوق يقوم عليه معنى معتبر.",
      "مصطلح ناشئ له تعريف منضبط وقابل للتثبيت.",
      "اختلاف سياقي يمكن تفسيره بقرينة واضحة.",
    ],

    boundaries: [
      {
        id: "boundary-allaghw-001",
        kind: "DISTINGUISHES_FROM",
        statement:
          "اللغو ليس صمتاً، بل منطوقاً سقط منه اعتبار المعنى.",
      },
      {
        id: "boundary-allaghw-002",
        kind: "EXCLUDES",
        statement:
          "اللغو لا يُقبل مدخلاً حاكماً للمعنى.",
        relatedEntryId: "semantic-entry-almaana-001",
      },
      {
        id: "boundary-allaghw-003",
        kind: "DISTINGUISHES_FROM",
        statement:
          "اللغو يختلف عن اللهجة؛ فاللهجة تحول محلي داخل اللسان، أما اللغو فسقوط للمعنى.",
        relatedEntryId: "semantic-entry-allahja-001",
      },
    ],

    relations: [
      {
        id: "relation-allaghw-almaana-001",
        kind: "CONTRASTS_WITH",
        targetEntryId: "semantic-entry-almaana-001",
      },
      {
        id: "relation-allaghw-allisan-001",
        kind: "EXCLUDES",
        targetEntryId: "semantic-entry-allisan-001",
        explanation:
          "اللغو لا يثبت بوصفه لساناً معتبراً.",
      },
    ],

    allowedContexts: [
      "الحكم بسقوط المعنى",
      "رفض المدخل غير المنضبط",
      "كشف الانفصال بين المنطوق والمعنى",
    ],

    forbiddenContexts: [
      "استعمال اللغو مرادفاً للصمت",
      "استعمال اللغو مرادفاً للخطأ النحوي فقط",
    ],

    aliases: [
      "المنطوق الساقط من الاعتبار",
    ],

    tongue: "العربية",
    version: "1.0.0",
    governanceStatus: "RATIFIED",

    provenance: {
      sourceId: SOURCE_ID,
      sourceType: "BOOK",
      author: AUTHOR,
      recordedAt: RECORDED_AT,
      sourceLocation:
        "المعجم اللساني المفاهيمي المعتمد — مدخل اللغو",
    },

    createdAt: RECORDED_AT,
  };

export const dialectEntry:
  SemanticConstitutionEntry = {
    id: "semantic-entry-allahja-001",
    canonicalTerm: "اللهجة",
    root: "ل-ه-ج",

    category: "BOUNDARY",

    definition:
      "ناتج محلي لتبدل تدريجي في اللسان المنطوق لا ينشئ بذاته معنى مستقلاً ولا يصبح لساناً جديداً إلا بتحول بنيوي قابل للاشتقاق المفاهيمي.",

    acceptanceCriteria: [
      "وجود تحول محلي في المنطوق.",
      "بقاء الصلة باللسان الأصل.",
      "عدم قيام معنى مستقل بذاته.",
    ],

    rejectionCriteria: [
      "تحول أنتج معنى مستقلاً ونظاماً اشتقاقياً جديداً.",
      "منطوق لا يقوم عليه معنى ويُعامل بوصفه لغواً.",
    ],

    boundaries: [
      {
        id: "boundary-allahja-001",
        kind: "LIMITS_TO_CONTEXT",
        statement:
          "اللهجة تحول محلي داخل اللسان وليست لساناً مستقلاً بمجرد اختلاف النطق.",
        relatedEntryId: "semantic-entry-allisan-001",
      },
      {
        id: "boundary-allahja-002",
        kind: "FORBIDS",
        statement:
          "يُحظر اعتبار اللهجة منشئة لمعنى مستقل دون تحول بنيوي مثبت.",
        relatedEntryId: "semantic-entry-almaana-001",
      },
      {
        id: "boundary-allahja-003",
        kind: "DISTINGUISHES_FROM",
        statement:
          "اللهجة لا تساوي اللغو ما دامت تحافظ على معنى قائم داخل اللسان.",
        relatedEntryId: "semantic-entry-allaghw-001",
      },
    ],

    relations: [
      {
        id: "relation-allahja-allisan-001",
        kind: "PART_OF",
        targetEntryId: "semantic-entry-allisan-001",
      },
      {
        id: "relation-allahja-almaana-001",
        kind: "LIMITS",
        targetEntryId: "semantic-entry-almaana-001",
        explanation:
          "اللهجة لا تنشئ معنى مستقلاً بذاتها.",
      },
      {
        id: "relation-allahja-allaghw-001",
        kind: "CONTRASTS_WITH",
        targetEntryId: "semantic-entry-allaghw-001",
      },
    ],

    allowedContexts: [
      "التحول المحلي في المنطوق",
      "الاختلاف داخل اللسان الواحد",
      "تحليل تطور الاستعمال",
    ],

    forbiddenContexts: [
      "اعتبار كل لهجة لساناً مستقلاً",
      "إسناد معنى مستقل للهجة بلا إثبات بنيوي",
    ],

    aliases: [
      "اللهجة المحلية",
    ],

    tongue: "العربية",
    version: "1.0.0",
    governanceStatus: "RATIFIED",

    provenance: {
      sourceId: SOURCE_ID,
      sourceType: "BOOK",
      author: AUTHOR,
      recordedAt: RECORDED_AT,
      sourceLocation:
        "المعجم اللساني المفاهيمي المعتمد — الإطار اللساني ومدخل اللهجة",
    },

    createdAt: RECORDED_AT,
  };

export const foundationalSemanticEntries:
  SemanticConstitutionEntry[] = [
    tongueEntry,
    spokenExpressionEntry,
    meaningEntry,
    futileExpressionEntry,
    dialectEntry,
  ];
