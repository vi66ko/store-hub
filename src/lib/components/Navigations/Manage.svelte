<script lang="ts">
	import { drawerStore } from '@skeletonlabs/skeleton';

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="list-nav">
	<ul>
		<li><a href="/manage/products">Products</a></li>
		<li><a href="/manage/categories">Gategories</a></li>
		<li><a href="/brands">Brands</a></li>
	</ul>
</nav>
