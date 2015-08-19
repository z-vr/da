/**
 * Created by zavr on 19/08/2015.
 */
var form = document.getElementById("login-form");

var userpic, user = readCookie('username');

//check if user is authenticated
if(user){
    form.style.display = 'none';
    document.getElementById("user-info-div").style.display = "block";
    userpic = readCookie('userPic');
    document.getElementById("userPic").src = userpic;
    document.getElementById("userName").innerHTML = user;
}
/**
 * Simple sign in without password
 * @returns {boolean} true on successfull sign in and false otherwise.
 */
function signIn(){
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
/**
 * Sign out from the system by deleting cookies.
 */
function signOut(){
    eraseCookie('username');
    eraseCookie('userPic');
    window.location.reload();
}

/**
 * Reads link from body's data and appends share token to it.
 * @param ast amigo share token
 * @returns {string} a link
 */
function getLink(ast) {
    return document.getElementsByTagName("body")[0].dataset.touchpoint+"?ast="+ast;
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

    //console.log(data.metadata);

    if(amigo) {
        amigo.createToken('ad_sharepoint', data, function (err, meta) {
            if (err) {
                console.warn(err);
                return false;
            }

            //could use autolock instead
            amigo.lockToken(meta[0].token, function(err,token) {
                if (err) {
                    console.warn(err);
                    return false;
                }
                console.info('Successfully locked', token);
                _share(channel, token); //goto step 2
            });

        });
    }else {
        console.warn('Amigo was not initialized');
        return false;
    }

    return false;

}

var productDetail = document.getElementById("product-detail-plain").innerHTML;

/**
 * Second step of share: consume token and perform channel-specific action
 * @param channel
 * @param ast amigo share token
 * @returns {boolean} true of success and false otherwise
 * @private
 */
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

/**
 * Returns a mailto: link with specified subject and body
 * @param subject subject of the email
 * @param body body of the email
 * @returns {string} link which will open native mail client
 */
function getEmail(subject, body){
    return "mailto:?subject="+subject+"&body="+body;
}
