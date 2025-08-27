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
        const projectItems = []
        const projectKeys = new Map()

        const response = await api.get(`/api/assignments/${authStore.user.employee_id}`)
        if(response.status !== 200){
            chartData.value = { keys: [], chart: [] }
            return;
        }

        for(var task of response.data.tasks){
            const prj = response.data.projects.find(it => it.project_id === task.project_id)
            
            projectItems.push(new ChartItem(
                prj.project_id,
                ChartItemType.RESOURCE,
                task.name,
                task.startDate,
                task.endDate
            ))

            if(!projectKeys.has(prj.project_id))
                projectKeys.set(prj.project_id, prj)

        }

        const chartItems = projectItems.sort(it => it.ID)
        const chartKeys = Array.from(projectKeys.values()).sort(it => it.project_id)
        chartKeys.push("Vacation")

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
        
        chartData.value = { keys: chartKeys, chart: chartItems }
    }
    catch(error){
        chartData.value = { keys: [], chart: [] }
    }
}

onMounted(() => {
    LoadChartData()
})
</script>