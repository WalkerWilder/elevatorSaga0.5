import dotenv from "dotenv";
dotenv.config();

const app = require("./app");
const appWs = require("./appWs");
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App Express is running on port ${port}!`);
});

appWs(server);
