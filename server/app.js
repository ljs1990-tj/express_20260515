const express = require('express');
const cors = require('cors');
const path = require('path');
const oracledb = require('oracledb');
var QRCode = require('qrcode')

// router
const studentRouter = require("./routes/student");
const userRouter = require("./routes/user");
const boardRouter = require("./routes/board");
const db = require("./db");

const app = express();
app.use(cors());
app.use(express.json())

// ejs 설정
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '.')); // .은 경로

app.use("/student", studentRouter)
app.use("/user", userRouter)
app.use("/board", boardRouter)

let connection;

async function startServer() {
  try {
    await db.init();
    console.log('Successfully connected to Oracle database');

    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });

  } catch (err) {
    console.error('Error connecting to Oracle database. Server not started.', err);
    process.exit(1); // DB 연결 실패 시 프로세스 종료 (선택 사항)
  }
}

app.get("/qrcode", async (req, res)=>{
  try{

    let qrImg = await QRCode.toDataURL("https://www.naver.com");
    res.send(
      `
        <img src=${qrImg}>
      `
    )
  }catch(err){
    console.log(err);
  }
})


startServer();



