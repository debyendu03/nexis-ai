import { createClient } from '@supabase/supabase-js';
import { Conversation, Message } from '@/types';

// Initialize Supabase Browser/Server Client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase environment variables in .env.local');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// CONVERSATION HELPERS
// ============================================================================

/*  Fetch all conversations belonging to a specific user (newest first) */
export async function getConversations(userId: string): Promise<Conversation[]> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) throw error;
    return (data as Conversation[]) || [];
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return [];
  }
}

/* Create a new conversation record in Supabase */
export async function createConversation(
  userId: string,
  title: string = 'New Chat'
): Promise<Conversation | null> {
  try {
    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: userId,
        title,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as Conversation;
  } catch (error) {
    console.error('Error creating conversation:', error);
    return null;
  }
}

/* Update the title of an existing conversation */
export async function updateConversationTitleInDb(
  conversationId: string,
  title: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('conversations')
      .update({
        title,
        updated_at: new Date().toISOString(),
      })
      .eq('id', conversationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating conversation title:', error);
    return false;
  }
}

/* Delete a conversation (messages auto-delete via CASCADE in PostgreSQL) */
export async function deleteConversationFromDb(
  conversationId: string
): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('conversations')
      .delete()
      .eq('id', conversationId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting conversation:', error);
    return false;
  }
}

// ============================================================================
// MESSAGE HELPERS
// ============================================================================

/* Fetch all messages for a given conversation (chronological order) */
export async function getMessages(conversationId: string): Promise<Message[]> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return (data as Message[]) || [];
  } catch (error) {
    console.error('Error fetching messages:', error);
    return [];
  }
}

/* Save a single message (user prompt or assistant response) into Supabase */
export async function saveMessage(
  conversationId: string,
  role: 'user' | 'assistant',
  content: string
): Promise<Message | null> {
  try {
    const { data, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        role,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;

    // Bump the parent conversation's updated_at timestamp
    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', conversationId);

    return data as Message;
  } catch (error) {
    console.error('Error saving message:', error);
    return null;
  }
}