const NetworkView = {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        interfaces: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        totalSent() {
            return this.data.bytes_sent ? (this.data.bytes_sent / 1073741824).toFixed(2) : '0';
        },
        totalRecv() {
            return this.data.bytes_recv ? (this.data.bytes_recv / 1073741824).toFixed(2) : '0';
        }
    },
    template: `
        <div>
            <h2 class="card-title">Network Monitor</h2>
            <div class="card">
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div class="info-card" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);">
                        <div class="label">Bytes Sent</div>
                        <div class="value">{{ totalSent }}<span class="unit">GB</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);">
                        <div class="label">Bytes Received</div>
                        <div class="value">{{ totalRecv }}<span class="unit">GB</span></div>
                    </div>
                </div>
            </div>
            <h3 class="card-title" style="margin-top: 20px;">Network Interfaces</h3>
            <div class="card">
                <el-table :data="interfaces" stripe style="width: 100%">
                    <el-table-column prop="interface" label="Interface" width="150"></el-table-column>
                    <el-table-column label="Sent (MB)" width="120">
                        <template #default="scope">
                            {{ (scope.row.bytes_sent / 1048576).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Received (MB)" width="140">
                        <template #default="scope">
                            {{ (scope.row.bytes_recv / 1048576).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column prop="packets_sent" label="Packets Sent" width="120"></el-table-column>
                    <el-table-column prop="packets_recv" label="Packets Received" width="140"></el-table-column>
                    <el-table-column label="Errors" width="100">
                        <template #default="scope">
                            {{ scope.row.errin + scope.row.errout }}
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    `
};
