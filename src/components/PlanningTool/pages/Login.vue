<template>
  <v-sheet class="bg-primary d-flex align-center justify-center">
    <v-card class="mx-auto px-6 py-8" width="344">
      <v-form
        v-model="form"
        @submit.prevent="onSubmit"
        @register.prevent="onRegister"
      >
        <v-text-field
          v-model="userName"
          :readonly="loading"
          :rules="[rules.required]"
          class="mb-2"
          label="User"
          clearable
          id="username"
        ></v-text-field>

        <v-text-field
            :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
            :rules="[rules.required, rules.minLength]"
            :type="show ? 'text' : 'password'"
            class="input-group--focused"
            label="Password"
            placeholder="Enter your password"
            name="input-10-2"
            @click:append="show = !show"
            v-model="password"
            id="password"
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

        <v-btn
          v-if="allowCreateUser"
          :disabled="!form"
          :loading="loading"
          @click="onRegister"
          color="success"
          size="large"
          type="button"
          variant="elevated"
          block
          style="margin-top: 5px;"
        >
          Register
        </v-btn>
      </v-form>
    </v-card>
  </v-sheet>
</template>

<script setup>
import api from '@/api/api'
import { onMounted, ref } from 'vue'
import router from '@/router'
import { AuthStore } from '@/store/auth_store'

const form = ref(false)
const userName = ref(null)
const password = ref(null)
const loading = ref(false)
const show = ref(false)
const allowCreateUser = ref(true)

async function onSubmit () {
    if (!form.value || loading.value) 
      return
    loading.value = true
    
    api.post(`/api/login`, {
        user: userName.value,
        password: password.value
    }, { skipAuth: true })
    .then((response) => {
        if(response.status !== 200)
            return

        const authStore = AuthStore()
        authStore.login(response.data.user, response.data.token)
        router.push('/')
    })
    .catch((error) => {
        console.log(error);
    })
    .finally(() => {
        loading.value = false
    });
}

async function onRegister(){
    if (!form.value || loading.value) 
      return
    loading.value = true

    api.post(`/api/register`, {
        user: userName.value,
        password: password.value
    }, { skipAuth: true })
    .then((response) => {
        if(response.status !== 200)
            return

        const authStore = AuthStore()
        authStore.login(response.data.user, response.data.token)
        router.push('/')
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
    minLength: value => value.length >= 8 || 'Minimum 8 characters'
}

onMounted(() => {
  const authStore = AuthStore()
  if(authStore.isLoggedIn())
    router.push('/')
})

</script>

<style scoped>
.v-sheet {
    height: 100vh;
}

.v-card {
    
}
</style>