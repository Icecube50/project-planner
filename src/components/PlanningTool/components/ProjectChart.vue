<template>
    <Gantt v-model="chartData"></Gantt>

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
import Gantt from '../utility_components/Gantt.vue';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import Create_Project from '@/components/Dialog/Create_Project.vue';

const chartData = ref([])
const createDialog = ref(false)

async function LoadChartData() {
    try{
        const today = Utils.to_string(Utils.today())
        const response = await api.get(`/api/projects/${today}`)
        if(response.status !== 200){
            chartData.value = []
            return;
        }

        const chartItems = []
        const query = response.data
        for(var row of query){
            chartItems.push(new ChartItem(
                row.project_name,
                ChartItemType.RESOURCE,
                row.sprint_name,
                row.sprint_start_date,
                row.sprint_end_date
            ))
        }

        chartData.value = chartItems

    }
    catch(error){
        console.log(error)
        chartData.value = []
    }
}

function onDialogOpen() {
    createDialog.value = true
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