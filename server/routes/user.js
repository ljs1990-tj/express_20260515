const express = require('express');
const oracledb = require('oracledb');
const db = require("../db");
const router = express.Router();

// user
router.post('/login', async (req, res) => {
  const { userId, pwd } = req.body;
  try {
    let connection = await db.getConnection();
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

router.post('/join', async (req, res) => {
  const { userId, pwd, userName } = req.body;

  try {
    let connection = await db.getConnection();
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

module.exports = router;