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
				>Update</el-button
			>
		</el-form-item>
	</el-form>
</template>

<script setup>
import { reactive, ref, inject } from 'vue'
import { useFeedStore } from '@/stores/feed'
import { useModalStore } from '@/stores/modal'
const store = useFeedStore()
const { updateFeedById } = store
const formRef = ref()
const { getData, hideModal } = useModalStore()

const axios = inject('axios')

const form = reactive({
	content: getData.content || '',
})

const submitForm = (formEl) => {
	if (!formEl) return
	formEl.validate(async (valid) => {
		if (!valid) return
		try {
			const response = await axios({
				url: `/Publications/${getData.id}`,
				method: 'PUT',
				data: {
					content: form.content,
				},
			})
			if (response.status === 204) {
				updateFeedById(getData.id, form.content)
				hideModal()
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
