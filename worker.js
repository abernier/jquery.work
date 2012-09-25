function Task(action) {
	this.action = Task.getFunc(action);
}
Task.prototype.execute = function (args) {
	if (!this.action) {
		return; // return if no action defined
	}

	return this.action.apply(null, args);
};
Task.getFunc = function (funcStr) {
	//Gets a Function given an input function string.

	//Get the name of the argument. We know there is a single argument
	//in the worker function, between the first '(' and the first ')'.
	var argName = funcStr.substring(funcStr.indexOf("(") + 1, funcStr.indexOf(")"));
 
	//Now get the function body - between the first '{' and the last '}'.
	funcStr = funcStr.substring(funcStr.indexOf("{") + 1, funcStr.lastIndexOf("}"));
 
	//Construct the new Function
	return new Function(argName, funcStr);
};

var task;

self.addEventListener('message', function (event) {
	var cmd = event.data.cmd;
	switch (cmd) {
		case 'init':
			task = new Task(event.data.action);
		break;
		case 'process':
			var result = task.execute(event.data.args);
			if (result) {
				self.postMessage(result);
			}
		break;
	}
}, false);