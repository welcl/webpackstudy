import _ from 'lodash';//引入lodash文件
import printMe from './print.js'; //引入print.js
import './style.css';//引入css文件
import './black.less';//引入less文件
// import $ from 'jquery';//引入jquery库
//引入json文件
const json=require('../data.json');
function component() {
	var element = document.createElement('div');
	var btn = document.createElement('button');
	btn.className='btnclass';
	element.innerHTML = _.join(['Hello', 'webpack'], ' ');
	btn.innerHTML = 'click me and check the console!';
	btn.onclick = printMe;
	element.appendChild(btn);
	{
		let babeltest="hello webpack";
		document.querySelector('.black').innerHTML=babeltest;
	}
	$('.black').html("我是通过jquery写入的addhahadadaadad adadaadada");
	$('#json').html(json.name+'website:'+json.website);
	return element;
}
document.body.appendChild(component());