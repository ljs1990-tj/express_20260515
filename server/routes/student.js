const express = require('express');
const oracledb = require('oracledb');
const db = require("../db");
const router = express.Router();

// /student
router.get('/', async (req, res) => {
  const { keyword } = req.query;
  let connection;
  try {
    connection = await db.getConnection();
    const result = await connection.execute(
      `
      SELECT * FROM STUDENT
      WHERE STU_NAME LIKE '%' || :keyword || '%'
      `,
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
  } finally{
    connection.close();
  }
});

router.get('/:stuNo', async (req, res) => {
  const { stuNo } = req.params;
  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `
        SELECT 
          STU_NO AS "stuNo",
          STU_NAME AS "stuName",
          STU_DEPT AS "stuDept",
          STU_GRADE AS "stuGrade"
        FROM STUDENT WHERE STU_NO = :stuNo
      `,
      [stuNo],
      {outFormat: oracledb.OUT_FORMAT_OBJECT}
    );
    console.log(result)
    res.json({
        result : "success",
        info : result.rows[0]
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

router.delete('/:stuNo', async (req, res) => {
  console.log("DELETE 호출!")
  console.log(req.params)
  const { stuNo } = req.params;

  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `DELETE FROM STUDENT WHERE STU_NO = :stuNo`,
      [stuNo],
      {autoCommit : true}
    );

    res.json({
        result : "success",
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

router.put('/:stuNo', async (req, res) => {
  const { stuNo } = req.params;
  const { stuName, stuDept, stuGrade } = req.body;

  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `
        UPDATE STUDENT SET
          STU_NAME = :stuName,
          STU_DEPT = :stuDept,
          STU_GRADE = :stuGrade
        WHERE STU_NO = :stuNo
      `,
      [stuName, stuDept, stuGrade,stuNo],
      {autoCommit : true}
    );

    res.json({
        result : "success",
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

router.post('/', async (req, res) => {
  console.log("POST 호출!")
  console.log(req.body)
  const { stuNo, stuName, stuDept, stuGrade } = req.body;

  try {
    let connection = await db.getConnection();
    const result = await connection.execute(
      `INSERT INTO STUDENT(STU_NO, STU_NAME, STU_DEPT, STU_GRADE) VALUES(:stuNo, :stuName, :stuDept, :stuGrade)`,
      [stuNo, stuName, stuDept, stuGrade],
      {autoCommit : true}
    );

    res.json({
        result : "success",
    });
  } catch (error) {
    console.error('Error executing query', error);
    res.status(500).send('Error executing query');
  }
});

module.exports = router;