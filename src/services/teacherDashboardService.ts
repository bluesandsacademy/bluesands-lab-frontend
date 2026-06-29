import apiClient from "./axios-instance";

const triggerDownload = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

export async function exportEngagement(): Promise<void> {
  const res = await apiClient.get("/api/exports/engagement", {
    responseType: "blob",
  });
  triggerDownload(res.data, "engagement.csv");
}

export async function exportGradebook(classId: string): Promise<void> {
  const res = await apiClient.get("/api/exports/gradebook", {
    params: { classId },
    responseType: "blob",
  });
  triggerDownload(res.data, "gradebook.csv");
}

export async function getTeacherClasses(): Promise<{ id: string; name: string }[]> {
  const res = await apiClient.get("/api/classes");
  return res.data;
}
