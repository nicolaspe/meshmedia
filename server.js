var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var ss = require('socket.io-stream');
var fs = require('fs');
var path = require('path');


app.get('/video', function(req, res) {
	const path = 'assets/nouf_io.mp4';
	const stat = fs.statSync(path);
	const fileSize = stat.size;
	const range = req.headers.range;
	//res.send("Hello World!");

	if (range) {
		const parts = range.replace(/bytes=/, "").split("-")
		const start = parseInt(parts[0], 10)
		const end = parts[1]
		? parseInt(parts[1], 10)
		: fileSize-1
		const chunksize = (end-start)+1
		const file = fs.createReadStream(path, {start, end});

		const head = {
			'Content-Range': `bytes ${start}-${end}/${fileSize}`,
			'Accept-Ranges': 'bytes',
			'Content-Length': chunksize,
			'Content-Type': 'video/mp4',
		}

    	res.writeHead(206, head);
    	file.pipe(res);
	} else {
		const head = {
			'Content-Length': fileSize,
			'Content-Type': 'video/mp4',
		}

		res.writeHead(200, head)
		fs.createReadStream(path).pipe(res)
	}
});


//anonymous function
server.listen(8500, function () {
	  console.log('Server listening on port 8500!')
});

app.use(express.static('public'));
