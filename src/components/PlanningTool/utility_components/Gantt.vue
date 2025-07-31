<template>
    <div class="chart-area" ref="ganttArea">
        <!-- <div ref="ganttContainer"></div> -->
         <p>{{ chartData }}</p>
    </div>
</template>

<script setup>
import GanttChart from 'gantt-planner'
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    chart: {
        type: Object,
        required: true
    }
})

//const emit = defineEmits(['update:chart'])

const ganttArea = ref(null)
const ganttContainer = ref(null)
const chartData = ref([])

watch(() => props.chart, (newVal) => {
    chartData.value = newVal
    console.log("updated")
})

function renderChart(tasks){
    if(!tasks)
        tasks = []

    console.log(`render chart with ${tasks}`)
    const height = ganttArea.value?.offsetHeight || 400
    new GanttChart(ganttContainer.value, tasks, {
        view_mode: 'Day',
        date_format: 'DD-MM-YYYY',
        scroll_to: 'today',
        container_height: `${height}`
    })
}

onMounted(() => {
    // const observer = new ResizeObserver(() => {
    //     renderChart(model.value)
    // })
    // observer.observe(ganttArea.value)

    //chart.value = []
})


</script>

<style scoped>
.chart-area{
    height: 100%;
    width: 100%;
    color:aqua;
}
</style>