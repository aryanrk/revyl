import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../context/AuthContext';

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  read: boolean;
}

export function useMessages(chatId: string) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !chatId) return;

    const fetchMessages = async () => {
      try {
        const { data, error: messagesError } = await supabase
          .from('messages')
          .select('*')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: false });

        if (messagesError) throw messagesError;

        setMessages(data);

        // Mark messages as read
        await supabase.rpc('mark_messages_as_read', {
          p_chat_id: chatId,
          p_user_id: user.id,
        });
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to new messages
    const subscription = supabase
      .channel(`chat:${chatId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=eq.${chatId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setMessages((prev) => [payload.new as Message, ...prev]);
            
            // Mark message as read if it's not from the current user
            if (payload.new.sender_id !== user.id) {
              supabase.rpc('mark_messages_as_read', {
                p_chat_id: chatId,
                p_user_id: user.id,
              });
            }
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [chatId, user]);

  const sendMessage = async (content: string) => {
    if (!user || !chatId || !content.trim()) return;

    try {
      const { error: sendError } = await supabase.from('messages').insert({
        chat_id: chatId,
        sender_id: user.id,
        content: content.trim(),
      });

      if (sendError) throw sendError;
    } catch (err) {
      console.error('Error sending message:', err);
      throw new Error('Failed to send message');
    }
  };

  return { messages, loading, error, sendMessage };
}