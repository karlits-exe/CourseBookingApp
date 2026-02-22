<script setup>
import { ref } from 'vue'
import { Notyf } from 'notyf'
import api from '@/api'

const searchName = ref('')
const courses = ref([])
const loading = ref(false)

const notyf = new Notyf()

const handleSearch = async () => {
  try {
    if (!searchName.value.trim()) {
      notyf.error('Please enter a course name')
      return
    }

    loading.value = true

    const res = await api.post('/courses/search', {
      name: searchName.value
    })

    courses.value = res.data

    if (courses.value.length === 0) {
      notyf.error('No courses found')
    }
  } catch (err) {
    notyf.error(err.response?.data?.message || 'Search failed')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="container mt-5">
    <div class="card shadow-sm">
      <div class="card-body">
        <h3 class="card-title mb-4">Search Course</h3>

        <!-- Search Form -->
        <form @submit.prevent="handleSearch" class="row g-3">
          <div class="col-md-9">
            <input
              type="text"
              class="form-control"
              placeholder="Enter course name..."
              v-model="searchName"
            />
          </div>

          <div class="col-md-3">
            <button
              type="submit"
              class="btn btn-primary w-100"
              :disabled="loading"
            >
              {{ loading ? 'Searching...' : 'Search' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Results -->
    <div class="row mt-4" v-if="courses.length">
      <div
        class="col-md-4 mb-3"
        v-for="course in courses"
        :key="course.id"
      >
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ course.name }}</h5>
            <p class="card-text">{{ course.description }}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
