import { useState, useEffect, useRef, ChangeEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Save, Trash2, Terminal, FileText, Plus, ChevronRight } from "lucide-react";

export function DevNotes() {
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<string>(() => {
    return localStorage.getItem("dev_notes") || "";
  });
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Alt + Shift + N
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.key === "N") {
        setIsOpen((prev) => !prev);
      }
    };

    const handleOpenNotes = () => setIsOpen(true);

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-dev-notes", handleOpenNotes);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-dev-notes", handleOpenNotes);
    };
  }, []);

  useEffect(() => {
    if (isOpen && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem("dev_notes", notes);
    setIsSaved(true);
  };

  const handleClear = () => {
    if (window.confirm("Are you sure you want to clear all notes?")) {
      setNotes("");
      localStorage.removeItem("dev_notes");
      setIsSaved(true);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setNotes(e.target.value);
    setIsSaved(false);
  };

  return (
    <>
      {/* Hidden Trigger: Click the bot name in footer 5 times (implemented in Footer) */}
      {/* For now, just a keyboard shortcut or a very subtle button in the corner */}
      <div 
        className="fixed bottom-4 right-4 z-50 opacity-0 hover:opacity-10 transition-opacity cursor-pointer p-2"
        onClick={() => setIsOpen(true)}
        title="Dev Notes (Alt+Shift+N)"
      >
        <Terminal className="w-4 h-4 text-white/20" />
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 z-[101] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-zinc-900/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-white tracking-wide">Personal Notes</h2>
                    <p className="text-xs text-gray-500 font-mono">Stored locally in your browser</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-grow p-6 flex flex-col gap-4">
                <div className="relative flex-grow group">
                  <div className="absolute -inset-1 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
                  <textarea
                    ref={textareaRef}
                    value={notes}
                    onChange={handleChange}
                    placeholder="Type your notes here... (Auto-saves to local storage)"
                    className="relative w-full h-full bg-zinc-900/50 border border-white/5 rounded-xl p-4 text-gray-300 font-mono text-sm resize-none focus:outline-none focus:border-primary/30 transition-all placeholder:text-gray-700"
                  />
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSave}
                    disabled={isSaved}
                    className={`flex-grow flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      isSaved 
                        ? "bg-zinc-800 text-gray-500 cursor-default" 
                        : "bg-primary text-black hover:scale-[1.02] active:scale-[0.98]"
                    }`}
                  >
                    <Save className="w-4 h-4" />
                    {isSaved ? "Saved" : "Save Changes"}
                  </button>
                  <button
                    onClick={handleClear}
                    className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-all group"
                    title="Clear All"
                  >
                    <Trash2 className="w-5 h-5 text-red-500 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Footer Info */}
              <div className="p-4 border-t border-white/5 bg-zinc-900/30">
                <div className="flex items-center justify-between text-[10px] uppercase tracking-widest font-bold text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Private Session</span>
                  </div>
                  <span>{notes.length} characters</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
