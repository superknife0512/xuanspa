new Vue({
    el: '#footer',
    data: {
        footer: null,
    },
    mounted(){
        fetch('/api/footer')
            .then(res=>{
                return res.json()
            })
            .then(data=>{
                this.footer = data
            })
    }
})