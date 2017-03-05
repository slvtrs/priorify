export const partial = (fn, ...args) => 
	// ...args takes array of any other arguments
	fn.bind(null, ...args)
	// partial is used to call a parent's function without needing the first param...
	// i think, I don't get this function

const _pipe = (f, g) => (...args) => g(f(...args))
// accepts two functions, returns new func of 2(1())

export const pipe = (...fns) => fns.reduce(_pipe)
// accepts array of functions, returns them nested
// reduce puts first 2 through the function that is passed to it, then pus the result and the 3rd value through the function, and so on