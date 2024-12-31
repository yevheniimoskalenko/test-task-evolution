import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
export const useFeedStore = defineStore('feed', () => {
	const feeds = ref([])

	const getFeeds = computed(() => feeds.value)

	function setFeeds(data) {
		feeds.value = [...data, ...feeds.value]
	}

	function removeFeedById(id) {
		const feed = feeds.value.find((f) => f.id === id)
		if (feed) {
			feeds.value = feeds.value.filter((f) => f.id !== id)
			ElMessage({
				message: 'Topic was removed',
				type: 'success',
			})
		} else {
			ElMessage({
				message: 'Feed not found',
				type: 'error',
			})
			return
		}
	}

	function updateFeedById(id, content) {
		const feed = feeds.value.find((f) => f.id === id)
		if (feed) {
			Object.assign(feed, {
				content,
				updatedAt: Date.now(),
			})
			ElMessage({
				message: 'Topic was update',
				type: 'success',
			})
		} else {
			ElMessage({
				message: 'Feed not found',
				type: 'error',
			})
			return
		}
	}

	return { getFeeds, setFeeds, removeFeedById, updateFeedById }
})
