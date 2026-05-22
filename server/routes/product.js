const express = require('express');
const oracledb = require('oracledb');
const db = require("../db");
const router = express.Router();

router.get('/', async (req, res) => {
  const { } = req.query;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `SELECT * FROM PRODUCT`,
      [],
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
    connection.close();
  }
});

module.exports = router;