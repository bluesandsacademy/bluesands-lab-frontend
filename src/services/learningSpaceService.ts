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
  score: string;
  duration: string;
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
