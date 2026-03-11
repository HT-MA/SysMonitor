const API_BASE = 'http://localhost:8000/api';

async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error fetching ${endpoint}:`, error);
        throw error;
    }
}

async function postAPI(endpoint, data) {
    try {
        const response = await fetch(`${API_BASE}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error posting to ${endpoint}:`, error);
        throw error;
    }
}

const MonitorAPI = {
    getCPU: () => fetchAPI('/cpu'),
    getMemory: () => fetchAPI('/memory'),
    getProcesses: () => fetchAPI('/process'),
    getPorts: () => fetchAPI('/ports'),
    getSystem: () => fetchAPI('/system'),
    stopProcess: (pid) => postAPI('/process/stop', { pid }),
    killProcess: (pid) => postAPI('/process/kill', { pid })
};
