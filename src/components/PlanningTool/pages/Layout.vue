<template>
    <div class="layout-container" ref="layout">
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

        <v-tabs-window v-model="tab" ref="tabWindow">
            <v-tabs-window-item value="home">
                <Home></Home>
            </v-tabs-window-item>
            <v-tabs-window-item value="project-chart">
                <ProjectChart></ProjectChart>
            </v-tabs-window-item>
            <v-tabs-window-item value="employee-chart">
                <EmployeeChart></EmployeeChart>
            </v-tabs-window-item>
            <v-tabs-window-item value="team-chart">
                Team Chart
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<script setup lang="ts">7
import { onMounted, ref } from 'vue';
import Home from '../components/Home.vue';
import ProjectChart from '../components/ProjectChart.vue';
import EmployeeChart from '../components/EmployeeChart.vue';

const tab = ref('home')
const layout = ref(null)
const tabWindow = ref(null)

function tabContentFillRemainingSpace(){
   if(!layout.value)
            return

        const totalHeight = layout.value.offsetHeight
        const tabHeaderHeight = 48; // get from css? --tab-height
        const itemHeight = totalHeight - tabHeaderHeight

        const window = layout.value.getElementsByClassName('v-tabs-window')
        const items = layout.value.getElementsByClassName('v-tabs-window-item')

        for(let it of window){
            it.style.height = `${itemHeight}px`
        }

        for(let it of items){
            it.style.height = `${itemHeight}px`
        }
}

onMounted(() => {
    const observer = new ResizeObserver(() => tabContentFillRemainingSpace())
    observer.observe(layout.value)
})
</script>

<style scoped>
.layout-container {
    height: 100vh;
    width: 100%;
    overflow: hidden;
    background-color: #fff;
}


</style>