const express = require('express');
const oracledb = require('oracledb');
const db = require("../db");
const router = express.Router();

router.get('/', async (req, res) => {
  const { keyword, orderKey } = req.query;
  let order = " ORDER BY ";
  if(orderKey == "date"){
    order += "CDATETIME DESC"
  } else if(orderKey == "title"){
    order += "TITLE ASC"
  } else if(orderKey == "cnt"){
    order += "CNT DESC"
  }
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        SELECT 
            BOARDNO AS "boardNo",
            TITLE AS "title",
            USERID AS "userId",
            CNT AS "cnt",
            TO_CHAR(CDATETIME, 'YYYY-MM-DD') AS "cDateTime"
        FROM TBL_BOARD
        WHERE TITLE LIKE '%' || :keyword || '%'
      ` + order,
      [keyword],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    
    res.json({
        result : "success",
        list : result.rows
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

router.get('/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        SELECT 
            BOARDNO AS "boardNo",
            TITLE AS "title",
            USERID AS "userId",
            CNT AS "cnt",
            TO_CHAR(CDATETIME, 'YYYY-MM-DD') AS "cDateTime",
            CONTENTS AS "contents"
        FROM TBL_BOARD  
        WHERE BOARDNO = :boardNo
      ` ,
      [boardNo],
      // result 안에 rows는 키 안에 json형태로 db데이터를 반환
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    
    res.json({
        result : "success",
        info : result.rows[0]
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});


router.delete('/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        DELETE FROM TBL_BOARD 
        WHERE BOARDNO = :boardNo
      ` ,
      [boardNo],
      {autoCommit : true}
    );
    
    res.json({
        result : "success",
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

router.put('/:boardNo', async (req, res) => {
  const { boardNo } = req.params;
  const { title, contents, QQQ } = req.body;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        UPDATE TBL_BOARD SET
          TITLE = :title,
          CONTENTS = :contents
        WHERE BOARDNO = :boardNo
      ` ,
      [ title, contents, boardNo],
      {autoCommit : true}
    );
    
    res.json({
        result : "success",
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

router.post('/', async (req, res) => {
  const { title, contents, userId } = req.body;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
        INSERT INTO TBL_BOARD 
        VALUES(BOARD_SEQ.NEXTVAL, :userId, :title, :contents, 0, '1', SYSDATE, SYSDATE)
      ` ,
      [ userId, title, contents],
      {autoCommit : true}
    );
    
    res.json({
        result : "success",
    });
    
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  } finally {
    await connection.close();
  }
});

module.exports = router;