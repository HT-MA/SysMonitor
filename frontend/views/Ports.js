const PortsView = {
    props: {
        data: {
            type: Array,
            default: () => []
        }
    },
    data() {
        return {
            searchQuery: '',
            filterProtocol: ''
        };
    },
    computed: {
        filteredData() {
            let result = [...this.data];
            
            if (this.searchQuery) {
                const query = this.searchQuery.toLowerCase();
                result = result.filter(item => 
                    item.process.toLowerCase().includes(query) ||
                    item.port.toString().includes(query)
                );
            }
            
            if (this.filterProtocol) {
                result = result.filter(item => item.protocol === this.filterProtocol);
            }
            
            return result;
        },
        protocolOptions() {
            const protocols = [...new Set(this.data.map(item => item.protocol))];
            return protocols;
        }
    },
    methods: {
        getProtocolTagType(protocol) {
            return protocol === 'TCP' ? 'primary' : 'success';
        }
    },
    template: `
        <div>
            <h2 class="card-title">Port Monitor</h2>
            <div class="card">
                <div style="margin-bottom: 20px; display: flex; gap: 15px; align-items: center;">
                    <el-input
                        v-model="searchQuery"
                        placeholder="Search by port or process"
                        style="width: 300px;">
                        <template #prefix>
                            <el-icon><search /></el-icon>
                        </template>
                    </el-input>
                    <el-select 
                        v-model="filterProtocol" 
                        placeholder="Filter by protocol"
                        clearable
                        style="width: 150px;">
                        <el-option
                            v-for="protocol in protocolOptions"
                            :key="protocol"
                            :label="protocol"
                            :value="protocol">
                        </el-option>
                    </el-select>
                </div>
                <el-table :data="filteredData" style="width: 100%">
                    <el-table-column prop="port" label="Port" width="100"></el-table-column>
                    <el-table-column prop="protocol" label="Protocol" width="100">
                        <template #default="{ row }">
                            <el-tag :type="getProtocolTagType(row.protocol)" size="small">
                                {{ row.protocol }}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="process" label="Process"></el-table-column>
                    <el-table-column prop="pid" label="PID" width="100"></el-table-column>
                </el-table>
                <div style="margin-top: 15px; color: #666;">
                    Showing {{ filteredData.length }} listening ports
                </div>
            </div>
        </div>
    `
};
