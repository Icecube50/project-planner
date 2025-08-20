<template>
    <Gantt v-model="chartData"></Gantt>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import Gantt from '../utility_components/Gantt.vue';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';

const chartData = ref([])

async function LoadChartData() {
    try{
        const response = await api.get(`/api/projects`)
        if(response.status !== 200){
            chartData.value = []
            return;
        }

        const result = []
        for (let prj of response.data){
            
            result.push(
                new ChartItem(
                    prj.project_id,
                    ChartItemType.PROJECT,
                    prj.name,
                    prj.startDate,
                    prj.endDate,
                    [],
                    prj.view.color
                )
            )

            const milestoneResponse = await api.get(`/api/projects/${prj.project_id}/milestones`)
            if(milestoneResponse.status !== 200){
                chartData.value = []
                return
            }

            for (let milestone of milestoneResponse.data){
               result.push(
                    new ChartItem(
                        milestone.milestone_id,
                        ChartItemType.MILESTONE,
                        milestone.milestone_id,
                        milestone.startDate,
                        milestone.endDate,
                        milestone.project_id,
                        prj.view.color,
                    )
                )
            }
        }

        chartData.value = result
    }
    catch(error){
        console.log(error)
        chartData.value = []
    }
}

onMounted(() => {
    LoadChartData()
})

</script>