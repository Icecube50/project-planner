<template>
    <ResourceGantt v-model="chartData"></ResourceGantt>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios';
import { ChartItem, ChartItemType } from 'gantt-planner';
import ResourceGantt from '../utility_components/ResourceGantt.vue';

const chartData = ref({keys: [], chart: []})
const apiUrl = import.meta.env.VITE_API_URL

async function LoadEmployeeAssignments() {
    try{
        const response = await axios.get(`${apiUrl}/api/employees`)
        if(response.status !== 200){
            chartData.value = {keys: [], chart: []}
            return;
        }

        const result = []
        const keys = new Map()
        const workload = new Map()
        for (let employee of response.data){
            
            const assignmentResponse = await axios.get(`${apiUrl}/api/assignments/${employee.employeeId}`)
            if(assignmentResponse.status !== 200){
                chartData.value = {keys: [], chart: []}
                return
            }

            for(let assignment of assignmentResponse.data){
                const taskResponse = await axios.get(`${apiUrl}/api/tasks/${assignment.taskId}`)
                if(taskResponse.status !== 200){
                    chartData.value = {keys: [], chart: []}
                    return
                }
                const task = taskResponse.data[0]

                const projectResponse = await axios.get(`${apiUrl}/api/projects/${task.prjId}`)
                if(projectResponse.status !== 200){
                    chartData.value = {keys: [], chart: []}
                    return
                }
                const prj = projectResponse.data[0]

                result.push(
                    {
                        name: employee.name, 
                        value: new ChartItem(
                                employee.employeeId,
                                ChartItemType.RESOURCE,
                                task.name,
                                assignment.startDate,
                                assignment.endDate,
                                [],
                                prj.view.color,
                            )
                    }
                )

                if(!keys.has(employee.employeeId))
                    keys.set(employee.employeeId, employee.name)      
                
                const startDay = new Date(assignment.startDate)
                const endDay = new Date(assignment.endDate)

                if(!workload.has(employee.employeeId))
                    workload.set(employee.employeeId, new Map())

                const work = workload.get(employee.employeeId)
                for(var day = startDay; day <= endDay; day.setDate(day.getDate() + 1)){
                    // ignore weekend
                    if(day.getDay() === 0 || day.getDay() === 6)
                        continue

                    const key = `${day.getDate()}_${day.getMonth() + 1}_${day.getFullYear()}`
                    if(!work.has(key))
                        work.set(key, 0)

                    work.set(key, work.get(key) + assignment.dailyHours)
                }
            }
        }

        const employees = []
        for (var key of keys.keys()){
            const name = keys.get(key)
            const employee = response.data.find(it => it.employeeId === key)
            var overCapacity = false

            const work = workload.get(key)
            for(var date of work.keys()){
                if(work.get(date) > employee.dailyCapacity){
                    overCapacity = true
                    break;
                }
            }

            employees.push({name: name, overCapacity: overCapacity})
        }

        chartData.value = { keys: employees.sort(it => it.name), chart: result.sort(it => it.name) }
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