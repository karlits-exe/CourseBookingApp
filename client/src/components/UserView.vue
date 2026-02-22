<template>
    <div class="row">
        <div class="col my-5">
            <h1 class="text-center text-primary py-1">Courses Offered</h1>
            <p class="text-center">Select a course to enroll in!</p>
			<!-- <CourseSearch /> -->
            <CourseSearch />
        </div>
    </div>
    <div class="row g-4">
      		<CourseComponent v-for="course in coursesData" :courseData="course" />

		</div>
</template>

<script setup>
import CourseComponent from '../components/CourseComponent.vue';
import CourseSearch from '../components/CourseSearch.vue';
import { defineProps } from 'vue';

const props = defineProps({
    coursesData: Array
});

</script>