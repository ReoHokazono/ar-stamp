Vue.config.ignoredElements = [
    "a-scene",
    "a-entity",
    "a-camera",
    "a-box",
    "a-marker"
]

const app = new Vue({
    el: "#main-container",
    data: {
        cameraSelected: true,
        stampSelected: false,
        mapSelected: false,
        infoSelected: false,
        video: {}
    },
    methods: {
        tabSelected(tab) {
            this.cameraSelected = false
            this.stampSelected = false
            this.mapSelected = false
            this.infoSelected = false

            switch (tab) {
                case "camera":
                    this.cameraSelected = true
                    break
                case "stamp":
                    this.stampSelected = true
                    break
                case "map":
                    this.mapSelected = true
                    break
                default:
                    this.infoSelected = true
                    break
            }
        }
    },
    mounted() {
    }
})

window.addEventListener("scroll", () => {
    document.body.scrollLeft = 0
}, false)

let displayTimeCount = 0
let markerIsShown = false
let displayedMarkerId = 0
const fullPoints = 7

for (let index = 1; index <= 7; index++) {
    if (localStorage.getItem("s" + String(index)) == "1") {
        document.getElementById("stamp-img-" + String(index)).src = "../images/stamps/s" + String(index) + ".png"
    }

}

let currentPoints = Number(localStorage.getItem("visitedPoints"))
if (currentPoints == null) {
    currentPoints = 0
}

const restPoints = fullPoints - currentPoints
if (restPoints == 0) {
    document.getElementById("stamp-num-text").innerText = "コンプリートしました!"
    document.getElementById("stamp-complete").style.display = "block"
} else {
    const displayText = "残り" + String(restPoints) + "ヶ所です"
    document.getElementById("stamp-num-text").innerText = displayText
}

setInterval(() => {
    let elements = document.getElementsByTagName("a-marker")
    markerIsShown = false
    for (let index = 0; index < elements.length; index++) {
        const element = elements[index];
        if (element.object3D.visible) {
            displayTimeCount++
            displayedMarkerId = Number(element.getAttribute("markerid"))
            markerIsShown = true
        }
    }

    if (!markerIsShown) {
        displayTimeCount = 0
    }

    if (displayedMarkerId == "0"){
        return
    }

    if (displayTimeCount == 8 && markerIsShown) {
        const alreadyDetected = localStorage.getItem("s" + String(displayedMarkerId), "1")
        if (alreadyDetected) { return }

        let currentPoints = Number(localStorage.getItem("visitedPoints"))
        if (currentPoints == null) {
            currentPoints = 0
        }
        currentPoints++
        localStorage.setItem("visitedPoints", String(currentPoints))
        const restPoints = fullPoints - currentPoints

        let displayText = ""
        if (restPoints == 0) {
            document.getElementById("stamp-num-text").innerText = "コンプリートしました!"
            document.getElementById("stamp-complete").style.display = "block"
        } else {
            const displayText = "残り" + String(restPoints) + "ヶ所です"
            document.getElementById("stamp-num-text").innerText = displayText
        }
        swal({
            title: "スタンプしました!",
            text: displayText,
            content: {
                element: "img",
                attributes: {
                    src: "../images/stamps/s" + String(displayedMarkerId) + ".png",
                    style: "width:90%"
                }
            }
        }).then(() => {
            if (restPoints == 0) {
                swal({
                    title: "コンプリートしました!",
                    text: displayText,
                    content: {
                        element: "img",
                        attributes: {
                            src: "../images/stamps/complete.png",
                            style: "width:90%"
                        }
                    }
                })
            }
        })

        
        localStorage.setItem("s" + String(displayedMarkerId), "1")
        document.getElementById("stamp-img-" + String(displayedMarkerId)).src = "../images/stamps/s" + String(displayedMarkerId) + ".png"
        ga('set', 'dimension1', String(currentPoints));
    }
}, 100)

for (let index = 1; index <= fullPoints; index++) {
    let image = new Image()
    image.src = "../images/stamps/s" + String(index) + ".png"
}
let image = new Image()
image.src = "../images/stamps/complete.png"

const parser = new UAParser()
const result = parser.getResult()
if (result.browser.name != "Mobile Safari" && result.os.name == "iOS"){
    swal ( "" ,  "Safariで開いてください" ,  "error" )
}else if (result.os.name == "iOS" && result.os.version.startsWith("10")){
    swal ( "" ,  "iOS10では正常に動作しない場合があります" ,  "error" )
}else if (!result.browser.name.startsWith("Chrome") && result.os.name == "Android" ){
    swal ( "" ,  "Google Chromeで開いてください" ,  "error" )
}else if (result.os.name != "iOS" && result.os.name != "Android" ){
    swal ( "" ,  "PCでは正常に動作しない場合があります" ,  "error" )
}else {
    if (localStorage.getItem("isFirstVisit") == null){
        swal("使い方", "校内に掲示されたマーカーをカメラで写すとスタンプを集めることができます。")
        localStorage.setItem("isFirstVisit","false")
    }
}