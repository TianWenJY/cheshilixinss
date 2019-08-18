import ElementUI from 'element-ui';
export default {
    msg:message => {
        ElementUI.Message(message);
    },
    alert:(message,callback) => {
        ElementUI.MessageBox.alert(message, '注意信息', {
            confirmButtonText: '确定',
            callback: action => {
                if(callback){
                    callback();
                }
            }
        });
    },
    confirm:(title,succCallback,rejectCallback) => {
        ElementUI.MessageBox.Confirm(title, '确认信息', {
            distinguishCancelAndClose: true,
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        })
        .then(() => {
            callback();
        })
        .catch(action => {
            rejectCallback();
        });
    },
}