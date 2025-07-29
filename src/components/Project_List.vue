<script setup>
import { store } from '@/store/store';
import { project_table } from '@/store/Database_Mockup/projects';
import { task_table } from '@/store/Database_Mockup/tasks';
import { onMounted, reactive } from 'vue';
import { ref } from 'vue'

const sort_projects = ref([{ key: 'project_id', order: 'asc' }])
const sort_tasks = ref([{ key: 'task_id', order: 'asc' }])
const group_tasks = ref([{ key: 'project_id', order: 'asc' }])

const project_headers = [
    { title: 'ID', value: 'project_id' },
    { title: 'Name', value: 'project_name' },
    { title: 'Start', value: 'project_start_as_text' },
    { title: 'End', value: 'project_end_as_text' },
    { title: 'Hours Is', value: 'project_hours_is' },
    { title: 'Hours Estimated', value: 'project_hours_estimated' },
]

const task_headers = [
    { title: 'Name', value: 'task_name' },
    { title: 'Start', value: 'task_start_as_text' },
    { title: 'End', value: 'task_end_as_text' },
    { title: 'Hours Is', value: 'task_hours_is' },
    { title: 'Hours Estimated', value: 'task_hours_estimated' },
]

const projects = ref([])
const tasks = ref([])
const state = reactive({ projects, tasks })
// const dialog = shallowRef(false)
// const employee_name = ref(null)
// const employee_surname = ref(null)
// const employee_id = ref(null)
// const employee_role = ref(null)

function load_projects() {
    Object.assign(state.projects, project_table)
}

function load_tasks() {
    Object.assign(state.tasks, task_table)
}

// function create_employee(){
//     if(employee_name.value === null
//     || employee_surname.value === null
//     || employee_id.value === null
//     || employee_role === null) {
//         dialog.value = false
//         return
//     }

//     let employee = {
//         employee_name: `${employee_name.value} ${employee_surname.value}`,
//         employee_id: `${employee_id.value.toUpperCase()}`,
//         employee_role: `${employee_role.value}`,
//     }

//     if(store.db.CreateEmployee(employee)){
//         load_employees()
//     }

//     dialog.value = false
//     return
// }

onMounted(() => {
    load_projects()
    load_tasks()
})
</script>

<template>
    <h2 class="table_title">Projects</h2>
    <v-data-table class="datagrid" :headers="project_headers" :items="state.projects" :sort-by="sort_projects" density="compact" hide-default-footer>
    </v-data-table>

    <h2 class="table_title">Tasks</h2>
    <v-data-table class="datagrid" :headers="task_headers" :items="state.tasks" :sort-by="sort_tasks" :group-by="group_tasks" density="compact" hide-default-footer>
    </v-data-table>

    <!-- <v-dialog v-model="dialog" width="auto" max-width="600" min-width="400">
        <template v-slot:activator="{ props: activatorProps }">
            <v-btn class="text-none font-weight-regular" prepend-icon="mdi-account" text="Create Employee" variant="tonal"
                v-bind="activatorProps"></v-btn>
        </template>
<v-card prepend-icon="mdi-account" title="New Employee">
    <v-card-text>
        <v-row dense>
            <v-col>
                <v-text-field label="First name*" required v-model="employee_name"></v-text-field>
            </v-col>
            <v-col>
                <v-text-field label="Last name*" required v-model="employee_surname"></v-text-field>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col>
                <v-text-field label="ID*" required v-model="employee_id"></v-text-field>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col>
                <v-autocomplete :items="roles" label="Roles" auto-select-first v-model="employee_role">
                </v-autocomplete>
            </v-col>
        </v-row>
        <small class="text-caption text-medium-emphasis">*indicates required field</small>
    </v-card-text>

    <v-card-actions>
        <v-spacer></v-spacer>

        <v-btn text="Close" variant="plain" @click="dialog = false"></v-btn>

        <v-btn color="primary" text="Save" variant="tonal" @click="create_employee"></v-btn>
    </v-card-actions>
</v-card>
</v-dialog> -->
</template>

<style scoped>
.datagrid {
    margin-bottom: 20px;
}

.table_title {
    margin-left: 10px;
    margin-bottom: 10px;
}
</style>