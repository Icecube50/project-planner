<script setup>
import Employee_List from './Employee_List.vue';
import { ref } from 'vue'
import Project_List from './Project_List.vue';

const tab = ref('projects')
</script>

<template>
    <v-tabs
        v-model="tab"
        bg-color="primary"
        class="tab_control">

        <v-tab value="projects">Projects</v-tab>
        <!-- <v-tab value="assignments">Assignments</v-tab> -->
        <v-tab value="employees">Employees</v-tab>
    </v-tabs>

    <v-tabs-window v-model="tab">
        <v-tabs-window-item value="projects">
            <Project_List></Project_List>
        </v-tabs-window-item>
          <v-tabs-window-item value="assignments">

        </v-tabs-window-item>
        <v-tabs-window-item value="employees">
            <Employee_List></Employee_List>
        </v-tabs-window-item>
    </v-tabs-window>
</template>

<style scoped>
.tab-control {
    height: 100;
    overflow-y: hidden;
}
</style>