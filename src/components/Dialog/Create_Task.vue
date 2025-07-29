<template>
    <v-form @submit.prevent="onSave">
        <v-card prepend-icon="mdi-chart-gantt" title="New Task">
            <v-card-text>
                <v-row dense>
                    <v-col>
                        <v-text-field label="Task name*" v-model="task_name" required
                            :rules="requiredRules"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-autocomplete :items="task_types" label="Task type*" v-model="task_type"
                            :rules="requiredRules" auto-select-first>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-textarea label="Description" v-model="task_description"></v-textarea>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field class="mb-2" label="Start date*" v-model="task_start" readonly
                            :rules="startDateRules">
                            <v-dialog v-model="start_date_dialog" activator="parent" width="auto">
                                <v-date-picker v-model="task_start"></v-date-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field class="mb-2" label="End date*" v-model="task_end" readonly :rules="endDateRules">
                            <v-dialog v-model="end_date_dialog" activator="parent" width="auto">
                                <v-date-picker v-model="task_end"></v-date-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="Estimated hours*" v-model="task_hours" :rules="requiredRules"
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

const task_types = ref(['PL', 'KOS'])
const start_date_dialog = ref(false)
const end_date_dialog = ref(false)

const task_name = ref(null)
const task_type = ref(null)
const task_description = ref('')
const task_start = ref(null)
const task_end = ref(null)
const task_hours = ref(null)

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
        if (!task_end.value) return true
        if (value < task_end.value) return true
        return 'start cannot be after end'
    }
]

const endDateRules = [
    value => {
        if (value) return true
        return 'field is required'
    },
    value => {
        if (!task_start.value) return true
        if (value > task_start.value) return true
        return 'end cannot be before start'
    }

]

function onAbort() {
    emit('exit', null)
}

async function onSave(submitEventPromise) {
    const {valid, errors} = await submitEventPromise
    if(!valid) return

    let task = {
        task_name: task_name.value,
        task_description: task_description?.value,
        task_type: task_type.value,
        task_start_date: task_start.value,
        task_end_date: task_end.value,
        task_hours_estimated: task_hours.value,
    }

    emit('exit', task)
}
</script>