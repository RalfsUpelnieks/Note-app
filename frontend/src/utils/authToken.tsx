export function GetStoredAuthToken() { return localStorage.getItem('token') };

export function StoreAuthToken(token) { localStorage.setItem('token', token); };

export function RemoveStoredAuthToken() { localStorage.removeItem('token') };