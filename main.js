/**
 * Created by zavr on 19/08/2015.
 */
var form = document.getElementById("login-form");

var userpic, user = readCookie('username');

if(user){
    form.style.display = 'none';
    document.getElementById("user-info-div").style.display = "block";
    userpic = readCookie('userPic');
    document.getElementById("userPic").src = userpic;
    document.getElementById("userName").innerHTML = user;
}
function signIn(){
    //console.log('login');
    //console.log(form.login.value, form.pass.value);
    var signedIn = true;
    switch(form.login.value){
        case 'Lila':
            createCookie('username','Lila',1);
            createCookie('userPic','users/lila.gif',1);
            break;
        case 'Fry':
            createCookie('username','Fry',1);
            createCookie('userPic','users/Fry.jpg',1);
            break;
        case 'Bender':
            createCookie('username','Bender',1);
            createCookie('userPic','users/bender.jpg',1);
            break;
        default:
            signedIn = false;
    }
    if(signedIn) window.location.reload();
    return false;
}
function signOut(){
    eraseCookie('username');
    eraseCookie('userPic');
    window.location.reload();
}


function getLink(ast) {
    return document.getElementsByTagName("body")[0].dataset.touchpoint+"?ast="+ast;
}

var productDetail = document.getElementById("product-detail-plain").innerHTML;

function _share(channel, ast){
    amigo.consumeToken(ast, {shareChannel: 'touch'}, function(err,token){
        if (err) {
            console.warn(err);
            return false;
        }

        var link = getLink(token);
        switch (channel) {
            case "facebook":
                window.open("https://www.facebook.com/sharer/sharer.php?u=" + link, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                break;
            case "email":
                window.location.href = getEmail("Check it out: Extreme Walrus Juice", productDetail+link);
                break;
            case "vk":
                window.open("http://vk.com/share.php?url="+link, '', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                break;
            case "g-plus":
                window.open("https://plus.google.com/share?url="+link,'', 'menubar=no,toolbar=no,resizable=yes,scrollbars=yes,height=300,width=600');
                break;
            case "touch":
                window.location = link;
                break;
            default:
                return false;
        }

    });


    return true;
}

function getEmail(subject, body){
    return "mailto:?subject="+subject+"&body="+body;
}
var supportedChannels = ['facebook', 'email', 'vk','g-plus', 'touch'];

/**
 * This function is called from HTML when user decides to share.
 * A share token is then created, populated with user metadata and locked.
 * @param link pointer to a_href DOM element which was clicked.
 * @returns {boolean} false.
 */
function share(link){

    var channel = link.dataset.channel;
    //check if channel is supported
    var supported = false, i;
    for(i=0; i<supportedChannels.length; i++){
        if(supportedChannels[i] == channel){
            supported = true;
            break;
        }
    }
    if(!supported){
        console.warn('Channel '+channel+' not supported');
        return false;
    }

    var data = {
        userId: '1',
        username: 'zavr',
        email: 'me@zavr.co.uk',
        name: 'Anton',
        metadata: { name: user, userPic: userpic }
    }

    console.log(data.metadata);

    if(amigo) {
        amigo.createToken('ad_sharepoint', data, function (err, meta) {
            if (err) {
                console.warn(err);
                return false;
            }

            amigo.lockToken(meta[0].token, function(err,token) {
                if (err) {
                    console.warn(err);
                    return false;
                }
                console.info('Successfully locked', token);
                _share(channel, token);
                //var url = getLink();
            });

        });
    }else {
        console.warn('Amigo was not initialized');
        return false;
    }

    return false;

//    amigo.updateToken(ast, {
//        shareChannel: channel
//    });
//    amigo.lockToken(ast, function (err, token) {
//        if (err) {
//            console.warn(err);
//            return;
//        }
//
//        console.info('Success! Locked token: ' + token);
//    });
//
//    amigo.consumeToken(ast);

//            , { shareChannel: channel }, function (err, token) {
//                if (err) {
//                    console.warn(err);
//                    return;
//                }
//
//                console.info('Success! Consumed token: ' + token);
//            });

}