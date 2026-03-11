const InfoCard = {
    props: {
        label: String,
        value: [String, Number],
        unit: String,
        color: {
            type: String,
            default: '#667eea'
        }
    },
    template: `
        <div class="info-card" :style="{ background: color }">
            <div class="label">{{ label }}</div>
            <div class="value">
                {{ value }}<span class="unit">{{ unit }}</span>
            </div>
        </div>
    `
};
