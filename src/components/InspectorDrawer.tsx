import { useEffect, useState } from 'react';
import { Database, ChevronDown, ChevronUp, X, Trash2 } from 'lucide-react';
import { subscribeInspector, clearInspector } from '@/lib/inspectorStore';
import type { InspectorEntry } from '@/types';

export default function InspectorDrawer() {
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState<InspectorEntry[]>([]);

  useEffect(() => {
    return subscribeInspector(setEntries);
  }, []);

  const methodColor: Record<string, string> = {
    GET: 'text-blue-600 bg-blue-50',
    POST: 'text-emerald-600 bg-emerald-50',
    PUT: 'text-amber-600 bg-amber-50',
    PATCH: 'text-purple-600 bg-purple-50',
    DELETE: 'text-red-600 bg-red-50',
  };

  return (
    <>
      {/* Toggle bar */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-0 right-4 z-40 bg-slate-800 text-white rounded-t-lg px-4 py-2 shadow-lg flex items-center gap-2 text-sm font-medium hover:bg-slate-700 transition-colors"
      >
        <Database className="w-4 h-4" />
        MongoDB Inspector
        {entries.length > 0 && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {entries.length}
          </span>
        )}
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
      </button>

      {/* Drawer */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-30 bg-slate-900 border-t border-slate-700 transition-transform duration-300 ${
          open ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ height: '42vh' }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-4 py-2 border-b border-slate-700">
            <div className="flex items-center gap-2 text-slate-200">
              <Database className="w-4 h-4 text-emerald-400" />
              <span className="text-sm font-semibold">Live MongoDB Update Inspector</span>
            </div>
            <div className="flex items-center gap-2">
              {entries.length > 0 && (
                <button
                  onClick={clearInspector}
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              )}
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {entries.length === 0 ? (
              <div className="text-slate-500 text-sm text-center py-12">
                No MongoDB operations yet. Log a food or edit a target to see live updates here.
              </div>
            ) : (
              entries.map((e) => (
                <div
                  key={e.id}
                  className="bg-slate-800 rounded-lg p-3 border border-slate-700 text-sm"
                >
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${methodColor[e.method] || 'text-slate-300 bg-slate-700'}`}>
                      {e.method}
                    </span>
                    <code className="text-slate-300 text-xs">{e.url}</code>
                    <span className="text-slate-500 text-xs ml-auto">
                      {new Date(e.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-emerald-400 text-xs font-semibold font-mono">{e.operator}</span>
                  </div>
                  <pre className="bg-slate-950 rounded p-2 text-xs text-emerald-300 overflow-x-auto max-h-48 font-mono">
                    {JSON.stringify(e.data, null, 2)}
                  </pre>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
