<template>
    <v-form @submit.prevent="onSave">
        <v-card prepend-icon="mdi-bolt" title="New Project">
            <v-card-text>
                <v-row dense>
                    <v-col>
                        <v-text-field label="Project name*" v-model="project_name" required
                            :rules="requiredRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field class="mb-2" label="Color*" v-model="project_color" readonly
                            :rules="requiredRules">
                            <v-dialog v-model="color_dialog" activator="parent" width="auto">
                                <v-color-picker v-model="project_color" mode="hex"></v-color-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-textarea label="Description" v-model="project_description"></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field class="mb-2" label="Start date*" v-model="project_start" readonly
                            :rules="startDateRules">
                            <v-dialog v-model="start_date_dialog" activator="parent" width="auto">
                                <v-date-picker v-model="project_start"></v-date-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field class="mb-2" label="End date*" v-model="project_end" readonly :rules="endDateRules">
                            <v-dialog v-model="end_date_dialog" activator="parent" width="auto">
                                <v-date-picker v-model="project_end"></v-date-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="Estimated hours*" v-model="project_hours" :rules="requiredRules"
                            required></v-text-field>
                    </v-col>
                </v-row>

                <small class="text-caption text-medium-emphasis">*indicates required field</small>
            </v-card-text>

            <v-card-actions>
                <v-spacer></v-spacer>

                <v-btn text="Close" variant="plain" @click="onAbort"></v-btn>

                <v-btn color="primary" text="Save" variant="tonal" type="submit"></v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script setup>
import { ref } from 'vue';

const emit = defineEmits(['exit'])

const start_date_dialog = ref(false)
const end_date_dialog = ref(false)
const color_dialog = ref(false)

const project_color = ref(null)
const project_name = ref(null)
const project_description = ref('')
const project_start = ref(null)
const project_end = ref(null)
const project_hours = ref(null)

const requiredRules = [
    value => {
        if (value && value?.length > 0) return true
        return 'field is required'
    },
    value => {
        if (/^\s*$/.test(value)) return 'field cannot be empty'
        return true
    }
]

const startDateRules = [
    value => {
        if (value) return true
        return 'field is required'
    },
    value => {
        if (!project_end.value) return true
        if (value < project_end.value) return true
        return 'start cannot be after end'
    }
]

const endDateRules = [
    value => {
        if (value) return true
        return 'field is required'
    },
    value => {
        if (!project_start.value) return true
        if (value > project_start.value) return true
        return 'end cannot be before start'
    }

]

function onAbort() {
    emit('exit', null)
}

function getDateString(date){
    try{
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    }
    catch{

    }
}

async function onSave(submitEventPromise) {
    const {valid, errors} = await submitEventPromise
    if(!valid) return

    let project = {
        name: project_name.value,
        description: project_description.value,
        startDate: getDateString(project_start.value),
        endDate: getDateString(project_end.value),
        view: {
            color: project_color.value
        }
    }

    emit('exit', project)
}
</script>