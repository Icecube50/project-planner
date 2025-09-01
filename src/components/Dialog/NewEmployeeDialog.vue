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
                        <v-select multiple :items="roles" label="Roles*" required :rules="validRoleRules" read auto-select-first v-model="employee_role">
                        </v-select>
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
import { onMounted, reactive, ref } from 'vue';
import { Config } from '@/util/app_config';

const emit = defineEmits(['exit'])

const roles = reactive([])

const employee_name = ref(null)
const employee_surname = ref(null)
const employee_id = ref(null)
const employee_role = ref(null)

onMounted(() => {
    Object.assign(roles, Config.getEmployeeRoles())
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

const validRoleRules = [
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
        employee_id: employee_id.value.toUpperCase(),
        employee_role: employee_role.value,
    }

    emit('exit', employee)
}
</script>