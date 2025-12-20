const BASE_URL = "http://localhost:5000";

export async function login(email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password })
  });
  return res.json();
}

export async function register(name, email, password) {
  const res = await fetch(`${BASE_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password })
  });
  return res.json();
}

export async function fetchIssues(token) {
  const res = await fetch(`${BASE_URL}/api/issues`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

export async function resolveIssue(issueId, token) {
  const res = await fetch(
    `${BASE_URL}/api/issues/${issueId}/resolve`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );

  return res.json();
}

export async function fetchTimeline(token) {
  const res = await fetch(`${BASE_URL}/api/timeline`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.json();
}

