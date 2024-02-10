


const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const jwtSecretKey = process.env.JWT_SECRET_KEY;

const saltRounds = 10;
const salt = bcrypt.genSaltSync(saltRounds);
const { MongoClient,ServerApiVersion } = require("mongodb");

const uri = "mongodb+srv://taskapp:TaskAppApi@cluster0.pj4eq8e.mongodb.net/?retryWrites=true&w=majority";
const client =  new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
    useUnifiedTopology: true
  }
});

export async function findUser(username) {
  await client.connect()
  const database = client.db('ecommerce');
    const users = database.collection('users');
    var cc= await users.findOne({"username":username});
    // console.log(cc)
    // await client.close();
    return cc;

}

export function isUserExists(username) {
  return findUser(username) || false;
}
export async function login(username, password) {
  if (!username || !password) {
    return {
      error: "WRONG_CREDENTIAL",
      message: `Both Username and Password are required.`,
    };
  }

  if (await !isUserExists(username)) {
    return {
      error: "USER_NOT_FOUND",
      message: `${username} is not defined, make sure the user is registered before.`,
    };
  }
  const user = await findUser(username); 
  console.log(user)
  const hashedPassword = hashPassword(password);
  console.log('pass')
  console.log(hashedPassword);
console.log(user.password)
  if (!checkPassword(password, user.password)) {
    return {
      error: "WRONG_CREDENTIAL",
      message: "Your Password is wrong. Shame on you!(^_^)",
    };
  }else{
    console.log("here")
  }

  const token = jwt.sign({ username: user.username, email: user.email, id: user.id }, jwtSecretKey, {
    expiresIn: 3000,
  });
  console.log(token)
  return {
    payload: {
      token
    },
  };
}


export async function register({ username, password, email }) {
  if (!username || !password || !email) {
    return errorMessage("WRONG_CREDENTIAL", `Username, password and email is required.`);
  }

  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return errorMessage("WRONG_CREDENTIAL", `${email} is wrong.`);
  }

  if (await isUserExists(username)) {
    console.log("here")
    return errorMessage(
      "DUPLICATE_USER",
      `${username} has already registered. Try another username(But never mind, don't do this.)`
    );
  }

  const hashedPassword = hashPassword(password);
  await client.connect()
  const database = await client.db('ecommerce');
    const users = await database.collection('users');
    await users.insertOne({username, "password": hashedPassword, email});
  
  return {
    isSuccessful: true,
    payload: {},
  };
}

export function whoAmI(username) {
  if (!username || !isUserExists(username)) {
    return {
      error: "USER_NOT_FOUND",
      message: `${username} is not defined, make sure the user is registered before.`,
    };
  }

  const user = findUser(username);
  return {
    isSuccessful: true,
    payload: {
      username: user.username,
      id: user.id,
      email: user.email,
    },
  };
}

function hashPassword(password) {
  return bcrypt.hashSync(password, 8);
}

function checkPassword(currentHashedPassword, hashedPassword) {
  return bcrypt.compare(currentHashedPassword, hashedPassword);
}

export function verifyToken(token) {
  return jwt.verify(token, jwtSecretKey);
}

function errorMessage(error, message) {
  return {
    isSuccessful: false,
    error,
    message,
  };
}
