const baseUrl = 'http://localhost:8080/todos'

export const loadTodos = () => {
	return fetch(baseUrl)
		.then(res => res.json())
}

export const loadChildren = (id, status) => {
	var query = '?parent=' + id;
	// query += status ? '&status=' + status : ''
	return fetch(baseUrl + query)
		.then((res) => {
			return res.json().then(function(json){
				let sortedJson = json.sort(function(obj1, obj2) {
					return obj1.position - obj2.position;
				});
				return sortedJson;
			});
		});
}

export const loadStatus = (status) => {
	var query = '?status=' + status;
	return fetch(baseUrl + query)
		.then(res => res.json());
}

export const createTodo = (todo) => {
	return fetch(baseUrl, {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(todo)
	}).then(res => res.json)
}

export const saveTodo = (todo) => {
	return fetch(`${baseUrl}/${todo.id}`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(todo)
	}).then(res => res.json)
}

export const saveChildNodes = (nodes) => {
	return fetch(`${baseUrl}/${parent.id}`, {
		method: 'PUT',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(nodes)
	}).then(res => res.json)
}

export const destroyTodo = (id) => {
	return fetch(`${baseUrl}/${id}`, {
		method: 'DELETE',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		}
	})
}