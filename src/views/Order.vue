<template>
    <div class="bg-gray-200 min-h-screen flex items-center justify-center p-4">
      <div class="bg-white rounded-lg shadow p-6 w-full max-w-4xl">
        <ul class="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
          <li v-for="tab in tabs" :key="tab.id" class="mr-2">
            <a :href="tab.href" :class="[
              'inline-block p-4 rounded-t-lg',
              tab.active ? 'text-blue-600 bg-gray-100' : 'hover:text-gray-600 hover:bg-gray-50'
            ]" @click.prevent="() => setActiveTab(tab)">
              {{ tab.label }}
            </a>
          </li>
        </ul>
        <div class="relative overflow-x-auto shadow-md sm:rounded-lg mt-4">
          <table class="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3">วันที่</th>
                <th scope="col" class="px-6 py-3">รายการ</th>
                <th scope="col" class="px-6 py-3">ร้าน</th>
                <th scope="col" class="px-6 py-3">รวม</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="loading" v-for="n in 4" :key="n" class="bg-white border-b animate-pulse">
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </td>
                <td class="px-6 py-4">
                  <div class="h-4 bg-gray-200 rounded"></div>
                </td>
              </tr>
              <tr v-else v-for="order in orderList" :key="order.CUOR" class="bg-white border-b hover:bg-gray-100 cursor-pointer" @click="viewOrderDetail(order.CUOR)">
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ order.OAORDT }}</td>
                <td class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{{ order.CUOR }}</td>
                <td class="px-6 py-4">{{ order.customername }}</td>
                <td class="px-6 py-4">{{ order.total }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </template>  

  <script setup>
  import { ref, computed, onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import { useOrderStore } from '../stores'
  
  const router = useRouter()
  const order = useOrderStore()
  const orderList = computed(() => order.orders)
  const loading = ref(true)
  
  const tabs = ref([
    { id: 1, label: 'BE811', area: 'BE811', href: '#', active: true },
    { id: 2, label: 'BE812', area: 'BE812', href: '#', active: false },
    { id: 3, label: 'BE813', area: 'BE813', href: '#', active: false },
    { id: 4, label: 'BE814', area: 'BE814', href: '#', active: false },
  ])
  
  const setActiveTab = (tab) => {
    tabs.value.forEach(t => t.active = t.id === tab.id)
    fetchOrders(tab.area)
  }
  
  const fetchOrders = async (area) => {
    loading.value = true
    await order.getOrder(area)
    loading.value = false
  }
  
  const viewOrderDetail = async (CUOR) => {
    console.log('order :', CUOR)
    localStorage.setItem('orderNo', CUOR)
    router.push('detail')
    // await order.getOrderDetail(CUOR)
    
  }
  
  onMounted(() => {
    const activeTab = tabs.value.find(tab => tab.active)
    fetchOrders(activeTab.area)
  })
  </script>