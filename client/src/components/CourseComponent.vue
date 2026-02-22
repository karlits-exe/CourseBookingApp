<template>
	<div class="col-12 col-md-6 col-lg-4 my-3">
		<div id="CourseCard" class="card p-2 cardHighlights shadow-sm" style="min-height: 100%">
			<img 
				class="card-img-top"
				:src="`https://placehold.co/600x400/377399/ffffff?font=lora&text=${encodeURIComponent(courseData.name)}`"
				:alt="courseData.name"
			>
			<div class="card-body d-flex flex-column gap-2">
				<h4 class="card-title fw-bold mb-2">
					
					{{courseData.name}}
				</h4>
				<p class="card-text text-muted mb-2">
					
					{{courseData.description.slice(0, 100) + (courseData.description.length > 100 ? '...' : '')}}
				</p>
				<p class="mb-1">
				<span class="fw-semibold">Price:</span> PHP {{ courseData.price }}
				</p>
				
				<div class="d-grid d-md-block mt-md-auto">
					
				
					<router-link class="btn btn-outline-primary d-block" :to="{ path: `/courses/${courseData._id}`}">View Course</router-link>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

	
    import { ref, watch } from "vue";

	
	import { useGlobalStore } from "../stores/global";

    import { Notyf } from 'notyf';

    const notyf = new Notyf();

  	export default {
	    props: {
	      courseData: Object
	    },
	    
    	setup({courseData}){
	    
	      
		const {user} = useGlobalStore();

		console.log(user);
	      
	      return {
			user
	      }
	    }
    }
</script>	

