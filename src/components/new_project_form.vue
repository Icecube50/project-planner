<script setup>
    import { ref } from 'vue'

    const project_form = ref(false)
    const project_name = ref(null)
    const project_start_date = ref(null)
    const project_end_date = ref(null)
    const loading = ref(false)
    const project_start_date_dialog = ref(false)
    const project_end_date_dialog = ref(false)

    function toDateString(date){
        return `${date.getDate()}-${date.getMonth()+1}-${date.getFullYear()}`
    }  
    
    function onSubmit() {
        if(!project_form.value)
            return
        
        let start = new Date(project_start_date.value)
        let end = new Date(project_end_date.value)
        if(start > end)
            return
    
        let request_data = {
            name: project_name.value,
            start: toDateString(start),
            end: toDateString(end),
            id: project_name.value.replace(' ', '_')
        }

        console.log(JSON.stringify(request_data))
        let request = new Request('http://localhost:8080/api/tasks', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(request_data)
        })

        loading.value = true

        fetch(request)
            .then(response => response.json())
            .then(data => {
                emit('created_project', {data})
                loading.value = false
            });
    }

    function required(value) {
        return !!value || 'Field is required'
    }
</script>

<template>
<div>
    <v-card>
        <v-form
        v-model="project_form"
        @submit.prevent="onSubmit">
            <v-text-field
                v-model="project_name"
                :readonly="loading"
                :rules="[required]"
                class="mb-2"
                label="Project Name">
            </v-text-field>
            <v-text-field
                :model-value="project_start_date"
                :rules="[required]"
                class="mb-2"
                label="Project Start Date"
                readonly>
                <v-dialog v-model="project_start_date_dialog" activator="parent" width="auto">
                    <v-date-picker v-model="project_start_date"></v-date-picker>
                </v-dialog>
            </v-text-field>
             <v-text-field
                :model-value="project_end_date"
                :rules="[required]"
                class="mb-2"
                label="Project End Date"
                readonly>
                <v-dialog v-model="project_end_date_dialog" activator="parent" width="auto">
                    <v-date-picker v-model="project_end_date"></v-date-picker>
                </v-dialog>
            </v-text-field>
            <v-btn
                :disabled="!project_form"
                :loading="loading"
                size="large"
                type="submit"
                block>
                Submit
            </v-btn>
        </v-form>
    </v-card>
</div>
</template>

<style scoped>
.project_dates{
    display: flex;
    width: 100%;
}

.left{
    flex: 50%;
}

.right{
    flex: 50%;
}
</style>