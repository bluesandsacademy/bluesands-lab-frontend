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


export async function getLearningSpaces(token?: string | null) {
  const config = {
    withCredentials: true,
    ...(token && { headers: { Authorization: `Bearer ${token}` } }),
  };
  const res = await apiClient.get(`/api/ils`, config);
  return res.data;
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
    const res = await apiClient.post(
      `/api/ils/${id}/publish`,
      {
       // params: { id },
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }
    );
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


export interface SessionCreateResponse {
  id: string;
  studentId: string;
  ilsId: string;
  status: string;
}

export async function createSession(
  studentId: string,
  ilsId: string,
): Promise<SessionCreateResponse> {
  const res = await apiClient.post("/api/session", { studentId, ilsId });
  return res.data;
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