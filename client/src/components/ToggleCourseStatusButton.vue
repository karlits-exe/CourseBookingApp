<template>
    <button :class="buttonClass" class="btn" @click="toggleCourseStatus" :disabled="loading">
        {{ loading ? "Processing..." : buttonText }}
    </button>
</template>

<script setup>
import { ref, computed } from "vue";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import api from "@/api"; // Axios instance

// Props
const props = defineProps({
    course: {
        type: Object,
        required: true,
    },
});

// Emit for parent refresh
const emit = defineEmits(["status-updated"]);

const loading = ref(false);
const notyf = new Notyf();

const buttonText = computed(() => (props.course.isActive ? "Archive" : "Activate"));

const buttonClass = computed(() => (props.course.isActive ? "btn-danger" : "btn-success"));

const toggleCourseStatus = async () => {
    loading.value = true;

    const endpoint = props.course.isActive
        ? `/courses/${props.course._id}/archive`
        : `/courses/${props.course._id}/activate`;

    try {
        const token = localStorage.getItem("token");

        await api.patch(
            endpoint,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        notyf.success(
            props.course.isActive
                ? "Course archived successfully!"
                : "Course activated successfully!"
        );

        emit("status-updated"); // Notify parent to refresh course list
    } catch (err) {
        console.error(err);
        notyf.error("Action failed. Please try again.");
    } finally {
        loading.value = false;
    }
};
</script>
