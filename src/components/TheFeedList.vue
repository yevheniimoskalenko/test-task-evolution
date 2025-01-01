<template>
	<div
		class="infinite-list-wrapper"
		style="overflow: auto"
	>
		<div
			v-infinite-scroll="load"
			:infinite-scroll-disabled="isLoading"
			:infinite-scroll-distance="10"
			class="infinite-list"
		>
			<TransitionGroup name="feed-list">
				<article
					v-for="feed in getFeeds"
					:key="feed.id"
				>
					<div class="date">
						<span> Published on: </span>
						<time :datetime="format(feed.createdOn, 'yyyy-MM-dd')">{{ useFormatDate(feed.createdOn) }}</time>
						<UiTooltip
							v-if="feed?.updatedOn"
							:content="feed.updatedOn"
						/>
					</div>
					<p>{{ feed.content }}</p>
					<el-row>
						<el-col>
							<div class="manage">
								<el-button
									type="success"
									:icon="Edit"
									circle
									@click="showModal({ component: 'TheFormEditTopic', title: 'Update', data: feed })"
								/>
								<el-button
									type="danger"
									:icon="Delete"
									circle
									@click="remove(feed.id)"
								/>
							</div>
						</el-col>
					</el-row>
				</article>
			</TransitionGroup>
		</div>
	</div>
</template>

<script setup>
import { inject, computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { format } from 'date-fns'
import { useFeedStore } from '@/stores/feed'
import { useModalStore } from '@/stores/modal'
import UiTooltip from '@/components/Ui/Tooltip.vue'
import useFormatDate from '@/composibles/useFormatDate'
import { Delete, Edit } from '@element-plus/icons-vue'
const store = useFeedStore()
const { showModal } = useModalStore()

const { setFeeds, removeFeedById } = store
const { getFeeds } = storeToRefs(store)
const axios = inject('axios')

const page = ref(1)
const isLoading = ref(false)

const load = async () => {
	if (isLoading.value) return
	const loading = ElLoading.service({
		lock: true,
		text: 'Loading',
		background: 'rgba(0, 0, 0, 0.7)',
	})
	try {
		// const response = await axios(`/Publications?order=Desc`)
		const response = await axios(`/posts?_page=${page.value}&_limit=10`)
		if (response.status === 200) {
			setFeeds(response.data.map((feed) => ({ id: feed.id, content: feed.title, createdOn: Date.now() })))
			loading.close()
			page.value++
		}
	} catch (err) {
		ElMessage({
			message: err,
			type: 'error',
		})
	} finally {
		isLoading.value = false
		loading.close()
	}
}

const remove = async (id) => {
	try {
		ElMessageBox.confirm('Will permanently delete the topic. Continue?', 'Delete topic', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
			type: 'warning',
		})
			.then(() => {
				removeFeedById(id)
			})
			.catch(() => {
				ElMessage({
					type: 'info',
					message: 'Delete canceled',
				})
			})
	} catch (err) {
		ElMessage({
			message: err,
			type: 'error',
		})
	}
}
</script>

<style>
.infinite-list {
	height: calc(100vh - 177px);
}
article {
	border-bottom: 1px solid #ccc;
	padding: 20px 0;
}
.manage {
	display: flex;
	width: 100%;
	justify-content: flex-end;
}
.date {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	column-gap: 20px;
}
.feed-list-enter-active,
.feed-list-leave-active {
	transition: all 0.5s ease;
}
.feed-list-enter-from,
.feed-list-leave-to {
	opacity: 0;
	transform: translateX(30px);
}
</style>
