<template>
	<div class="container device-detail">
		<div class="row">
			<div class="col-12 mb-2">
				<h2>{{ deviceName }}</h2>
			</div>
		</div>
		<div class="row">
			<div class="col-12 mb-4">
				<form @submit.prevent="addSeriesNum">
					<div class="input-group">
						<input 
							type="text" 
							class="form-control" 
							v-model.trim="seriesNum" />
						<button 
							class="btn btn-primary"
							type="submit"
							:disabled="seriesNum.length === 0">
							Добавить серийный номер
						</button>
					</div>
				</form>
			</div>
		</div>
		<div class="row">
			<div class="col-12">
				<div v-if="series.length > 0">
					{{series.series}}
					<ul class="list-group">
						<li class="list-group-item d-flex align-items-center"
							v-for="(s, key) in series"
							:class="{disable: seriesDisabled}"
							:key="key"
							>
							<div class="col-lg-10">
								<div v-if="s.isEdit === false">
									<a 
										@click.prevent="copySeriesNum(s.id, s.mainId, $event)"
										class="device-detail__link" href="#">
										{{ s.series }}
									</a>
								</div>
								<div v-else 
		                            class="form-group col-12">
		                            <input
		                                v-model.trim="seriesName" 
		                                type="text" 
		                                class="form-control">
		                        </div>
							</div>
							<div class="col-lg-2 d-flex justify-content-between">
								<div>
		                            <button 
		                                v-if="s.isEdit === false"
		                                @click="editSeries(s.id, s.mainId)"
		                                class="btn btn-warning">
		                                изменить
		                            </button>
		                            <button
		                                v-else
		                                @click="saveSeries(s.id, s.mainId)"
		                                class="btn btn-success"
		                                >сохранить
		                            </button>
		                        </div>
		                        <div>
		                            <button
		                                @click="deleteSeries(s.id, s.mainId)" 
		                                class="btn btn-danger">
		                                удалить
		                            </button>
		                        </div>
							</div>
							<div
								class="device-detail__copy alert alert-success d-flex justify-content-center align-items-center"
								role="alert"
								v-if="s.isShow">
								 скопировано
							</div>
						</li>
					</ul>
				</div>
				<div v-else>
					<h4>Нет серийных номеров</h4>
				</div>
			</div>
		</div>
	</div>
</template>


<script>
import axios from 'axios';
export default {
	data() {
		return {
			deviceName: '',
			series: [],
			seriesName: '',
			seriesNum: '',
			timeOutTextCopied: null,
			seriesDisabled: false,
			id: null
		}
	},
	mounted() {
		this.getDeviceSeries();
	},
	methods: {
		async deleteSeries (id, mainId) {
			console.log('ID', id);
			const result = this.series.filter(s => s.id !== id);
            this.series = result;
            console.log('S', this.series);

            await axios.delete(`https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices/${mainId}/series/${id}.json`);
		},
		editSeries (id, mainId) {
			this.series.map(s => {
				if (s.id === id) {
					this.seriesName = s.series;
					s.isEdit = true;
				}
			});
		},
		async saveSeries (id, mainId) {
			console.log('id', id);
			console.log('mainId', mainId);
			this.series.map(s => {
				if (s.id === id) {
					s.series = this.seriesName;
					s.isEdit = false;
				}
			});
			await axios.patch(`https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices/${mainId}/series/${id}.json`, {
				series: this.seriesName
			});
		},
		async addSeriesNum() {
			console.log('SERIES NUM', this.seriesNum);
			const response = await axios.put(`https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices/${this.$route.params.id}/series/${this.seriesNum}.json`, {
					series: String(this.seriesNum)
				});
			console.log('RESPONSE', response);
			this.seriesNum = '';
			this.getDeviceSeries();
		
		},
		async getDeviceSeries() {
			const {data} = await axios.get(`https://device-ed123-default-rtdb.europe-west1.firebasedatabase.app/devices/${this.$route.params.id}.json`);
			// console.log('DATA', Object.keys(data.series));
			this.deviceName = data.deviceName.deviceName;
			if ( data.series) {
				this.series = data.series;
				console.log('SERIES', this.series);
				this.series = Object.keys(data.series).map((key, k) => {
					// console.log('KEY', this.series[key].series);
					console.log('KEY', data.series[key].series);
					// if (this.series[k].series !== '') {
						return {
							id: key,
							mainId: this.$route.params.id,
							isEdit: false,
							series: data.series[key].series,
							isShow: false
						}
					// }
					

				});
				
				
			}
			
		},
		hideTextCopied () {
			this.series.map(s => {
				if (s.id === this.id) {
					s.isShow = false;
					this.seriesDisabled = false;
				}
			});
			// this.series[this.id].isShow = false;
			clearTimeout(this.timeOutTextCopied);
		},
		copySeriesNum(id, mainId, {target}) {
			try {
				this.id = id;
				const text = target.textContent;
				navigator.clipboard.writeText(text);
				this.series.map(s => {
					console.log('S', s);
					if (s.id === id) {
						s.isShow = true;
						this.seriesDisabled = true;
						this.timeOutTextCopied = setTimeout(this.hideTextCopied, 1000);
					}
				});
				
			} catch (e) {
				throw e;
			}
		}
	}
}

</script>

<style lang="scss" scoped>
	.device-detail {
		ul {
			li {
				position: relative;
				padding: 0;
				&.disable {
					pointer-events: none;
				}
			}
		}
		&__copy {
			position: absolute;
			top: 50%;
			width: 100%;
			height: 100%;
			transform: translateY(-50%);
			font-size: 20px;
			color: green;
		}
		&__link {
			display: block;
			padding: .5rem;
			text-decoration: none;
			font-size: 20px;
			text-align: left;
		}
	}
</style>