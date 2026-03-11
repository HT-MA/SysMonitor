const ProcessView = {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    emits: ['refresh'],
    data() {
        return {
            searchQuery: '',
            sortBy: 'cpu',
            sortOrder: 'descending',
            loading: false
        };
    },
    computed: {
        filteredData() {
            let result = [...this.data];
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(item => 
                    item.name.toLowerCase().includes(query) ||
                    item.pid.toString().includes(query)
                );
            }
            
            result.sort((a, b) => {
                let valA = a[this.sortBy];
                let valB = b[this.sortBy];
                
                if (this.sortOrder === 'ascending') {
                    return valA - valB;
                } else {
                    return valB - valA;
                }
            });
            
            return result;
        }
    },
    methods: {
        handleSort({ prop, order }) {
            this.sortBy = prop;
            this.sortOrder = order;
        },
        getStatusTagType(status) {
            const statusMap = {
                'running': 'success',
                'sleeping': 'info',
                'stopped': 'danger',
                'zombie': 'warning'
            };
            return statusMap[status] || 'info';
        },
        async handleKillProcess(pid, name) {
            try {
                await ElementPlus.ElMessageBox.confirm(
                    `Are you sure you want to kill process ${pid} (${name})? This action cannot be undone.`,
                    'Confirm Kill Process',
                    {
                        confirmButtonText: 'Kill',
                        cancelButtonText: 'Cancel',
                        type: 'error'
                    }
                );
                
                this.loading = true;
                const result = await MonitorAPI.killProcess(pid);
                
                if (result.success) {
                    ElementPlus.ElMessage({
                        type: 'success',
                        message: `kill ${name} success`
                    });
                    this.$emit('refresh');
                }
            } catch (error) {
                if (error !== 'cancel') {
                    ElementPlus.ElMessage({
                        type: 'error',
                        message: error.message || 'Failed to kill process'
                    });
                }
            } finally {
                this.loading = false;
            }
        }
    },
    template: `
        <div>
            <h2 class="card-title">Process Monitor</h2>
            <div class="card">
                <el-input
                    v-model="searchQuery"
                    placeholder="Search by name or PID"
                    style="width: 300px; margin-bottom: 20px;">
                    <template #prefix>
                        <el-icon><search /></el-icon>
                    </template>
                </el-input>
                <el-table 
                    :data="filteredData" 
                    style="width: 100%"
                    @sort-change="handleSort"
                    v-loading="loading">
                    <el-table-column 
                        prop="pid" 
                        label="PID" 
                        width="100" 
                        sortable>
                    </el-table-column>
                    <el-table-column 
                        prop="name" 
                        label="Name" 
                        sortable>
                        <template #default="{ row }">
                            <span v-if="row.protected" style="color: #f56c6c;">
                                <el-icon><lock /></el-icon>
                                {{ row.name }}
                            </span>
                            <span v-else>{{ row.name }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        prop="cpu" 
                        label="CPU %" 
                        width="120" 
                        sortable
                        :formatter="(row) => row.cpu.toFixed(2)">
                    </el-table-column>
                    <el-table-column 
                        prop="memory" 
                        label="Memory %" 
                        width="120" 
                        sortable
                        :formatter="(row) => row.memory.toFixed(2)">
                    </el-table-column>
                    <el-table-column 
                        prop="status" 
                        label="Status" 
                        width="120">
                        <template #default="{ row }">
                            <el-tag :type="getStatusTagType(row.status)" size="small">
                                {{ row.status }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column 
                        label="Action" 
                        width="100"
                        fixed="right">
                        <template #default="{ row }">
                            <el-button
                                type="danger"
                                size="small"
                                :disabled="row.protected || loading"
                                @click="handleKillProcess(row.pid, row.name)">
                                Kill
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div style="margin-top: 15px; color: #666;">
                    Showing {{ filteredData.length }} processes
                    <span v-if="filteredData.some(p => p.protected)" style="margin-left: 10px; color: #f56c6c;">
                        <el-icon><lock /></el-icon> Protected processes cannot be killed
                    </span>
                </div>
            </div>
        </div>
    `
};
