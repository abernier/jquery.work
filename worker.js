self.addEventListener('message', function (event) {
	//Get the action from the string-encoded arguments
	var action = getFunc(event.data.action);
 
 	var result = action.apply(null, event.data.args);
	//Execute the newly-defined action and post result back to the callee
	self.postMessage(result);
 
}, false);
 
//Gets a Function given an input function string.
function getFunc(funcStr) {
	//Get the name of the argument. We know there is a single argument
	//in the worker function, between the first '(' and the first ')'.
	var argName = funcStr.substring(funcStr.indexOf("(") + 1, funcStr.indexOf(")"));
 
	//Now get the function body - between the first '{' and the last '}'.
	funcStr = funcStr.substring(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
 
	//Construct the new Function
	return new Function(argName, funcStr);
};