import { useEffect, useState } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../../context/AuthContext';

export interface Chat {
  id: string;
  participants: {
    id: string;
    name: string;
    avatar_url: string;
  }[];
  lastMessage?: {
    content: string;
    created_at: string;
    sender_id: string;
  };
  unreadCount: number;
}

export function useChats() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchChats = async () => {
      try {
        // Get all chats the user is part of
        const { data: chatParticipants, error: chatError } = await supabase
          .from('chat_participants')
          .select(`
            chat:chats (
              id,
              updated_at,
              participants:chat_participants (
                user:profiles (
                  id,
                  name,
                  avatar_url
                )
              ),
              messages (
                content,
                created_at,
                sender_id,
                read
              )
            )
          `)
          .eq('user_id', user.id)
          .order('chat(updated_at)', { ascending: false });

        if (chatError) throw chatError;

        const formattedChats = chatParticipants.map(({ chat }) => {
          const otherParticipants = chat.participants
            .map(p => p.user)
            .filter(p => p.id !== user.id);

          const messages = chat.messages || [];
          const lastMessage = messages[0];
          const unreadCount = messages.filter(
            m => !m.read && m.sender_id !== user.id
          ).length;

          return {
            id: chat.id,
            participants: otherParticipants,
            lastMessage,
            unreadCount,
          };
        });

        setChats(formattedChats);
      } catch (err) {
        console.error('Error fetching chats:', err);
        setError('Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();

    // Subscribe to new messages
    const subscription = supabase
      .channel('chats')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `chat_id=in.(${chats.map(c => c.id).join(',')})`,
        },
        () => {
          fetchChats();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  return { chats, loading, error };
}