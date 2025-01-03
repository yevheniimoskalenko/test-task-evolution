<template>
	<div
		class="infinite-list-wrapper"
		style="overflow: auto"
	>
		<div
			v-infinite-scroll="load"
			:infinite-scroll-disabled="isLoading || !hasMore"
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
							v-if="feed?.updatedOn !== feed.createdOn"
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
import { inject, ref } from 'vue'
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
const isLoading = ref(false)
const hasMore = ref(true) // Контролює, чи є ще дані для завантаження
const cursor = ref(null)
const limit = 10

const load = async () => {
	if (isLoading.value || !hasMore.value) return // Зупиняємо, якщо вже завантажуємо або більше даних немає

	const loading = ElLoading.service({
		lock: true,
		text: 'Loading',
		background: 'rgba(0, 0, 0, 0.7)',
	})

	let url = `/Publications?order=Desc&take=${limit}`
	if (cursor.value) {
		url += `&cursor=${cursor.value}`
	}

	try {
		const response = await axios(url)

		if (response.status === 200) {
			// Якщо заголовок `x-cursor` відсутній, припиняємо завантаження
			if (response.headers['x-cursor']) {
				cursor.value = response.headers['x-cursor']
			} else {
				hasMore.value = false // Більше немає даних
				ElMessage({
					message: `No more records`,
					type: 'info',
				})
			}

			// Додаємо нові дані до списку
			setFeeds(response.data)
		}
	} catch (err) {
		ElMessage({
			message: `Error load: ${err.message || err}`,
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
			.then(async () => {
				const response = await axios.delete(`/Publications/${id}`)
				if (response.status === 204) {
					removeFeedById(id)
				}
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
.date time {
	font-size: 14px;
	color: #888;
}
.noMore {
	text-align: center;
	margin: 20px;
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
