'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Bot, X, Sparkles, Flame, Plus, Send, User, Loader2, ShoppingBag, Square } from 'lucide-react';
import { MenuItem } from '@/data/ambrociaMenu';
import { useCart } from '@/context/CartContext';
import { readChatStream, toolLabels, ToolOutput, OrderSummary } from '@/lib/flavourAI';

interface AIRecommenderProps { isOpen: boolean; onClose: () => void }
interface Message {
  id: string; role: 'user' | 'assistant'; text: string; finished?: boolean;
  tools: { id: string; name: string; output?: ToolOutput; receipt?: string }[];
}
interface History { role: 'user' | 'assistant'; content: string }
const prompts = ['Something spicy under ₹400', 'Vegetarian dinner', 'Build a meal for two', 'Help me choose'];

function RecommendationCard({ item, disabled, onAdd }: { item: MenuItem; disabled: boolean; onAdd: () => void }) {
  return <article className="rounded-2xl border border-gold/20 bg-[#0A0A0C]/90 p-4 flex flex-col gap-2">
    <div className="flex items-start justify-between gap-3">
      <h3 className="font-serif font-bold text-gold-light">{item.name}</h3>
      <span className="font-serif text-gold whitespace-nowrap">₹{item.price}</span>
    </div>
    <p className="text-[11px] text-gold-muted capitalize">{item.category.replace(/-/g, ' ')} · {item.isVeg === null ? 'Dietary details unavailable' : item.isVeg ? 'Vegetarian' : 'Non-vegetarian'}</p>
    {item.description && <p className="text-xs leading-relaxed text-gold-light/80">{item.description}</p>}
    {item.spicyLevel && <span className="flex items-center gap-1 text-xs text-saffron"><Flame size={12} />{['Mild', 'Medium', 'Hot'][item.spicyLevel - 1]}</span>}
    <button disabled={disabled} onClick={onAdd} className="mt-auto rounded-xl border border-gold/30 py-2 text-xs text-gold hover:bg-gold/10 disabled:opacity-40 flex items-center justify-center gap-2"><Plus size={14} /> Add to Cart</button>
  </article>;
}

function Recommendations({ items, busy, onAdd }: { items: MenuItem[]; busy: boolean; onAdd: (item: MenuItem) => void }) {
  const [expanded, setExpanded] = useState(false);
  return <div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">{(expanded ? items : items.slice(0, 6)).map(item => <RecommendationCard key={item.id} item={item} disabled={busy} onAdd={() => onAdd(item)} />)}</div>
    {items.length > 6 && <button onClick={() => setExpanded(!expanded)} className="mt-3 text-xs text-gold underline">{expanded ? 'Show fewer dishes' : `Show all ${items.length} dishes`}</button>}
  </div>;
}

export default function AIRecommender({ isOpen, onClose }: AIRecommenderProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const history = useRef<History[]>([]);
  const busyRef = useRef(false);
  const controller = useRef<AbortController | null>(null);
  const panel = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const end = useRef<HTMLDivElement>(null);
  const { cart, totalItems, totalAmount, getCartSnapshot, applyAIAction, refreshCartMenu, addToCart, setIsCartOpen } = useCart();

  const close = () => { controller.current?.abort(); onClose(); };
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    inputRef.current?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { controller.current?.abort(); onClose(); }
      if (event.key !== 'Tab') return;
      const focusable = panel.current?.querySelectorAll<HTMLElement>('button:not(:disabled), input:not(:disabled)');
      if (!focusable?.length) return;
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard);
    return () => { document.body.style.overflow = overflow; document.removeEventListener('keydown', keyboard); previous?.focus(); };
  }, [isOpen, onClose]);
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }); }, [messages, busy]);
  useEffect(() => () => controller.current?.abort(), []);

  const updateMessage = (id: string, update: (message: Message) => Message) =>
    setMessages(previous => previous.map(message => message.id === id ? update(message) : message));

  async function run(text?: string) {
    if (busyRef.current || (text !== undefined && !text.trim())) return;
    busyRef.current = true;
    setBusy(true); setError(''); setInput('');
    const abort = new AbortController(); controller.current = abort;
    if (text !== undefined) {
      history.current.push({ role: 'user', content: text.trim() });
      setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'user', text: text.trim(), tools: [] }]);
    }
    try {
      // Each continuation sends the latest CartContext snapshot. Pause after
      // every approved mutation, apply it once, then report the browser receipt.
      for (let continuation = 0; continuation < 8; continuation++) {
        const id = crypto.randomUUID();
        let responseText = '';
        const facts: string[] = [];
        let acted = false;
        setMessages(previous => [...previous, { id, role: 'assistant', text: '', tools: [] }]);
        try {
          const response = await fetch('/api/ai/chat', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: abort.signal,
            body: JSON.stringify({ messages: history.current, cart: getCartSnapshot() }),
          });
          await readChatStream(response, event => {
            if (event.type === 'text') {
              responseText += event.text;
              updateMessage(id, message => ({ ...message, text: responseText }));
            }
            if (event.type === 'tool-state') {
              updateMessage(id, message => ({ ...message, tools: message.tools.some(tool => tool.id === event.id) ? message.tools : [...message.tools, { id: event.id, name: event.name }] }));
            }
            if (event.type === 'tool-result') {
              let receipt: string | undefined;
              if (['get_cart', 'prepare_order'].includes(event.name) && event.output.items) refreshCartMenu(event.output.items);
              if (event.output.action) {
                const result = applyAIAction(event.output.action);
                acted = true;
                receipt = result.message;
                // Save immediately, including if the connection drops afterward.
                history.current.push({ role: 'assistant', content: `Browser cart receipt: ${event.name} itemId=${event.output.action.item.id} quantity=${event.output.action.quantity ?? 'removed'} success=${result.success}. ${result.message}. Inspect get_cart before continuing; do not repeat a successful action.` });
              } else {
                facts.push(`${event.name}: ${JSON.stringify(event.output).slice(0, 8000)}`);
              }
              updateMessage(id, message => ({ ...message, tools: [...message.tools.filter(tool => tool.id !== event.id), { id: event.id, name: event.name, output: event.output, receipt }] }));
            }
          });
        } finally {
          updateMessage(id, message => ({ ...message, finished: true }));
          const content = [responseText, ...facts].filter(Boolean).join('\n');
          if (content) history.current.push({ role: 'assistant', content: content.slice(0, 12000) });
        }
        if (!acted) return;
      }
      throw new Error('Your cart has been updated. Please review it before asking for more changes.');
    } catch (caught) {
      setError(abort.signal.aborted ? 'Response stopped. Your completed cart changes are saved.' : caught instanceof Error ? caught.message : 'Something went wrong. Please try again.');
    } finally {
      busyRef.current = false; setBusy(false); controller.current = null;
      inputRef.current?.focus();
    }
  }

  const checkout = () => { close(); setIsCartOpen(true); };
  const addCard = (item: MenuItem) => {
    if (busyRef.current) return;
    const current = getCartSnapshot().find(line => line.itemId === item.id)?.quantity || 0;
    if (current >= 50) { setError('Maximum quantity is 50 per dish.'); return; }
    addToCart(item, 1, false);
    const content = `Added one ${item.name} (item ID ${item.id}) using Add to Cart. Its current quantity is ${current + 1}.`;
    history.current.push({ role: 'user', content: `Add one ${item.name} (item ID ${item.id}) to my cart.` }, { role: 'assistant', content });
    setMessages(previous => [...previous, { id: crypto.randomUUID(), role: 'assistant', text: content.replace(/ \(item ID .*?\)/, ''), tools: [] }]);
    setError('');
  };
  if (!isOpen) return null;
  return <div className="fixed inset-0 z-50 bg-[#0A0A0C]/90 backdrop-blur-xl p-2 sm:p-4 flex items-center justify-center font-sans animate-fade-in" onClick={event => { if (event.target === event.currentTarget) close(); }}>
    <div ref={panel} role="dialog" aria-modal="true" aria-labelledby="flavour-ai-title" className="w-full max-w-3xl h-[92dvh] sm:h-[85dvh] flex flex-col rounded-3xl border-2 border-gold/40 bg-[#120F16]/95 shadow-2xl text-gold-light overflow-hidden">
      <header className="flex items-center gap-3 p-4 sm:p-6 border-b border-gold/20 shrink-0">
        <div className="p-3 rounded-2xl bg-gold/10 border border-gold/30"><Bot className="text-gold" size={22} /></div>
        <div className="flex-1 min-w-0"><h2 id="flavour-ai-title" className="font-serif text-xl font-bold text-gold-gradient tracking-wider">FLAVOUR AI</h2><p className="text-xs text-gold-muted">Your culinary assistant</p></div>
        <button disabled={busy} onClick={() => { history.current = []; setMessages([]); setError(''); setInput(''); inputRef.current?.focus(); }} className="text-xs text-gold-muted hover:text-gold disabled:opacity-40">New chat</button>
        <button aria-label="Close Flavour AI" onClick={close} className="p-2 rounded-full border border-gold/30 hover:bg-gold/10"><X size={18} /></button>
      </header>
      <div className="flex-1 overflow-y-auto overscroll-contain p-4 sm:p-6 space-y-5" role="log" aria-label="Flavour AI conversation" aria-live="polite" aria-relevant="additions text">
        {messages.length === 0 && <div className="py-6 sm:py-12 text-center">
          <Sparkles className="mx-auto text-saffron mb-4" size={28} />
          <h3 className="font-serif text-2xl text-gold-gradient">What are you craving?</h3>
          <p className="text-sm text-gold-muted mt-3 mb-6 max-w-sm mx-auto">Discover dishes from our menu, build a meal, or ask me to help with your cart.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">{prompts.map(prompt => <button key={prompt} onClick={() => void run(prompt)} className="text-sm rounded-xl border border-gold/30 px-4 py-3 bg-[#1A1624] hover:bg-gold/10">{prompt}</button>)}</div>
        </div>}
        {messages.map(message => <div key={message.id} className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
          <div className="shrink-0 pt-3">{message.role === 'user' ? <User size={18} className="text-gold-muted" /> : <Bot size={18} className="text-saffron" />}</div>
          <div className={`min-w-0 w-full rounded-2xl p-4 border ${message.role === 'user' ? 'bg-gold/10 border-gold/20 max-w-[85%]' : 'bg-[#1A1624]/90 border-gold/20'}`}>
            <span className="sr-only">{message.role === 'user' ? 'You' : 'Flavour AI'}: </span>
            {message.text && <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{message.text}</p>}
            {!message.text && !message.tools.length && busy && !message.finished && <span className="flex items-center gap-2 text-xs text-gold-muted"><Loader2 className="animate-spin" size={14} /> Thinking about your meal…</span>}
            {message.tools.map(tool => <div key={tool.id} className="mt-3 space-y-3">
              <p className="text-xs text-gold-muted flex items-center gap-2">
                {!tool.output && busy && !message.finished && <Loader2 size={12} className="animate-spin" />}
                {tool.output ? tool.receipt || (tool.output.error ? tool.output.error.message : tool.name === 'search_menu' ? `${tool.output.items?.length || 0} dishes found` : tool.name === 'get_menu_item' ? 'Menu details found' : tool.name === 'prepare_order' ? 'Order summary prepared' : 'Cart checked') : busy && !message.finished ? toolLabels[tool.name] || 'Working on your request…' : 'Action interrupted'}
              </p>
              {['search_menu', 'get_menu_item'].includes(tool.name) && tool.output?.items && <Recommendations items={tool.output.items} busy={busy} onAdd={addCard} />}
              {['get_cart', 'prepare_order'].includes(tool.name) && tool.output?.items && <div className="rounded-xl border border-gold/20 p-3 text-sm space-y-2">
                {(tool.output as OrderSummary).items.map(item => <div key={item.id} className="flex justify-between gap-2"><span>{item.quantity} × {item.name}</span><span className="whitespace-nowrap">₹{item.lineTotal}</span></div>)}
                {!tool.output.items.length && <p>Your cart is empty.</p>}
                {!!tool.output.unavailable?.length && <p className="text-rose-300">Some cart items are unavailable. Please review your cart.</p>}
                <div className="flex justify-between font-serif text-gold border-t border-gold/20 pt-2"><span>Subtotal</span><span>₹{tool.output.subtotal}</span></div>
                {tool.name === 'prepare_order' && tool.output.readyForCheckout && <button onClick={checkout} disabled={busy || cart.length === 0} className="w-full rounded-xl p-3 bg-gradient-to-r from-saffron to-gold text-[#0A0A0C] font-bold disabled:opacity-40">Review & checkout</button>}
              </div>}
            </div>)}
          </div>
        </div>)}
        <div ref={end} />
      </div>
      <footer className="p-4 sm:px-6 border-t border-gold/20 shrink-0 space-y-3">
        {error && <div role="alert" className="rounded-xl border border-rose-400/30 p-3 text-xs text-rose-200">{error}<button disabled={busy} onClick={() => void run()} className="underline ml-2 disabled:opacity-40">Retry</button></div>}
        <div className="flex justify-between gap-2 text-xs text-gold-muted"><span>{totalItems} items · ₹{totalAmount}</span><button onClick={checkout} className="flex items-center gap-1 text-gold"><ShoppingBag size={13} /> View cart</button></div>
        <form onSubmit={event => { event.preventDefault(); void run(input); }} className="flex gap-2">
          <input ref={inputRef} value={input} onChange={event => setInput(event.target.value)} disabled={busy} maxLength={2000} aria-label="Ask Flavour AI" placeholder="Tell me what you’re craving…" className="flex-1 min-w-0 rounded-xl border border-gold/30 bg-[#0A0A0C] px-4 py-3 text-base sm:text-sm outline-none focus:border-gold disabled:opacity-50" />
          {busy ? <button type="button" aria-label="Stop response" onClick={() => controller.current?.abort()} className="p-3 rounded-xl border border-gold/30 text-gold"><Square size={18} /></button> : <button type="submit" disabled={!input.trim()} aria-label="Send message" className="rounded-xl p-3 bg-gradient-to-r from-saffron to-gold text-[#0A0A0C] disabled:opacity-40"><Send size={18} /></button>}
        </form>
        <p className="text-[10px] text-gold-muted/80">Please confirm allergies with the restaurant. Checkout is a demo; no orders are sent or saved.</p>
      </footer>
    </div>
  </div>;
}
