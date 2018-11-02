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
const fullPoints = 6

for (let index = 1; index <= 6; index++) {
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
    document.getElementById("stamp-num-text").innerHTML = "コンプリートしました!<br />この画面を受付で見せてください。"
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
            document.getElementById("stamp-num-text").innerHTML = "コンプリートしました!<br />この画面を受付で見せてください。"
            document.getElementById("stamp-complete").style.display = "block"
        } else {
            const displayText = "残り" + String(restPoints) + "ヶ所です"
            document.getElementById("stamp-num-text").innerText = displayText
        }
        swal({
            title: "スタンプをゲットしました!",
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

const mainAssets = document.getElementById("main-assets")

// Water 流体力学
const waterObj = document.createElement("a-asset-item")
waterObj.setAttribute("id","water-obj")
waterObj.setAttribute("src","/models/water/M1.obj")

const waterMtl = document.createElement("a-asset-item")
waterMtl.setAttribute("id","water-mtl")
waterMtl.setAttribute("src","/models/water/M1.mtl")

const waterEty = document.createElement("a-entity")
waterEty.setAttribute("id","water-entity")
waterEty.setAttribute("obj-model","obj:#water-obj; mtl:#water-mtl;")
waterEty.setAttribute("position","0 1.3 0")
waterEty.setAttribute("scale","1 1 1")

mainAssets.appendChild(waterObj)
mainAssets.appendChild(waterMtl)
document.getElementById("m01").appendChild(waterEty)

// Steel 材料力学
const steelObj = document.createElement("a-asset-item")
steelObj.setAttribute("id","steel-obj")
steelObj.setAttribute("src","/models/steel/M3.obj")

const steelMtl = document.createElement("a-asset-item")
steelMtl.setAttribute("id","steel-mtl")
steelMtl.setAttribute("src","/models/steel/M3.mtl")

const steelEty = document.createElement("a-entity")
steelEty.setAttribute("id","steel-entity")
steelEty.setAttribute("obj-model","obj:#steel-obj; mtl:#steel-mtl;")
steelEty.setAttribute("position","0 1.3 0")
steelEty.setAttribute("scale","1 1 1")

mainAssets.appendChild(steelObj)
mainAssets.appendChild(steelMtl)
document.getElementById("m02").appendChild(steelEty)

// Control (Robot) 制御工学実験室
const controlObj = document.createElement("a-asset-item")
controlObj.setAttribute("id","control-obj")
controlObj.setAttribute("src","/models/control/control.obj")

const controlMtl = document.createElement("a-asset-item")
controlMtl.setAttribute("id","control-mtl")
controlMtl.setAttribute("src","/models/control/control.obj.sxfil.mtl")

const controlEty = document.createElement("a-entity")
controlEty.setAttribute("id","control-entity")
controlEty.setAttribute("obj-model","obj:#control-obj; mtl:#control-mtl;")
controlEty.setAttribute("position","0 0.7 0")
controlEty.setAttribute("scale","1 1 1")

mainAssets.appendChild(controlObj)
mainAssets.appendChild(controlMtl)
document.getElementById("m03").appendChild(controlEty)

// Fire 熱工学実験室
const fireObj = document.createElement("a-asset-item")
fireObj.setAttribute("id","fire-obj")
fireObj.setAttribute("src","/models/fire/fire.obj")

const firelMtl = document.createElement("a-asset-item")
firelMtl.setAttribute("id","fire-mtl")
firelMtl.setAttribute("src","/models/fire/fire.obj.sxfil.mtl")

const fireEty = document.createElement("a-entity")
fireEty.setAttribute("id","fire-entity")
fireEty.setAttribute("obj-model","obj:#fire-obj; mtl:#fire-mtl;")
fireEty.setAttribute("position","0 0.7 0")
fireEty.setAttribute("scale","1 1 1")

mainAssets.appendChild(fireObj)
mainAssets.appendChild(firelMtl)
document.getElementById("m04").appendChild(fireEty)

// Machine 教育研究支援センター
const machineObj = document.createElement("a-asset-item")
machineObj.setAttribute("id","machine-obj")
machineObj.setAttribute("src","/models/machine/machine.obj")

const machineMtl = document.createElement("a-asset-item")
machineMtl.setAttribute("id","machine-mtl")
machineMtl.setAttribute("src","/models/machine/machine.obj.sxfil.mtl")

const machineEty = document.createElement("a-entity")
machineEty.setAttribute("id","machine-entity")
machineEty.setAttribute("obj-model","obj:#machine-obj; mtl:#machine-mtl;")
machineEty.setAttribute("position","0 0.7 0")
machineEty.setAttribute("scale","1 1 1")

mainAssets.appendChild(machineObj)
mainAssets.appendChild(machineMtl)
document.getElementById("m05").appendChild(machineEty)

// Car エコラン
const carObj = document.createElement("a-asset-item")
carObj.setAttribute("id","car-obj")
carObj.setAttribute("src","/models/car/car.obj")

const carMtl = document.createElement("a-asset-item")
carMtl.setAttribute("id","car-mtl")
carMtl.setAttribute("src","/models/car/car.obj.sxfil.mtl")

const carEty = document.createElement("a-entity")
carEty.setAttribute("id","car-entity")
carEty.setAttribute("obj-model","obj:#car-obj; mtl:#car-mtl;")
carEty.setAttribute("position","0 0.7 0")
carEty.setAttribute("scale","1 1 1")

mainAssets.appendChild(carObj)
mainAssets.appendChild(carMtl)
document.getElementById("m06").appendChild(carEty)