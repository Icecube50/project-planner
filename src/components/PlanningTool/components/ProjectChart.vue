<template>
    <ResourceGantt :model="chartData" viewMode="Week"></ResourceGantt>

    <v-fab 
        :absolute="true"
        :app="false"
        color="primary"
        location="bottom right"
        size="small"
        icon="mdi-plus"
        @click="onDialogOpen">
    </v-fab>
    

   <v-dialog 
        width="600"
        v-model="createDialog">
        <Create_Project @exit="onDialogExit"></Create_Project>
    </v-dialog>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Utils } from '@/util/date_utils';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import Create_Project from '@/components/Dialog/Create_Project.vue';
import ResourceGantt from '../utility_components/ResourceGantt.vue';

const chartData = ref([])
const createDialog = ref(false)

async function LoadChartData() {
    try{
        const today = Utils.to_string(Utils.today())
        const response = await api.get(`/api/projects/${today}`)
        if(response.status !== 200){
            chartData.value = { keys: [], chart: []}
            return;
        }

        const chartItems = []
        const chartKeys = new Map()
        const query = response.data
        for(var row of query){
            chartItems.push(new ChartItem(
                row.project_name,
                ChartItemType.RESOURCE,
                row.sprint_name,
                row.sprint_start_date,
                row.sprint_end_date,
                [],
                getSprintColor(row.sprint_name)
            ))
            
            if(!chartKeys.has(row.project_name))
                chartKeys.set(row.project_name, row.customer_name)
        }

        chartData.value = { keys: Array.from(chartKeys.values()), chart: chartItems }
    }
    catch(error){
        console.log(error)
        chartData.value = { keys: [], chart: []}
    }
}

function onDialogOpen() {
    createDialog.value = true
}

function getSprintColor(type){
    switch(type){
        case "KM ENG":
            return "Orange"
        case "KOS":
            return "Lime"
        case "Funktion":
            return "Yellow"
        case "I/O":
            return "Darkblue"
        case "Setup":
            return "Gainsboro"
        case "IBN":
            return "Aqua"
        case "I/O:OS":
            return "Grey"
        case "Setup:OS":
            return "Grey"
        case "IBN:OS":
            return "Grey"
    }
}

async function onDialogExit(result) {
    createDialog.value = false
    if(!result)
        return

    const response = await api.post(`api/projects/create`, {
        payload: result
    })

    if(response.status !== 200)
        return

    LoadChartData()
}

onMounted(() => {
    LoadChartData()
})

</script>