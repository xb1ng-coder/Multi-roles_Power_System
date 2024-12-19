import { defineStore } from "pinia";

export const useMainStore = defineStore('main', {
    state(){
        return{
            nav:[]
        }
    },
    actions:{
        setNav(data){
            this.nav = data;
        },
        getNav(){
            return this.nav;
        },
        removeNav(){
            this.nav = [];
        }
    }
})