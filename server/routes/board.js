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
  try {
    let connection = await db.getConnection();
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
  }
});


module.exports = router;