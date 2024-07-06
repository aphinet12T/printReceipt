import { defineStore } from 'pinia'
import axios from 'axios'

export const useOrderStore = defineStore('orders', {
    state: () => ({
        orders: [],
        orderDetail: [],
        orderItem: [],
        orderCustomer: [],
    }),
    actions: {
        async getOrder(area) {
            try {
                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL + '/orders',
                    { area } 
                )
                this.orders = response.data
                console.log('order', this.orders)
            } catch (error) {
                console.error(error)
            }
        },
        async getOrderDetail(order) {
            try {
                const response = await axios.post(
                    import.meta.env.VITE_API_BASE_URL + '/orderDetail',
                    { order } 
                )
                this.orderDetail = response.data[0]
                this.orderItem = response.data[0].items
                this.orderCustomer = response.data[0].customer
                console.log('orderDetail', this.orderDetail)
            } catch (error) {
                console.error(error)
            }
        },
    },
})
