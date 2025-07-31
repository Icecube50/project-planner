<template>
    <Gantt v-model="chartData"></Gantt>
</template>

<script setup>
import { onMounted, reactive } from 'vue';
import Gantt from '../utility_components/Gantt.vue';
import axios from 'axios';

const chartData = ref([])

async function LoadChartData() {
    try{
        const response = await axios.get('http://localhost:8080/api/projects')
        if(response.status !== 200){
            chartData.value = []
            return;
        }

        const result = []
        for (let prj of response.data){
            prj.type = 'PROJECT'
            result.push(prj)

            const taskResponse = await axios.get(`http://localhost:8080/api/projects/${prj.prjId}/tasks`)
            if(taskResponse.status !== 200){
                chartData.value = []
                return
            }

            for (let task of taskResponse.data){
                task.type = 'TASK'
                result.push(task)
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
    //LoadChartData()
})

</script>