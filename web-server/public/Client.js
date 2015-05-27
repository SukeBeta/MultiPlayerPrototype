var pomelo = window.pomelo;
var host = "127.0.0.1";
var port = "3010";

function connect(cb) {
	var route = "connector.entryHandler.entry";
	pomelo.init({
		host: host,
		port: port,
		log: true
	}, function() {
		console.log("Yo");
		pomelo.request(route, {}, function(data) {
				console.log("Lo");
				if (data.code != 200) {
					alert(data);
					return;
				}
				cb(data.uid);
			})
	});
}

//Upload player's coordinate
//Withdraw player list with coordinates
function update(id, x, y, cb) {
	var route = "connector.gameHandler.update";
	pomelo.request(route, {uid: id, x:x, y:y}, function(data) {
		if (data.code != 200) {
			alert(data);
			return;
		}
		cb(data.list);
	});
}