function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

console.log(articleId);
function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

const likeCountButton = document.getElementById("likeCountButton")
const likeCountText = document.getElementById("likeCount")
likeCountButton.addEventListener('click', e => {
    const isLiked = getCookie(`like-${articleId}`);

    if (!isLiked) {
        fetch(`/article/${articleId}/like`, {
            method: 'POST'
        })
            .then(response => response.json())
            .then(data => {
                setCookie(`like-${articleId}`, true, 100)
                likeCountText.innerText = data.data.likeCount;
            })
    }
})