<script setup>
import { store } from '@/store/store';
import { employee_table } from '@/store/Database_Mockup/employees';
import { onMounted, reactive } from 'vue';
import { ref } from 'vue'
import Create_Employee from './Dialog/Create_Employee.vue';

const sortBy = ref([{ key: 'employee_name', order: 'asc' }])
const groupBy = ref([{ key: 'employee_role', order: 'asc' }])

const headers = [
    { title: 'ID', value: 'employee_id' },
    { title: 'Role', value: 'employee_role' },
    { title: 'Name', value: 'employee_name' },
]

const employees = ref([])
const state = reactive({ employees })
const create_dialog = ref(false)

function load_employees() {
    Object.assign(state.employees, employee_table)
}

onMounted(() => {
    store.notifyMe(() => {
        load_employees()
    })

    load_employees()
})

function onCreateEmployeeExit(employee){
    create_dialog.value = false
    if(!employee) return

    if(store.db.CreateEmployee(employee)){
        store.updateCache()
    }
}

</script>

<template>
    <h2 class="table_title">Employees</h2>
    <v-data-table class="datagrid" :headers="headers" :items="state.employees" :sort-by="sortBy" :group-by="groupBy" density="compact"
        hide-default-footer>
    </v-data-table>

     <v-spacer></v-spacer>

    <v-btn class="text-none font-weight-regular create_button" prepend-icon="mdi-account" text="Create Employee" variant="tonal" @click="create_dialog = true"></v-btn>
    
    <v-dialog 
        width="600"
        v-model="create_dialog">
    
        <Create_Employee @exit="onCreateEmployeeExit"></Create_Employee>
    </v-dialog>
</template>

<style scoped>
.datagrid {
    margin-bottom: 20px;
}

.table_title {
    margin-left: 10px;
    margin-bottom: 10px;
}

.create_button{
    margin-left: 10px;
    margin-bottom: 10px;
}

</style>