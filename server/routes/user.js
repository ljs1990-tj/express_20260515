const express = require('express');
const oracledb = require('oracledb');
const db = require("../db");
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;

// user
router.post('/login', async (req, res) => {
  const { userId, pwd } = req.body;
  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM TBL_USER WHERE USERID = :userId`,
      [userId],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    console.log(result.rows); 
    let message = "";
    let info = {}
    
    if(result.rows.length > 0){
      let match = await bcrypt.compare(pwd, result.rows[0].PWD);
      if(match){
          message = "success";
          info = {
            userId : result.rows[0].USERID,
            userName : result.rows[0].USERNAME,
          }
      } else {
        // 비밀번호 틀림
        message = "fail";
      }
    } else {
      // 로그인 실패 - 아이디도 맞는거 없음
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

router.post('/join', async (req, res) => {
  const { userId, pwd, userName } = req.body;
  const hashPwd = await bcrypt.hash(pwd, saltRounds);
  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO TBL_USER(USERID, PWD, USERNAME) VALUES(:userId, :hashPwd, :userName)`,
      [userId, hashPwd, userName],
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

router.get('/check/:userId', async (req, res) => {
  const { userId } = req.params;
 
  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM TBL_USER WHERE USERID = :userId`,
      [userId],
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    
    let r = "";
    if(result.rows.length > 0){
      // 이미 사용중인 아이디
      r = false;
      message = "이미 사용중인 아이디 입니다."
    } else {
      // 사용 가능한 아이디
      r = true;
      message = "사용가능한 아이디 입니다."
    }
    res.json({
        result : r,
        message : message
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

module.exports = router;