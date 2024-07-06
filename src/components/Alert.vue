<template>
    <div v-if="show" :id="alertId" :class="alertClasses" role="alert">
        <div class="flex items-center">
            <h3 class="sm:text-lg md:text-2xl font-medium">{{ title }}</h3>
        </div>
        <div class="mt-2 mb-4 md:text-xl" v-if="connectedPrinter">
            กำลังเชื่อมต่อกับ: {{ connectedPrinter }}
        </div>
        <div class="mt-2 mb-4 md:text-xl" v-else>
            ไม่ได้เชื่อมต่อกับเครื่องพิมพ์
        </div>
        <div class="relative rounded-t-xl overflow-auto p-4">
            <div class="flex flex-nowrap gap-4 font-mono text-white text-base md:text-lg rounded-lg">
                <button type="button"
                    class="text-white bg-blue-500 px-4 py-2 w-full rounded-lg flex items-center justify-center"
                    @click="onScan">
                    {{ scanText }}
                </button>
                <button type="button"
                    class="text-white px-4 py-2 w-full rounded-lg flex items-center justify-center"
                    :class="{ 'bg-green-500': isPaired, 'bg-gray-500': !isPaired }"
                    :disabled="!isPaired"
                    @click="onConnect">
                    {{ connectText }}
                </button>
                <button type="button"
                    class="text-white px-4 py-2 w-full rounded-lg flex items-center justify-center"
                    :class="{ 'bg-green-500': isConnected, 'bg-gray-500': !isConnected }"
                    :disabled="!isConnected"
                    @click="onPrint" aria-label="print">
                    {{ printText }}
                </button>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { defineProps, defineEmits } from 'vue'
import { useBluetoothStore } from '../stores'

const props = defineProps({
    alertId: String,
    title: String,
    color: String,
    scanText: { type: String, default: 'ค้นหา' },
    connectText: { type: String, default: 'เชื่อมต่อ' },
    printText: { type: String, default: 'พิมพ์' },
    show: { type: Boolean, default: true }
});

const emit = defineEmits(['print', 'dismiss']);

const bluetooth = useBluetoothStore();

const isPaired = ref(false);
const isConnected = ref(false);

const onScan = async () => {
    try {
        await bluetooth.scanDevices();
        if (bluetooth.devices.length > 0) {
            isPaired.value = true;
            localStorage.setItem('bluetoothDeviceId', bluetooth.devices[0].id);
        }
    } catch (error) {
        console.error('Failed to scan devices:', error);
    }
};

const onConnect = async () => {
    try {
        const storedDeviceId = localStorage.getItem('bluetoothDeviceId');
        // await bluetooth.scanDevices()
        const device = bluetooth.devices.find(d => d.id === storedDeviceId);

        if (device) {
            await bluetooth.connectPrinter(device);
            if (bluetooth.isConnected) {
                isConnected.value = true;
            } else {
                console.error('Failed to connect to printer');
            }
        } else {
            console.error('No devices found or device ID does not match');
        }
    } catch (error) {
        console.error('Failed to connect to printer:', error);
    }
};

const onPrint = async () => {
    try {
        if (isConnected.value) {
            emit('print')
        } else {
            console.error('Printer is not connected')
        }
    } catch (error) {
        console.error('Failed to print:', error)
    }
};

const connectedPrinter = computed(() => {
    return bluetooth.printer ? bluetooth.printer.name : null
});

watch(() => bluetooth.printer, (newPrinter) => {
    if (newPrinter) {
        console.log('Connected to printer:', newPrinter.name)
    } else {
        console.log('Disconnected from printer')
        isConnected.value = false
        isPaired.value = false
    }
});

const alertClasses = computed(() => {
    return [
        'p-4 mb-4 fixed top-0 left-0 right-0 z-50 w-full h-44 overflow-x-hidden overflow-y-auto rounded-lg',
        props.color,
    ];
});

onMounted(async () => {
    const storedDeviceId = localStorage.getItem('bluetoothDeviceId');
    if (storedDeviceId) {
        await onConnect();
    }
});
</script>
