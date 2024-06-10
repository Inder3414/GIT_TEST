sap.ui.define([], () => {
    "use strict";

    return {
        TimeFormat : function (MilliSecond) {
            MilliSecond = MilliSecond.ms;
                let seconds = Math.floor((MilliSecond / 1000) % 60);
                let minutes = Math.floor((MilliSecond / (1000 * 60))) % 60;
                let hours = Math.floor((MilliSecond / (1000 * 60 * 60) % 24));
                
                hours = (hours < 10) ? "0" + hours : hours;
                minutes = (minutes < 10) ? "0" + minutes : minutes;
                seconds = (seconds < 10) ? "0" + seconds : seconds;
              
                return hours + ":" + minutes + ":" + seconds;
        },

        getStatus : function(iStatusCode){
            if(iStatusCode === 1){
                return "Indication03";
            } else if(iStatusCode === 2){
                return "Success";
            }
        }
    };
});