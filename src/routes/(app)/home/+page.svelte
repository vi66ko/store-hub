<script lang="ts">
	import { Line } from 'svelte-chartjs';
	import 'chart.js/auto';
	import Chart from 'chart.js/auto';

	import type { PageData } from './$types';
	import { onMount } from 'svelte';

	export let data: PageData;

	const lineChartDataProp = {
		labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
		datasets: [
			{
				label: 'My First dataset',
				fill: true,
				lineTension: 0.3,
				backgroundColor: 'rgba(50, 255,230, .1)',
				borderColor: 'rgb(50, 255, 203)',
				borderCapStyle: 'butt',
				borderDash: [],
				borderDashOffset: 0.0,
				borderJoinStyle: 'miter',
				pointBorderColor: 'rgb(1, 130,1 58)',
				pointBackgroundColor: 'rgb(255, 255, 255)',
				pointBorderWidth: 10,
				pointHoverRadius: 5,
				pointHoverBackgroundColor: 'rgb(0, 0, 0)',
				pointHoverBorderColor: 'rgba(1, 220, 220,1)',
				pointHoverBorderWidth: 2,
				pointRadius: 1,
				pointHitRadius: 10,
				data: [65, 59, 80, 81, 56, 55, 40]
			}
		]
	};

	const options: import('chart.js/dist/types/utils.js')._DeepPartialObject<
		import('chart.js').CoreChartOptions<'line'> &
			import('chart.js').ElementChartOptions<'line'> &
			import('chart.js').PluginChartOptions<'line'> &
			import('chart.js').DatasetChartOptions<'line'> &
			import('chart.js').ScaleChartOptions<'line'> &
			import('chart.js').LineControllerChartOptions
	> = {
		maintainAspectRatio: false,
		plugins: {
			title: {},
			legend: {
				labels: {
					color: 'white',
					font: {
						size: 16
					}
				}
			}
		},
		scales: {
			x: {
				grid: {
					color: 'rgba(50, 150, 150, 0.7)'
				},
				title: {
					color: 'white',
					display: true,
					text: 'Title',
					font: {
						size: 16
					}
				}
			},
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(50, 150, 150, 0.7)'
				},
				title: {
					text: 'Price',
					color: 'white',
					display: true,
					font: {
						size: 16
					}
				},
				ticks: {
					color: 'white',
					font: {
						size: 20
					}
				}
			}
		}
	};

	$: console.log(data);
	$: topSells = [...data.topSells];

	// ---- Beginning of the test
	const barData = [
		{ year: 2010, count: 10 },
		{ year: 2011, count: 20 },
		{ year: 2012, count: 15 },
		{ year: 2013, count: 25 },
		{ year: 2014, count: 22 },
		{ year: 2015, count: 30 },
		{ year: 2016, count: 28 }
	];
	onMount(() => {
		//  labels: data.map(row => row.year),
		new Chart(document.getElementById('acquisitions'), {
			type: 'bar',
			data: {
				labels: barData.map((row) => row.year),
				datasets: [
					{
						label: 'Acquisitions by year',
						data: barData.map((row) => row.count)
					}
				]
			}
		});
	});

	function displayRange(event) {
		console.log(+event.target.value + 1);

		console.log(data.topSells.slice(0, +event.target.value + 1));

		topSells = data.topSells.slice(0, +event.target.value);
	}
</script>

<!-- START OF TEST -->
<section class="mb-96">
	<h2>Test of chart</h2>
	<div class="w-[800px]">
		<canvas id="acquisitions" />
	</div>
</section>
<!-- END OF TEST -->

<section>
	<h2>Here comes the selection options like Today</h2>
</section>
<section>
	<h2>Total sales and</h2>
</section>
<section class="h-[20rem]">
	<h2>The chart goes here</h2>

	<Line {options} data={lineChartDataProp} />
</section>
<section>
	<div class="max-w-7xl mx-auto mt-8 table-container">
		<header class="sticky flex justify-between top-0 z-30 py-4 px-3 dark:bg-surface-700 font-bold">
			<div>
				<h3 class="mr-6">
					Top [ <input
						on:change={displayRange}
						type="number"
						name="totalRangeDisplay"
						min="2"
						max="100"
						value="5"
						class="input w-14 variant-form-material text-center"
					/> ] Sells
				</h3>
			</div>
			<form>
				<input type="date" name="" id="" class="dark:bg-surface-700" />
			</form>
			<!-- <div>
				<h3>Name</h3>
			</div> -->
		</header>
		{#if data.tableData.length !== 0}
			<p class="px-2 py-4 text-center dark:bg-surface-800">
				There is not any brand records. Feel free to add.
			</p>
		{:else}
			<table class="table table-hover rounded-t-none relative">
				<thead class="">
					<tr class="">
						<th class="text-center">#</th>
						<th>Product</th>
						<th>Quantity</th>
						<th class="float-right mr-[2.10rem]">Sum</th>
					</tr>
				</thead>
				<tbody>
					{#each topSells as row, i}
						<tr>
							<td class="w-[5.25rem] text-center">{row.tableId}</td>
							<td>{row.name}</td>
							<td>{row.total_sales}</td>
							<td class="float-right mr-5">£ {row.total_amount.toFixed(2)}</td>
						</tr>
					{/each}
				</tbody>
				<tfoot>
					<tr class="dark:bg-surface-700">
						<th class="text-center">#</th>
						<th>Product</th>
						<th>Quantity</th>
						<th class="float-right mr-[2.10rem]">Sum</th>
					</tr>
				</tfoot>
			</table>
		{/if}
	</div>
</section>

<style>
	input::-webkit-outer-spin-button,
	input::-webkit-inner-spin-button {
		-webkit-appearance: none;
		margin: 0;
	}

	/* Firefox */
	input[type='number'] {
		-moz-appearance: textfield;
	}
</style>
