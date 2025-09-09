const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:3000/api';
// Baseurl/path { init = headers}
export async function clientApi (path, init = {}){
    const response = await fetch(`${BASE_URL}${path}`, {
        ...init,
        headers : {'Content-Type': 'application/json', ...(init.headers || {})}
    });
    if(!response.ok) throw new Error(`${response.status} - ${response.statusText} `);

    return response.json();
}