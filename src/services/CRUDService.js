const connection = require("../config/database");


const getAllUsers = async (req, res) => {
  const [results, fields] = await connection.query(
    'select * from Users;'
  );
  console.log(results)
  return results;
}

const getUserById = async (userId) => {
  const [results, fields] = await connection.query(
    'select * from Users where id= ?;', [userId]
  );
  let user = results && results.length > 0 ? results[0] : {}
  console.log(users)

  return user;
}

const updateUserById = async (email, city, name, userId) => {
  let [results, fields] = await connection.query(
    `
    INSERT INTO Users ( email, name, city ) VALUES ( ?, ?, ?) 
    UPDATE Users
    SET email = ? , city = ? , name = ?
    WHERE id = ?
    `, [email, city, name, userId]
  );
}

const deleteUserById = async (userId) => {
  const [results, fields] = await connection.query(
    'DELETE FROM Users where id= ?;', [userId]
  );
}
module.exports = {
  getAllUsers, getUserById, updateUserById, deleteUserById
}