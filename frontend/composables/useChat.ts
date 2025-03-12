import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useApiService, type ChatMessage } from '~/services/api';

export const useChat = () => {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const apiService = useApiService();
  
  const conversation = computed<ChatMessage[]>(() => messages.value);

  const logs = ref<string[]>([]); // Stores real-time logs from SSE
  const loadingContent = ref(''); // Stores the latest step of the process
  let eventSource: EventSource | null = null;

  const config = useRuntimeConfig();
  const baseUrl = config.public.sseBaseUrl;

  const startSSE = () => {
    if (eventSource) {
      eventSource.close(); // Close any existing connection
    }

    eventSource = new EventSource(`${baseUrl}/logs`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      logs.value.push(data.message); // Append new log message
      loadingContent.value = data.message; // Update loading content
    };

    eventSource.onerror = () => {
      console.error('Error in SSE connection');
      eventSource?.close();
    };
  }


  const sendMessage = async (content: string,) => {
    if (!content.trim()) return;
    
    try {
      // Reset logs and loading state
      isLoading.value = true;
      logs.value = [];
      loadingContent.value = "Sending request...";

      error.value = null;

      const requestId = uuidv4();
      
      // Add user message
      const userMessage: ChatMessage = {
        id: requestId,
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      // Important: créer un nouveau tableau au lieu de modifier l'existant
      const currentMessages = [...messages.value];
      currentMessages.push(userMessage);
      messages.value = currentMessages;
      
      // Envoyer la demande au backend
      const response = await apiService.sendMessage(content, requestId);
      
      // Ajouter la réponse de l'assistant
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: response.answer,
        timestamp: new Date(),
        sources: response.sources
      };
      
      // Encore une fois, créer un nouveau tableau
      const updatedMessages = [...messages.value];
      updatedMessages.push(assistantMessage);
      messages.value = updatedMessages;
      
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Une erreur est survenue';
      console.error('Erreur lors de l\'envoi du message:', err);
    } finally {
      isLoading.value = false;
    }
  };
  
  const clearChat = () => {
    messages.value = [];
    error.value = null;
  };

  onMounted(() => {
    startSSE();
  })

  // Cleanup function to close the SSE connection when the component unmounts
  onUnmounted(() => {
    if (eventSource) {
      eventSource.close();
    }
  });
  
  return {
    messages,
    conversation,
    isLoading,
    error,
    loadingContent,
    sendMessage,
    clearChat
  };
};