const connection = require("../config/database");
const { getAllUsers, updateUserById } = require("../services/CRUDService");

const getHomepage = async (req, res) => {
  let results = await getAllUsers();
  console.log(results)

  res.send('Hello world !!!')
}

const postCreateUser = (req, res) => {
  // let { email, name, city} = req.body;
  let email = 'em01@g.c';
  let name = 'em01';
  let city = 'hanoi';
  connection.query(
    `INSERT INTO 
    Users ( email, name, city)
    VALUES (?,?,?)`, [email, name, city],

    function (err, results, fields) {
      console.log('result <<', results);
    }
  );
  console.log("<<req.body<<", req.body)
}

const postUpdateUser = async (req, res) => {
  // let { email, name, city, id} = req.body;
  let email = 'em01@g.c';
  let name = 'em01';
  let city = 'hanoi';
  let userId = '1';

  await updateUserById(email, city, name, userId);

  res.send('Update User succeed!')
}

module.exports = {
  getHomepage, postCreateUser
}