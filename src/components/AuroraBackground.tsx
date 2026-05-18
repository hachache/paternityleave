/**
 * Décor d'arrière-plan : auroras animées et particules thématiques.
 * Isolé pour alléger App.tsx et garder le rendu purement décoratif.
 */
export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="aurora-blob aurora-1 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      <div className="aurora-blob aurora-2 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      <div className="aurora-blob aurora-3 rounded-full mix-blend-multiply blur-3xl opacity-40"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>

      <div
        className="absolute top-[15%] left-[10%] text-4xl opacity-[0.08] animate-float blur-[1px] select-none"
        style={{ animationDelay: '0s' }}
        aria-hidden="true"
      >
        🍼
      </div>
      <div
        className="absolute top-[25%] right-[15%] text-3xl opacity-[0.06] animate-float blur-[1px] select-none"
        style={{ animationDelay: '2.5s' }}
        aria-hidden="true"
      >
        🧸
      </div>
      <div
        className="absolute bottom-[20%] left-[20%] text-5xl opacity-[0.05] animate-float blur-[2px] select-none"
        style={{ animationDelay: '4s' }}
        aria-hidden="true"
      >
        ✨
      </div>
      <div
        className="absolute bottom-[30%] right-[10%] text-4xl opacity-[0.07] animate-float blur-[1px] select-none"
        style={{ animationDelay: '1.5s' }}
        aria-hidden="true"
      >
        👶
      </div>
      <div
        className="absolute top-[40%] left-[50%] text-2xl opacity-[0.06] animate-float blur-[1px] select-none"
        style={{ animationDelay: '3s' }}
        aria-hidden="true"
      >
        📅
      </div>
    </div>
  );
}
