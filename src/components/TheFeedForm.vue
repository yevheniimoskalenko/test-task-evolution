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
import { reactive, ref } from 'vue'
import { useFeedStore } from '@/stores/feed'
const { setFeeds } = useFeedStore()
const formRef = ref()

const form = reactive({
	content: '',
})

const submitForm = (formEl) => {
	if (!formEl) return
	formEl.validate((valid) => {
		if (valid) {
			setFeeds([{ id: Date.now(), content: form.content, date: Date.now() }])
			formRef.value.resetFields()
		} else {
			console.log('error submit!')
		}
	})
}
</script>
