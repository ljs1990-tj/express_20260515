const express = require('express');
const cors = require('cors');
const path = require('path');
const oracledb = require('oracledb');
const studentRouter = require("./routes/student");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json())

// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.')); // .은 경로

app.use("/student", studentRouter)

let connection;

async function startServer() {
  try {
    db.init();
    console.log('Successfully connected to Oracle database');

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });

  } catch (err) {
    console.error('Error connecting to Oracle database. Server not started.', err);
    process.exit(1); // DB 연결 실패 시 프로세스 종료 (선택 사항)
  }
}

startServer();

// user
app.post('/user/login', async (req, res) => {
  const { userId, pwd } = req.body;
  try {
    const result = await connection.execute(
      `SELECT * FROM TBL_USER WHERE USERID = :userId AND PWD = :pwd`,
      [userId, pwd],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    console.log(result.rows); 
    let message = "";
    let info = {}
    
    if(result.rows.length > 0){
      message = "success";
      info = {
        userId : result.rows[0].USERID,
        userName : result.rows[0].USERNAME,
      }
    } else {
      // 로그인 실패
      message = "fail";
    }
    
    res.json({
        message : message,
        info : info
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

app.post('/user/join', async (req, res) => {
  const { userId, pwd, userName } = req.body;

  try {
    const result = await connection.execute(
      `INSERT INTO TBL_USER(USERID, PWD, USERNAME) VALUES(:userId, :pwd, :userName)`,
      [userId, pwd, userName],
      {autoCommit : true}
    );
    console.log(result);
    if(result.rowsAffected > 0){
      // 성공
    } else {
      // 실패
    }
    res.json({
        result : "success",
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

