export const addTodo = (list, item, id, index) => {
	// const insertAfterIndex = list.findIndex(item => item.id === id)
	const insertAfterIndex = index
	const newList = [
		...list.slice(0,insertAfterIndex+1),
		item,
		...list.slice(insertAfterIndex+1)
	]
	for(let i=0; i<newList.length; i++)
		newList[i].position = i;
	return newList;
}

export const generateId = () => Math.floor(Math.random()*10000)

export const findById = (id, list) => list.find(item => item.id === id)

export const toggleTodo = (todo) => ({...todo, isCompleted: !todo.isCompleted})

export const updateNode = (list, node) => {
	const oldPos = list.findIndex(item => item.id === node.id)
	const newList = [
		...list.slice(0,oldPos),
		...list.slice(oldPos+1)
	]
	const newPos = node.position;
	newList.splice(newPos, 0, node);
	for(let i=0; i<newList.length; i++)
		newList[i].position = i;
	return newList
}

export const removeTodo = (list, id) => {
	const removeIndex = list.findIndex(item => item.id === id)
	const newList = [
		...list.slice(0,removeIndex),
		...list.slice(removeIndex+1)
	]
	for(let i=0; i<newList.length; i++)
		newList[i].position = i;
	return newList
}

export const filterByStatus = (list, status) => {
	if(!status)
		return list;
	else{
		return list.filter(node => node.status === status);
	}
}

export const sortTodos = (list, route) => {
	switch(route) {
		case '/active':
			return list.filter(item => !item.isCompleted)
		case '/complete':
			return list.filter(item => item.isCompleted)
		default:
			return list
	}
}