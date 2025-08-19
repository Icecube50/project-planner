<template>
    <div class="resource-gantt-area">
        <div class="row-headers" ref="rowHeader">
            <div ref="rowSearch"></div>
            <div class="content-box" ref="contentBox">
                <div ref="rowContent"></div>
            </div>
        </div>
        <div class="chart-area" ref="ganttArea">
            <div ref="ganttContainer"></div>
        </div>
    </div>
</template>

<script setup>
import GanttChart from 'gantt-planner'
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    modelValue: {
        type: Object,
        required: true
    }
})

const emit = defineEmits(['update:modelValue'])

const ganttArea = ref(null)
const ganttContainer = ref(null)
const rowSearch = ref(null)
const rowContent = ref(null)
const rowHeader = ref(null)
const contentBox = ref(null)

const rowHeaderItems = ref([])
const chartData = ref([])
let instance = null

watch(() => props.modelValue, (newVal) => {

    const names = newVal.keys
    const chart = []

    for(let it of newVal.chart)
        chart.push(it.value)

    rowHeaderItems.value = names
    chartData.value = chart
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
        container_height: `${height}`,
        bar_height: 15,
    })

    createRowHeaders()
    syncScroll()
}

function createRowHeaders(){
    if(rowContent.value)
        rowContent.value.innerHTML = ''
    if(rowSearch.value)
        rowSearch.value.innerHTML = ''

    if(!instance || !ganttContainer.value)
        return

    const chartHeader = ganttContainer.value.getElementsByClassName('grid-header')[0]
    const chartHeaderHeight = chartHeader.offsetHeight

    rowSearch.value.style.height = `${chartHeaderHeight}px`
    rowContent.value.style.height = `${instance.getRowHeight() * instance.row_count}px`
    contentBox.value.style.height = `${ganttArea.value.offsetHeight - chartHeaderHeight}px`

    for (let index = 0; index < instance.row_count; index++){
        let row = document.createElement('div')
        row.style.position = 'relative'
        row.style.width = `${rowHeader.value.offsetWidth}px`
        row.style.height = `${instance.getRowHeight()}px`
        row.style.borderBottom = 'solid 1px #ebeff2'

        if(index < rowHeaderItems.value.length){
            let it = rowHeaderItems.value[index]
            let text = document.createElement('p')
            text.appendChild(document.createTextNode(it.name))
            text.style.padding = `${instance.options.padding / 2}px`
            text.style.textAlign = 'center'

            if(it.overCapacity)
                text.style.color = 'red'

            row.appendChild(text)
        }

        rowContent.value.appendChild(row)
    }
}

function syncScroll(){
    let ganttScroll = ganttContainer.value.getElementsByClassName('gantt-container')[0]
    let rowHeaderScroll = contentBox.value

    ganttScroll.onscroll = () => {
        let ganttScroll = ganttContainer.value.getElementsByClassName('gantt-container')[0]
        let rowHeaderScroll = contentBox.value

        rowHeaderScroll.scrollTop = ganttScroll.scrollTop
    }

    rowHeaderScroll.onscroll = () => {
        let ganttScroll = ganttContainer.value.getElementsByClassName('gantt-container')[0]
        let rowHeaderScroll = contentBox.value

        ganttScroll.scrollTop = rowHeaderScroll.scrollTop
    }
}

onMounted(() => {
    const observer = new ResizeObserver(() => {
        renderChart(chartData.value)
    })
    observer.observe(ganttArea.value)
})


</script>

<style scoped>
.resource-gantt-area{
    height: 100%;
    width: 100%;
}

.row-headers{
    width: 20%;
    float: left;
    height: 100%;
}

.content-box{
    overflow: auto;
    border-top: solid 1px #ebeff2;
    border-right: solid 1px #c7c7c7;
}

.chart-area{
    display: block;
    box-sizing: border-box;
    width: 80%;
    height: 100%;
    float: right;
}
</style>