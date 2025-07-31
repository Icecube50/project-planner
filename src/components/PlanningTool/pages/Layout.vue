<template>
    <div class="layout-container">
        <v-tabs
        v-model="tab"
        bg-color="primary">
            <v-tab value="home">
                Home
            </v-tab>
            <v-tab value="project-chart">
                Project Chart
            </v-tab>
            <v-tab value="employee-chart">
                Employee Chart
            </v-tab>
            <v-tab value="team-chart">
                Team Chart
            </v-tab>
        </v-tabs>

        <v-tabs-window v-model="tab">
            <v-tabs-window-item value="home">
                <Home></Home>
            </v-tabs-window-item>
            <v-tabs-window-item value="project-chart">
                <ProjectChart></ProjectChart>
            </v-tabs-window-item>
            <v-tabs-window-item value="employee-chart">
                Employee-Chart
            </v-tabs-window-item>
            <v-tabs-window-item value="team-chart">
                Team Chart
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<script setup lang="ts">7
import { ref } from 'vue';
import Home from '../components/Home.vue';
import ProjectChart from '../components/ProjectChart.vue';
const tab = ref('home')
</script>

<style scoped>
.layout-container {
    width: 100%;
    height: 90vh;
    overflow: hidden;
}
</style>