<template>
	<view class="content page">
		<tan-tan-swiper :key="timer" />
		<!-- 弹出层 -->
		<u-modal v-model="show" :title="title" :content="content" width="70%" :show-cancel-button="showcancelbutton"
			:confirm-style="{color: '#ff5500'}" :confirm-text="confirmtext" :cancel-text="canceltext"
			@confirm="confirm()" @cancel="cancel()"></u-modal>
	</view>
</template>

<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'

	import TanTanSwiper from '@/components/cl-cardDel/index.vue'
	import amap from '@/common/amap-wx.130.js';
	import Server from "@/common/serverutil.js";

	const app = getApp();
	import {
		genTestUserSig
	} from '../../common/TXIM/GenerateTestUserSig.js';

	export default {
		name: 'Index',
		components: {
			TanTanSwiper
		},
		data() {
			return {
				timer: '',
				isLike: false,
				preIndex: 0,
				show: false,
				content: '',
				title: '提示',
				confirmtext: '确认',
				canceltext: '取消',
				showcancelbutton: true,
				actionoperation: "",
				amapPlugin: null,
				key: '87b470386b2e45e0d16bb3599a7b6831',
				userId: ''
			}
		},
		onShow() {

			let self = this;
			this.timer = new Date().getTime();
			uni.showLoading({
				title: '玩命加载中..'
			});

			self.userId =
				uni.getStorageSync("loginuserinfo") &&
				uni.getStorageSync("loginuserinfo").id;
			//登录腾讯im
			if (self.userId != null) {

				self.imLogin(self.userId);
			}

			try {
				const relocation = uni.getStorageSync('relocation');

				if (relocation == 'true' && self.userId != null) {
					self.saveaddress();
				}
			} catch (e) {
				// error
			}

			Server.get("/nologin/users", {
				pageIndex: 1,
				pageSize: 5
			}, {
				success: response => {

				},
				warnings: response => {

				},
				error: response => {

				},
				service: response => {
					if (response.data.code == 508) {
						console.log("查询用户列表没有位置信息")
						//接口调用完成执行 关闭loading
						uni.hideLoading();

						try {
							const canceladdress = uni.getStorageSync('cancellocatin');

							if (canceladdress != "true") {
								//没有授权，引导用户打开授权
								self.showcancelbutton = true; //修改取消按钮
								self.content = "我们需要获取定位信息用于向您推荐附近的人";
								self.title = "警告";
								self.show = true;
								self.actionoperation = "gotoAppPermissionSetting";
							}

						} catch (e) {
							// error
						}
					}

				}
			}, false)
		},
		onLoad() {
			try {
				uni.setStorageSync('cancellocatin', 'false');
			} catch (e) {

			}
			try {
				uni.setStorageSync('relocation', 'true');
			} catch (e) {

			}

			this.amapPlugin = new amap.AMapWX({
				key: this.key
			});

			let isreload = uni.getStorageSync("reload");
			if (isreload == false) {
				// #ifdef H5
				window.location.reload();
				// #endif
				try {
					uni.setStorageSync('reload', true);
				} catch (e) {

				}
			}
		},
		methods: {
			imLogin(userID) {

				let self = this;
				// #ifdef APP-PLUS
				const userSig = genTestUserSig(userID.toString()).userSig;
				const SDKAppID = app.globalData.SDKAppID;
				console.log(userID);
				console.log("登录腾讯im: SDKAppID:" + SDKAppID + "  userID:" + userID + "   userSig:" + userSig);

				uni.$TUICalling.login({
						sdkAppID: SDKAppID,
						userID: userID.toString(),
						userSig: userSig
					},
					res => {
						console.log("登录腾讯im结果信息：" + JSON.stringify(res));
					}
				);


				Server.get("/users/getUserInfoCheck/" + userID, {}, {
					success: response => {
						let useriminfo = response.data.data;
						// 设置名字
						console.log("设置昵称：" + useriminfo.nickName)
						uni.$TUICalling.setUserNickname({
							nickName: useriminfo.nickName
						}, (res) => {
							console.log("设置昵称结果：" + JSON.stringify(res))
						})

						// 设置当前用户头像
						console.log("设置用户头像：" + self.geturl(useriminfo.headPortrait))
						uni.$TUICalling.setUserAvatar({
							avatar: self.geturl(useriminfo.headPortrait)
						}, (res) => {
							console.log("设置用户头像结果：" + JSON.stringify(res))
						})
					},
					warnings: response => {

					},
					error: response => {

					}
				})


				// #endif
			},
			saveaddress() {
				let self = this;
				//获取位置信息
				console.log("判断用户是否授权位置信息")
				console.log("获取定位")
				/* uni.getLocation({
				type: 'gcj02',
				success: (res) => {
				this.latitude=res.latitude;
				this.longitude=res.longitude;
				console.log(this.latitude);
				console.log(this.longitude);
				console.log(res);
				// console.log('当前位置的经度：' + res.longitude);
				// console.log('当前位置的纬度：' + res.latitude);
				}
				}); */
				self.amapPlugin.getRegeo({
					success: (data) => {
						console.log("高德地图获取位置信息")
						console.log(data)
						console.log('当前位置的经度：' + data[0].longitude);
						console.log('当前位置的纬度：' + data[0].latitude);
						let addresslocation = "";
						if (data[0].regeocodeData.addressComponent.city.length == 0) {
							addresslocation = data[0].regeocodeData.addressComponent.province;
						} else {
							addresslocation = data[0].regeocodeData.addressComponent.city;
						}
						console.log("修改用户位置" + self.userId)
						//修改用户位置
						Server.put("/user/updateUserAddress", {
							"longitude": data[0].longitude,
							"latitude": data[0].latitude,
							"address": addresslocation
						}, {
							success: response => {
								console.log("修改用户位置完成")
								try {
									uni.setStorageSync('relocation', 'false');
								} catch (e) {

								}
							},
							warnings: response => {
								//接口调用完成执行 关闭loading
								uni.hideLoading();
								self.showcancelbutton = true; //修改取消按钮
								self.content = response;
								self.title = "警告";
								self.show = true;
							},
							service: response => {
								//接口调用完成执行 关闭loading
								uni.hideLoading();
								self.showcancelbutton = true; //修改取消按钮
								self.content = response.data.msg;
								self.title = "警告";
								self.show = true;
							},
							error: response => {
								//接口调用完成执行 关闭loading
								uni.hideLoading();
								self.showcancelbutton = false; //修改取消按钮
								self.content = response;
								self.title = "错误";
								self.show = true;
							}
						}, false)


					},
					fail: (err) => {
						console.log(err);
						//接口调用完成执行 关闭loading
						uni.hideLoading();
						//self.showcancelbutton = false; //修改取消按钮
						try {
							const canceladdress = uni.getStorageSync('cancellocatin');

							if (canceladdress != 'true') {
								//没有授权，引导用户打开授权
								self.showcancelbutton = true; //修改取消按钮
								self.content = "我们需要获取定位信息用于向您推荐附近的人";
								self.title = "警告";
								self.show = true;
								self.actionoperation = "gotoAppPermissionSetting";
							}

						} catch (e) {
							// error
						}

					}
				});
				/* uni.authorize({
					scope: 'scope.userLocation',
					success() {
						
					},
					fail() {
						//接口调用完成执行 关闭loading
						uni.hideLoading();
						try {
							const canceladdress = uni.getStorageSync('cancellocatin');

							if (canceladdress != 'true') {
								//没有授权，引导用户打开授权
								self.showcancelbutton = true; //修改取消按钮
								self.content = "我们需要获取定位信息用于向您推荐附近的人";
								self.title = "警告";
								self.show = true;
								self.actionoperation = "gotoAppPermissionSetting";
							}

						} catch (e) {
							// error
						}
					}
				}) */

			},
			confirm() {
				console.log("点击了确认")
				if (this.actionoperation == "gotoAppPermissionSetting") {
					//引导用户授权
					uni.getLocation();
				}
				this.actionoperation = ""; //置空防止干扰
			},
			cancel() {
				console.log("点击了取消")
				try {
					uni.setStorageSync('cancellocatin', 'true');


				} catch (e) {

				}
			},
			geturl(url) {
				return Vue.prototype.imageaddress + "/" + url;
			}

		}
	}

	// type SwiperChangeEvent = {
	//   detail: {
	//     current: number
	//     currentItemId: string
	//     source: string
	//   }
	// }

	// @Component({
	//   components: {
	//     TanTanSwiper
	//   }
	// })
	// export default class Index extends Vue {
	//   isLike: boolean = false
	//   preIndex = 0

	//   mounted() {
	// 	  console.log(Vue.prototype.websiteUrl)
	//   }
	// }
</script>

<style lang="less" scoped>
	.content {
		// position: relative;
		// text-align: center;
		height: 100vh;

		// .full-height {
		//   height: 100vh;
		// }

		// .img {
		//   width: 100vw;
		// }

		// .uni-bg-brown {
		//   background-color: brown;
		// }

		// .uni-bg-red {
		//   background-color: red;
		// }

		// .like {
		//   display: flex;
		//   align-items: center;
		//   justify-content: center;
		//   position: absolute;
		//   bottom: 80upx;
		//   right: 40upx;
		//   z-index: 99999;
		//   background-color: #fff;
		//   height: 100upx;
		//   width: 100upx;
		//   border-radius: 50%;

		//   > .heart-img {
		//     width: 55upx;
		//     height: 50upx;
		//   }
		// }
	}
</style>
