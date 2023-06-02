/* 
本下载插件为体验版，需要完整前后端加管理后台程序 可以加微信：MMRWXM  获取, 请备注uniapp
运营端 http://1.14.110.117:7102/ 111111111111 123456
登录账号1：15261133552 密码：123456
登录账号2：00000000010 密码：123456
或自行注册

备用演示地址
客户端 http://1.14.110.117:7103/chatport/ 15261133552 123456
运营端 http://1.14.110.117:7102/ 111111111111 123456
安卓 http://1.14.110.117:7100/fileutil/download
或自行注册
本软件系统产品使用用途仅限于测试实验、研究学习娱乐为目的，禁止用于非法运营！使用此软件从事违法犯罪行为的与开源方无关
仅提供参考学习使用！已经获得软著！
商业使用需要支付源码授权费用 交付开源源码，支持二次开发,我们会提供搭建部署资料文档，无授权书商业使用追究法律责任！
价格绝对是同类型中最低，可按需定制

另外可定制开发软件 专业团队 完整开发流程，从ui 前端 后端俱全 有案例可参考 微信：MMRWXM

 */

import Vue from 'vue'
import App from './App'


import common from './utils/common.js'
Vue.prototype.$common = common

import api from './utils/api/api.js'
Vue.prototype.$api = api

// 挂载全局状态管理
import store from './store/index.js'
Vue.prototype.$store = store

//格式化时间  此处应该写在公共方法里面  但本人习惯写这
Date.prototype.Format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, // 月份
		"d+": this.getDate(), // 日
		"h+": this.getHours(), // 小时
		"m+": this.getMinutes(), // 分
		"s+": this.getSeconds(), // 秒
		"q+": Math.floor((this.getMonth() + 3) / 3), // 季度
		"S": this.getMilliseconds() // 毫秒
	};
	if (/(y+)/.test(fmt))
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + ""));
	for (var k in o)
		if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[
			k]).substr(("" + o[k]).length)));
	return fmt;
}
// new Date(1542274800000).Format('yy-MM-dd hh:mm:ss'); //"2018-11-15 17:40:00"

import uView from "uview-ui";
Vue.use(uView);

Vue.config.productionTip = false
App.mpType = 'app'
Vue.prototype.websocketurl = 'wss://aihui.zanghongtu.com/wss' 
Vue.prototype.serveraddress = 'https://aihui.zanghongtu.com/api'
Vue.prototype.imageaddress = 'https://image.aihuiinfo.com'
Vue.prototype.serveraddress0 = 'https://www.wxmblog.com/serverapi'
// Vue.prototype.serveraddress = 'https://www.wxmblog.com/serverapi'
//app版本

Vue.prototype.fronturl='https://www.wxmblog.com/chatport'
Vue.prototype.appid='wx120a18c636fd8718'
Vue.prototype.secret='d0f62b74be3cabfd2020cc7619e4d719'
Vue.prototype.mchid='1614696304'

Vue.prototype.defaultheadportrait="/system/defaultheadPortrait.png"
Vue.prototype.defaulwomantheadportrait="/system/defaulwomantheadportrait.png"
const app = new Vue({
	...App
})
app.$mount()
