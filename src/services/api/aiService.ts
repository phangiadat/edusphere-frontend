import { axiosClient } from './axiosClient';

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
    return (await axiosClient.post('/ai/ask', payload)) as unknown as AskAiResponse;
  },
};
