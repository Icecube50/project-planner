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

                const taskResponse = await api.get(`/api/milestones/${milestone.milestone_id}/tasks`)
                if(taskResponse.status !== 200){
                    chartData.value = []
                    return
                }

                for (let task of taskResponse.data){
                result.push(
                        new ChartItem(
                            task.task_id,
                            ChartItemType.TASK,
                            task.name,
                            task.startDate,
                            task.endDate,
                            task.milestone_id,
                            prj.view.color,
                            task.progress,
                        )
                    )
                }
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