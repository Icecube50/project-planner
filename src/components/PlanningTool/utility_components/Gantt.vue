<template>
    <div class="chart-area" ref="ganttArea">
        <div ref="ganttContainer"></div>
    </div>
</template>

<script setup>
import GanttChart from 'gantt-planner'
import { onMounted, ref, watch } from 'vue';

const props = defineProps(["model", "viewMode"])

const emit = defineEmits(['update:modelValue'])

const ganttArea = ref(null)
const ganttContainer = ref(null)
let instance = null

watch(() => props.model, (newVal) => {
    renderChart(newVal)
})

function renderChart(tasks){
    if(!tasks)
        tasks = []

    if(ganttContainer.value){
        ganttContainer.value.innerHTML = ''
    }

    const height = ganttArea.value?.offsetHeight || 400
    const options = {
        view_mode: 'Week',
        date_format: 'DD-MM-YYYY',
        scroll_to: 'today',
        container_height: `${height}`,
        on_date_change: onDateChange,
        bar_height: 15,
        view_mode_select: true,
    }

    if(props.viewMode){
        options.view_mode = `${props.viewMode}`
    }

    instance = new GanttChart(ganttContainer.value, tasks, options)
}

function onDateChange(args){

}

onMounted(() => {
    const observer = new ResizeObserver(() => {
        if(props.model)
            renderChart(props.model)
    })
    observer.observe(ganttArea.value)
})


</script>

<style scoped>
.chart-area{
    height: 100%;
}
</style>