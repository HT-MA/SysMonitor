const MemoryView = {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        'memory-chart': MemoryChart
    },
    computed: {
        totalGB() {
            return this.data.total ? (this.data.total / 1073741824).toFixed(2) : '0';
        },
        usedGB() {
            return this.data.used ? (this.data.used / 1073741824).toFixed(2) : '0';
        },
        freeGB() {
            return this.data.free ? (this.data.free / 1073741824).toFixed(2) : '0';
        }
    },
    template: `
        <div>
            <h2 class="card-title">Memory Monitor</h2>
            <div class="card">
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div class="info-card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
                        <div class="label">Total Memory</div>
                        <div class="value">{{ totalGB }}<span class="unit">GB</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <div class="label">Used</div>
                        <div class="value">{{ usedGB }}<span class="unit">GB</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                        <div class="label">Free</div>
                        <div class="value">{{ freeGB }}<span class="unit">GB</span></div>
                    </div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill" :style="{ width: data.percent + '%' }"></div>
                </div>
                <div style="margin-top: 10px; text-align: center; color: #666;">
                    Usage: {{ data.percent?.toFixed(1) || '0' }}%
                </div>
                <memory-chart :data="data"></memory-chart>
            </div>
        </div>
    `
};
