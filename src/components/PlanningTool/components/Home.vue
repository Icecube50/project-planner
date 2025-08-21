<template>
    <div class="data-table-container" ref="container">
        <v-data-table
        :items="items"
        :headers="headers"
        :sort-by="sortByName"
        :group-by="groupByTeam"
        density="compact"
        hide-default-footer
        fixed-header
        :height="tableHeight"
        items-per-page="-1"
        v-if="!loading">

            <template v-slot:item.roles="{ value }">
                <v-chip
                v-for="role in value"
                :border="`${getRoleColor(role)} thin opacity-25`"
                :color="getRoleColor(role)"
                :text="role"
                size="x-small"
                style="margin-right: 5px;"
                ></v-chip>
            </template>

            <template v-slot:item.status="{ value }">
                <v-chip
                :border="`${getStatusColor(value)} thin opacity-25`"
                :color="getStatusColor(value)"
                :text="getStatusText(value)"
                size="x-small"
                style="margin-right: 5px;"
                ></v-chip>
            </template>

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
import api from '@/api/api';

const loading = ref(true)
const container = ref(null)

const sortByName = ref ([{key: 'name', order: 'asc'}])
const groupByTeam = ref ([{key: 'team_id', order: 'asc'}])

const headers = [
    { title: 'Name', key: 'name'},
    { title: 'Team', key: 'team_id'},
    { title: 'Title', key: 'title'},
    { title: 'Roles', key: 'roles'},
    { title: 'Status', key: 'status'},
]

const items = reactive([])
const tableHeight = ref(400)

async function LoadHomeData() {
    try{
        const response = await api.get(`/api/employees`)
        if(response.status !== 200){
            Object.assign(items, [])
            return;
        }

        const employees = response.data
        for(let employee of employees){
            const vacation = await api.get(`api/employees/status/${employee.employee_id}`)
            if(vacation.status !== 200){
                continue
            }

            if(vacation.data){
                employee.status = 0
            }
            else{
                employee.status = 1
            }
        }

        Object.assign(items, response.data)
    }
    catch(error){
        console.log(error)
        Object.assign(items, [])
    }
    finally{
        loading.value = false
    }
}

function getRoleColor (role) {
    return 'success'
}

function getStatusColor (status) {
    switch (status) {
        case 1:
            return "success"
        case 0:
            return "warning"
        default:
            return "error"
    }
}

function getStatusText(status) {
    switch (status) {
        case 1:
            return "Verfügbar"
        case 0:
            return "Im Urlaub"
        default:
            return "UNDEFINIERT"
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