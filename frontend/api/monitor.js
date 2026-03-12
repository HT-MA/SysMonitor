const API_BASE = 'http://localhost:8001/api';

const _cache = {};

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    }
}

async function fetchAPI(endpoint, useCache = true) {
    const cacheKey = endpoint;
    if (useCache && _cache[cacheKey] && (Date.now() - _cache[cacheKey].timestamp < 1000)) {
        return _cache[cacheKey].data;
    }
    
    try {
        const response = await fetch(`${API_BASE}${endpoint}`);
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        if (useCache) {
            _cache[cacheKey] = { data, timestamp: Date.now() };
        }
        return data;
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
    getSystem: () => fetchAPI('/system', false),
    getNetwork: () => fetchAPI('/network'),
    getDisk: () => fetchAPI('/disk'),
    getNetworkInterfaces: () => fetchAPI('/network/interfaces'),
    getDiskPartitions: () => fetchAPI('/disk/partitions'),
    stopProcess: (pid) => postAPI('/process/stop', { pid }),
    killProcess: (pid) => postAPI('/process/kill', { pid }),
    
    throttledGetCPU: throttle(() => fetchAPI('/cpu', false), 2500),
    throttledGetMemory: throttle(() => fetchAPI('/memory', false), 2500),
    throttledGetNetwork: throttle(() => fetchAPI('/network', false), 2500)
};
