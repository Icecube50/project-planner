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
import GanttChart, { ChartItemType } from 'gantt-planner'
import { createVNode, onMounted, readonly, ref, watch } from 'vue';

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

    const employees = []
    const chart = []

    for(let it of newVal.chart)
        chart.push(it)

    for(var it of newVal.keys){
        employees.push(it)
    }

    rowHeaderItems.value = employees
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
        readonly: true,
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

            let container = document.createElement('div')
            container.style.width = '100%'
            container.style.height = '100%'

            if(it.roles){
                let text = document.createElement('p')
                text.appendChild(document.createTextNode(it.name))
                text.style.textAlign = 'center'
                text.style.float = 'right'
                text.style.width = '70%'
                text.style.height = '100%'
                text.style.verticalAlign = 'middle'

                if(it.overCapacity)
                    text.style.color = 'red'

                let role = document.createElement('p')
                role.appendChild(document.createTextNode(it.roles[0]))
                role.style.textAlign = 'center'
                role.style.float = 'left'
                role.style.width = '30%'
                role.style.height = '100%'
                role.style.verticalAlign = 'middle'
                role.style.background = '#4CAF503F'
                role.style.color = '#4CAF50'
                
                container.appendChild(text)
                container.appendChild(role)
            }
            else{
                let text = document.createElement('p')
                text.appendChild(document.createTextNode(it))
                text.style.textAlign = 'center'
                text.style.width = '100%%'
                text.style.height = '100%'
                text.style.verticalAlign = 'middle'

                container.appendChild(text)
            }

            row.appendChild(container)
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