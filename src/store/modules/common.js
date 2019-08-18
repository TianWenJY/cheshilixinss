export default {
    state: {
        loading: false
    },
    getters: {
    },
    mutations: {
        startLoading(state) {
         return state.loading = true;
        },
        endLoading(state) {
            state.loading = false;
        }
    },
    actions: {
    }
}