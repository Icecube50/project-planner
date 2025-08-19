<template>
    <div class="data-table-container" ref="container">
        <v-data-table
        :items="items"
        :headers="headers"
        :group-by="groupByProject"
        :sort-by="sortByDate"
        density="compact"
        hide-default-footer
        fixed-header
        :height="tableHeight"
        items-per-page="-1"
        v-if="!loading">
        </v-data-table>
        <div class="text-center" v-else>
            <v-progress-circular
            color="primary"
            indeterminate>
            </v-progress-circular>
        </div>
    </div>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import axios from 'axios'


const loading = ref(true)
const container = ref(null)

const groupByProject = ref([{key: 'prjId', order: 'asc'}, {key: 'type', order: 'asc'}])
const sortByDate = ref ([{key: 'startDate', order: 'asc'}])

const apiUrl = import.meta.env.VITE_API_URL
const headers = [
    {
        title: 'ID',
        key: 'id',
        value: item => {
            if(item.type === 'PROJECT')
                return item.prjId
            return item.taskId
        }
    },
    { title: 'Name', key: 'name'},
    { title: 'Start', key: 'startDate'},
    { title: 'End', key: 'endDate'},
    { title: 'Completed Hours', key: "hoursCompleted"},
    { title: 'Estimated Hours', key: 'hoursEstimated'}
]

const items = reactive([])
const tableHeight = ref(400)

async function LoadHomeData() {
    try{
        const response = await axios.get(`${apiUrl}/api/projects`)
        if(response.status !== 200){
            Object.assign(items, [])
            return;
        }

        const result = []
        for (let prj of response.data){
            prj.type = 'PROJECT'
            result.push(prj)

            const taskResponse = await axios.get(`${apiUrl}/api/projects/${prj.prjId}/tasks`)
            if(taskResponse.status !== 200){
                Object.assign(items, [])
                return
            }

            for (let task of taskResponse.data){
                task.type = 'TASK'
                result.push(task)
            }
        }

        Object.assign(items, result)
    }
    catch(error){
        console.log(error)
        Object.assign(items, [])
    }
    finally{
        loading.value = false
    }
}

onMounted(() => {
    const observer = new ResizeObserver(() => {
        let newHeight = container.value?.offsetHeight || 400
        tableHeight.value = newHeight
    })
    observer.observe(container.value)

    LoadHomeData()
})
</script>

<style scoped>
.data-table-container {
    height: 100%;
}
</style>