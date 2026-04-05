// ─── Shared Learning Space Normalizer ────────────────────────────────────────
// The API may return string fields or array items as objects e.g. {id, label, subject}.
// Run raw API responses through normalizeSpace before passing them to any component.

export const toStr = (val: unknown): string => {
  if (val === null || val === undefined) return "";
  if (typeof val === "string") return val;
  if (typeof val === "number" || typeof val === "boolean") return String(val);
  if (typeof val === "object" && !Array.isArray(val)) {
    const obj = val as Record<string, unknown>;
    const labelKey = ["label", "name", "title", "value", "text"].find(
      (k) => typeof obj[k] === "string"
    );
    if (labelKey) return obj[labelKey] as string;
    return JSON.stringify(val);
  }
  return String(val);
};

export const toStrArr = (val: unknown): string[] => {
  if (!val) return [];
  if (!Array.isArray(val)) return [toStr(val)];
  return val.map(toStr);
};

const normalizeQuiz = (q: any) => ({
  quizTitle: toStr(q?.quizTitle),
  description: toStr(q?.description),
  points: toStr(q?.points),
  questions: Array.isArray(q?.questions)
    ? q.questions.map((question: any) => ({
        question: toStr(question?.question),
        options: toStrArr(question?.options),
        correctAnswer: toStr(question?.correctAnswer),
      }))
    : [{ question: "", options: ["", "", "", ""], correctAnswer: "" }],
});

export const normalizeSpace = (raw: any) => ({
  id: toStr(raw?.id),
  title: toStr(raw?.title),
  objective: toStr(raw?.objective),
  score: toStr(raw?.score),
  duration: toStr(raw?.duration),
  simulationId: toStr(raw?.simulationId),
  simulationTitle: toStr(raw?.simulationTitle),
  tags: toStrArr(raw?.tags),
  introductionMessage: toStr(raw?.introductionMessage),
  engagementQuestion: toStr(raw?.engagementQuestion),
  hypothesisQuestion: toStr(raw?.hypothesisQuestion),
  experimentProcedures: toStrArr(raw?.experimentProcedures),
  discussionPrompt: toStr(raw?.discussionPrompt),
  realWorldApplications: toStrArr(raw?.realWorldApplications),
  relatedCareers: toStrArr(raw?.relatedCareers),
  realWorldTask: toStr(raw?.realWorldTask),
  preSimAssessment: normalizeQuiz(raw?.preSimAssessment),
  postSimAssessment: normalizeQuiz(raw?.postSimAssessment),
  published: raw?.published,
  createdAt: toStr(raw?.createdAt),
});