<template>
	<view>
		<u-navbar :is-back="true" title="编辑个人资料" title-color="#fff" back-icon-color="#fff"
			:back-text-style="{ color: '#fff' }" back-text="返回" :background="{backgroundColor: '#ff5500'}"> </u-navbar>
		<view class="page" :style="{ minHeight: mineBoxHeight }">
			<view class="header">
				<image class="bg" :src="geturl(userInfo.headPortrait)" />
				<view class="content">
					<view class="avatar-wrapper" @tap="ChooseImage">
						<image class="img" :src="geturl(userInfo.headPortrait)" />
					</view>
				</view>
			</view>
			<view class="main">
				<view class="header">
					<view class="tab-group">
						<view class="login_line">
							<view class="login_line_title">昵称：</view>
							<input type="text" maxlength="12" placeholder="请输入昵称" v-model="userInfo.nickName" />
						</view>
						<view class="login_line">
							<view class="login_line_title">性别：</view>
							<view style="width: 80%;" @tap="showselect">{{genderText}}</view>
							<u-select v-model="showgender" :default-value="defaultgender" mode="single-column"
								:list="list" @confirm="confirmgender" confirm-color="#ff5500"></u-select>
						</view>
						<view class="login_line">
							<view class="login_line_title">年龄：</view>
							<input type="text" maxlength="12" placeholder="请输入年龄" v-model="userInfo.age" />
						</view>
						<view class="login_line">
							<view class="login_line_title">星座：</view>
							<view style="width: 80%;" @tap="showxingzuoselect">{{xingzuoText}}</view>
							<u-select v-model="showxingzuo" :default-value="defaultxingzuo" mode="single-column"
								:list="xingzuolist" @confirm="confirmxingzuo" confirm-color="#ff5500"></u-select>
						</view>
						
					</view>
				</view>
				<view class="login_btn" @tap="updateUserInfo">保存</view>
			</view>

		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%"
			:confirm-style="{color: '#ff5500'}"></u-modal>
	</view>
</template>

<script>
	import Vue from 'vue';
	import Server from "@/common/serverutil.js";
	import COS from '@/common/cos-wx-sdk-v5-min.js';

	function randomUUID() {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		const r = Math.random() * 16 | 0
		const v = c === 'x' ? r : (r & 0x3 | 0x8)
		return v.toString(16)
		})
	}

	export default {
		name: 'EditSelfInfo',
		components: {

		},
		computed: {
			statusBarHeight() {
				const {
					statusBarHeight
				} = getApp().globalData
				return statusBarHeight
			},
			mineBoxHeight() {
				return `calc(100vh - 100px + ${this.statusBarHeight}px)`
			}
		},
		data() {
			return {
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				checked: false,
				showgender: false,
				showxingzuo: false,
				gendervalue: null,
				genderText: "男",
				xingzuovalue: null,
				xingzuoText: "白羊座",
				xingzuolist: [{
						value: 0,
						label: '白羊座',
					},
					{
						value: 1,
						label: '金牛座'
					},
					{
						value: 2,
						label: '双子座'
					},
					{
						value: 3,
						label: '巨蟹座'
					},
					{
						value: 4,
						label: '狮子座'
					},
					{
						value: 5,
						label: '处女座'
					},
					{
						value: 6,
						label: '天秤座'
					},
					{
						value: 7,
						label: '天蝎座'
					},
					{
						value: 8,
						label: '射手座'
					},
					{
						value: 9,
						label: '魔羯座'
					},
					{
						value: 10,
						label: '水瓶座'
					},
					{
						value: 11,
						label: '双鱼座'
				}],
				list: [{
						value: 0,
						label: '男'
					},
					{
						value: 1,
						label: '女'
				}],
				defaultgender: [0],
				defaultxingzuo: [0],
				userInfo: {
					nickName: null,
					genderId: null,
					headPortrait: '',
					xingzuo: null,
				},
				imgList: [],
				cosKey: {
					tmpSecretId: '',
					tmpSecretKey: '',
					sessionToken: '',
					expiredTime: 0,
				},
				config: {
					Bucket: 'images-1303232721',
					Region: 'ap-shanghai'
				}
			}
		},
		methods: {
			// 选择图片
			ChooseImage() {
				let self = this;
				var cos = new COS({
					// getAuthorization 必选参数
					SimpleUploadMethod: 'putObject',
					getAuthorization: function(options, callback) {
						let token = 'bearer';
						let restoken = uni.getStorageSync('logintokeninfo');
						if (restoken) {
							token = restoken.token_type + ' ' + restoken.access_token
						}
						wx.request({
							url: Vue.prototype.serveraddress + '/cloud/tencent/cos/tmpkey',
							data: {},
							dataType: 'json',
							header: {
								'Authorization': token
							},
							success: function(result) {
								let credentials = result.data.data;
								callback({
									TmpSecretId: credentials.tmpSecretId,
									TmpSecretKey: credentials.tmpSecretKey,
									SecurityToken: credentials.sessionToken,
									StartTime: credentials.startTime, 
									ExpiredTime: credentials.expiredTime, 
								});
							}
						});
					}
				});
				// 此处以选择图片api(wx.chooseImage)为参考，其他api请参考小程序官方文档
				wx.chooseImage({
					count: 1,
					success: function(res) {
						let file = res.tempFiles[0];
						let strs = file.path.split('.');
						let uuid = randomUUID();
						let fileName = uuid + '.' + strs[strs.length -1];
						let fullFileName = fileName.charAt(0) + "/" + fileName.substr(0,2) + "/" + fileName.substr(0, 8) + "/" + fileName;
						console.log(fullFileName)
						// 微信小程序里获取文件管理器
						var wxfs = wx.getFileSystemManager();
						wxfs.readFile({
							filePath: file.path,
							success: function(res) {
								cos.putObject({
									Bucket: self.config.Bucket,
									Region: self.config.Region,
									Key: fullFileName,
									Body: res.data, // Body里传入的是文件内容
								}, function(err, data) {
									self.userInfo.headPortrait = fullFileName;
								});
							},
							fail: function(err) {
								console.error(err)
							},
						});
					},
					fail: function(err) {
						console.error(err)
					},
				});
			},
			onShow() {
				let self = this;
				Server.get("/users/getUserInfoCheck", {}, {
					success: response => {
						console.log(response)
						self.userInfo = response.data.data;
						console.log(self.userInfo)
						for (var i = 0; i < self.list.length; i++) {
							if (self.list[i].value == self.userInfo.genderId) {
								self.gendervalue = [i];
								self.genderText = self.list[i].label
								break;
							}
						}
						for (var i = 0; i < self.list.length; i++) {
							if (self.xingzuolist[i].value == self.userInfo.xingzuo) {
								self.xingzuovalue = [i];
								self.xingzuoText = self.xingzuolist[i].label
								break;
							}
						}
					},
					warnings: response => {
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
				})
			},
			geturl(url) {
				if (url != null && !url.startsWith("http")) {
					return Vue.prototype.imageaddress + "/" + url;
				}
				return url;
			},
			// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
			confirmgender(e) {
				this.genderText = e[0].label;
				this.gendervalue = e[0].value;
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].value == this.gendervalue) {
						this.userInfo.genderId = i;
						this.userInfo.genderText = this.list[i].label;
						break;
					}
				}
			},
			confirmxingzuo(e) {
				this.xingzuoText = e[0].label;
				this.xingzuovalue = e[0].value;
				for (var i = 0; i < this.xingzuolist.length; i++) {
					if (this.xingzuolist[i].value == this.xingzuovalue) {
						this.userInfo.xingzuo = i;
						this.userInfo.xingzuoText = this.xingzuolist[i].label;
						break;
					}
				}
			},
			objectURLToBlob(blodurl) {
				uni.showLoading({
					title: '压缩中...'
				});
				return new Promise((resolve, reject) => {
					var http = new XMLHttpRequest();
					http.open('GET', blodurl, true);
					http.responseType = 'blob';
					http.onload = function(e) {
						if (this.status == 200 || this.status === 0) {
							// console.log('blod数据',this.response);
							// 在将blod数据转为file
							let files = new window.File([this.response], 'file.name', {
								type: 'image'
							});
							// console.log('blod数据转换file',files);
							resolve(files);
							uni.hideLoading();
						}
					};
					http.send();
				});
			},
			showselect() {
				this.showgender = true;
			},
			showxingzuoselect() {
				this.showxingzuo = true;
			},
			updateUserInfo() {
				let self = this;
				Server.post("/users/update", self.userInfo, {
					success: response => {
						this.modelcontent = "保存成功";
						this.modeltitle = "提示";
						this.modelshow = true;
					},
					warnings: response => {
						this.modelcontent = response;
						this.modeltitle = "警告";
						this.modelshow = true;
					},
					error: response => {
						this.modelcontent = response;
						this.modeltitle = "错误";
						this.modelshow = true;
					}
				})
			},
		}
	}
</script>
<style lang="less" scoped>
	@mainColor: #ff5500;

	.flexAllCenter {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.login_img {
		width: 120upx;
		height: 120upx;
		border-radius: 10upx;
		display: block;
		margin: 0 auto;
		margin-top: 120upx;
		margin-bottom: 40upx;
	}

	.login_line {
		width: 94%;
		margin: 60upx auto;
		border-bottom: 1px solid #eeeeee;
		display: flex;
		align-items: center;
		height: 60upx;
	}

	.login_line_title {
		font-size: 28upx;
		color: #333;
		width: auto;
	}

	.login_line_input {
		width: 50%;
		font-size: 26upx;
	}

	.login_line_ver {
		font-size: 26upx;
		color: #333;
		border: 1px solid #333;
		padding: 2upx 5upx;
		border-radius: 6upx;
	}

	.login_btn {
		width: 94%;
		height: 80upx;
		text-align: center;
		background: #ff5500;
		color: #ffffff;
		margin: 100upx auto;
		border-radius: 10upx;
		line-height: 80upx;
	}

	.page {
		// height: calc(100vh - 100upx);
		overflow: scroll;

		>.header {
			position: absolute;
			left: 0;
			right: 0;
			height: 640rpx;

			.bg {
				// content: '';
				position: absolute;
				top: 0;
				right: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				-webkit-filter: blur(60upx);
				-moz-filter: blur(60upx);
				-o-filter: blur(60upx);
				-ms-filter: blur(60upx);
				filter: blur(60upx);
				height: 640upx;
			}

			.content {
				position: relative;
				z-index: 99;
				height: 640upx;

				.top-bar {
					position: relative;
					// z-index: 9999999;
					display: flex;
					align-items: center;
					font-size: 30upx;
					color: #ffffff;

					.item {
						display: flex;
						align-items: center;
						background-color: rgba(0, 0, 0, 0.3);
						padding: 5upx 10upx;
						border-radius: 30upx;
						margin-left: 20upx;

						// margin-top: 50upx;
						.icon {
							height: 40upx;
							width: 40upx;
							margin-right: 10upx;
						}

						&:nth-child(2) {
							.icon {
								height: 30upx;
								width: 30upx;
							}
						}
					}
				}

				.avatar-wrapper {
					position: relative;
					left: 50%;
					// top: 50%;
					transform: translate(-50%, 70%);
					box-sizing: border-box;
					border: 30upx solid rgba(245, 245, 245, 0.6);
					width: 250upx;
					height: 250upx;
					border-radius: 50%;

					// display: flex;
					// align-items: center;
					// justify-content: center;
					.img {
						height: 100%;
						width: 100%;
						border-radius: 50%;
						border: 10upx solid #ffffff;
						position: relative;
						left: 50%;
						top: 50%;
						transform: translate(-50%, -50%);
					}
				}
			}
		}
	}

	.main {
		position: relative;
		z-index: 888;
		background-color: #ffffff;
		top: 640upx;
		border-top-left-radius: 30upx;
		border-top-right-radius: 30upx;

		.header {
			padding-left: 20upx;

			.tab-group {
				font-size: 25upx;
				color: #999999;
				padding: 20upx 0;

				.tab {
					margin-right: 50upx;

					&.active {
						color: #333333;
						font-size: 30upx;
					}
				}
			}
		}

		.progress-box {
			margin: 0 20upx;
			margin-top: 50upx;
			height: 10upx;
			background: #cecece;
			border-radius: 20upx;
			position: relative;

			.progress-bar {
				position: absolute;
				left: 0;
				top: 0;
				width: 55%;
				height: 10upx;
				background: @mainColor;
				border-radius: 20upx;

				.percent-box {
					position: absolute;
					right: -40upx;
					top: -60upx;
					width: 80upx;
					height: 40upx;
					background: @mainColor;
					border-radius: 50upx;
					.flexAllCenter();

					.percent {
						font-size: 24upx;
						color: #fff;
					}

					.triangle {
						height: 0;
						width: 0;
						position: absolute;
						left: calc(50% - 8upx);
						bottom: -6px;
						border-color: @mainColor transparent transparent transparent;
						border-style: solid;
						border-width: 16upx 8upx 0 8upx;
					}
				}
			}
		}

		.progress-label {
			font-size: 24upx;
			margin-top: 10upx;
			margin-left: 20upx;
		}

		.progress-img {
			margin-right: 20upx;
			margin-left: 20upx;
		}

		.info {
			display: flex;
			justify-content: space-between;
			align-items: center;
			box-shadow: 0 0 20upx #ecf0f1;
			margin-left: 20upx;
			margin-right: 20upx;
			padding: 20upx;
			border-radius: 20upx;
			margin-top: 50upx;

			.middle {
				flex: 1;
				margin-left: 20upx;

				.nickname {
					display: inline-block;
					font-size: 35upx;
					margin-bottom: 10upx;
				}
			}

			.line {
				width: 1px;
				height: 80upx;
				background-color: #f3f3f3;
			}

			.avatar {
				height: 100upx;
				width: 100upx;
				border-radius: 50%;
			}

			.right {
				margin-left: 20upx;
				text-align: center;

				.heart-receive-wrapper {
					display: flex;
					align-items: center;
					justify-content: center;

					.text {
						font-size: 20upx;
					}

					.heart-receive {
						width: 20upx;
						height: 20upx;
						margin-left: 10upx;
					}
				}
			}

			.extra {
				display: flex;
				align-items: center;
				color: #fb90bc;
				font-size: 20upx;
				padding: 5upx 10upx;
				border-radius: 20upx;
				background-color: #fef1f3;

				.sex {
					width: 20upx;
					height: 20upx;
					margin-right: 20upx;
				}
			}

			.extraman {
				display: flex;
				align-items: center;
				color: #0FBCF9;
				font-size: 20upx;
				padding: 5upx 10upx;
				border-radius: 20upx;
				background-color: #E5F8FF;

				.sex {
					width: 20upx;
					height: 20upx;
					margin-right: 20upx;
				}
			}
		}

		.desc {
			background-image: linear-gradient(to right, #fba3d9, #fb90bc);
			min-height: 300upx;
			margin: 30upx 20upx;
			border-radius: 10upx;
			padding: 20upx;
			font-size: 30upx;
			color: white;
			display: flex;
			align-items: center;
		}

		.section {
			box-shadow: 0 0 20upx #ecf0f1;
			margin: 0 20upx;
			border-radius: 20upx;
			padding: 20upx;
			margin-bottom: 30upx;

			.header {
				display: flex;
				border-bottom: 1px solid #e5e5e5;
				padding-bottom: 10upx;

				.section-icon {
					height: 50upx;
					width: 50upx;
				}

				.title-wrapper {
					font-size: 35upx;
					display: flex;
					flex-direction: column;

					.subtitle {
						font-size: 20upx;
						color: #999999;
					}
				}
			}

			.qa,
			.hobby-empty {
				.title {
					font-size: 20upx;
					color: #999999;
				}

				.add-btn {
					font-size: 90upx;
					font-weight: bold;
					color: #e5e5e5;
					display: block;
					height: 150upx;
					width: 150upx;
					border: 1px dashed #e5e5e5;
					border-radius: 20upx;
					text-align: center;
					margin-top: 20upx;
				}
			}

			.qa {
				padding-top: 20upx;

				.qa-item {
					display: flex;
					flex-direction: column;

					.question,
					.answer {
						font-size: 25upx;
					}

					.answer {
						color: #999999;
						padding-left: 15upx;
					}
				}
			}

			.about {
				font-size: 20upx;
				display: flex;
				flex-wrap: wrap;
				padding-top: 20upx;

				.tag {
					color: #999999;
					background-color: #e5e5e5;
					padding: 10upx 20upx;
					margin-right: 20upx;
					border-radius: 25upx;
					margin-bottom: 20upx;
				}
			}

			.hobby {
				display: flex;
				flex-wrap: wrap;
				padding-top: 20upx;
				font-size: 20upx;

				.tag {
					border-radius: 25upx;
					padding: 10upx 20upx;
					margin-bottom: 20upx;
					margin-right: 20upx;

					&.pink {
						background-color: #fdf1f3;
						color: #fb90bc;
					}
				}
			}

			.contact-method {
				display: flex;
				align-items: center;
				justify-content: space-between;
				padding: 30upx 0;

				.weixin {
					font-size: 25upx;
				}

				.weixin-wrapper {
					display: flex;
					align-items: center;
					font-size: 30upx;

					.weixin-icon {
						width: 40upx;
						height: 40upx;
						margin-right: 10upx;
					}
				}
			}
		}
	}
</style>