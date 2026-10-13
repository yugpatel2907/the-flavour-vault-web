import 'server-only';
import { createChatHandler } from '@/server/ai/agent';

export const runtime = 'nodejs';
export const maxDuration = 65;

// Keep the handler (and its concurrency guard) alive for this server instance.
export const POST = createChatHandler();
