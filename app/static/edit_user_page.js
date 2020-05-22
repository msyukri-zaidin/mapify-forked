let userID;

$(document).ready(function () {
    $(".gg-close").click(function() {
        document.getElementById('user-delete-modal').style.display = 'block';
        userID = this.parentNode.parentNode.children[0].innerHTML;
        /*
        let myJSON = {
            user_id:this.parentNode.parentNode.children[0].innerHTML
        }
        myJSON = JSON.stringify(myJSON);
        $.ajax({
            type: "POST",
            url: '/delete-user',
            data: myJSON,

            error: function (jqXHR, textStatus, errorThrown) {
                 console.log(textStatus); 
                },
            success: function(data, textStatus) {
                window.location.reload();
            }
        })*/
    })
    $(".confirm-button").click(function() {
        let myJSON = {
            userID:userID
        }
        myJSON = JSON.stringify(myJSON);
        $.ajax({
            type: "POST",
            url: '/delete-user',
            data: myJSON,

            error: function (jqXHR, textStatus, errorThrown) {
                 console.log(textStatus); 
                },
            success: function(data, textStatus) {
                window.location.reload();
            }
        })
    })
    $(".cancel-button").click(function() {
        document.getElementById('user-delete-modal').style.display = 'none';
        userID = null;
    })
    $(".gg-chevron-double-up").click(function() {
        userID = this.parentNode.parentNode.children[0].innerHTML;
                
        let myJSON = {
            userID:userID
        }
        myJSON = JSON.stringify(myJSON);
        $.ajax({
            type: "POST",
            url: '/promote-user',
            data: myJSON,

            error: function (jqXHR, textStatus, errorThrown) {
                 console.log(textStatus); 
                },
            success: function(data, textStatus) {
                window.location.reload();
            }
        })
    })
    $(".gg-chevron-double-down").click(function() {
        userID = this.parentNode.parentNode.children[0].innerHTML;
                
        let myJSON = {
            userID:userID
        }
        myJSON = JSON.stringify(myJSON);
        $.ajax({
            type: "POST",
            url: '/demote-user',
            data: myJSON,

            error: function (jqXHR, textStatus, errorThrown) {
                 console.log(textStatus); 
                },
            success: function(data, textStatus) {
                window.location.reload();
            }
        })
    })
})