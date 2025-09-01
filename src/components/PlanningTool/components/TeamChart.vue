<template>
    <ResourceGantt :model="chartData" viewMode="Day"></ResourceGantt>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import ResourceGantt from '../utility_components/ResourceGantt.vue';
import { Utils } from '@/util/date_utils';
import { Config } from '@/util/app_config';

const chartData = ref({ keys: [], chart: [] })

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
                'blue' //Config.getSprintColor(row.sprint_name)
            ))
            
            if(!chartKeys.has(row.project_name))
                chartKeys.set(row.project_name, `${row.customer_name} | ${row.project_name}`) 
        }

         chartData.value = { keys: Array.from(chartKeys.values()), chart: chartItems }
    }
    catch(error){
        console.log(error)
        chartData.value = { keys: [], chart: [] }
    }
}

async function LoadAssignedEmployees(project){
    try{
        const response = await api.get(`/api/projects/${project.project_id}/assignment`)
        if(response.status !== 200){
            chartData.value = { keys: [], chart: [] }
            return;
        }

        const chartItems = []
        const employees = new Map()

        const result = response.data
        for(var assign of result.assignments){
            const employee = result.employees.find(it => it.employee_id === assign.employee_id)
            const task = result.tasks.find(it => it.task_id === assign.task_id)
            
            const chartItem = new ChartItem(
                employee.employee_id,
                ChartItemType.RESOURCE,
                task.name,
                assign.startDate,
                assign.endDate,
            )
            chartItems.push(chartItem)

            if(!employees.has(employee.employee_id))
                employees.set(employee.employee_id, employee)
        }

        for(var employee of employees.keys()){
            for(var vacation of result.vacations.filter(it => it.employee_id === employee)){
                const chartItem = new ChartItem(
                    employee,
                    ChartItemType.RESOURCE,
                    'Vacation',
                    vacation.startDate,
                    vacation.endDate,
                    [],
                    'grey'
                )
                chartItems.push(chartItem)
            }
        }

        return { employees: employees, chart: chartItems }
    }
    catch(error){
        console.log(error)
        chartData.value = { keys: [], chart: [] }
    }
}

onMounted(() => {
    LoadChartData()
})

</script>