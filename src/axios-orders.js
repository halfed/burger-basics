import axios from 'axios';

const instance = axios.create({
	baseURL: 'https://burger-builder-39f08.firebaseio.com/'
});

export default instance;