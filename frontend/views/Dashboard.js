const DashboardView = {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        systemData: {
            type: Object,
            default: () => ({})
        }
    },
    components: {
        'info-card': InfoCard
    },
    computed: {
        memoryTotalGB() {
            return this.systemData.memory_total ? (this.systemData.memory_total / 1073741824).toFixed(2) : '0';
        }
    },
    template: `
        <div>
            <h2 class="card-title">System Overview</h2>
            <div class="info-grid">
                <info-card 
                    label="CPU Usage" 
                    :value="data.cpu_percent?.toFixed(1) || '0'" 
                    unit="%"
                    color="linear-gradient(135deg, #667eea 0%, #764ba2 100%)">
                </info-card>
                <info-card 
                    label="Memory Usage" 
                    :value="data.memory_percent?.toFixed(1) || '0'" 
                    unit="%"
                    color="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)">
                </info-card>
                <info-card 
                    label="Processes" 
                    :value="data.process_count || 0" 
                    unit=""
                    color="linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)">
                </info-card>
                <info-card 
                    label="Ports" 
                    :value="data.port_count || 0" 
                    unit=""
                    color="linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)">
                </info-card>
                <info-card 
                    label="Uptime" 
                    :value="data.uptime || '0'" 
                    unit="days"
                    color="linear-gradient(135deg, #fa709a 0%, #fee140 100%)">
                </info-card>
            </div>
            
            <div class="card" style="margin-top: 20px;">
                <h3 style="margin-bottom: 20px; color: #333; font-size: 18px; font-weight: 600;">Hardware & System Information</h3>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div style="padding: 20px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px; color: white; margin-bottom: 20px;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">Operating System</div>
                            <div style="font-size: 20px; font-weight: 700;">{{ systemData.os || 'Unknown' }}</div>
                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div style="padding: 20px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: 12px; color: white; margin-bottom: 20px;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">Hostname</div>
                            <div style="font-size: 20px; font-weight: 700;">{{ systemData.hostname || 'Unknown' }}</div>
                        </div>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <div style="padding: 20px; background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); border-radius: 12px; color: white; margin-bottom: 20px;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">CPU Model</div>
                            <div style="font-size: 16px; font-weight: 600;">{{ systemData.cpu_model || 'Unknown' }}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div style="padding: 20px; background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%); border-radius: 12px; color: white; margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">CPU Cores</div>
                            <div style="font-size: 32px; font-weight: 700;">{{ systemData.cpu_cores || 0 }}</div>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div style="padding: 20px; background: linear-gradient(135deg, #fa709a 0%, #fee140 100%); border-radius: 12px; color: white; margin-bottom: 20px; text-align: center;">
                            <div style="font-size: 14px; opacity: 0.9; margin-bottom: 10px;">Total Memory</div>
                            <div style="font-size: 32px; font-weight: 700;">{{ memoryTotalGB }} GB</div>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>
    `
};
