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
                :border="`${getColor(role)} thin opacity-25`"
                :color="getColor(role)"
                :text="role"
                size="x-small"
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
    { title: 'Roles', key: 'roles'},
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

function getColor (calories) {
    return 'green'
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