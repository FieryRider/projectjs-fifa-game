var Ajax = {
    ajax : null,
 
    init: function() {
        if(!this.ajax) {
            this.ajax = new XMLHttpRequest();  
        }
 
        return this.ajax;
    },
 
    get: function(url, callback) {
        var request = this.init();
        request.open("GET", url)
        request.send();
        request.onload = () => {
            /*
             * 200: "OK"
             * 403: "Forbidden"
             * 404: "Not Found"
             */
            if (request.status == 200) {
                callback(JSON.parse(request.responseText));
            } else {
                console.log(request)
            }
        };
    }
};
