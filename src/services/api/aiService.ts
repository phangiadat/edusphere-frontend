import { axiosClient } from '../../api/axiosClient';

export interface AskAiPayload {
  question: string;
  lessonId?: string;
}

export interface AskAiResponse {
  answer: string;
}

export const aiService = {
  // Ask Gemini AI Assistant
  async askQuestion(payload: AskAiPayload): Promise<AskAiResponse> {
    const response = await axiosClient.post('/ai/ask', payload);
    return response.data;
  },
};
