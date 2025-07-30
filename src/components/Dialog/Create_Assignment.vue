<template>
    <v-form @submit.prevent="onSave">
        <v-card prepend-icon="mdi-account" title="New Assignment">
            <v-card-text>
                <v-row dense>
                    <v-col>
                        <v-autocomplete :items="available_employees" item-title="employee_name" item-value="employee_id"
                            label="Employee*" v-model="assigned_employee" :rules="requiredRules" :custom-filter="filterEmployees" auto-select-first>
                        </v-autocomplete>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field class="mb-2" label="Start date*" v-model="assignment_start" readonly
                            :rules="startDateRules">
                            <v-dialog v-model="start_date_dialog" activator="parent" width="auto">
                                <v-date-picker v-model="assignment_start"></v-date-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field class="mb-2" label="End date*" v-model="assignment_end" readonly :rules="endDateRules">
                            <v-dialog v-model="end_date_dialog" activator="parent" width="auto">
                                <v-date-picker v-model="assignment_end"></v-date-picker>
                            </v-dialog>
                        </v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="Hours per day*" v-model="assignment_hours_per_day" :rules="requiredRules"
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
import { onMounted, ref } from 'vue';
import { employee_table } from '@/store/Database_Mockup/employees';

const emit = defineEmits(['exit'])

const available_employees = ref([])
const start_date_dialog = ref(false)
const end_date_dialog = ref(false)

const assigned_employee = ref(null)
const assignment_start = ref(null)
const assignment_end = ref(null)
const assignment_hours_per_day = ref(null)

onMounted(() => {
    available_employees.value = employee_table
})


function filterEmployees(itemTitle, queryText, item) {
    const textOne = item.raw.employee_name.toLowerCase()
    const textTwo = item.raw.employee_id.toLowerCase()
    const textThree = item.raw.employee_role.toLowerCase()
    const searchText = queryText.toLowerCase()
    return textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1 || textThree.indexOf(searchText) > -1
}

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
        if (!assignment_end.value) return true
        if (value < assignment_end.value) return true
        return 'start cannot be after end'
    }
]

const endDateRules = [
    value => {
        if (value) return true
        return 'field is required'
    },
    value => {
        if (!assignment_start.value) return true
        if (value > assignment_start.value) return true
        return 'end cannot be before start'
    }

]

function onAbort() {
    emit('exit', null)
}

async function onSave(submitEventPromise) {
    const { valid, errors } = await submitEventPromise
    if (!valid) return

    let assignment = {
        assignment_employee_id: assigned_employee.value,
        assignment_start_date: assignment_start.value,
        assignment_end_date: assignment_end,
        assignment_hours_per_day: assignment_hours_per_day.value,
    }

    emit('exit', assignment)
}
</script>