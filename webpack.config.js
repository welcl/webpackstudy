const path = require('path');
const webpack = require('webpack');
 //引入html模块插件
const HtmlWebpackPlugin = require('html-webpack-plugin');
 //清理/dist文件夹插件
// const CleanWebpackPlugin = require('clean-webpack-plugin');
//压缩JS代码：
const uglify = require('uglifyjs-webpack-plugin');
//把css文件从js中分离出来(webpack4.0后这个插件的版本也要对应上)
const ExtractWebpackPlugin = require('extract-text-webpack-plugin');
//引入glob
const glob = require('glob');
//引入purifycss来处理没有用到的css文件
const PurifyCssPlugin = require('purifycss-webpack');
//引入模块化后的entry模块
const entry=require('./webpack_config/entry_webpack.js');
//引入打包静态资源的插件
const copyWebpackPlugin = require('copy-webpack-plugin');
//这里设置一个对象的属性充当一个变量,在pubolicPath中调用
console.log(encodeURIComponent(process.env.type));
//判断是生产环境还是开发环境并选择相应地址
if(process.env.type=="build"){
	var website={
		publicPath:'http://localhost:8080/'
	}
}else{
	var website={
		publicPath:'http://localhost:8080/'
	}
}


module.exports = {
	//配置打包时报错的类型
	devtool:'cheap-module-eval-source-map',
	//入口文件的配置
	entry:{
		app:'./src/index.js',
		jQuery:'jquery',
		Vue:'vue'
	},
	// devtool: 'inline-source-map',
	//服务器配置
	devServer: {
		//设置基本目录结构
		contentBase: path.resolve(__dirname, 'dist'),
		//服务器的IP地址，可以使用IP也可以使用localhost
		host: 'localhost',
		//服务端压缩是否开启
		compress: true,
		//配置服务端口号
		port: 8080

	},
	//模块,包含对js,css,字体等的处理
	module: {
		rules: [{
			test: /\.css$/,
			// use: [
			// 	'style-loader',
			// 	'css-loader'
			// ]
			use: ExtractWebpackPlugin.extract({
				fallback:'style-loader',
				use:[
				{ loader:'css-loader',options:{importLoaders: 1} },
				'postcss-loader'
				]
			})
		}, {
			test: /\.(png|svg|jpg|gif)$/,
			use: [{
					loader: 'url-loader',
					options: {
						//当图片比这个值大的时候就在显示dist里,比这个值小就转成base64写到js代码里
						limit: 500,
						//图片生成后存放的路径
						outputPath:'images/'
					}
				}
			]
		},{
			test:/\.(htm|html)$/i,
			//处理在html中写入img图片在webpack不打包问题
			use:['html-withimg-loader']
		},{
			test:/\.less$/,
			use:ExtractWebpackPlugin.extract({
				use:[{
					loader:'css-loader'
				},{
					loader:'less-loader'
				}],
				fallback:'style-loader'

			})
		},{
			test:/\.(jsx|js)$/,
			use:{
				loader:'babel-loader',
			},
			//略过node_modules中的文件
			exclude:/node_modules/
		}
		]
	},
	watchOptions:{
		//检测修改的时间，以毫秒为单位
		poll:1000,
		//防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
		aggregateTimeout:500,
		//不监听的目录
		ignored:/node_modules/,
	},
	//插件的使用
	plugins: [
		// new webpack.optimize.SplitChunksPlugin({
		// 	//name对应入口文件中的名字，我们起的是jQuery
		// 	name:['jQuery','Vue'],
		// 	//把文件打包到哪里，是一个路径
		// 	filename:'assets/js/[name].js',
		// 	//最小打包的文件模块数，这里直接写2就好
		// 	minChunks:2
		// }),
		// new CleanWebpackPlugin(['dist']),
		new HtmlWebpackPlugin({
			//html的标题名称
			title: 'Development',
			//压缩,removeAttributeQuotes把属性值额""去掉
			minify: {
				removeAttributeQuotes: true
			},
			//每次加一个hash防止缓存
			hash: true,
			//html的模板
			template:'./src/index.html'
		}),
		new ExtractWebpackPlugin('css/style.css'),//这里css/style.css是生成后的存放路径
		new PurifyCssPlugin({
			//这里是写入要在哪个路径下(页面)处理没有使用的css
			paths:glob.sync(path.join(__dirname,'src/*.html'))
		}),
		new webpack.ProvidePlugin({
			//考虑到兼容性,所以写三个来引入jquery
			$:'jquery',
      		jQuery:"jquery",
      		"window.jQuery":"jquery"
		}),
		//webpack.BannerPlugin是webpack自带的包,所以一定要先引入webpack
		new webpack.BannerPlugin('这个是版权声明插件,也可用来备注,表明这段代码谁写的'),
		new copyWebpackPlugin([{
			//从哪个路径下复制文件
			from:__dirname+'/src/public',
			//复制的文件放到哪里(因为打包到dist目录下,所以这里可以直接写/public)
			to:'./public'
		}]),
		new uglify()

	],
	//webpack4.x以后移除了new webpack.optimize.CommonsChunkPlugin({})该用如下代替
	optimization: {
        splitChunks: {
            cacheGroups: {
                commons: {
                	//name对应入口文件中的名字，我们起的是jQuery
                    name: "commons",
                    //把文件打包到哪里，是一个路径
                    filename:'assets/js/[name].js',
                    chunks: "initial",
                    //最小打包的文件模块数，这里直接写2就好
                    minChunks: 2
                }
            }
        }
    },
	//出口文件配置
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'dist'),
		//publicPath是为了解决limit:500时候当图片不打包在js中路径就会错误,利用publicPath设置一个绝对路径
		publicPath:website.publicPath
	},
	mode: "production",

};