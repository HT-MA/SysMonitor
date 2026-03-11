const CpuChart = {
    props: {
        data: {
            type: Array,
            default: () => []
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
            if (!this.chart) return;
            
            const option = {
                title: {
                    text: 'CPU Usage History',
                    left: 'center',
                    textStyle: {
                        fontSize: 16,
                        fontWeight: 600
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: '{b}秒: {c}%'
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: this.data.map((_, index) => (index * 2).toString()),
                    axisLabel: {
                        formatter: '{value}s'
                    }
                },
                yAxis: {
                    type: 'value',
                    min: 0,
                    max: 100,
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                series: [{
                    name: 'CPU Usage',
                    type: 'line',
                    smooth: true,
                    data: this.data,
                    areaStyle: {
                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                            { offset: 0, color: 'rgba(102, 126, 234, 0.8)' },
                            { offset: 1, color: 'rgba(102, 126, 234, 0.1)' }
                        ])
                    },
                    lineStyle: {
                        color: '#667eea',
                        width: 2
                    },
                    itemStyle: {
                        color: '#667eea'
                    }
                }]
            };
            
            this.chart.setOption(option);
        }
    },
    template: `
        <div class="chart-container" ref="chart"></div>
    `
};
