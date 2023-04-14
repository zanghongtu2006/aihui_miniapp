<template>
	<!-- 	<AppContainer title="动态"> -->
	<view>
		<u-navbar :is-back="false" title="动态" title-color="#fff" back-icon-color="#fff" :back-text-style="{ color: '#fff' }"
		 back-text="返回" :background="{backgroundColor: '#ff5500'}"> </u-navbar>
		<view class="home">
			<view class="card-bottom">
				<!-- 顶部分页栏 -->
				<view class="top-tab">
					<view :class="['tab-item flex-center', activeTab == index ? 'active' : '']" @tap="handleTab(index)" v-for="(item, index) in tabList"
					 :key="index">{{ item.title }}</view>
				</view>
				<y-Refresh ref="mixPulldownRefresh" :top="100" @refresh="onPulldownReresh">
					<view class="scroll-wrapper">
						<!-- 漂流瓶 -->
						<view v-if="activeTab == 0">
							<template v-if="cardList.length>0">
								<view class="margin-bottom" v-for="(item, index) in cardList" :key="index">
									<y-DiaryItem :obj="item" />
								</view>
							</template>
							<template v-else-if="emptycardList==true">
								<y-Empty emptyText="还没有任何动态" />
							</template>
						</view>
						<!-- 聚集岛 -->
						<view v-else>
							<template v-if="rightList.length>0">
								<view class="margin-bottom" v-for="(item, index) in rightList" :key="item.id">
									<y-DiaryItem :obj="item" />
								</view>
							</template>
							<template v-else-if="emptyrightList==true">
								<y-Empty emptyText="还没有好友的动态" />
							</template>
						</view>
						<y-LoadMore :status="loadMoreStatus" />
					</view>
				</y-Refresh>
				<!-- 右下角按钮 -->
				<y-Fab :bottom="140" :right="40" :btnList="fabList" @click="handleFab" />
			</view>
			<!-- 弹出层 -->
			<u-modal v-model="modelshow" :title="modeltitle" :content="modelcontent" width="70%" :confirm-style="{color: '#ff5500'}"></u-modal>
		</view>
	</view>

	<!-- </AppContainer> -->
</template>

<script>
	var that;
	import Server from "@/common/serverutil.js";
	export default {
		components: {},
		computed: {
			statusBarHeight() {
				const {
					statusBarHeight
				} = getApp().globalData
				return statusBarHeight
			}
		},
		data() {
			return {
				startNum: 0,
				startNumRight: 0,
				activeTab: 0,
				// tab的名称
				tabList: [{
						title: '推荐'
					},
					{
						title: '好友'
					}
				],
				cardList: [],
				rightList: [],
				loadMoreStatus: 1, //0加载前，1加载中，2没有更多了
				//fab的设置
				fabList: [{
						bgColor: '#ff5500',
						text: '发布',
						fontSize: 28,
						color: '#fff'
					},
					{
						bgColor: '#ff5500',
						text: '我的动态',
						fontSize: 22,
						color: '#fff'
					}
				],
				modelshow: false,
				modeltitle: "",
				modelcontent: "",
				pageSize: 10,
				emptycardList: false,
				emptyrightList: false,
				userlogId: 0
			};
		},
		onLoad() {
			this.initdata();
		},
		onShow() {

			try {
				const res = uni.getStorageSync('pushblogback');
				if (res == true) {
					try {
						uni.setStorageSync('pushblogback', false);
						this.initdata();
					} catch (e) {
						// error
					}
				}
			} catch (e) {
				// error
			}
		},
		onReachBottom() {
			if (that.activeTab == 0) {
				that.startNum++;
			} else if (that.activeTab == 1) {
				that.startNumRight++;
			}

			//上滑加载
			that.loadData('add');
		},
		methods: {
			toDetails(id) {
				uni.navigateTo({
					url: '../../pagesD/diary/details/details?id=' + id
				})
			},
			toOther(id) {
				uni.navigateTo({
					url: '../mine/other/other?id=' + id
				})
			},
			loadData(type) {
				if (type === 'add') {
					let list = that.cardList;
					let listright = that.rightList;
					// 上拉加载
					/* if (that.activeTab == 0) {
						list = ;
					} else if (that.activeTab == 1) {
						list = that.rightList;
					} */

					/* if (list.length == 8) {
						// 2 判断没有更多了 
						that.loadMoreStatus = 2;
					} else */
					//左边
					if (list.length > 0) {
						if (that.activeTab == 0) {
							//增加 加载左边的列表
							Server.get("/blogs", {
								pageIndex: that.startNum + 1,
								pageSize: that.pageSize
							}, {
								success: response => {
									if (response.data.data.rows.length > 0) {
										//封装数据
										that.cardList = that.cardList.concat(response.data.data.rows);
									}
									if (response.data.data.rows.length < that.pageSize) {
										// 2 判断没有更多了
										that.loadMoreStatus = 2;
									}

									if (response.data.data.total == 0) {
										that.emptycardList = true;
									} else {
										that.emptycardList = false;
									}
								},
								warnings: response => {
									that.modelcontent = response;
									that.modeltitle = "警告";
									that.modelshow = true;
								},
								error: response => {
									that.modelcontent = response;
									that.modeltitle = "错误";
									that.modelshow = true;
								},
								service: response => {
									that.modelcontent = response.data.msg;
									that.modeltitle = "警告";
									that.modelshow = true;
								}
							})
						}

					} else {

						//第一次加载 左边
						Server.get("/blogs", {
							pageIndex: that.startNum + 1,
							pageSize: that.pageSize
						}, {
							success: response => {
								if (response.data.data.rows.length > 0) {
									//封装数据
									that.cardList = response.data.data.rows;
								}
								if (response.data.data.rows.length < that.pageSize) {
									// 2 判断没有更多了
									that.loadMoreStatus = 2;
								}
								if (response.data.data.total == 0) {
									that.emptycardList = true;
								} else {
									that.emptycardList = false;
								}
							},
							warnings: response => {
								that.modelcontent = response;
								that.modeltitle = "警告";
								that.modelshow = true;
							},
							service: response => {
								that.modelcontent = response.data.msg;
								that.modeltitle = "警告";
								that.modelshow = true;
							},
							error: response => {
								that.modelcontent = response;
								that.modeltitle = "错误";
								that.modelshow = true;
							}
						})

					}

					//右边

					if (listright.length > 0) {
						if (that.activeTab == 1) {
							//加载右边列表
							Server.get("/blogs/friends", {
								pageIndex: that.startNumRight + 1,
								pageSize: that.pageSize
							}, {
								success: response => {
									if (response.data.data.rows.length > 0) {
										//封装数据
										that.rightList = that.rightList.concat(response.data.data.rows);
									}
									if (response.data.data.rows.length < that.pageSize) {
										// 2 判断没有更多了
										that.loadMoreStatus = 2;
									}
									if (response.data.data.total == 0) {
										that.emptyrightList = true;
									} else {
										that.emptyrightList = false;
									}
								},
								warnings: response => {
									that.modelcontent = response;
									that.modeltitle = "警告";
									that.modelshow = true;
								},
								service: response => {
									that.modelcontent = response.data.msg;
									that.modeltitle = "警告";
									that.modelshow = true;
								},
								error: response => {
									that.modelcontent = response;
									that.modeltitle = "错误";
									that.modelshow = true;
								}
							})
						}


					} else {


						Server.get("/blogs/friends", {
							pageIndex: that.startNumRight + 1,
							pageSize: that.pageSize
						}, {
							success: response => {
								if (response.data.data.rows.length > 0) {
									//封装数据
									that.rightList = response.data.data.rows;
								}
								if (response.data.data.rows.length < that.pageSize) {
									// 2 判断没有更多了
									that.loadMoreStatus = 2;
								}
								if (response.data.data.total == 0) {
									that.emptyrightList = true;
								} else {
									that.emptyrightList = false;
								}
							},
							warnings: response => {
								that.modelcontent = response;
								that.modeltitle = "警告";
								that.modelshow = true;
							},
							service: response => {
								that.modelcontent = response.data.msg;
								that.modeltitle = "警告";
								that.modelshow = true;
							},
							error: response => {
								that.modelcontent = response;
								that.modeltitle = "错误";
								that.modelshow = true;
							}
						})

					}
				} else {
					//下拉刷新
					that.initdata(); //重新初始化数据
					that.$refs.mixPulldownRefresh && that.$refs.mixPulldownRefresh.endPulldownRefresh();
				}
			},
			//下拉刷新
			onPulldownReresh() {
				that.loadData('refresh');
			},
			handleTab(index) {
				that.activeTab = index;
				if(index==1)
				{
					Server.get("/blogs/myself", {
						pageIndex: 1,
						pageSize: 0,
					}, {
						success: response => {
							
						},
						warnings: response => {
						
						},
						error: response => {
							
						}
					})
				}
			},
			//点击右下角tab按钮
			handleFab(e) {
				let index = e.index;
				switch (index) {
					case 0:
						uni.navigateTo({
							url: '../../pagesL/push/push'
						});
						break;
					case 1:
						uni.navigateTo({
							url: '/pagesI/mine/timeLine'
						})
						break;
				}
			},
			initdata() {
				that = this;
				this.emptycardList = false;
				this.emptyrightList = false;
				this.loadMoreStatus = 1;
				if (that.activeTab == 0) {
					that.startNum = 0;
					that.cardList = [];
				} else if (that.activeTab == 1) {
					that.startNumRight = 0;
					that.rightList = [];
				}
				that.loadData('add');
				//that.rightList = that.$store.state.diary.rightList
			}
		}
	};
</script>

<style lang="less" scoped>
	.home {
		/* padding-top: 120rpx; */

		.top-barrage {
			width: 100%;
			height: 320rpx;
			overflow: hidden;
		}

		.card-bottom {
			width: 100%;

			.top-tab {
				display: flex;
				height: 120rpx;
				position: relative;
				top: 0;
				width: 100%;
				z-index: 100;
				background-color: #ffffff;

				.tab-item {
					flex: 1;
					color: #999;
					border-bottom: 4rpx solid #ececec;
				}

				.active {
					color: #ff5500;
					border-bottom: 4rpx solid #ff5500;
				}
			}
		}
	}
</style>
