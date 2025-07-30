<template>
    <v-form @submit.prevent="onSave">
        <v-card prepend-icon="mdi-account" title="New Employee">
            <v-card-text>
               <v-row dense>
                    <v-col>
                        <v-text-field label="First name*" required :rules="requiredRules" v-model="employee_name"></v-text-field>
                    </v-col>
                    <v-col>
                        <v-text-field label="Last name*" required :rules="requiredRules" v-model="employee_surname"></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-text-field label="ID*" required :rules="requiredRules" v-model="employee_id"></v-text-field>
                    </v-col>
                </v-row>
                <v-row dense>
                    <v-col>
                        <v-autocomplete :items="roles" label="Roles*" required :rules="requiredRules" auto-select-first v-model="employee_role">
                        </v-autocomplete>
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

const emit = defineEmits(['exit'])

const roles = ref([])

const employee_name = ref(null)
const employee_surname = ref(null)
const employee_id = ref(null)
const employee_role = ref(null)

onMounted(() => {

})

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

function onAbort() {
    emit('exit', null)
}

async function onSave(submitEventPromise) {
    const {valid, errors} = await submitEventPromise
    if(!valid) return

    let employee = {
        employee_name: `${employee_name.value} ${employee_surname.value}`,
        employee_id: employee_id.value.toUpper(),
        employee_role: employee_role.value,
    }

    emit('exit', employee)
}
</script>