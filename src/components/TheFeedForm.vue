<template>
	<el-form
		ref="formRef"
		:model="form"
	>
		<el-form-item
			prop="content"
			:rules="[{ required: true, message: 'content is required' }]"
		>
			<el-input
				v-model="form.content"
				type="textarea"
				placeholder="Enter new post content here"
				autocomplete="off"
			/>
		</el-form-item>
		<el-form-item>
			<el-button
				type="primary"
				@click="submitForm(formRef)"
				>Publish</el-button
			>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { reactive, ref, inject } from 'vue'
import { useFeedStore } from '@/stores/feed'
const { addNewFeed } = useFeedStore()
const formRef = ref()
const axios = inject('axios')
const form = reactive({
	content: '',
})

const submitForm = (formEl) => {
	if (!formEl) return
	formEl.validate(async (valid) => {
		if (!valid) return
		try {
			const response = await axios({
				url: '/Publications',
				method: 'POST',
				data: {
					content: form.content,
				},
			})
			if (response.status === 201) {
				addNewFeed(response.data)
				formRef.value.resetFields()
			} else {
				ElMessage({
					message: response.data,
					type: 'error',
				})
			}
		} catch (err) {
			ElMessage({
				message: err,
				type: 'error',
			})
		}
	})
}
</script>
