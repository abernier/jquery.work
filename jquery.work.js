(function () {

  function work(/*action, args...*/) {
    var action = arguments[0];
    var args = (2 <= arguments.length ? [].slice.call(arguments, 1) : []);

    function deferred(dfd) {
      if (window.Worker) {
        var worker = new Worker('worker.js');
        worker.addEventListener('message', function (event) {
          //Resolve the Deferred when the Web Worker completes
          dfd.resolve(event.data);
        }, false);
   
        worker.addEventListener('error', function (event) {
          //Reject the Deferred if the Web Worker has an error
          dfd.reject(item);
        }, false);
   
        // Configure the worker with his action
        worker.postMessage({
          cmd: 'init',
          action: action.toString()
        });
        // Process
        worker.postMessage({
          cmd: 'process',
          args: args
        });
      } else {
        //If the browser doesn't support workers then execute synchronously.
        //This is done in a setTimeout to give the browser a chance to execute
        //other stuff before starting the hard work.
        setTimeout(function () {
          try {
            var result = action.apply(null, this.args);
            dfd.resolve(result);
          } catch(e) {
            dfd.reject(e);
          }
        }, 0);
      }
    };

    return $.Deferred(deferred).promise();
  };
  $.work = work;

}());