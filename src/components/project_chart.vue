<script setup>
import Gantt from 'gantt-planner'
import { onMounted, ref } from 'vue'
import New_project_form from './new_project_form.vue'

const chartContainer = ref(null)
const sidebarContainer = ref(null)

let chartInstance = null
let tasks = []

const renderChart = () => {
    const height = sidebarContainer.value?.offsetHeight || 400

    if(chartContainer)
        chartContainer.value.innerHTML = ''

    chartInstance = new Gantt(chartContainer.value, tasks, {
        view_mode: 'Day',
        date_format: 'DD-MM-YYYY',
        scroll_to: 'today',
        container_height: `${height}`,
    })
}

const update = (t) => {
    tasks = t
    renderChart()
}

onMounted(() => {
    fetch('http://localhost:8080/api/tasks')
        .then(response => response.json())
        .then(data => {
            update(data)
        });

    //renderChart()

    const observer = new ResizeObserver(renderChart)
    observer.observe(chartContainer.value)
})

</script>

<template>
    <div class="two-column-layout">

        <div class="left-column">
            <div class="sidebar" ref="sidebarContainer">
                <New_project_form @created_project="update"></New_project_form>
            </div>
        </div>

        <div class="right-column">
            <div class="chart-area">
                <div ref="chartContainer"></div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.two-column-layout{
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
}

.left-column{
    width: 30%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
    border: 1px solid #ddd;
}

.right-column{
    width: 70%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
}

.sidebar{
    width: 100%;
    height: 100%;
}

.chart-area{
    height: 100%;
}
</style>