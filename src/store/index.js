import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

import smart from './modules/smart'
import common from "./modules/common";

const store = new Vuex.Store({
  strict:true,
  modules: {
    smart,
    common
  }
});

export default store