import type { RequestHandler } from 'express';
import { supabaseAdmin } from '../supabaseAdmin';

// Helper to extract bearer token
function getToken(req: any): string | null {
  const auth = req.headers['authorization'] as string | undefined;
  if (!auth) return null;
  const [type, token] = auth.split(' ');
  if (type?.toLowerCase() !== 'bearer' || !token) return null;
  return token;
}

export const createUserAdmin: RequestHandler = async (req, res) => {
  try {
    const token = getToken(req);
    if (!token) return res.status(401).json({ error: 'missing_token' });

    // Verify requester and ensure is admin in profile table
    const { data: tokenUser, error: tokenErr } = await supabaseAdmin.auth.getUser(token);
    if (tokenErr || !tokenUser?.user) return res.status(401).json({ error: 'invalid_token' });

    const requesterId = tokenUser.user.id;
    const { data: requesterProfile } = await supabaseAdmin
      .from('users')
      .select('id, role')
      .eq('id', requesterId)
      .single();
    if (!requesterProfile || requesterProfile.role !== 'admin') {
      return res.status(403).json({ error: 'forbidden' });
    }

    const { email, password, name, role = 'seller', permissions = [] } = req.body || {};
    if (!email || !password || !name) {
      return res.status(400).json({ error: 'missing_fields' });
    }

    // Create auth user
    const { data: created, error: createErr } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (createErr || !created?.user) {
      return res.status(500).json({ error: 'create_user_failed', details: createErr?.message });
    }

    const userId = created.user.id;

    // Insert profile row in public.users
    const now = new Date().toISOString();
    const { error: upsertErr } = await supabaseAdmin.from('users').upsert([
      {
        id: userId,
        email,
        name,
        role,
        permissions,
        created_at: now,
        updated_at: now,
      },
    ]);
    if (upsertErr) {
      return res.status(500).json({ error: 'profile_upsert_failed', details: upsertErr.message });
    }

    return res.status(201).json({ id: userId, email, name, role, permissions });
  } catch (e: any) {
    return res.status(500).json({ error: 'internal_error', details: e?.message });
  }
};
