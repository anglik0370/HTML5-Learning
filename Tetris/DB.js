const mysql = require('mysql2');
const connectionData = require('./secret.js');

const pool = mysql.createConnection(connectionData); //DB에 연결
const promisePool = pool.promise(); //프로밈스 풀로 업그레이드


async function Query(sql, data = [])
{
    const [rows, field] = await promisePool.query(sql, data);
    return rows;
}

module.exports = {
    Query,
    Pool:promisePool
}