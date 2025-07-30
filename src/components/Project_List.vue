<script setup>
import { store } from '@/store/store';
import { project_table } from '@/store/Database_Mockup/projects';
import { task_table } from '@/store/Database_Mockup/tasks';
import { onMounted, reactive } from 'vue';
import { ref } from 'vue'
import Create_Project from './Dialog/Create_Project.vue';

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
const create_dialog = ref(false)

function load_projects() {
    Object.assign(state.projects, project_table)
}

function load_tasks() {
    Object.assign(state.tasks, task_table)
}

onMounted(() => {
    store.notifyMe(() => {
        load_projects()
        load_tasks()
    })

    load_projects()
    load_tasks()
})

function onCreateProjectExit(project){
    create_dialog.value = false
    if(!project) return

    if(store.db.CreateProject(project)){
        store.updateCache()
    }
}

</script>

<template>
    <h2 class="table_title">Projects</h2>
    <v-data-table class="datagrid" :headers="project_headers" :items="state.projects" :sort-by="sort_projects" density="compact" hide-default-footer>
    </v-data-table>

    <h2 class="table_title">Tasks</h2>
    <v-data-table class="datagrid" :headers="task_headers" :items="state.tasks" :sort-by="sort_tasks" :group-by="group_tasks" density="compact" hide-default-footer>
    </v-data-table>

    <v-spacer></v-spacer>

    <v-btn class="text-none font-weight-regular create_button" prepend-icon="mdi-bolt" text="Create Project" variant="tonal" @click="create_dialog = true"></v-btn>
    
    <v-dialog 
        width="600"
        v-model="create_dialog">
    
        <Create_Project @exit="onCreateProjectExit"></Create_Project>
    </v-dialog>

</template>

<style scoped>
.datagrid {
    margin-bottom: 20px;
}

.table_title {
    margin-left: 10px;
    margin-bottom: 10px;
    color: black;
}

.create_button{
    margin-left: 10px;
    margin-bottom: 10px;
    color: black;
}
</style>