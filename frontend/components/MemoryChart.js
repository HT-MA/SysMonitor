const MemoryChart = {
    props: {
        data: {
            type: Object,
            default: () => ({})
        }
    },
    data() {
        return {
            chart: null
        };
    },
    mounted() {
        this.initChart();
    },
    watch: {
        data: {
            handler() {
                this.updateChart();
            },
            deep: true
        }
    },
    methods: {
        initChart() {
            const chartDom = this.$refs.chart;
            this.chart = echarts.init(chartDom);
            this.updateChart();
            
            window.addEventListener('resize', () => {
                this.chart.resize();
            });
        },
        updateChart() {
            if (!this.chart || !this.data.percent) return;
            
            const option = {
                title: {
                    text: 'Memory Usage',
                    left: 'center',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 600
                    }
                },
                tooltip: {
                    formatter: '{a} <br/>{b}: {c}GB ({d}%)'
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['Used', 'Free']
                },
                series: [{
                    name: 'Memory',
                    type: 'pie',
                    radius: ['40%', '70%'],
                    avoidLabelOverlap: false,
                    itemStyle: {
                        borderRadius: 10,
                        borderColor: '#fff',
                        borderWidth: 2
                    },
                    label: {
                        show: true,
                        formatter: '{b}: {d}%'
                    },
                    emphasis: {
                        label: {
                            show: true,
                            fontSize: 16,
                            fontWeight: 'bold'
                        }
                    },
                    data: [
                        { 
                            value: (this.data.used / 1073741824).toFixed(2), 
                            name: 'Used',
                            itemStyle: { color: '#667eea' }
                        },
                        { 
                            value: (this.data.free / 1073741824).toFixed(2), 
                            name: 'Free',
                            itemStyle: { color: '#e0e0e0' }
                        }
                    ]
                }]
            };
            
            this.chart.setOption(option);
        }
    },
    template: `
        <div class="chart-container" ref="chart"></div>
    `
};
