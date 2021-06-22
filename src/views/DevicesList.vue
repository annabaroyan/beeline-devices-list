<template>
    <div class="container">
        <div v-if="devices.length !== 0">
            <ul class="list-group">
                <li 
                class="list-group-item d-md-flex align-items-center"
                v-for="device in devices"
                :key="device.id"
                >
                    <div class="col-md-10 col-12 d-md-flex justify-content-left mb-md-0 mb-2">
                        <router-link 
                        v-if="device.isEdit === false"
                        :to="`/device/${device.id}`">
                            {{ device.deviceName.deviceName }}
                        </router-link>
                        <div
                            v-else 
                            class="form-group col-12">
                            <input
                                v-model.trim="deviceName" 
                                type="text" 
                                class="form-control">
                        </div>
                    </div>
                    <div class="col-md-2 col-12 d-flex flex-md-row flex-column justify-content-md-between justify-content-center">
                        <div>
                            <button 
                                v-if="device.isEdit === false"
                                @click="editDevice(device.id)"
                                class="btn btn-warning mb-md-0 mb-2 w-100">
                                изменить
                            </button>
                            <button
                                v-else
                                @click="saveDevice(device.id)"
                                class="btn btn-success mb-md-0 mb-2 w-100"
                                >сохранить
                            </button>
                        </div>
                        <div>
                            <button
                                @click="deleteDevice(device.id)" 
                                class="btn btn-danger w-100">
                                удалить
                            </button>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="card" v-else>
            <h4>Нет устройств</h4>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
export default {
    data() {
        return {
            deviceName: '',
            devices: []
        }
    },
    mounted() {
        this.loadDevices();
    },
    methods: {
        editDevice (id) {
            this.devices.map(device => {
                if (device.id === id) {
                    this.deviceName = device.deviceName.deviceName;
                    device.isEdit = true;
                }
            });
        },
        async saveDevice (id) {
            console.log('ID', id);
            this.devices.map(device => {
                if (device.id === id) {
                    device.deviceName.deviceName = this.deviceName;
                    device.isEdit = false;
                }
            });
            await axios.put(`https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices/${id}/deviceName.json`, {
                deviceName: this.deviceName
            });

        },
        async deleteDevice (id) {

            const result = this.devices.filter(device => device.id !== id);
            this.devices = result;

            await axios.delete(`https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices/${id}.json`);

            
        },
        async loadDevices () {
            const {data} = await axios.get('https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices.json');
            if (data) {
                this.devices = Object.keys(data).map(key => {
                    return {
                        id: key,
                        isEdit: false,
                        ...data[key]
                    }
                });
            }
            
        }
    }
}
</script>

<style scoped>

</style>
