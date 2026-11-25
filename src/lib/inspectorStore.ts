import type { InspectorEntry } from '@/types';

type Listener = (entries: InspectorEntry[]) => void;

let entries: InspectorEntry[] = [];
const listeners = new Set<Listener>();
const MAX = 12;

export function getInspectorEntries(): InspectorEntry[] {
  return entries;
}

export function subscribeInspector(fn: Listener): () => void {
  listeners.add(fn);
  fn(entries);
  return () => {
    listeners.delete(fn);
  };
}

export function pushInspectorEntry(entry: InspectorEntry): void {
  entries = [entry, ...entries].slice(0, MAX);
  listeners.forEach((l) => l(entries));
}

export function clearInspector(): void {
  entries = [];
  listeners.forEach((l) => l(entries));
}
