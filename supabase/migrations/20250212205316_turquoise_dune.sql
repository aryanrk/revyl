/*
  # Add chat functionality

  1. New Tables
    - `chats`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `chat_participants`
      - `chat_id` (uuid, foreign key)
      - `user_id` (uuid, foreign key)
      - `created_at` (timestamp)
    
    - `messages`
      - `id` (uuid, primary key)
      - `chat_id` (uuid, foreign key)
      - `sender_id` (uuid, foreign key)
      - `content` (text)
      - `created_at` (timestamp)
      - `read` (boolean)

  2. Security
    - Enable RLS on all tables
    - Add policies for chat participants to read/write messages
    - Add policies for managing chat participants
*/

-- Create chats table
CREATE TABLE IF NOT EXISTS chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create chat_participants table
CREATE TABLE IF NOT EXISTS chat_participants (
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  PRIMARY KEY (chat_id, user_id)
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  chat_id uuid REFERENCES chats(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read boolean DEFAULT false,
  CONSTRAINT content_not_empty CHECK (char_length(trim(content)) > 0)
);

-- Enable RLS
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Policies for chats
CREATE POLICY "Users can view chats they're part of"
  ON chats
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_id = chats.id
      AND user_id = auth.uid()
    )
  );

-- Policies for chat_participants
CREATE POLICY "Users can see other participants in their chats"
  ON chat_participants
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants cp
      WHERE cp.chat_id = chat_participants.chat_id
      AND cp.user_id = auth.uid()
    )
  );

-- Policies for messages
CREATE POLICY "Users can view messages in their chats"
  ON messages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_id = messages.chat_id
      AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can send messages to their chats"
  ON messages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM chat_participants
      WHERE chat_id = messages.chat_id
      AND user_id = auth.uid()
    )
    AND sender_id = auth.uid()
  );

-- Function to update chat's updated_at timestamp
CREATE OR REPLACE FUNCTION update_chat_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE chats
  SET updated_at = now()
  WHERE id = NEW.chat_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update chat's timestamp when new message is added
CREATE TRIGGER update_chat_timestamp
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION update_chat_timestamp();

-- Function to mark messages as read
CREATE OR REPLACE FUNCTION mark_messages_as_read(p_chat_id uuid, p_user_id uuid)
RETURNS void AS $$
BEGIN
  UPDATE messages
  SET read = true
  WHERE chat_id = p_chat_id
    AND sender_id != p_user_id
    AND read = false;
END;
$$ LANGUAGE plpgsql;