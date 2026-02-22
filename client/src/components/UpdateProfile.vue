<script setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import 'notyf/notyf.min.css'
import api from '@/api'

const firstName = ref('')
const lastName = ref('')
const mobileNo = ref('')
const loading = ref(false)

const notyf = new Notyf()

const handleUpdate = async () => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      notyf.error('You are not authorized')
      return
    }

    loading.value = true

    const res = await api.put(
      '/users/profile',
      {
        firstName: firstName.value,
        lastName: lastName.value,
        mobileNo: mobileNo.value
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    notyf.success('Profile updated successfully')

    // Optional: update form with returned user data
    firstName.value = res.data.firstName
    lastName.value = res.data.lastName
    mobileNo.value = res.data.mobileNo

  } catch (err) {
    notyf.error(err.response?.data?.message || 'Update failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <div class="card shadow-sm">
          <div class="card-body">
            <h3 class="card-title mb-4">Update Profile</h3>

            <form @submit.prevent="handleUpdate">
              <div class="mb-3">
                <label class="form-label">First Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="firstName"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Last Name</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="lastName"
                  required
                />
              </div>

              <div class="mb-3">
                <label class="form-label">Mobile Number</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="mobileNo"
                  required
                />
              </div>

              <button
                type="submit"
                class="btn btn-primary w-100"
                :disabled="loading"
              >
                {{ loading ? 'Updating...' : 'Update Profile' }}
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>
