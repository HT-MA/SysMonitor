const CpuView = {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    components: {
        'cpu-chart': CpuChart
    },
    template: `
        <div>
            <h2 class="card-title">CPU Monitor</h2>
            <div class="card">
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div class="info-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <div class="label">Current Usage</div>
                        <div class="value">{{ data[data.length - 1]?.toFixed(1) || '0' }}<span class="unit">%</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <div class="label">Average (60s)</div>
                        <div class="value">{{ calculateAverage() }}<span class="unit">%</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <div class="label">Peak</div>
                        <div class="value">{{ calculatePeak() }}<span class="unit">%</span></div>
                    </div>
                </div>
                <cpu-chart :data="data"></cpu-chart>
            </div>
        </div>
    `,
    methods: {
        calculateAverage() {
            if (this.data.length === 0) return '0';
            const sum = this.data.reduce((a, b) => a + b, 0);
            return (sum / this.data.length).toFixed(1);
        },
        calculatePeak() {
            if (this.data.length === 0) return '0';
            return Math.max(...this.data).toFixed(1);
        }
    }
};
