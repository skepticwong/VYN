const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000';
const ADMIN_TOKEN = 'secret-admin-token';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: response.statusText }));
    throw new Error(error.detail || response.statusText);
  }
  return await response.json();
}

export async function fetchPosts() {
  return await request('/posts');
}

export async function fetchPolls() {
  return await request('/polls');
}

export async function likePost(postId) {
  return await request(`/posts/${postId}/like`, { method: 'POST' });
}

export async function commentPost(postId, comment) {
  return await request(`/posts/${postId}/comment`, { method: 'POST', body: JSON.stringify(comment) });
}

export async function votePoll(pollId, optionId) {
  return await request(`/polls/${pollId}/vote`, { method: 'POST', body: JSON.stringify({ option_id: optionId }) });
}

export async function deletePoll(pollId) {
  return await request(`/polls/${pollId}`, { method: 'DELETE', headers: { 'X-Admin-Token': ADMIN_TOKEN } });
}

export async function updatePost(postId, post) {
  return await request(`/posts/${postId}`, {
    method: 'PUT',
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
    body: JSON.stringify(post),
  });
}

export async function createPost(post) {
  return await request('/posts', {
    method: 'POST',
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
    body: JSON.stringify(post),
  });
}

export async function createPoll(poll) {
  return await request('/polls', {
    method: 'POST',
    headers: { 'X-Admin-Token': ADMIN_TOKEN },
    body: JSON.stringify(poll),
  });
}

export async function deletePost(postId) {
  return await request(`/posts/${postId}`, { method: 'DELETE', headers: { 'X-Admin-Token': ADMIN_TOKEN } });
}
