<template>
    <div>
        <h2>Graph</h2>
        <div>
            <line-chart ref="myChart" :data="chartList" :messages="{empty: 'Loading data'}" :refresh="20"></line-chart>
        </div>
    </div>
</template>

<script>
export default {
    name: 'graph',
    data() {
        return {
        }
    },
    computed: {
        chartList: function() {
            // console.log('data list ', this.$store.getters.chartDataList)
            return this.$store.getters.chartDataList
        }
    },
}
</script>
