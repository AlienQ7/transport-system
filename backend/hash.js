const bcrypt = require("bcryptjs");

bcrypt.hash("local", 10).then(console.log);
