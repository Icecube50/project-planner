<template>
    <ResourceGantt v-model="chartData"></ResourceGantt>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue';
import api from '@/api/api';
import { ChartItem, ChartItemType } from 'gantt-planner';
import ResourceGantt from '../utility_components/ResourceGantt.vue';

const chartData = ref({ keys: [], chart: [] })

async function LoadEmployeeAssignments() {
    try {
        const response = await api.get(`/api/employees`)
        if (response.status !== 200) {
            chartData.value = { keys: [], chart: [] }
            return;
        }

        const result = []
        const keys = new Map()
        const workload = new Map()
        for (let employee of response.data) {

            const projectResponse = await api.get(`/api/assignments/projects/${employee.employee_id}`)
            if (projectResponse.status !== 200) {
                chartData.value = { keys: [], chart: [] }
                return
            }

            for (let it of projectResponse.data) {
                result.push(
                    {
                        name: employee.name,
                        value: new ChartItem(
                            employee.employee_id,
                            ChartItemType.RESOURCE,
                            it.task,
                            it.from,
                            it.to,
                            [],
                            it.prj.view.color,
                        )
                    })
    
                if (!keys.has(employee.employee_id))
                    keys.set(employee.employee_id, employee.name)

                const startDay = new Date(it.from)
                const endDay = new Date(it.to)

                if (!workload.has(employee.employee_id))
                    workload.set(employee.employee_id, new Map())

                const work = workload.get(employee.employee_id)
                for (var day = startDay; day < endDay; day.setDate(day.getDate() + 1)) {
                    // ignore weekend
                    if (day.getDay() === 0 || day.getDay() === 6)
                        continue

                    const key = `${day.getDate()}_${day.getMonth() + 1}_${day.getFullYear()}`
                    if (!work.has(key))
                        work.set(key, 0)

                    work.set(key, work.get(key) + it.hours)
                }
            }
        }

        const employees = []
        for (var key of keys.keys()) {
            const name = keys.get(key)
            const employee = response.data.find(it => it.employee_id === key)
            var overCapacity = false

            const work = workload.get(key)
            for (var date of work.keys()) {
                if (work.get(date) > employee.dailyCapacity) {
                    overCapacity = true
                    break;
                }
            }

            employees.push({ name: name, overCapacity: overCapacity })
        }

        chartData.value = { keys: employees.sort(it => it.name), chart: result.sort(it => it.name) }
    }
    catch (error) {
        console.log(error)
        chartData.value = []
    }
}

onMounted(() => {
    LoadEmployeeAssignments()
})

</script>