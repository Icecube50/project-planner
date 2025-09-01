<template>
    <ResourceGantt :model="chartData" viewMode="Day"></ResourceGantt>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import ResourceGantt from '../utility_components/ResourceGantt.vue';

const chartData = ref({ keys: [], chart: [] })

async function LoadChartData() {
    // not logged in -> return to login

    // no team lead -> show personal/assigned tasks

    // team lead -> load all team projects -> load assigned employees


    try{
        const response = await api.get(`/api/projects`)
        if(response.status !== 200){
            chartData.value = { keys: [], chart: [] }
            return;
        }

        const projects = []
        const projectKeys = new Map()
        var assignments = []
        const employees = new Map()
        for (let prj of response.data){
            
            projects.push(
                new ChartItem(
                    prj.project_id,
                    ChartItemType.PROJECT,
                    `${prj.name} - Engineering`,
                    prj.engineering.startDate,
                    prj.engineering.endDate,
                    [],
                    prj.view.color
                )
            )

            projects.push(
                new ChartItem(
                    prj.project_id,
                    ChartItemType.PROJECT,
                    `${prj.name} - On Site`,
                    prj.startupOnSite.startDate,
                    prj.startupOnSite.endDate,
                    [],
                    'blue'
                )
            )

            projects.push(
                new ChartItem(
                    prj.project_id,
                    ChartItemType.PROJECT,
                    `${prj.name} - Off Site`,
                    prj.startupOffSite.startDate,
                    prj.startupOffSite.endDate,
                    [],
                    'red'
                )
            )

            if(!projectKeys.has(prj.project_id))
                projectKeys.set(prj.project_id, prj)

            const assignment = await LoadAssignedEmployees(prj)
            for(var employee of assignment.employees.values()){
                if(!employees.has(employee.employee_id)){
                    employees.set(employee.employee_id, employee)
                }
            }

            assignments = assignments.concat(assignment.chart)
        }

        // employees: sort by role -> sort by name
        // projects: sort by name

        var chartHeader = []
        var chartItems = []

        var sorted = Array.from(employees.values()).sort((a, b) => {
            if(a.roles[0] === b.roles[0])
                return a.name.localeCompare(b.name)

            return a.roles[0].localeCompare(b.roles[0])
        })

        for(var employee of sorted){
            chartHeader.push(employee)

            var work = assignments.filter(it => it.ID === employee.employee_id)
            chartItems = chartItems.concat(work)
        }

        const sortedProjects = projects.sort(it => it.project_id)
        chartItems = chartItems.concat(sortedProjects)

        chartHeader = chartHeader.concat(Array.from(projectKeys.keys()).sort(it => it.project_id))

        chartData.value = { keys: chartHeader, chart: chartItems }
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