
//引入
const webpack = require('webpack');
const filePath = require('./webpack.path.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');//生成html插件

//------------------开发环境------------------------

module.exports = {

	devtool : 'cheap-module-eval-source-map', //便于开发调试,用于锁定代码出错片段

	entry : filePath.DEV_PATH + '/index.js', //指定入口文件

	output : {

		path : filePath.BUILD_PATH, //指定输出路径

		filename : 'index.js' //指定输出文件名,
	},

	//loader配置
	module : {
		rules : [

			//编译vue文件
			{
				test : /\.vue$/,
				loader : 'vue-loader',
				options : {
					loaders : {
						
						//编译scss文件
						scss : [
							'vue-style-loader',
							'css-loader',
							'sass-loader',
							{
								loader: 'sass-resources-loader',
								options: {
									// 引入全局scss，以实际项目目录为准
									resources: filePath.DEV_PATH + '/common/style.scss'
								}
							}
						],

						//编译sass文件
						sass : [
							'vue-style-loader',
							'css-loader',
							'sass-loader?indentedSyntax=1',
							{
								loader: 'sass-resources-loader',
								options: {
									// 需更改为项目中实际scss文件路径
									resources: filePath.DEV_PATH + '/common/style.scss'
								}
							}
						]
										
					}
				}
			},
			//编译js
			{
				test : /\.js$/, //匹配js文件
				loader : 'babel-loader', //相关loder配置
				exclude: /(node_modules)/ //排除nodemodules文件夹
			},
			//编译图片
			{
				test : /\.(png|jsp|gif|jpg)/, //匹配图片
				loader : 'url-loader'
			}

			

		]
	},

	//对vue模块名的简写和地址重定向
	// vue2.0加上这一句
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js'
		},
	},

	//监听
	devServer : {

		contentBase : filePath.DEV_PATH + '/', //服务器在当前目录搭建页面

		inline : true, //自动刷新 注意：还需要再命令行添加 --inline

		port : 3000, //端口

		// host : "192.168.1.141", //使用本地ip
		hot : true, //模块热替换

		open : true //自动打开浏览器
	},

	//插件数组
    plugins : [

       	new webpack.NoEmitOnErrorsPlugin(), //防止出错时webpack进程退出

		//配置生成的html文件
        new HtmlWebpackPlugin({
            filename : 'index.html', //生成文件名
            template : filePath.DEV_PATH + '/index.html', //html模板
            inject : 'body'//引入文件的注入位置
            //favicon: '',//指定页面图标
            //压缩配置
            // minify : {
            // },
            // cache : true, //缓存，只有文件被修改后才生成

		}),

        //引入全局模块
        new webpack.ProvidePlugin({  
            $: 'jquery'
		})
			
    ]

	

}
