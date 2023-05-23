<template>
	<view>
		<u-navbar :is-back="true" title="编辑个人资料" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#ff5500'}"> </u-navbar>
		<view class="mine-wrap" :style="{ minHeight: mineBoxHeight }">
			<view class="login_line">
				<view class="login_line_title">昵称：</view>
				<input type="text" maxlength="12" placeholder="请输入昵称" v-model="userInfo.nickName"  />
			</view>
			<view class="login_line">
				<view class="login_line_title">性别：</view>
				<view style="width: 80%;" @tap="showselect">{{genderText}}</view>
				<u-select v-model="showgender" :default-value="defaultgender" mode="single-column" :list="list" @confirm="confirmgender"
				 confirm-color="#ff5500"></u-select>
			</view>
			<view class="login_btn" @tap="login">保存</view>
		</view>
		<!-- 弹出层 -->
		<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#ff5500'}"></u-modal>
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
				checked: false,
				showgender: false,
				gendervalue: null,
				genderText: "不限",
				list: [{
						value: 0,
						label: '男'
					},
					{
						value: 1,
						label: '女'
					},
					{
						value: null,
						label: '不限'
					}
				],
				defaultgender: [0],
				userInfo: {
					nickName: null,
				}
			}
		},
		methods: {
			onShow() {
				let self = this;
				Server.get("/users/getUserInfoCheck", {}, {
					success: response => {
						console.log(response)
						self.userInfo = response.data.data;
						// if (response.data.data.genderId != null && response.data.data.genderId != undefined && response.data.data.genderId !=
						// 	'') {
						// 	self.perferenceset.genderId = response.data.data.genderId;
						// }
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
			// 注意返回值为一个数组，单列时取数组的第一个元素即可(只有一个元素)
			confirmgender(e) {
				this.genderText = e[0].label;
				this.gendervalue = e[0].value;
				for (var i = 0; i < this.list.length; i++) {
					if (this.list[i].value == this.gendervalue) {
						this.defaultgender = [i];
						break;
					}
				}
			
			},
			showselect() {
				this.showgender = true;
			},
			login() {
				let self = this;
				Server.post("/users/addPreferenceSet", {
					genderId: self.perferenceset.genderId,
					maxAge: self.perferenceset.maxAge,
					minAge: self.perferenceset.minAge,
					stage: self.perferenceset.stage,
					seeRange: !self.checked
				}, {
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
</style>
