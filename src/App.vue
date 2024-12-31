<template>
	<el-container class="wrapper">
		<el-header>
			<TheFeedForm />
		</el-header>
		<el-main class="main">
			<TheFeedList />
		</el-main>
		<TheDialog></TheDialog>
	</el-container>
</template>
<style>
.wrapper {
	max-width: 600px;
	margin: 0 auto;
}
.main {
	margin-top: 60px;
}
</style>
