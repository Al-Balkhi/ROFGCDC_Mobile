/**
 * constants/strings.ts
 *
 * Centralised Arabic UI strings for the Citizen-app.
 * All user-facing text lives here so it can be translated or overridden in one place.
 *
 * Migration path: when react-i18next (or similar) is introduced, replace each
 * string reference with `t("KEY_NAME")` — the key names below are designed to
 * map directly to translation keys.
 */
export const STRINGS = {
  // ── Alert titles ─────────────────────────────────────────────────────────
  TITLE_WARNING: "تنبيه",
  TITLE_ERROR:   "خطأ",
  TITLE_NET_ERR: "خطأ في الاتصال",
  TITLE_SUCCESS: "نجاح",

  // ── Alert messages ────────────────────────────────────────────────────────
  ALERT_LOCATION_DENIED: "يجب السماح بالوصول إلى الموقع لإرسال البلاغ",
  ALERT_CAMERA_DENIED:   "يجب السماح بالوصول إلى الكاميرا لالتقاط صورة",
  ALERT_NO_IMAGE:        "يجب إرفاق صورة واحدة على الأقل",
  ALERT_NO_LOCATION:
    "لم يتم تحديد الموقع. يرجى المحاولة مرة أخرى للحصول على الموقع الجغرافي.",
  ALERT_LOCATION_ERROR:
    "تعذر الحصول على الموقع الجغرافي. يرجى التأكد من تشغيل الـ GPS.",
  ALERT_SUBMIT_SUCCESS: "تم إرسال البلاغ بنجاح. شكراً لك!",
  ALERT_SUBMIT_ERROR:   "حدث خطأ أثناء إرسال البلاغ",
  ALERT_NETWORK_ERROR:
    "يرجى التحقق من اتصالك بالإنترنت والمحاولة مجدداً",

  // ── Section / card headers ────────────────────────────────────────────────
  SECTION_PHOTO:       "إرفاق صورة للمشكلة",
  SECTION_LOCATION:    "الموقع الجغرافي",
  SECTION_ISSUE_TYPE:  "نوع البلاغ",
  SECTION_DESCRIPTION: "تفاصيل إضافية (اختياري)",

  // ── Labels & button text ──────────────────────────────────────────────────
  LABEL_PHOTO_HINT:       "يساعدنا تصوير المشكلة على تقييمها بشكل أسرع (مطلوب)",
  LABEL_LOCATING:         "جاري التحديد...",
  LABEL_GET_LOCATION:     "تحديد الموقع الآن",
  LABEL_LOCATION_SET:     "تم التحديد بنجاح ✓",
  LABEL_ISSUE_FULL:       "امتلاء الحاوية",
  LABEL_ISSUE_NONE:       "لا توجد حاوية",
  LABEL_DESCRIPTION_HINT: "هل تود إضافة أي ملاحظات؟",
  LABEL_SUBMIT:           "إرسال البلاغ الآن",
  LABEL_ADD_PHOTO:        "إضافة صورة",
  LABEL_REMOVE_PHOTO:     "حذف الصورة",

  // ── Onboarding screen ─────────────────────────────────────────────────────
  ONBOARDING_TITLE:
    "مرحباً بك في إماطة",
  ONBOARDING_SUBTITLE:
    "صوّر، بلّغ، وشاركنا التغيير..\nمع تطبيق إماطة، بيئتك مسؤوليتنا جميعاً.",
  ONBOARDING_STARTING: "جاري البدء...",

  // ── Navigation ────────────────────────────────────────────────────────────
  NAV_REPORT_TITLE: "تفضل ماهي مشكلتك؟",
} as const;
