<template>
	<view>
		<u-navbar v-if="shareSelect==true" :is-back="true" title="" title-color="#fff" back-icon-color="#fff"
			:back-text-style="{ color: '#fff' }" back-text="返回" :background="{backgroundColor: '#ff5500'}"> </u-navbar>
		<view  v-if="shareSelect==true" class="mine-wrap" :style="{ minHeight: mineBoxHeight }">
			<view class="login_line">
				分享成功注册{{sharenum}}个，就得一个月会员
			</view>
			<view class="login_line">
				<u-input class="desc" :custom-style="{'color':'white','font-size':'28upx','background-image': 'linear-gradient(to right, #fba3d9, #fb90bc)',
		'border-radius':'20upx','caret-color': 'white'}" v-model="answerContent" placeholder-style="color:white;"
					:maxlength="100" :clearable="false" height="250" type="textarea" />
			</view>
			<view class="row_btn" @click="chage">复制链接</view>
		</view>
		<view v-if="shareSelect==false" style="text-align: center; margin-top: 20rpx;">
			<image :src="geturl('/file/system/wxgzh.jpg')" mode="scaleToFill"> </image>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%"
			:confirm-style="{color: '#ff5500'}"></u-modal>
	</view>
</template>
<script>
	import {
		Vue,
		Component
	} from 'vue-property-decorator'
	import Server from "@/common/serverutil.js";
	export default {
		name: 'Login',
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
				problemId: "",
				answerContent: "",
				problemTitle: "",
				sharenum:"",
				shareSelect:null
			}
		},
		onLoad(options) {
			let self=this;
			if (options) {
				if (options.shareid != null) {
					this.shareSelect=false;
					Server.get("/Iqnore/share/"+options.shareid, {
					}, {
						success: response => {
							//跳转到首页
							/* uni.switchTab({
								url: '/pages/index/index'
							}); */
						},
						warnings: response => {
							self.modelcontent = response;
							self.modeltitle = "警告";
							self.modelshow = true;
						},
						error: response => {
							self.modelcontent = response;
							self.modeltitle = "错误";
							self.modelshow = true;
						}
					})
					
				}else{
					this.shareSelect=true;
					let userId =
						uni.getStorageSync("loginuserinfo") &&
						uni.getStorageSync("loginuserinfo").id;
						if(userId!=null)
						{
							
							this.answerContent = Vue.prototype.fronturl + "#/pagesN/share/share?shareid=" + userId;
							
							Server.get("/common/getSystemValue/SHARENUM", {
							}, {
								success: response => {
									debugger
									self.sharenum=response.data.data;
								},
								warnings: response => {
									self.modelcontent = response;
									self.modeltitle = "警告";
									self.modelshow = true;
								},
								error: response => {
									self.modelcontent = response;
									self.modeltitle = "错误";
									self.modelshow = true;
								}
							})
							
						
						}
				}
			}
		},
		onShow() {
			
			   
		},
		methods: {
			geturl(url) {
				return Vue.prototype.imageaddress + "/" + url;
			},
			chage() {
				let self = this;
				uni.setClipboardData({
				        data:self.answerContent,//要被复制的内容
				        success:()=>{//复制成功的回调函数
						   uni.hideToast()
				          self.modelcontent = "复制成功,快去分享给小伙伴吧！";
				          self.modeltitle = "提示";
				          self.modelshow = true;
				        }
				      });
			}
		}
	}
</script>
<style>
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
		margin: 60rpx auto;
		font-size: 28upx;
		color: #545454;
		align-items: center;
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

	.row_btn {
		width: 80%;
		height: 100upx;
		text-align: center;
		background-image: linear-gradient(to right, #fba3d9, #ff5500);
		color: #ffffff;
		margin: 80upx auto;
		border-radius: 60upx;
		line-height: 100upx;
	}
</style>
