<template>
	<div class="container text-center">
		<div class="row align-items-start">
			<div class="col-auto">
				<select class="form-select" v-model="select_data" v-on:change="getData"> 
					<option value="all">ทั้งหมด</option>
					<option value="unsuccess">ยังไม่เสร็จ</option>
					<option value="success">เสร็จแล้ว</option>
				</select>
			</div>
			<div class="col-auto">
				<button type="button" class="btn btn-primary" v-on:click="myModal.show()">ADD TODO LIST</button>
			</div>
		</div>
	</div>
	<table class="table mt-2">
		<thead>
			<tr class="table-secondary">
				<th>#</th>
				<th>วันที่เพิ่ม</th>
				<th>วันที่</th>
				<th>เรื่อง</th>
				<th>รายละเอียด</th>
				<th>เสร็จสิ้น</th>
				<th>#</th>
			</tr>
		</thead>
		<tbody>
			<tr v-for="(item, index) in data_TodoList" :key="index">
				<td>{{index+1}}</td>
				<td>
					{{item.data().add_datetime ? new Date(item.data().add_datetime.seconds*1000).toLocaleString() : ''}}
				</td>
				<td>{{item.data().date}}</td>
				<td>{{item.data().title}}</td>
				<td>{{item.data().detail}}</td>
				<td>
					{{item.data().success_datetime ? new Date(item.data().success_datetime.seconds*1000).toLocaleString()  : ''}}
				</td>
				<td>
					<template v-if="!item.data().success_datetime">
						<button type="button" class="btn btn-success" v-on:click="updateSuccess(item.id)">สำเร็จ</button>
						&nbsp;
						<button type="button" class="btn btn-danger" v-on:click="cancelTodoList(item.id)">ลบ</button>
					</template>
				</td>	
			</tr>
		</tbody>
	</table>
	<small class="text-danger">*แสดงสูงสุด 10 รายการ</small>

	<!-- Modal -->
	<div class="modal fade" id="myModal" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
		<div class="modal-dialog">
			<div class="modal-content">
				<div class="modal-header">
					<h1 class="modal-title fs-5" id="myModalLabel">ADD TODO LIST</h1>
					<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
				</div>
				<div class="modal-body">
					<div class="mb-3">
						<label for="date" class="form-label">วันที่</label>
						<input type="text" class="form-control" id="date" placeholder="วันที่" onkeypress="return false;">
					</div>
					<div class="mb-3">
						<label for="title" class="form-label">เรื่อง</label>
						<input type="text" class="form-control" id="title" placeholder="เรื่อง" v-model="add_title">
					</div>
					<div class="mb-3">
						<label for="detail" class="form-label">รายละเอียด</label>
						<textarea class="form-control" id="detail" rows="3" placeholder="รายละเอียด	" v-model="add_detail"></textarea>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">ปิด</button>
					<button type="button" class="btn btn-primary" v-on:click="addTodoList">บันทึก</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import * as bootstrap from 'bootstrap';	
	import AirDatepicker from 'air-datepicker';
	import 'air-datepicker/air-datepicker.css';
	import localeEn from 'air-datepicker/locale/en';

// the relevant methods
	import { collection, query, where, orderBy, limit, doc, addDoc, setDoc, updateDoc, deleteDoc, onSnapshot } from "firebase/firestore"
// the firestore instance
	import { db, auth } from '../firebase'
	export default {

		name: 'page-users',

		data () {
			return {
				select_data:'success', 
				myModal:'', 
				data_TodoList:[],
				add_date:'',
				add_title:'',
				add_detail:'',
				ele_datepicker:'',
			}
		},
		created() {
			var self = this;
			// console.log(auth.currentUser.uid);
			this.getData()
			this.$nextTick(() => {
				self.ele_datepicker = new AirDatepicker('#date', {
					locale: localeEn,
					isMobile: true,
					autoClose: true,
					dateFormat: 'yyyy-MM-dd',
					onSelect({formattedDate}) {
						self.add_date = formattedDate;
					}
				})

				self.myModal = new bootstrap.Modal('#myModal', {
					keyboard: false
				})
			});
		},
		methods: {
			async addTodoList() {
				var self = this;
				// await setDoc(doc(db, 'todo_list', auth.currentUser.uid), {});

				const dataObj = {
					date: self.add_date,
					title: self.add_title,
					detail: self.add_detail,
					add_datetime: new Date(),
					success_datetime: null
				}

				await setDoc(doc(db, 'todo_list', auth.currentUser.uid), {})
				const colRef = collection(db, 'todo_list/'+auth.currentUser.uid+'/data');
				await addDoc(colRef, dataObj)
				.then((docRef) => {
					self.myModal.hide();
					// alert('บันทึกสำเร็จ');
					console.log('Document was created with ID:', docRef.id);
					self.add_date   = '';
					self.add_title  = '';
					self.add_detail = '';
					self.ele_datepicker.clear();
				})
				.catch((err) => {
					alert('บันทึกไม่สำเร็จ');
					console.log(err)
				});
			},
			async cancelTodoList(id) {
				await deleteDoc(doc(db, 'todo_list/'+auth.currentUser.uid+'/data', id))
			},
			async updateSuccess(id){
				await updateDoc(doc(db, 'todo_list/'+auth.currentUser.uid+'/data', id), {
					success_datetime: new Date()
				});
			}, 
			async getData() {
				var self = this;
				if(self.select_data == 'all'){
					onSnapshot(query(collection(db, 'todo_list/'+auth.currentUser.uid+'/data'), orderBy('success_datetime', 'desc'), orderBy('add_datetime', 'desc'), limit(10)), (snap) => {
					self.data_TodoList = [];
					snap.forEach((doc) => {
						self.data_TodoList.push(doc)
					})
				})
				}else if(self.select_data == 'unsuccess'){
					onSnapshot(query(collection(db, 'todo_list/'+auth.currentUser.uid+'/data'), where("success_datetime", "==", null), orderBy('success_datetime', 'desc'), orderBy('add_datetime', 'desc'), limit(10)), (snap) => {
					self.data_TodoList = [];
					snap.forEach((doc) => {
						self.data_TodoList.push(doc)
					})
				})
				}else if(self.select_data == 'success'){
					onSnapshot(query(collection(db, 'todo_list/'+auth.currentUser.uid+'/data'), where("success_datetime", "!=", null), orderBy('success_datetime', 'desc'), orderBy('add_datetime', 'desc'), limit(10)), (snap) => {
					self.data_TodoList = [];
					snap.forEach((doc) => {
						self.data_TodoList.push(doc)
					})
				})
				}
				
			}
		}
	}
</script>

<style lang="css">
	.air-datepicker-global-container{
		z-index: 9999;
	}
</style>