export default function WeeklySummary({ issues }) {
  const critical = issues.filter(
    i => i.weeksPersisted >= 3
  ).length;

  return (
    <div className="bg-zinc-950 p-6 rounded-2xl mb-8 border border-zinc-800">
      <h2 className="text-2xl font-bold text-white mb-3">
        Weekly Summary
      </h2>

      <div className="flex gap-6 text-zinc-300">
        <p>Total Issues: {issues.length}</p>
        <p>Critical: {critical}</p>
      </div>

      {critical > 0 && (
        <p className="text-red-500 mt-4">
          You are repeating the same mistakes. Fix them before applying again.
        </p>
      )}
    </div>
  );
}
