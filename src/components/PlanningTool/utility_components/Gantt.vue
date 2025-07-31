<template>
    <div class="chart-area" ref="ganttArea">
        <div ref="ganttContainer"></div>
    </div>
</template>

<script setup>
import GanttChart from 'gantt-planner'
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Array,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const ganttArea = ref(null)
const ganttContainer = ref(null)
const chartData = ref([])
let instance = null

watch(() => props.modelValue, (newVal) => {
    chartData.value = newVal
    renderChart(chartData.value)
})

function renderChart(tasks){
    if(!tasks)
        tasks = []

    if(ganttContainer.value){
        ganttContainer.value.innerHTML = ''
    }

    const height = ganttArea.value?.offsetHeight || 400
    instance = new GanttChart(ganttContainer.value, tasks, {
        view_mode: 'Day',
        date_format: 'DD-MM-YYYY',
        scroll_to: 'today',
        container_height: `${height}`
    })
}

onMounted(() => {
    const observer = new ResizeObserver(() => {
        renderChart(chartData.value)
    })
    observer.observe(ganttArea.value)
})


</script>

<style scoped>
.chart-area{
    height: 100%;
}
</style>