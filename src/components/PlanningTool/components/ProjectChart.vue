<template>
    <Gantt v-model="chartData"></Gantt>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import { store } from '@/store/store';
import Gantt from '../utility_components/Gantt.vue';
import axios from 'axios';
import { ChartItem, ChartItemType } from 'gantt-planner';

const chartData = ref([])
const apiUrl = import.meta.env.VITE_API_URL

async function LoadChartData() {
    try{
        const response = await axios.get(`${apiUrl}/api/projects`)
        if(response.status !== 200){
            chartData.value = []
            return;
        }

        const result = []
        for (let prj of response.data){
            
            result.push(
                new ChartItem(
                    prj.prjId,
                    ChartItemType.PROJECT,
                    prj.name,
                    prj.startDate,
                    prj.endDate,
                    [],
                    prj.view.color
                )
            )

            const taskResponse = await axios.get(`${apiUrl}/api/projects/${prj.prjId}/tasks`)
            if(taskResponse.status !== 200){
                chartData.value = []
                return
            }

            for (let task of taskResponse.data){
               result.push(
                new ChartItem(
                    task.taskId,
                    ChartItemType.TASK,
                    task.name,
                    task.startDate,
                    task.endDate,
                    task.prjId,
                    prj.view.color,
                    Math.trunc((task.hoursCompleted / task.hoursEstimated) * 10),
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