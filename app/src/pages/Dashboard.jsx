import { useEffect, useState } from "react";
import { fetchIssues, fetchTimeline } from "../api/api";
import IssueCard from "../components/IssueCard";
import WeeklySummary from "../components/WeeklySummary";
import Timeline from "../components/Timeline";

export default function Dashboard({ token }) {
    const [issues, setIssues] = useState([]);
    const [timeline, setTimeline] = useState([]);

    useEffect(() => {
        async function load() {
            try {
                const issuesData = await fetchIssues(token);
                const timelineData = await fetchTimeline(token);
                setIssues(issuesData);
                setTimeline(timelineData);
            } catch (error) {
                console.error('Failed to load dashboard data:', error);
            }
        }
        load();
    }, [token]);

    return (
        <div className="min-h-screen bg-black px-6 py-10">
            <div className="max-w-4xl mx-auto">
                <WeeklySummary issues={issues} />

                <h2 className="text-xl text-white mb-4">
                    Active Issues
                </h2>

                {issues.map(issue => (
                    <IssueCard
                        key={issue._id}
                        issue={issue}
                        token={token}
                        onResolved={(id) =>
                            setIssues(prev => prev.filter(i => i._id !== id))
                        }
                    />
                ))}
                {issues.length === 0 && (
                    <p className="text-green-500 mt-6">
                        All tracked issues resolved. You're ready to apply again 🚀
                    </p>
                )}



                <Timeline timeline={timeline} />
            </div>
        </div>
    );
}
