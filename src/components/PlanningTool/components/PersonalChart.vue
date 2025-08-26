<template>
    <ResourceGantt v-model="chartData"></ResourceGantt>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import ResourceGantt from '../utility_components/ResourceGantt.vue';
import { AuthStore } from '@/store/auth_store';

const chartData = ref({ keys: [], chart: [] })

async function LoadChartData() {
    try{
        const authStore = AuthStore()
        const chartItems = []
        const chartKeys = []

        const response = await api.get(`/api/assignments/${authStore.user.employee_id}`)
        if(response.status !== 200){
            chartData.value = { keys: [], chart: [] }
            return;
        }

        for(var task of response.data.tasks){
            chartItems.push(new ChartItem(
                task.task_id,
                ChartItemType.RESOURCE,
                task.name,
                task.startDate,
                task.endDate
            ))
        }


        for(var vacation of response.data.vacations){
             chartItems.push(new ChartItem(
                "Vacation",
                ChartItemType.RESOURCE,
                "Vacation",
                vacation.startDate,
                vacation.endDate,
                [],
                "grey"
            ))
        }

         chartData.value = { keys: [], chart: chartItems }
    }
    catch(error){
        chartData.value = { keys: [], chart: [] }
    }
}

onMounted(() => {
    LoadChartData()
})
</script>