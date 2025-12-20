import { resolveIssue } from "../api/api";

export default function IssueCard({ issue, token, onResolved }) {
  const critical = issue.weeksPersisted >= 3;

  async function handleResolve() {
    await resolveIssue(issue._id, token);
    onResolved(issue._id);
  }

  return (
    <div className="bg-zinc-900 p-5 rounded-xl mb-4 border border-zinc-800">
      <h3 className="text-lg font-semibold text-white">
        {issue.category}
      </h3>

      <p className="text-sm text-zinc-400 mt-1">
        Repeated for {issue.weeksPersisted} week(s)
      </p>

      <div className="flex justify-between items-center mt-4">
        <span
          className={`px-3 py-1 text-sm rounded-full ${
            critical
              ? "bg-red-600 text-white"
              : "bg-yellow-500 text-black"
          }`}
        >
          {critical ? "Critical" : "Needs Improvement"}
        </span>

        <button
          onClick={handleResolve}
          className="text-sm bg-green-600 text-white px-4 py-1 rounded hover:bg-green-700"
        >
          Mark as Fixed
        </button>
      </div>
    </div>
  );
}
