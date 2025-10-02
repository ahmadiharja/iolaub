import { createClient } from '@supabase/supabase-js';

export function createSupabaseServiceClient() {
	const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string | undefined;
	const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string | undefined;
	if (!supabaseUrl || !serviceRoleKey) {
		throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
	}
	return createClient(supabaseUrl, serviceRoleKey, {
		auth: { autoRefreshToken: false, persistSession: false },
	});
}


