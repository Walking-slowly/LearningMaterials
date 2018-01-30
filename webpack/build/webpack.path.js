//路径文件
const path = require("path");

//定义路径
const ROOT_PATH = path.join(__dirname); //锁定当前路径

const DEV_PATH = path.resolve(ROOT_PATH, "src"); //定义开发路径

const BUILD_PATH = path.resolve(ROOT_PATH, "build"); //定义生产路径

module.exports = {
	ROOT_PATH,
	DEV_PATH,
	BUILD_PATH,
}
