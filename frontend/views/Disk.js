const DiskView = {
    props: {
        data: {
            type: Object,
            default: () => ({})
        },
        partitions: {
            type: Array,
            default: () => []
        }
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
            <h2 class="card-title">Disk Monitor</h2>
            <div class="card">
                <div class="info-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));">
                    <div class="info-card" style="background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);">
                        <div class="label">Total Disk</div>
                        <div class="value">{{ totalGB }}<span class="unit">GB</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">
                        <div class="label">Used</div>
                        <div class="value">{{ usedGB }}<span class="unit">GB</span></div>
                    </div>
                    <div class="info-card" style="background: linear-gradient(135deg, #30cfd0 0%, #330867 100%);">
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
            </div>
            <h3 class="card-title" style="margin-top: 20px;">Partitions</h3>
            <div class="card">
                <el-table :data="partitions" stripe style="width: 100%">
                    <el-table-column prop="device" label="Device" width="100"></el-table-column>
                    <el-table-column prop="mountpoint" label="Mount Point" width="120"></el-table-column>
                    <el-table-column prop="fstype" label="File System" width="100"></el-table-column>
                    <el-table-column label="Total (GB)" width="100">
                        <template #default="scope">
                            {{ (scope.row.total / 1073741824).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Used (GB)" width="100">
                        <template #default="scope">
                            {{ (scope.row.used / 1073741824).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Free (GB)" width="100">
                        <template #default="scope">
                            {{ (scope.row.free / 1073741824).toFixed(2) }}
                        </template>
                    </el-table-column>
                    <el-table-column label="Usage %" width="100">
                        <template #default="scope">
                            <el-progress :percentage="scope.row.percent" :stroke-width="10" :color="'#409eff'"></el-progress>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    `
};
