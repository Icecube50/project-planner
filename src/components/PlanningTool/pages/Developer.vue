<template>
    <div class="p-4 rounded-xl shadow-md bg-white w-full max-w-md">
        <h2 class="text-xl font-semibold mb-3">Load JSON File</h2>    

        <v-file-input label="Users" @change="onUsersChange"></v-file-input>
        <v-file-input label="Projects" @change="onProjectsChange"></v-file-input>
        <v-file-input label="Milestones" @change="onMilestonesChange"></v-file-input>
        <v-file-input label="Tasks" @change="onTasksChange"></v-file-input>
        <v-file-input label="Assignments" @change="onAssignmentsChange"></v-file-input>
        <v-file-input label="Employees" @change="onEmployeesChange"></v-file-input>
        <v-file-input label="Teams" @change="onTeamsChange"></v-file-input>

        <v-btn text="Get" @click="onRequest" style="margin-left: 40px;"/>
    </div>
</template>

<script setup>
import api from '@/api/api';

async function onRequest(){
    const response = await api.get("/api/dev")
    if(response.status === 200){
        console.log(response.data)
    }
    else{
        console.log(response)
    }
}

// handle file selection
function onUsersChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("users", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

function onProjectsChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("projects", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

function onMilestonesChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("milestones", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

function onTasksChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("tasks", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

function onAssignmentsChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("assignments", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

function onEmployeesChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("employees", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

function onTeamsChange(event) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.type !== "application/json") {
        error.value = "Please select a valid JSON file.";
        return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
        try {
            const content = JSON.parse(e.target.result);
            Upload("teams", content)
           
        } catch (err) {
            error.value = "Invalid JSON format.";
        }
    };

    reader.readAsText(file);
}

async function Upload(route, payload) {
    const response = await api.post(`api/dev/${route}`, {
        payload: payload,
    })
}
</script>
