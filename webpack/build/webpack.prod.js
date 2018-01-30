const webpack = require('webpack');
const filePath = require('./webpack.path.js');

const HtmlWebpackPlugin = require('html-webpack-plugin');//生成html插件
const CleanWebpackPlugin = require('clean-webpack-plugin');//删除旧文件
const ExtractTextPlugin = require("extract-text-webpack-plugin");//分离样式文件

// -----------------------------生产环境----------------------------

module.exports = {

    devtool : 'cheap-module', //便于生成环境

    entry : {
		index : filePath.DEV_PATH + '/index.js', //唯一入口文件
		//命名需要缓存的文件，以便后续直接从缓存中提取
        vendor: ['jquery','vue']
	},

    output : {

        path : filePath.BUILD_PATH + '/js/', //输出路径

        filename : '[name]-[chunkhash:6].min.js' //输出文件名
    },

    //loader配置
	module : {
		loaders : [

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
									resources : filePath.DEV_PATH + '/common/style.scss'
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
						],

						//提取样式文件
						scss:ExtractTextPlugin.extract({
							fallback: 'vue-style-loader',
							use: ['css-loader','sass-loader']
						})
					}
				}
				
			},
			//编译js
			{
				test : /\.js$/, //匹配js文件
				loader : 'babel-loader', //相关loder配置
				exclude: /(node_modules)/ //排除nodemodules文件夹
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
  
    //插件数组
    plugins : [
        
        //配置生成的html文件
        new HtmlWebpackPlugin({
            filename : filePath.BUILD_PATH + '/index.html', //生成文件
            template : filePath.DEV_PATH + '/index.html', //html模板
			inject : 'body'//引入文件的注入位置
		}),

		//配置删除旧文件
		new CleanWebpackPlugin(
			[filePath.BUILD_PATH + '/js/*.js',filePath.BUILD_PATH + '/css/*.css'],//要删除的文件目录匹配
			{
			  root:filePath.ROOT_PATH,//根目录
			  verbose:true, //将日志写入控制台
			  dry:false //删除文件 'true'模拟删除（不会删除文件）
			}
		),

		//配置js压缩
		new webpack.optimize.UglifyJsPlugin({
			exclude:['/node_modules/']//排除不需要压缩的文件夹
		}),

		//引入全局模块
        new webpack.ProvidePlugin({  
            $: 'jquery'
		}),

		//该插件会根据模块的相对路径生成一个四位数的hash作为模块id, 建议用于生产环境
        new webpack.HashedModuleIdsPlugin(),
		
		//提取公共模块
		/*
		 *	使用该模块提取出有改动的代码（index），manifest（webpack运行的代码），vendor(不需要改动的代码，以便后续从缓存中拿取)
		 * 	使用该模块配合HashedModuleIdsPlugin每次打包只会打包所需要的文件（index）和manifest(webpack运行的代码)
		 * 
		*/
		new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor' //从index提取不需要修改的生成vendor
		}),	
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks:['vendor'] //从所选文件中提取webpack运行的代码生成manifet文件
		}),

		//分离样式文件
		new ExtractTextPlugin({
			filename : '../css/[name]-[hash:6].css', //默认js目录
			allChunks : true
		})


        

    ]
}