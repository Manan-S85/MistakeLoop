export default function Timeline({ timeline }) {
  return (
    <div className="mt-10">
      <h2 className="text-xl font-semibold text-white mb-4">
        Progress Timeline
      </h2>

      {timeline.map((week, index) => (
        <div
          key={index}
          className="bg-zinc-900 p-4 rounded-lg mb-3 border border-zinc-800"
        >
          <h4 className="text-white font-medium">
            Week {week.week}
          </h4>

          <ul className="list-disc list-inside text-zinc-400 mt-2">
            {week.issues.map((issue, i) => (
              <li key={i}>{issue}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
