//A store is a container for managing the state of an app. 
//It is a reactive object and holds the application's data and has methods used for updating and accessing that data. 
//Stores are defined using the defineStore() function and can be registered globally or locally within a component.
import { defineStore } from 'pinia';
import { reactive } from 'vue';

//import axios to send requests to our server when the action method is used.
// import axios from 'axios';

// import the axios api instance that we created in api.js 
import api from '../api';

//defineStore() creates a store. It has 2 arguments, the unique id of the store and the callback function that defines and returns the states and actions of the store.
//States and methods from a store can be accessed globally.
//export useGlobalStore to other files. When we need access to our global state and methods, we will be able to use the useGlobalStore method to create an instance of our global store.
export const useGlobalStore = defineStore('global',() => {
	
	//user will be our global reactive object/state that can be updated and used in different parts/components of our application.
	//this will contain the user's details which can be used by other components in the app.
	let user = reactive({
		token: localStorage.getItem('token'),
		email: null,
		isAdmin: null,
		isLoading: false
	})

	//We can add a function/action that allows us to update the global state
	//This can be done in the components that uses the state. However, adding/defining the action within the store itself, makes our code more efficient, as we don't have to repeat this definition in the components.
	//getUserDetails() receives the user's email as an argument and updates our state's email property.
	//Retreive the user's details by passing its token.
    //if the route has auth.verify, or needs to pass header, we need to add a headers property.
    //Authorization is the header which contains our Bearer token.
    //res.data.access is our token from our successful login using axios.
	async function getUserDetails(token){
	  	
		// Check if the token is null, if it is, set the token, email, and isAdmin to null 
        // and return to terminate the function.
	  	if(!token) {
			user.token = null;
		  	user.email = null;
        	user.isAdmin = null;

        	return;
    	}

		user.isLoading = true;
    	//data was destructured from the response object instead.
        // use api.get to make a GET request to the /users/details endpoint.
        let { data } = await api.get('/users/details');
		
		user.isLoading = false;
		//update the global user state with the token.
		user.token = token;
        //update the global user state with the user details.
        user.email = data.email;
        //We can now add detail whether the user logged in is an admin.
        user.isAdmin = data.isAdmin;

	}

	//when useGlobalStore() is used in our application, it will return an object that contains the global state and actions.
	return {
		user,
		getUserDetails
	}
})