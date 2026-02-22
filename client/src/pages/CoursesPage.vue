<script>


import api from "../api.js";
import { ref, reactive, onMounted, onBeforeMount, watch } from "vue";

import CourseComponent from "../components/CourseComponent.vue";


import UserView from "../components/UserView.vue";
import AdminView from "../components/AdminView.vue";

import { useGlobalStore } from "../stores/global.js";

export default {
    components: {
        CourseComponent,
        UserView,
        AdminView,
        
    },
  
    setup() {
        const { user } = useGlobalStore();

        const courses = reactive({ data: [] });

        onMounted(() => console.log(courses));

        const fetchCourses = async () => {
            if (user.isLoading === false) {
                if (user.isAdmin) {
                    let { data } = await api.get("/courses/all");

                    courses.data = data;
                } else {
                    let { data } = await api.get("/courses");
                    console.log(data);
                    courses.data = data;
                }
            }
        };

        watch([user], fetchCourses, { immediate: true });

        return {
            courses,
            user,
			fetchCourses,
            
        };
    },
};
</script>

<template>
    <div class="container">
        <p v-if="user.isLoading">Loading...</p>
        <AdminView v-if="user.isAdmin && !user.isLoading" :coursesData="courses.data" :fetchCourses="fetchCourses" />
        <UserView v-if="!user.isAdmin && !user.isLoading" :coursesData="courses.data" />
    </div>
</template>
