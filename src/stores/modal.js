import { defineStore } from 'pinia'
import { computed, reactive } from 'vue'
export const useModalStore = defineStore('modal', () => {
	const state = reactive({
		active: false,
		data: {},
		component: '',
		title: '',
	})

	const getData = computed(() => state.data)

	function showModal({ data, component, title }) {
		state.active = true
		state.data = data
		state.component = component
		state.title = title
	}

	function hideModal() {
		state.active = false
		state.data = {}
		state.component = ''
		state.title = ''
	}

	return { state, showModal, hideModal, getData }
})
