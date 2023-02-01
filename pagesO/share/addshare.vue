<template>
	<view>
		<u-navbar :is-back="true" :title="title" title-color="#fff" back-icon-color="#fff"
			:back-text-style="{ color: '#fff' }" back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view class="main">
			<view class="row_title">
				账号类型
			</view>
			<view class="row_input">
				<u-input v-model="cardType" placeholder="支付宝/微信"
					:custom-style="{'caret-color': '#303133','color':'#808080'}" placeholder-style="color:#8f8f8f;"
				    :clearable="false" />
			</view>
			<view class="row_title">
				账号
			</view>
			<view class="row_input">
				<u-input v-model="cardNum" placeholder="提现账号" :custom-style="{'caret-color': '#303133','color':'#808080'}"
					placeholder-style="color:#8f8f8f;"  :clearable="false" />
			</view>
			<view class="row_title">
				用户名
			</view>
			<view class="row_input">
				<u-input v-model="cardName" placeholder="用户名" :custom-style="{'caret-color': '#303133','color':'#808080'}"
					placeholder-style="color:#8f8f8f;" :clearable="false" />
			</view>
			<view class="row_btn" @click="chage">提交</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%"
				:confirm-style="{color: '#fe7e97'}"></u-modal>
		</view>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	export default {
		data() {
			return {
				cardType: "",
				cardNum: "",
				cardName: "",
				modelshow: false,
				modeltitle: "",
				modelcontent: ""
			}
		},
		onLoad(options) {

		},
		methods: {
			
			chage() {
				let self = this;
				Server.post("/user/addExchage", {
					cardType: self.cardType,
					cardNum: self.cardNum,
					cardName: self.cardName
				}, {
					success: response => {
						uni.navigateTo({
							url: '/pagesO/share/cashList/cashList'
						});
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
</script>

<style scoped>
	.main {
		height: 450upx;
		padding: 20upx;
	}

	.row_title {
		font-size: 35upx;
		height: 150upx;
		display: flex;
		align-items: center;
		color: #505061;
	}

	.row_input {

		height: 80upx;
		border-bottom: 1px solid #cccccc;
		display: flex;
		align-items: center;
	}

	.row_btn {
		width: 80%;
		height: 100upx;
		text-align: center;
		background-image: linear-gradient(to right, #fba3d9, #fe7e97);
		color: #ffffff;
		margin: 80upx auto;
		border-radius: 60upx;
		line-height: 100upx;
	}
</style>
