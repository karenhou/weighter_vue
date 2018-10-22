<template>
    <div>
        <h2>Graph</h2>
        <div>
            <line-chart ref="myChart" :data="chartData" :messages="{empty: 'Loading data'}" :refresh="20"></line-chart>
        </div>
    </div>
</template>
<script>
import moment from 'moment'
import db from '@/firebase/init'
import Chart from 'chart.js';

export default {
    name: 'Graph',
    props: ['user_id'],
    data() {
        return {
            chartData:[],
        }
    },
    mounted() {
        var tempf = {}
        var tempw = {}
        var ref = db.collection('history').where('user_id', '==', this.user_id).orderBy('timestamp')
        ref.onSnapshot(snapshot => {
            // console.log('times')
            snapshot.docChanges().forEach(change => {
                console.log(change.type)
                if(change.type) {
                    console.log('in graph ' + change.type)
                    let x = change.doc
                    let time = moment(x.data().timestamp).format('lll')
                    tempf[time] = parseInt(x.data().fat)
                    tempw[time] = parseInt(x.data().weight)
                }
            })
            this.chartData = []
            this.chartData.push({
                name: 'Weight',
                data: tempw
            })
            this.chartData.push({
                name: 'Fat',
                data: tempf
            })

            // snapshot.forEach(doc => {
            //     console.log(doc.data().timestamp)
            //     let time = moment(doc.data().timestamp).format('lll')
            //     tempf[time] = parseInt(doc.data().fat)
            //     tempw[time] = parseInt(doc.data().weight)
            // })

            // this.chartData.push({
            //     name: 'Weight',
            //     data: tempw
            // })

            // this.chartData.push({
            //     name: 'Fat',
            //     data: tempf
            // })
            // console.log('hello')
        })
    },
}
</script>
