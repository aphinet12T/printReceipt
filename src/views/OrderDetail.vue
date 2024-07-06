<template>
    <div class="flex flex-col md:h-full space-y-4 p-4">
        <div class="flex items-center space-x-4">
            <!-- <ButtonBack /> -->
            <span class="ml-2 text-xl font-bold">รายละเอียด</span>
        </div>
        <div class="bg-white p-3 shadow-md rounded-md">
            <div class="text-sm">
                <!-- <div>{{ customer.customername }} </div> -->
                <div>ร้าน : {{ customer.customername }}</div>
                <div>เบอร์ : {{ customer.phone }}</div>
                <div>เลขที่ผู้เสียภาษี : {{ customer.taxno }} </div>
                <div>{{ customer.address1 }} {{ customer.address2 }} {{ customer.address3 }} {{ customer.postcode }}</div>
            </div>
        </div>
        <div class="flex flex-col items-center">
            <div class="bg-white px-4 py-2 shadow-md rounded-lg overflow-auto h-[500px] w-full max-w-2xl">
                <div class="flex flex-col space-y-2">
                    <div v-for="list in item" :key="list.OBITNO" class="border-b pb-2">
                        <div class="flex justify-between">
                            <h2 class="text-lg font-semibold tracking-tight overflow-hidden whitespace-nowrap truncate">
                                {{ list.itemname }}
                            </h2>
                        </div>
                        <div class="flex justify-between">
                            <p class="font-normal text-gray-700">
                                ฿{{ list.itemamount }}
                            </p>
                            <p class="font-normal text-gray-700">
                                {{ list.OBORQA }} {{ list.OBSPUN }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="flex-grow">
            <div class="bg-white p-4 rounded-md shadow-md space-y">
                <div class="flex justify-between text-lg">
                    <span>มูลค่าสินค้า</span>
                    <span>{{ detail.ex_vat }}</span>
                </div>
                <div class="flex justify-between text-lg">
                    <span>ภาษีมูลค่าเพิ่ม 7%</span>
                    <span>{{ detail.vat }}</span>
                </div>
                <div class="flex justify-between text-lg">
                    <span>ส่วนลดท้ายบิล</span>
                    <span>{{ detail.OAODAM }}</span>
                </div>
                <div class="flex justify-between text-lg">
                    <span>ส่วนลดร้านค้า</span>
                    <span>{{ detail.OAODAM }}</span>
                </div>
                <div class="flex justify-between text-lg font-bold">
                    <span>มูลค่ารวม</span>
                    <span>{{ detail.total }}</span>
                </div>
            </div>
        </div>
        <div class="flex gap-4 text-white text-xl">
            <button 
                class="p-4 w-full bg-blue-500 rounded-lg flex items-center justify-center shadow-lg" @click="showAlert = true">
                พิมพ์ใบเสร็จ
            </button>
        </div>
    </div>
    <AlertBluetooth v-if="showAlert" :title="'เชื่อมต่อบลูทูธ'" @print="handlePrint" @dismiss="showAlert = false"
    :color="'text-gray-600 border border-green-300 bg-green-100'" />
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useOrderStore, useBluetoothStore, useReceiptStore } from '../stores'
import AlertBluetooth from '../components/Alert.vue'

const router = useRouter()
const order = useOrderStore()
const bluetooth = useBluetoothStore()
const receipt = useReceiptStore()

const detail = computed(() => order.orderDetail)
const item = computed(() => order.orderItem)
const customer = computed(() => order.orderCustomer)
const showAlert = ref(false)

const handlePrint = async () => {
    const formattedData = receipt.formatReceiptData(detail.value);
    console.log('print', formattedData)
    await bluetooth.print(formattedData)
    showAlert.value = false;
};

onMounted(() => {
    const orderNo = localStorage.getItem('orderNo')
    order.getOrderDetail(orderNo)
});
</script>
