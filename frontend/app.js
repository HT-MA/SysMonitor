const { createApp } = Vue;

const app = createApp({
    data() {
        return {
            activeMenu: 'dashboard',
            dashboardData: {},
            cpuData: [],
            cpuHistory: [],
            memoryData: {},
            processData: [],
            portsData: [],
            systemData: {},
            refreshInterval: null,
            startTime: null
        };
    },
    mounted() {
        this.startTime = Date.now();
        this.fetchSystemData();
        this.fetchAllData();
        this.startAutoRefresh();
    },
    beforeUnmount() {
        this.stopAutoRefresh();
    },
    methods: {
        handleMenuSelect(index) {
            this.activeMenu = index;
        },
        async fetchAllData() {
            await Promise.all([
                this.fetchDashboardData(),
                this.fetchCpuData(),
                this.fetchMemoryData(),
                this.fetchProcessData(),
                this.fetchPortsData()
            ]);
            await this.fetchSystemData();
        },
        async fetchDashboardData() {
            try {
                const [cpu, memory, processes, ports] = await Promise.all([
                    MonitorAPI.getCPU(),
                    MonitorAPI.getMemory(),
                    MonitorAPI.getProcesses(),
                    MonitorAPI.getPorts()
                ]);
                
                this.dashboardData = {
                    cpu_percent: cpu?.cpu_percent,
                    memory_percent: memory?.percent,
                    process_count: processes?.length || 0,
                    port_count: ports?.length || 0,
                    uptime: this.calculateUptime()
                };
            } catch (error) {
                console.error('Failed to fetch dashboard data:', error);
            }
        },
        async fetchCpuData() {
            try {
                const cpu = await MonitorAPI.getCPU();
                if (cpu) {
                    this.cpuHistory.push(cpu.cpu_percent);
                    if (this.cpuHistory.length > 30) {
                        this.cpuHistory.shift();
                    }
                    this.cpuData = [...this.cpuHistory];
                }
            } catch (error) {
                console.error('Failed to fetch CPU data:', error);
            }
        },
        async fetchMemoryData() {
            try {
                const memory = await MonitorAPI.getMemory();
                if (memory) {
                    this.memoryData = memory;
                }
            } catch (error) {
                console.error('Failed to fetch memory data:', error);
            }
        },
        async fetchProcessData() {
            try {
                const processes = await MonitorAPI.getProcesses();
                if (processes) {
                    this.processData = processes;
                }
            } catch (error) {
                console.error('Failed to fetch process data:', error);
            }
        },
        async fetchPortsData() {
            try {
                const ports = await MonitorAPI.getPorts();
                if (ports) {
                    this.portsData = ports;
                }
            } catch (error) {
                console.error('Failed to fetch ports data:', error);
            }
        },
        async fetchSystemData() {
            try {
                const system = await MonitorAPI.getSystem();
                if (system) {
                    this.systemData = system;
                }
            } catch (error) {
                console.error('Failed to fetch system data:', error);
            }
        },
        calculateUptime() {
            const elapsed = Date.now() - this.startTime;
            const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
            return days;
        },
        startAutoRefresh() {
            this.refreshInterval = setInterval(() => {
                this.fetchAllData();
            }, 2000);
        },
        stopAutoRefresh() {
            if (this.refreshInterval) {
                clearInterval(this.refreshInterval);
                this.refreshInterval = null;
            }
        }
    }
});

app.use(ElementPlus);

const icons = ElementPlusIconsVue;
for (const [key, component] of Object.entries(icons)) {
    app.component(key, component);
}

app.component('dashboard-view', DashboardView);
app.component('cpu-view', CpuView);
app.component('memory-view', MemoryView);
app.component('process-view', ProcessView);
app.component('ports-view', PortsView);
app.component('system-view', SystemView);

app.mount('#app');
