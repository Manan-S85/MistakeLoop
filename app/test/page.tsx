"use client";
import { useState } from "react";

interface ApiResponse {
  error?: string;
  [key: string]: any;
}

export default function Test() {
  const [response, setResponse] = useState<ApiResponse | null>(null);

  async function testAPI() {
    try {
      const res = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          reflection: "I cleared OA but failed technical interview because I couldn't explain my project properly",
          email: "test@example.com",
          pastMistakes: ["Communication"]
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (error) {
      setResponse({ error: error instanceof Error ? error.message : 'Unknown error occurred' });
    }
  }

  return (
    <div className="p-6">
      <button
        onClick={testAPI}
        className="px-4 py-2 bg-black text-white rounded"
      >
        Test Backend
      </button>

      <pre className="mt-4 bg-gray-100 p-4">
        {JSON.stringify(response, null, 2)}
      </pre>
    </div>
  );
}
