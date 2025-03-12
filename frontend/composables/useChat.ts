import { ref, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useApiService, type ChatMessage } from '~/services/api';

export const useChat = () => {
  const messages = ref<ChatMessage[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  const apiService = useApiService();
  
  const conversation = computed<ChatMessage[]>(() => messages.value);
  
  const sendMessage = async (content: string) => {
    if (!content.trim()) return;
    
    try {
      // Mettre à jour l'état de chargement
      isLoading.value = true;
      error.value = null;
      
      // Ajouter le message de l'utilisateur
      const userMessage: ChatMessage = {
        id: uuidv4(),
        role: 'user',
        content,
        timestamp: new Date()
      };
      
      // Important: créer un nouveau tableau au lieu de modifier l'existant
      const currentMessages = [...messages.value];
      currentMessages.push(userMessage);
      messages.value = currentMessages;
      
      // Envoyer la demande au backend
      const response = await apiService.sendMessage(content);
      
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
  
  return {
    messages,
    conversation,
    isLoading,
    error,
    sendMessage,
    clearChat
  };
};