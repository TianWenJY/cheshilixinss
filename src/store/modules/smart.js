import Axios from "axios";
import { CommunitySelect } from "@/api/smart";
import { Store } from "vuex";

export default {
    state: {
        communityList:[],
        a:5
    },
    getters: {
        a(){
            console.log('aaa');
            return 12;
        }
    },
    mutations: {
        getcommunity(state, arg) {
            state.communityList = communityList.concat(arg);
        }
    },
    actions: {
        async getcommunityList({commit},arg) {
            let data = await CommunitySelect({})
             console.log(data)
            commit("getcommunity",data);
        }
    }
}