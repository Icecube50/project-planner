<script setup>
import Gantt from 'gantt-planner'
import { computed, onMounted, ref, watch } from 'vue'
import axios from 'axios'
import { store } from '@/store/store'
import { toDateString, TicksPerDay } from '@/store/Database_Mockup/util/today'
import Project_SideBar from './Project_SideBar.vue'
import Create_Task from './Dialog/Create_Task.vue'
import Create_Assignment from './Dialog/Create_Assignment.vue'

const chartContainer = ref(null)
const sidebarContainer = ref(null)
const create_dialog = ref(false)
const dialog_type = ref(null)
const dialog_payload = ref(null)

let chartInstance = null

function renderChart(tasks) {
    if(!tasks) return

    const height = sidebarContainer.value?.offsetHeight || 400

    if (chartContainer || tasks === undefined) {
        try {
            chartContainer.value.innerHTML = ''
        }
        catch {
            // ignore
        }
    }

    chartInstance = new Gantt(chartContainer.value, tasks, {
        view_mode: 'Day',
        date_format: 'DD-MM-YYYY',
        scroll_to: 'today',
        container_height: `${height}`,
        popup: (bar) => {
            let task = bar.task

            if (task.type === 1) {
                bar.add_action(`<button>Add Task</button>`, () => { 
                    if(!create_dialog.value){
                        dialog_type.value = 'create_task'
                        dialog_payload.value = task.id
                        create_dialog.value = true
                    }
                 })
                bar.set_title(task.name)
                bar.set_subtitle(task.id)
                bar.set_details(
                    `
                    <div style="width: 400px;">
                        <table style="margin-bottom: 15px; width: 100%;">
                            <tr>
                                <td colspan="2">
                                    <p>${task.description}</p>
                                </td>
                            </tr>
                        </table>

                        <table style="width: 100%;">
                            <tr>
                                <td>
                                    <p><strong>Start:</strong></p>
                                </td>
                                <td>
                                    <p>${toDateString(task.start)}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>End:</strong></p>
                                </td>
                                <td>
                                    <p>${toDateString(task.end)}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>Progress:</strong></p>
                                </td>
                                <td>
                                    <p>${task.progress}% (${task.hours_is}h / ${task.hours_estimated}h)</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>Assigned Hours:</strong></p>
                                </td>
                                <td>
                                    <p>${store.db.CalculateAssignedWorkload(task.id)}h / ${task.hours_estimated}h</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
                )

                return
            }

            if (task.type === 2) {
                bar.add_action(`<button>Assign Employee</button>`, () => { 
                    if(!create_dialog.value){
                        dialog_type.value = 'create_assignment'
                        dialog_payload.value = task.id
                        create_dialog.value = true
                    }
                 })
                bar.set_title(task.name)
                bar.set_subtitle(task.category)
                bar.set_details(
                    `
                    <div style="width: 400px;">
                        <table style="margin-bottom: 15px; width: 100%;">
                            <tr>
                                <td colspan="2">
                                    <p>${task.description}</p>
                                </td>
                            </tr>
                        </table>

                        <table style="width: 100%;">
                            <tr>
                                <td>
                                    <p><strong>Start:</strong></p>
                                </td>
                                <td>
                                    <p>${toDateString(task.start)}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>End:</strong></p>
                                </td>
                                <td>
                                    <p>${toDateString(task.end)}</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>Progress:</strong></p>
                                </td>
                                <td>
                                    <p>${task.progress}% (${task.hours_is}h / ${task.hours_estimated}h)</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>Assigned Hours:</strong></p>
                                </td>
                                <td>
                                    <p>${store.db.CalculateAssignedWorkload(task.id)}h / ${task.hours_estimated}h</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
                )

                return
            }

            if (task.type === 3) {
                bar.set_title(task.name)
                bar.set_subtitle(`${task.role} | ${task.id}`)
                bar.set_details(
                    `
                    <div style="width: 400px;">
                        <table style="width: 100%;">
                            <tr>
                                <td>
                                    <p><strong>Assigned:</strong></p>
                                </td>
                                <td>
                                    <p>${toDateString(task.start)} until ${toDateString(task.end)}: ${(task.end - task.start) / TicksPerDay} days</p>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <p><strong>Capacity:</strong></p>
                                </td>
                                <td>
                                    <p>Daily ${task.hours_per_day}h | Total ${((task.end - task.start) / TicksPerDay) * task.hours_per_day}h</p>
                                </td>
                            </tr>
                        </table>
                    </div>
                    `
                )
                return
            }
        }
    })
}

onMounted(() => {
    // axios.get('http://localhost:8080/api/tasks')
    //     .then(response => {
    //         if(response.status === 200){
    //             update(response.data)
    //         }
    //         else{
    //             console.log(`${response.status}: ${response.statusText}`)
    //         }
    //     })
    //     .catch(error => {
    //         console.log(error)
    //     })

    store.notifyMe(() => {
        renderChart(store.getCache())
    })

    const observer = new ResizeObserver(() => {
        renderChart(store.getCache())
    })
    observer.observe(chartContainer.value)

    store.updateCache()
})

function onCreateTaskExit(task){
    create_dialog.value = false
    if(!task || !dialog_payload.value) return

    if(store.db.CreateTaskInProject(dialog_payload.value, task)){
        store.updateCache()
    }
}

function onCreateAssignmentExit(assignment){
    create_dialog.value = false
    if(!assignment || !dialog_payload.value) return

    if(store.db.AssignEmployeeToTask(dialog_payload.value, assignment)){
        store.updateCache()
    }
}


</script>

<template>
    <div class="two-column-layout">

        <div class="left-column">
            <div class="sidebar" ref="sidebarContainer">
                <div class="sidebar-content">
                    <Project_SideBar></Project_SideBar>
                </div>
            </div>
        </div>

        <div class="right-column">
            <div class="chart-area">
                <div ref="chartContainer"></div>
            </div>
        </div>
    </div>

    <v-dialog 
        width="600"
        v-model="create_dialog">
        <Create_Task v-if="dialog_type === 'create_task'" @exit="onCreateTaskExit"></Create_Task>
        <Create_Assignment v-if="dialog_type === 'create_assignment'" @exit="onCreateAssignmentExit"></Create_Assignment>
    </v-dialog>
</template>

<style scoped>
.two-column-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
}

.left-column {
    width: 40%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 3px;
    padding-right: 3px;
    border-right: 1px solid #ddd;
}

.right-column {
    width: 60%;
    height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding-left: 16px;
    padding-right: 16px;
}

.sidebar {
    width: 100%;
    height: 100%;
    overflow: hidden;
}

.chart-area {
    height: 100%;
}

.sidebar-content {
    width: 100%;
    height: 100%;
}
</style>