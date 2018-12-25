Component({
    options: {
        multipleSlots: true
    },

    properties: {
        title: {
            type: String,
            value: "标题"
        },
    },

    data: {
        isShow: true
    },

    methods: {
        show(){
            this.setData({
                isShow: false
            });
        },
        hide() {
            this.setData({
                isShow: true
            });
        }
    }
})