<template>
    <ResourceGantt :model="chartData" viewMode="Week"></ResourceGantt>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { Utils } from '@/util/date_utils';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import ResourceGantt from '../utility_components/ResourceGantt.vue';
import { Config } from '@/util/app_config';

const chartData = ref([])

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
                Config.getSprintColor(row.sprint_name)
            ))
            
            if(!chartKeys.has(row.project_name))
                chartKeys.set(row.project_name, `${row.customer_name} | ${row.project_name}`) 
        }

        chartData.value = { keys: Array.from(chartKeys.values()), chart: chartItems }
    }
    catch(error){
        console.log(error)
        chartData.value = { keys: [], chart: []}
    }
}

onMounted(() => {
    LoadChartData()
})

</script>