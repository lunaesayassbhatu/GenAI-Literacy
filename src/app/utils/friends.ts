import { supabase } from './supabase';

export interface Friend {
  id: string;
  username: string;
  createdAt: string;
}

export async function getFriends(): Promise<Friend[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('friends')
    .select('id, friend_username, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getFriends failed:', error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    username: row.friend_username,
    createdAt: row.created_at,
  }));
}

export async function addFriend(username: string): Promise<{ success: boolean; error?: string }> {
  const trimmed = username.trim();
  if (!trimmed) return { success: false, error: 'Enter a username.' };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: 'You must be signed in.' };

  const { data: matchingProfile, error: lookupError } = await supabase
    .from('profiles')
    .select('username')
    .ilike('username', trimmed)
    .maybeSingle();

  if (lookupError) {
    console.error('addFriend lookup failed:', lookupError);
    return { success: false, error: 'Something went wrong looking up that username.' };
  }
  if (!matchingProfile) {
    return { success: false, error: `No ASU GenAI Lab user named "${trimmed}" was found.` };
  }

  const { error: insertError } = await supabase.from('friends').insert({
    user_id: user.id,
    friend_username: matchingProfile.username,
  });

  if (insertError) {
    if (insertError.code === '23505') {
      return { success: false, error: 'Already in your friends list.' };
    }
    console.error('addFriend insert failed:', insertError);
    return { success: false, error: 'Something went wrong adding that friend.' };
  }

  return { success: true };
}

export async function removeFriend(id: string): Promise<void> {
  const { error } = await supabase.from('friends').delete().eq('id', id);
  if (error) console.error('removeFriend failed:', error);
}
