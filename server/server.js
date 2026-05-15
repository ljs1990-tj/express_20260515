const express = require('express');

const app = express()
const oracledb = require('oracledb');

const config = {
  user: 'SYSTEM',
  password: 'test1234',
  connectString: 'localhost:1521/xe'
};

// Oracle 데이터베이스와 연결을 유지하기 위한 전역 변수
let connection;

// 데이터베이스 연결 설정
async function initializeDatabase() {
  try {
    connection = await oracledb.getConnection(config);
    console.log('Successfully connected to Oracle database');
  } catch (err) {
    console.error('Error connecting to Oracle database', err);
  }
}

initializeDatabase();

app.get('/', (req, res) => {
  res.send('Hello World')
})

app.get('/test', (req, res) => {
  res.send('Hello Express HaHaHa')
})


app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000')
})