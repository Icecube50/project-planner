<template>
    <v-card prepend-icon="mdi-chart-gantt" title="New Task">
        <v-card-text>
            <v-row dense>
                <v-col>
                    <v-text-field label="Task name*" v-model="task_name" required ></v-text-field>
                </v-col>
                 <v-col>
                        <v-autocomplete :items="task_types" label="Task type*" v-model="task_type" auto-select-first>
                        </v-autocomplete>
                    </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-textarea label="Description" v-model="task_description" ></v-textarea>
                </v-col>
            </v-row>
            <v-row dense>
                <v-col>
                    <v-text-field
                        class="mb-2"
                        label="Start date*"
                        v-model="task_start"
                        readonly>
                        <v-dialog v-model="start_date_dialog" activator="parent" width="auto">
                            <v-date-picker v-model="task_start"></v-date-picker>
                        </v-dialog>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field
                        class="mb-2"
                        label="End date*"
                        v-model="task_end"
                        readonly>
                        <v-dialog v-model="end_date_dialog" activator="parent" width="auto">
                            <v-date-picker v-model="task_end"></v-date-picker>
                        </v-dialog>
                    </v-text-field>
                </v-col>
                <v-col>
                    <v-text-field label="Estimated hours*" v-model="task_hours" required ></v-text-field>
                </v-col>
            </v-row>
          
            <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>

        <v-card-actions>
            <v-spacer></v-spacer>

            <v-btn text="Close" variant="plain" ></v-btn>

            <v-btn color="primary" text="Save" variant="tonal" ></v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import { ref } from 'vue';

defineEmits(['exit'])

const task_types = ref(['PL', 'KOS'])
const start_date_dialog = ref(false)
const end_date_dialog = ref(false)

const task_name = ref(null)
const task_type = ref(null)
const task_description = ref('')
const task_start = ref(null)
const task_end = ref(null)
const task_hours = ref(null)

</script>