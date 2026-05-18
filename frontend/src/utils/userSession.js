const SESSION_KEY = 'shopmind_session';
const MAX_HISTORY = 10;

export function getUserSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : { searches: [], preferences: {} };
  } catch {
    return { searches: [], preferences: {} };
  }
}

export function addSearchToHistory(query) {
  const session = getUserSession();
  session.searches = [query, ...session.searches.filter(s => s !== query)].slice(0, MAX_HISTORY);
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function getRecentSearches() {
  return getUserSession().searches;
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}
