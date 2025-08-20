<template>
    <div class="layout-container" ref="layout">
        <v-toolbar density="compact" title="Planning" color="primary">
            <template v-slot:prepend>
                <v-img src="favicon.ico" aspect-ratio="16/9" cover :width="24" style="margin-left: 16px;">
                </v-img>
            </template>

            <v-tabs v-model="tab" bg-color="primary" style="margin-right: 16px;">
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

            <v-btn v-if="loggedIn" icon="mdi-logout" @click="onLogoutClick"></v-btn>
            <v-btn :icon="!loggedIn ? 'mdi-login' : 'mdi-account'" @click="onAccountClick"></v-btn>
        </v-toolbar>


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
                <TeamChart></TeamChart>
            </v-tabs-window-item>
        </v-tabs-window>
    </div>
</template>

<script setup lang="ts">7
import { onMounted, ref } from 'vue';
import Home from '../components/Home.vue';
import ProjectChart from '../components/ProjectChart.vue';
import EmployeeChart from '../components/EmployeeChart.vue';
import router from '@/router';
import { AuthStore } from '@/store/auth_store';
import TeamChart from '../components/TeamChart.vue';

const tab = ref('home')
const layout = ref(null)
const tabWindow = ref(null)
const loggedIn = ref(false)
const auth = AuthStore()

function onLogoutClick(){
    auth.logout()
    router.push('/Login')
}

function onAccountClick() {
    if (!auth.isLoggedIn())
        router.push('/Login')
    else
        router.push('/Account')
}

function tabContentFillRemainingSpace() {
    if (!layout.value)
        return

    const totalHeight = layout.value.offsetHeight
    const tabHeaderHeight = 48; // get from css? --tab-height
    const itemHeight = totalHeight - tabHeaderHeight

    const window = layout.value.getElementsByClassName('v-tabs-window')
    const items = layout.value.getElementsByClassName('v-tabs-window-item')

    for (let it of window) {
        it.style.height = `${itemHeight}px`
    }

    for (let it of items) {
        it.style.height = `${itemHeight}px`
    }
}

onMounted(() => {
    const observer = new ResizeObserver(() => tabContentFillRemainingSpace())
    observer.observe(layout.value)

    loggedIn.value = auth.isLoggedIn()
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