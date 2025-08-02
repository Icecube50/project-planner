<template>
  <v-sheet class="bg-primary d-flex align-center justify-center">
    <v-card class="mx-auto px-6 py-8" width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
      >
        <v-text-field
          v-model="userName"
          :readonly="loading"
          :rules="[rules.required]"
          class="mb-2"
          label="User"
          clearable
        ></v-text-field>

        <v-text-field
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required]"
            :type="show ? 'text' : 'password'"
            class="input-group--focused"
            label="Password"
            placeholder="Enter your password"
            name="input-10-2"
            @click:append="show = !show"
            v-model="password"
          ></v-text-field>

        <br>

        <v-btn
          :disabled="!form"
          :loading="loading"
          color="success"
          size="large"
          type="submit"
          variant="elevated"
          block
        >
          Sign In
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup>
import axios from 'axios'
import { ref } from 'vue'
import router from '@/router'

const form = ref(false)
const userName = ref(null)
const password = ref(null)
const loading = ref(false)
const show = ref(false)

function onSubmit () {
    if (!form.value) return
    loading.value = true
    
    axios.post('http://localhost:8080/api/login', {
        user: userName.value,
        password: password.value
    })
    .then((response) => {
        if(response.status !== 200)
            return

        router.push('/planning')
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        loading.value = false
    });
}

const rules = {
    required: value => !!value || 'Required.',
}


</script>

<style scoped>
.v-sheet {
    height: 100vh;
}

.v-card {
    
}
</style>