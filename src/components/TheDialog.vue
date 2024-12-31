<template>
	<el-dialog
		v-model="inputValue"
		:title="state.title"
		width="600"
		:before-close="handleClose"
	>
		<template #default>
			<component
				:is="components[state.component]"
				v-bind="getData"
			/>
		</template>
		<template #fallback>
			<el-icon :size="24">
				<Loading />
			</el-icon>
		</template>
	</el-dialog>
</template>
<script setup>
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useModalStore } from '@/stores/modal'
import TheFormEditTopic from '@/components/TheFormEditTopic.vue'

const store = useModalStore()
const { getData, state } = storeToRefs(store)

const inputValue = computed({
	get: () => state.value.active,
	set: () => store.hideModal(),
})

const components = {
	TheFormEditTopic,
}
const handleClose = (done) => {
	ElMessageBox.confirm('Are you sure to close this dialog?')
		.then(() => {
			done()
		})
		.catch(() => {
			// catch error
		})
}
</script>
