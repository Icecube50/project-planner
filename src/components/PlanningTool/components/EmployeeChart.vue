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

async function LoadEmployeeAssignments() {
    try{
        const response = await axios.get('http://localhost:8080/api/employees')
        if(response.status !== 200){
            chartData.value = []
            return;
        }

        const result = []
        for (let employee of response.data){
            
            const assignmentResponse = await axios.get(`http://localhost:8080/api/assignments/${employee.employeeId}`)
            if(assignmentResponse.status !== 200){
                chartData.value = []
                return
            }

            for(let assignment of assignmentResponse.data){
                const taskResponse = await axios.get(`http://localhost:8080/api/tasks/${assignment.taskId}`)
                if(taskResponse.status !== 200){
                    chartData.value = []
                    return
                }
                const task = taskResponse.data[0]

                const projectResponse = await axios.get(`http://localhost:8080/api/projects/${task.prjId}`)
                if(projectResponse.status !== 200){
                    chartData.value = []
                    return
                }
                const prj = projectResponse.data[0]

                result.push(
                    new ChartItem(
                        employee.employeeId,
                        ChartItemType.RESOURCE,
                        task.name,
                        assignment.startDate,
                        assignment.endDate,
                        [],
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
    LoadEmployeeAssignments()
})

</script>