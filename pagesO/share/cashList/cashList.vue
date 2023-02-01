<template>
	<view style="text-align: left">
		<u-navbar :is-back="true" title="" title-color="#fff" back-icon-color="#fff"
			:back-text-style="{ color: '#fff' }" back-text="返回" :background="{backgroundColor: '#fe7e97'}"> </u-navbar>
		<view v-for="(item, index) in list" :key="index" class="item">
			<view>
				<view style="margin-bottom: 8upx;text-align: right;">
					<text style="margin-bottom: 8upx;color: #ff0000" v-if="item.status=='EXAMINEING'">审核中</text>
					<text style="margin-bottom: 8upx;color: #00ff00" v-if="item.status=='PASS'">已提现</text>
					<text style="margin-bottom: 8upx;color: #ff0000" v-if="item.status=='REJECT'">已提现</text>
				</view>

				<view style="color: #999999;font-size: 28upx;">
					<view style="margin-bottom: 8upx"> 类型: {{item.cardType}}</view>
					<view style="margin-bottom: 8upx"> 账号: {{item.cardNum}}</view>
					<view style="margin-bottom: 8upx"> 姓名: {{item.cardName}}</view>
					<view style="margin-bottom: 8upx"> 发起时间: {{item.createTime}}</view>
					<view style="margin-bottom: 8upx">审核时间: {{item.examineDate}}</view>
					<view style="margin-bottom: 8upx;color: #e10a07">兑换积分: {{item.integral}}</view>
					<view style="margin-bottom: 8upx;color: #e10a07">兑换金额: ￥{{item.amount}}</view>
				</view>
			</view>
		</view>
		<template v-if="list.length==0">
			<y-Empty style="margin: 0 auto;" emptyText="暂无记录" />
		</template>
	</view>
</template>

<script>
	import Server from "@/common/serverutil.js";
	import Vue from 'vue';
	export default {
		data() {
			return {
				list: [],
				page: 1,
				size: 10
			}
		},
		onLoad: function(e) {
			this.getMoney('');
		},
		methods: {
			getMoney(type) {
				let self = this;
				Server.get("/user/exchange/record", {
					pageIndex: self.page,
					pageSize: self.size
				}, {
					success: res => {
						if (this.page === 1) {
							this.list = [];
						}
						res.data.data.rows.forEach(d => {
							this.list.push(d);
						});

						if (type === 'Refresh') {
							uni.stopPullDownRefresh(); // 停止刷新
						}

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
			
		},
		onReachBottom: function() {
			this.page = this.page + 1;
			this.getMoney('');
		},
		onPullDownRefresh: function() {
			this.page = 1;
			this.getMoney('Refresh');
		}
	}
</script>

<style lang='scss'>
	@import '@/static/css/index.css';

	page {
		background: #FFFFFF;
	}

	.item {
		background: white;
		padding: 32rpx;
		margin: 32rpx;
		font-size: 28rpx;
		box-shadow: 7px 9px 34px rgba(0, 0, 0, 0.1);
		border-radius: 16upx;
	}
</style>
