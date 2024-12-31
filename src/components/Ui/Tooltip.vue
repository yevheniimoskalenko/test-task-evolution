<template>
	<el-tooltip
		:visible="visible"
		placement="top"
	>
		<template #content>
			<span>{{ format(content, 'PPpp') }}</span>
		</template>
		<el-button
			@mouseenter="visible = true"
			@mouseleave="visible = false"
			type="info"
			circle
		>
			<el-icon><EditPen /></el-icon>
		</el-button>
	</el-tooltip>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { format } from 'date-fns'
const visible = ref(false)
defineProps({
	content: {
		type: String,
		required: true,
	},
})
</script>
