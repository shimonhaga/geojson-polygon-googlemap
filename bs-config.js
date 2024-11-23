require('dotenv').config()

module.exports = {
  "port": process.env.PORT || 3001,
  "proxy": "http://localhost:" + (process.env.SERVER_PORT || 3002),
  "ui": {
    "port": process.env.UI_PORT || 3003
  },
  "files": [ "public/app.js", "src/index.ejs" ],
};
