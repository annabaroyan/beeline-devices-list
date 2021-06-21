<template>
    <div class="container">
        <form class="card" @submit.prevent="createDevice">
            <h2>Добавить устройство</h2>

            <div class="input-group">
                <label for="name"></label>
                <input 
                    class="form-control" 
                    placeholder="Введите название устройства" 
                    type="text" 
                    id="name" 
                    v-model.trim="device">
                <button class="btn btn-primary" :disabled="device.length === 0">
                    добавить
                </button>
            </div>
        </form>

    </div>
</template>

<script>

export default {
    data() {
        return {
            device: ''
        }
    },
    methods: {
        async createDevice () {
            const response = await fetch('https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices.json', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    deviceName: {
                        deviceName: this.device
                    },
                    series: [{series: null}]
                })
            });

            this.devices = await response.json();
            this.device = '';
            this.$router.push('/');
        }
    },
   
}
</script>

<style scoped>

</style>