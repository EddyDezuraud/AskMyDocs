// services/api.ts
export interface ChatMessage {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
    sources?: Array<{
      title: string;
      page: string;
    }>;
  }

  export interface ChatResponse {
    answer: string;
    think: string;
    sources: Array<{
      title: string;
      page: string;
    }>;
  }
  
  export const useApiService = () => {
    const config = useRuntimeConfig();
    const baseUrl = config.public.apiBaseUrl;
  
    const sendMessage = async (message: string): Promise<ChatResponse> => {
      try {
        const response = await useFetch<ChatResponse>(`${baseUrl}/chat`, {
          method: 'POST',
          body: { message },
        });
  
        if (response.error.value) {
          throw new Error(response.error.value.message);
        }
  
        return response.data.value as ChatResponse;
      } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
        throw error;
      }
    };
  
    const checkStatus = async (): Promise<{ status: string; message: string }> => {
      try {
        const response = await useFetch(`${baseUrl}/status`, {
          method: 'GET',
        });
  
        if (response.error.value) {
          throw new Error(response.error.value.message);
        }
  
        return response.data.value as { status: string; message: string };
      } catch (error) {
        console.error('Erreur lors de la vérification du statut:', error);
        throw error;
      }
    };
  
    const reindexDocuments = async (): Promise<{ success: boolean; count: number }> => {
      try {
        const response = await useFetch(`${baseUrl}/reindex`, {
          method: 'POST',
        });
  
        if (response.error.value) {
          throw new Error(response.error.value.message);
        }
  
        return response.data.value as { success: boolean; count: number };
      } catch (error) {
        console.error('Erreur lors de la réindexation des documents:', error);
        throw error;
      }
    };
  
    return {
      sendMessage,
      checkStatus,
      reindexDocuments,
    };
  };