import apiClient from "./axios-instance";

export interface QuizQuestionObject {
  question: string;
  options: string[];
  correctAnswer: string;
};

export interface QuizObject {
  quizTitle: string;
  description: string;
  points: string;
  questions: QuizQuestionObject[];
};

export interface LearningSpaceObject {
  title: string;
  objective: string;
  // score: string;
  duration: number;
  simulationId: string;
  preSimAssessment: QuizObject;
  postSimAssessment: QuizObject;
  tags: string[];
  introductionMessage: string;
  engagementQuestion: string;
  hypothesisQuestion: string;
  experimentProcedures: string[];
  discussionPrompt: string;
  realWorldApplications: string[];
  relatedCareers: string[];
  realWorldTask: string;
};


export async function getLearningSpaceById(id: string, token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/ils/${id}`, config);
  return res.data;
}


export interface LearningSpaceTag {
  id: string;
  label: string;
  subject: string;
}

/** Shape returned by GET /api/ils — duration is in hours, often fractional. */
export interface LearningSpaceSummary {
  id: string;
  title: string;
  objective: string;
  grade: string;
  duration: number;
  simulationId: string;
  status: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  tags: LearningSpaceTag[];
}

export async function getLearningSpaces(
  token?: string | null,
): Promise<LearningSpaceSummary[]> {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/ils`, config);
  return Array.isArray(res.data) ? res.data : [];
}

export async function getLearningSpacesByClassId(classId: string | null, token?: string | null) {
  const config = {
    withCredentials: true,
    params: classId,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/ils`, config);
  return res.data;
}

export async function addLearningSpace(
  learningSpaceData: LearningSpaceObject,
  // schoolId?: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      "/api/ils",
      learningSpaceData,
      {
        // params: { schoolId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to add learning space:", error);
    throw error;
  }
}

export async function updateLearningSpace(
  learningSpaceData: LearningSpaceObject,
  id: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.put(
      `/api/ils/${id}`,
      learningSpaceData,
      {
        // params: { schoolId },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to update learning space:", error);
    throw error;
  }
}

export async function publishLearningSpace(
  id: string,
  token?: string | null
) {
  try {
    // The header object belongs in the config arg — passing it as the second
    // argument sent it as the request body instead.
    const res = await apiClient.post(`/api/ils/${id}/publish`, null, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    return res.data;
  } catch (error) {
    console.error("Failed to publish learning space:", error);
    throw error;
  }
}


export async function assignLearningSpace(
  spaceData: {
    classroomId: string,
    type: string
  },
  id?: string | null,
  token?: string | null
) {
  try {
    const res = await apiClient.post(
      `/api/ils/${id}/assign`,
      spaceData,
      {
        // params: { id },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
    return res.data;
  } catch (error) {
    console.error("Failed to assign learning space:", error);
    throw error;
  }
}


/** Raw POST /api/session body: { "sessionId": "...", "step": 1 } */
interface SessionCreateResponse {
  sessionId?: string;
  /** Older/alternate shape — tolerated so a rename can't silently break saves. */
  id?: string;
  step?: number;
}

export interface LearningSession {
  id: string;
  /** 1-based step the server has this student on; 1 for a fresh session. */
  step: number;
}

export async function createSession(
  studentId: string,
  ilsId: string,
): Promise<LearningSession> {
  const res = await apiClient.post("/api/session", { studentId, ilsId });
  const data: SessionCreateResponse = res.data ?? {};
  const id = data.sessionId ?? data.id;

  // A 200 with no id is a failure for our purposes — surface it rather than
  // handing back an undefined id that would silently disable every save.
  if (!id) {
    throw new Error("Session response did not include a session id");
  }

  return { id, step: typeof data.step === "number" ? data.step : 1 };
}

export interface PollPayload {
  quizTitle: string;
  timeSpentSeconds: number;
  answers: { questionIndex: number; optionIndex: number; isCorrect: boolean }[];
  score: number;
  correctAnswers: number;
  totalQuestions: number;
}

export async function submitPoll(sessionId: string, data: PollPayload): Promise<void> {
  await apiClient.post(`/api/session/${sessionId}/poll`, data);
}

export async function submitOrientation(
  sessionId: string,
  engagementAnswer: string,
): Promise<void> {
  await apiClient.post(`/api/session/${sessionId}/orientation`, { engagementAnswer });
}

export async function submitHypothesis(sessionId: string, text: string): Promise<void> {
  await apiClient.post(`/api/session/${sessionId}/hypothesis`, { text, inputMethod: "text" });
}

export async function submitExperiment(
  sessionId: string,
  observationText: string,
  variables: Record<string, unknown> = {},
): Promise<void> {
  await apiClient.post(`/api/session/${sessionId}/experiment`, { variables, observationText });
}

export async function submitReflection(sessionId: string, text: string): Promise<void> {
  await apiClient.post(`/api/session/${sessionId}/reflection`, { text });
}

export async function submitRealWorld(sessionId: string, note: string): Promise<void> {
  await apiClient.post(`/api/session/${sessionId}/realworld`, { note });
}

export interface PostSimAnswer {
  questionIndex: number;
  selectedAnswer: string;
  isCorrect: boolean;
}

export interface AssessmentResult {
  score: number;
  feedback?: string;
  badgeAwarded: boolean;
  completedAt?: string;
}

export async function submitAssessment(
  sessionId: string,
  postSimAnswers: PostSimAnswer[],
  postSimScore: number,
  postSimTotal: number,
): Promise<AssessmentResult> {
  const res = await apiClient.post(`/api/session/${sessionId}/assessment`, {
    postSimAnswers,
    postSimScore,
    postSimTotal,
  });
  return res.data;
}