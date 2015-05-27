module.exports = function(app) {
  return new Handler(app);
};

var Handler = function(app) {
  this.app = app;
};

var Player = function() {
	this.uid;
	this.x;
	this.y;
};

var players = {};
var nextUid = 0;

/**
 * New client entry.
 *
 * @param  {Object}   uid     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.entry = function(msg, session, next) {
    var uid = nextUid++;
    // part modified by Geyang
    //var uid = parseInt(Math.random()*10000);
    //while (players[uid]) uid = parseInt(Math.random()*10000);
	players[uid] = new Player();
	players[uid].uid = uid;
	next(null, {code: 200, uid: uid});
};

Handler.prototype.update = function(msg, session, next) {
	console.log(msg);
	players[msg.uid].x = msg.x;
	players[msg.uid].y = msg.y;
	next(null, {code:200, list: players});
}

/**
 * Publish route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.publish = function(msg, session, next) {
	var result = {
		topic: 'publish',
		payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
	};

	next(null, result);
};

/**
 * Subscribe route for mqtt connector.
 *
 * @param  {Object}   msg     request message
 * @param  {Object}   session current session object
 * @param  {Function} next    next step callback
 * @return {Void}
 */
Handler.prototype.subscribe = function(msg, session, next) {
	var result = {
		topic: 'subscribe',
		payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
	};
	
	next(null, result);
};
