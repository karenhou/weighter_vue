<template>
   <div>
        <h1>Weight History</h1>
        <form class="needs-validation" @submit.prevent="addWeight">
            <div class="row">
                <div class="col-md-4 mb-3">
                    <label for="weight">Weight</label>
                    <input type="text" class="form-control" v-model="weight" @input="$v.weight.$touch()">
                    <!-- <span v-show="errors.has('weight')">{{ errors.first('weight') }}</span> -->
                    <!-- <div class="error" v-if="!$v.weight.required">Field is required</div> -->
                    <div class="error" v-if="$v.weight.$dirty">
                        <div class="error" v-if="!$v.weight.required">Field is required</div>
                        <div class="error" v-if="!$v.weight.numeric">Enter only numbers</div>
                    </div>
                    <!-- <div class="error" v-if="!$v.weight.required">Field is required</div>
                    <div class="error" v-if="!$v.weight.numeric">Enter only numbers</div>
                    <p v-if="feedback" class="error">{{ feedback }}</p> -->
                </div>
                <div class="col-md-4 mb-3">
                    <label for="fat">Body Fat</label>
                    <input type="text" class="form-control" v-model="fat" @input="$v.fat.$touch()">
                    <div class="error" v-if="$v.fat.$dirty">
                        <div class="error" v-if="!$v.fat.required">Field is required</div>
                        <div class="error" v-if="!$v.fat.numeric">Enter only numbers</div>
                    </div>
                    <!-- <div class="error" v-if="!$v.fat.required">Field is required</div>
                    <div class="error" v-if="!$v.fat.numeric">Enter only numbers</div>
                    <p v-if="feedback" class="error">{{ feedback }}</p> -->
                </div>
                <div class="col-md-4 mb-3">
                    <button class="btn btn-primary btn-lg btn-block submitBtn" :disabled="$v.$invalid">Add Weight</button>
                </div>
            </div>
        </form>
        <div class="table-responsive">
            <table class="table table-striped table-sm">
            <thead>
                <tr>
                <th>Time</th>
                <th>Weight</th>
                <th>Body Fat</th>
                <th>Action</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(data, index) in getHistoriesList" :key="index" >
                    <td>{{ data.timestamp }}</td>
                    <td><input type="text" v-model="data.weight" :disabled="disabled">{{$v.data}}</td>
                    <td><input type="text" v-model="data.fat" :disabled="disabled"></td>
                    <td>
                        <i class="fas fa-edit edit_mode" @click="editWeight(data)" aria-hidden="true"></i>
                        <i class="fas fa-trash delete_mode" aria-hidden="true" @click="deleteWeight(data.id)"></i>
                    </td>
                </tr>
                
            </tbody>
            
            </table>
        </div>
    </div>
</template>

<script>
import { required, numeric} from 'vuelidate/lib/validators'

export default {
    name: 'Table',
    data() {
        return {
            weight: null,
            fat: null,
            feedback: null,
            histories: [],
            disabled: true,
        }
    },
    computed: {
        getHistoriesList: function() {
            return this.$store.getters.historyList
        }
    },
    validations: {
        weight: {
            required,
            numeric
        },
        fat: {
            required,
            numeric
        },
       
    },
    methods: {
        addWeight() {
            if(this.weight && this.fat) {
                this.$store.dispatch('addWeight', {
                    weight: this.weight,
                    fat: this.fat,
                })
                this.feedback = null
            } else {
                this.feedback = 'You must a correct number'
            }
        },
        editMode() {
            this.feedback = null
            this.disabled = !this.disabled
        },
        editWeight(data) {
            this.feedback = null
            
            if(!this.disabled) {
                this.$store.dispatch('editWeight', {
                    id: data.id,
                    weight: data.weight,
                    fat: data.fat
                })
                this.disabled = !this.disabled
            } else {
                this.disabled = !this.disabled
            }
        },
        deleteWeight(id) {
            this.$store.dispatch('deleteWeight', {id: id})
        },
    }
}
</script>

<style>
.error {
    color: red;
}

</style>
