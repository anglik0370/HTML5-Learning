const http = require('http');


//http = websever => 요청과 응답
const server = http.createServer((req, res) => {

    res.write("<h1>안녕 노드 서버</h1>");
    res.end("<p>더이상 쓸거 없음!</p>");
});

server.listen(8080);