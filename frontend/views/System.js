const SystemView = {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    computed: {
        memoryTotalGB() {
            return this.data.memory_total ? (this.data.memory_total / 1073741824).toFixed(2) : '0';
        }
    },
    template: `
        <div>
            <h2 class="card-title">System Information</h2>
            <div class="card">
                <div class="system-info-item">
                    <span class="system-info-label">Operating System</span>
                    <span class="system-info-value">{{ data.os || 'Unknown' }}</span>
                </div>
                <div class="system-info-item">
                    <span class="system-info-label">Hostname</span>
                    <span class="system-info-value">{{ data.hostname || 'Unknown' }}</span>
                </div>
                <div class="system-info-item">
                    <span class="system-info-label">CPU Model</span>
                    <span class="system-info-value">{{ data.cpu_model || 'Unknown' }}</span>
                </div>
                <div class="system-info-item">
                    <span class="system-info-label">CPU Cores</span>
                    <span class="system-info-value">{{ data.cpu_cores || 0 }}</span>
                </div>
                <div class="system-info-item">
                    <span class="system-info-label">Total Memory</span>
                    <span class="system-info-value">{{ memoryTotalGB }} GB</span>
                </div>
            </div>
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 15px; color: #333;">System Status</h3>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">CPU Cores</div>
                            <div style="font-size: 32px; font-weight: 700; color: #667eea;">{{ data.cpu_cores || 0 }}</div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="padding: 20px; background: #f8f9fa; border-radius: 8px; text-align: center;">
                            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">Total Memory</div>
                            <div style="font-size: 32px; font-weight: 700; color: #f5576c;">{{ memoryTotalGB }} GB</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    `
};
