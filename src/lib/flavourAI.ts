import type { MenuItem } from '../data/ambrociaMenu';
import type { CartAction } from './cartActions';

export interface OrderSummary {
  items: (MenuItem & { quantity: number; lineTotal: number })[];
  unavailable: string[]; subtotal: number; total: number; readyForCheckout: boolean;
}
export interface ToolOutput {
  items?: MenuItem[]; action?: CartAction;
  error?: { code: string; message: string };
  subtotal?: number; total?: number; readyForCheckout?: boolean; unavailable?: string[];
}
export type ChatEvent =
  | { type: 'text'; text: string }
  | { type: 'tool-state'; id: string; name: string }
  | { type: 'tool-result'; id: string; name: string; output: ToolOutput }
  | { type: 'error'; message: string }
  | { type: 'done' };

// Express adapts AI SDK fullStream into customer-facing events. Raw tool
// arguments and provider reasoning never reach the customer interface.
export async function readChatStream(response: Response, onEvent: (event: ChatEvent) => void) {
  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(body?.error || 'Flavour AI could not connect. Please try again.');
  }
  if (!response.body) throw new Error('The response was interrupted. Please try again.');
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let completed = false;
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let boundary;
      while ((boundary = buffer.indexOf('\n\n')) !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const data = frame.split('\n').find(line => line.startsWith('data: '));
        if (!data) continue;
        const event: ChatEvent = JSON.parse(data.slice(6));
        if (event.type === 'error') throw new Error(event.message);
        if (event.type === 'done') completed = true;
        onEvent(event);
      }
      if (done) break;
    }
    if (!completed) throw new Error('The response was interrupted. Please try again.');
  } finally { await reader.cancel().catch(() => {}); reader.releaseLock(); }
}
export const toolLabels: Record<string, string> = {
  search_menu: 'Finding dishes…', get_menu_item: 'Looking up that dish…',
  get_cart: 'Checking your cart…', add_to_cart: 'Adding that to your cart…',
  update_cart: 'Updating the quantity…', remove_from_cart: 'Removing that dish…',
  prepare_order: 'Preparing your order summary…',
};
