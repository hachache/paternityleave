/**
 * Décor d'arrière-plan sobre.
 * Isolé pour alléger App.tsx et garder le rendu purement décoratif.
 */
export function AuroraBackground() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      <div className="aurora-blob aurora-1 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      <div className="aurora-blob aurora-2 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      <div className="aurora-blob aurora-3 rounded-full mix-blend-multiply blur-3xl opacity-20"></div>
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
    </div>
  );
}
