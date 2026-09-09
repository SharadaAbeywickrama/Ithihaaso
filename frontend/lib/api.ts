const API_URL = "http://localhost:8000/api";

export const uploadDocument = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  
  const res = await fetch(`${API_URL}/documents/upload`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Upload failed");
  return res.json();
};

export const getGraph = async () => {
  const res = await fetch(`${API_URL}/graph`);
  if (!res.ok) throw new Error("Failed to fetch graph");
  return res.json();
};

export const askQuestion = async (question: string) => {
  const res = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, include_explanation: true }),
  });
  if (!res.ok) throw new Error("Query failed");
  return res.json();
};

export const getExplanation = async (targetType: string, targetId: string) => {
  const res = await fetch(`${API_URL}/explanations/${targetType}/${targetId}`);
  if (!res.ok) throw new Error("Explanation not found");
  return res.json();
};
