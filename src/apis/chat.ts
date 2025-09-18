//간략화 잘 되어있음
import api from './index';

interface ChatRequest {
  query: string;
  language: string;
}

interface ChatResponse {
  answer: string;
}
export const sendChatMessage = async (query: string) => {
  const onboardingInfo = JSON.parse(
    localStorage.getItem('onboardingInfo') || '{}',
  );
  const payload: ChatRequest = { query, language: onboardingInfo.nation };

  try {
    const response = await api.post<ChatResponse>('/api/chatbot/ask', payload);
    console.log(response);
    return response.data.answer;
  } catch (error) {
    console.error(error);
  }
};
