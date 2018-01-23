# webpack #

[webpack](https://webpack.js.org)是一个前端资源打包工具，你可以选择将css，scss，less，img全部打包成js文件。现在前端开发都是使用webpack配合框架来构建项目；初次使用webpack是配合前端框架[vue](https://cn.vuejs.org),使用vue-cli脚手架搭建的项目，先说下使用vue-cli遇到的问题。

## vue-cli ##

使用vue-cli脚手架搭建环境
1. 先使用**npm install -g vue-cli**安装全局vue-cli

2. 使用**vue init webpack 你的项目名**基于webpack构建项目
    >使用该命令，系统会进行安装步骤，可以直接回车不用管。  
    **Use ESLint to lint your code**是官网默认推荐使用ESLint语法检测。  
    **Set up unit tests**是否安装单元测试。  
    **Setup e2e tests with Nightwatch**是否安装e2e测试

3. 使用**npm install**安装模块  

## 目录 ##  

<img src="./img/微信图片_20180123100459.png"/>  

目录|介绍  
-|- 
build|基于webpack项目构建相关代码
config|项目开发环境配置相关代码 
node_modules|项目依赖相关模块 
src|源代码目录 
static|静态资源文件目录  


    

    

    




