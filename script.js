import * as THREE from "three";

import {
GLTFLoader
} from "three/addons/loaders/GLTFLoader.js";

import {
OrbitControls
} from "three/addons/controls/OrbitControls.js";

/* =====================================================
CONFIGURATION
===================================================== */

const API_URL =
"https://api.araicameragame.party/api/generation";

const REQUIRED_COLLECTION =
"0:fd9a6de1c7e42f1f2346d7c80369a26d4934d04d555856327ace1a275e8723d9";

const COLLECTION_LINK =
"https://getgems.io/collection/EQD9mm3hx-QvHYNg18gDaaJtSTTQTVVYjJ6zhonXocj2eyI";

const TON_MANIFEST =
"https://roman22022000.github.io/Ton_site/tonconnect-manifest.json";

const MODEL_BASE =
"https://raw.githubusercontent.com/Roman22022000/ArGameCam/main/models/";

/* =====================================================
TELEGRAM
===================================================== */

const tg =
window.Telegram?.WebApp || null;

if (tg) {

```
tg.ready();

tg.expand();

if (tg.setHeaderColor) {
    tg.setHeaderColor("#000000");
}

if (tg.setBackgroundColor) {
    tg.setBackgroundColor("#000000");
}
```

}

/* =====================================================
TON CONNECT
===================================================== */

const tonConnectUI =
new TON_CONNECT_UI.TonConnectUI({

```
    manifestUrl: TON_MANIFEST,

    buttonRootId: "ton-connect"

});
```

/* =====================================================
DOM
===================================================== */

const loginScreen =
document.getElementById("loginScreen");

const menuScreen =
document.getElementById("menuScreen");

const generationScreen =
document.getElementById("generationScreen");

const galleryScreen =
document.getElementById("galleryScreen");

const viewerScreen =
document.getElementById("viewerScreen");

const loginStatus =
document.getElementById("loginStatus");

const walletInfo =
document.getElementById("walletInfo");

const generationButton =
document.getElementById("generationButton");

const generationBack =
document.getElementById("generationBack");

const generationCode =
document.getElementById("generationCode");

const generationSubmit =
document.getElementById("generationSubmit");

const generationStatus =
document.getElementById("generationStatus");

const galleryBack =
document.getElementById("galleryBack");

const viewerBack =
document.getElementById("viewerBack");

const openGalleryButton =
document.getElementById("openGallery");

const canvasContainer =
document.getElementById("canvasContainer");

const loader =
document.getElementById("loader");

const loaderText =
document.getElementById("loaderText");

const currentGallery =
document.getElementById("currentGallery");

const prevGallery =
document.getElementById("prevGallery");

const nextGallery =
document.getElementById("nextGallery");

const descriptionPanel =
document.getElementById("descriptionPanel");

const descriptionHeader =
document.getElementById("descriptionHeader");

const descriptionBody =
document.getElementById("descriptionBody");

/* =====================================================
SCREEN NAVIGATION
===================================================== */

function showScreen(screen) {

```
document
    .querySelectorAll(".screen")
    .forEach(element => {

        element.classList.remove("active");

    });

screen.classList.add("active");
```

}

/* =====================================================
WALLET
===================================================== */

function getWalletAddress() {

```
const wallet =
    tonConnectUI.wallet;

if (
    !wallet ||
    !wallet.account ||
    !wallet.account.address
) {

    return null;

}

return wallet.account.address;
```

}

/* =====================================================
NFT CHECK
===================================================== */

async function checkNFT(address) {

```
try {

    const response =
        await fetch(
            `https://tonapi.io/v2/accounts/${encodeURIComponent(address)}/nfts?limit=1000`
        );


    if (!response.ok) {

        throw new Error(
            "TonAPI error"
        );

    }


    const data =
        await response.json();


    const nftItems =
        data.nft_items || [];


    return nftItems.some(
        item =>
            item.collection &&
            item.collection.address ===
            REQUIRED_COLLECTION
    );

}
catch (error) {

    console.error(
        "NFT check error:",
        error
    );

    return false;

}
```

}

/* =====================================================
WALLET CONNECTION
===================================================== */

async function handleWalletConnected(wallet) {

```
if (
    !wallet ||
    !wallet.account
) {

    return;

}


const address =
    wallet.account.address;


loginStatus.textContent =
    "Проверка NFT...";


walletInfo.textContent =
    address;


const hasNFT =
    await checkNFT(address);


if (!hasNFT) {

    loginStatus.innerHTML =
        `NFT не найден. <a href="${COLLECTION_LINK}" target="_blank" style="color:#fff">Открыть коллекцию</a>`;

    walletInfo.textContent =
        "Нет доступа";

    return;

}


loginStatus.textContent =
    "Доступ разрешён";


showScreen(
    menuScreen
);
```

}

/* =====================================================
TON STATUS
===================================================== */

tonConnectUI.onStatusChange(
async wallet => {

```
    if (wallet) {

        await handleWalletConnected(
            wallet
        );

    }
    else {

        showScreen(
            loginScreen
        );

        loginStatus.textContent =
            "Подключите TON-кошелёк";

        walletInfo.textContent =
            "Кошелёк не подключён";

    }

}
```

);

/* =====================================================
INITIAL WALLET
===================================================== */

if (tonConnectUI.wallet) {

```
handleWalletConnected(
    tonConnectUI.wallet
);
```

}

/* =====================================================
GENERATION
===================================================== */

generationButton.addEventListener(
"click",
() => {

```
    generationCode.value = "";

    generationStatus.textContent = "";

    generationSubmit.disabled = true;

    showScreen(
        generationScreen
    );


    setTimeout(
        () => {

            generationCode.focus();

        },
        100
    );

}
```

);

/* =====================================================
GENERATION BACK
===================================================== */

generationBack.addEventListener(
"click",
() => {

```
    generationCode.value = "";

    generationStatus.textContent = "";

    generationSubmit.disabled = true;

    showScreen(
        menuScreen
    );

}
```

);

/* =====================================================
GENERATION INPUT
===================================================== */

generationCode.addEventListener(
"input",
() => {

```
    generationCode.value =
        generationCode.value
            .replace(/\D/g, "")
            .slice(0, 5);


    generationSubmit.disabled =
        generationCode.value.length !== 5;


    if (
        generationCode.value.length !== 5
    ) {

        generationStatus.textContent =
            "";

    }

}
```

);

/* =====================================================
GENERATION REQUEST
===================================================== */

generationSubmit.addEventListener(
"click",
async () => {

```
    const code =
        generationCode.value.trim();


    if (!/^\d{5}$/.test(code)) {

        generationStatus.textContent =
            "Введите 5 цифр";

        return;

    }


    const wallet =
        getWalletAddress();


    if (!wallet) {

        generationStatus.textContent =
            "TON-кошелёк не подключён";

        return;

    }


    generationSubmit.disabled =
        true;


    generationStatus.textContent =
        "Отправка...";


    const requestData = {

        code: code,

        wallet: wallet

    };


    console.log(
        "Отправка на сервер:",
        requestData
    );


    try {

        const response =
            await fetch(
                API_URL,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            requestData
                        )

                }
            );


        let data = {};

        try {

            data =
                await response.json();

        }
        catch {

            data = {};

        }


        if (!response.ok) {

            throw new Error(
                data.error ||
                `HTTP ${response.status}`
            );

        }


        if (
            data.success === false
        ) {

            throw new Error(
                data.error ||
                "Сервер отклонил запрос"
            );

        }


        generationStatus.textContent =
            "Данные отправлены";


        console.log(
            "Ответ сервера:",
            data
        );


        generationCode.value = "";

    }
    catch (error) {

        console.error(
            "Generation error:",
            error
        );


        generationStatus.textContent =
            "Ошибка отправки";

    }
    finally {

        generationSubmit.disabled =
            generationCode.value.length !== 5;

    }

}
```

);

/* =====================================================
GALLERY
===================================================== */

const galleryItems = [

```
{
    number: 1,

    filename:
        "creature.glb",

    description:
        "Первое цифровое существо. Здесь можно разместить описание объекта, его происхождение, особенности и концепцию."
},

{
    number: 2,

    filename:
        "creature.glb",

    description:
        "Второе цифровое существо. Здесь можно разместить описание второй модели."
},

{
    number: 3,

    filename:
        "creature.glb",

    description:
        "Третье цифровое существо. Здесь можно разместить описание третьей модели."
}
```

];

let currentGalleryIndex = 0;

/* =====================================================
THREE.JS
===================================================== */

let scene = null;

let camera = null;

let renderer = null;

let controls = null;

let model = null;

const gltfLoader =
new GLTFLoader();

const MODEL_CENTER =
new THREE.Vector3(
0,
0,
0
);

const CAMERA_RADIUS = 3;

const CAMERA_Y = 0.35;

/* =====================================================
INIT THREE
===================================================== */

function initThree() {

```
if (renderer) {
    return;
}


scene =
    new THREE.Scene();


scene.background =
    new THREE.Color(
        0x000000
    );


camera =
    new THREE.PerspectiveCamera(
        45,
        window.innerWidth /
            window.innerHeight,
        0.01,
        1000
    );


camera.position.set(
    0,
    CAMERA_Y,
    CAMERA_RADIUS
);


camera.lookAt(
    MODEL_CENTER
);


/* LIGHT */

const hemisphere =
    new THREE.HemisphereLight(
        0xffffff,
        0x222222,
        2.2
    );


scene.add(
    hemisphere
);


const keyLight =
    new THREE.DirectionalLight(
        0xffffff,
        3
    );


keyLight.position.set(
    3,
    5,
    4
);


scene.add(
    keyLight
);


const fillLight =
    new THREE.DirectionalLight(
        0xffffff,
        1
    );


fillLight.position.set(
    -4,
    2,
    -4
);


scene.add(
    fillLight
);


/* RENDERER */

renderer =
    new THREE.WebGLRenderer({

        antialias: true,

        powerPreference:
            "high-performance"

    });


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.outputColorSpace =
    THREE.SRGBColorSpace;


canvasContainer.appendChild(
    renderer.domElement
);


/* CONTROLS */

controls =
    new OrbitControls(
        camera,
        renderer.domElement
    );


controls.enableDamping =
    true;


controls.dampingFactor =
    0.08;


controls.enablePan =
    false;


controls.minDistance =
    1.2;


controls.maxDistance =
    7;


controls.target.copy(
    MODEL_CENTER
);


controls.update();


window.addEventListener(
    "resize",
    onResize
);


animate();
```

}

/* =====================================================
RESIZE
===================================================== */

function onResize() {

```
if (
    !camera ||
    !renderer
) {

    return;

}


camera.aspect =
    window.innerWidth /
    window.innerHeight;


camera.updateProjectionMatrix();


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);
```

}

/* =====================================================
LOAD MODEL
===================================================== */

function loadModel(filename) {

```
loader.classList.remove(
    "hidden"
);


loaderText.textContent =
    "Загрузка 3D модели...";


if (model) {

    scene.remove(
        model
    );


    model.traverse(
        object => {

            if (!object.isMesh) {
                return;
            }


            if (object.geometry) {

                object.geometry.dispose();

            }


            if (
                Array.isArray(
                    object.material
                )
            ) {

                object.material.forEach(
                    material => {

                        material.dispose();

                    }
                );

            }
            else if (
                object.material
            ) {

                object.material.dispose();

            }

        }
    );


    model = null;

}


const url =
    MODEL_BASE +
    filename;


gltfLoader.load(

    url,

    gltf => {

        model =
            gltf.scene;


        const box =
            new THREE.Box3()
                .setFromObject(
                    model
                );


        const center =
            box.getCenter(
                new THREE.Vector3()
            );


        const size =
            box.getSize(
                new THREE.Vector3()
            );


        model.position.sub(
            center
        );


        const maxSize =
            Math.max(
                size.x,
                size.y,
                size.z
            );


        if (maxSize > 0) {

            model.scale.setScalar(
                2 / maxSize
            );

        }


        scene.add(
            model
        );


        resetCamera();


        loader.classList.add(
            "hidden"
        );

    },

    xhr => {

        if (xhr.total > 0) {

            const percent =
                Math.round(
                    xhr.loaded /
                    xhr.total *
                    100
                );


            loaderText.textContent =
                `Загрузка ${percent}%`;

        }

    },

    error => {

        console.error(
            "GLB error:",
            error
        );


        loaderText.textContent =
            "Ошибка загрузки модели";

    }

);
```

}

/* =====================================================
RESET CAMERA
===================================================== */

function resetCamera() {

```
if (!camera) {
    return;
}


camera.position.set(
    0,
    CAMERA_Y,
    CAMERA_RADIUS
);


camera.lookAt(
    MODEL_CENTER
);


if (controls) {

    controls.target.copy(
        MODEL_CENTER
    );

    controls.update();

}
```

}

/* =====================================================
OPEN GALLERY ITEM
===================================================== */

function openGalleryItem(index) {

```
if (
    index < 0 ||
    index >= galleryItems.length
) {

    return;

}


currentGalleryIndex =
    index;


const item =
    galleryItems[
        currentGalleryIndex
    ];


updateGalleryNavigation();


showScreen(
    viewerScreen
);


initThree();


loadModel(
    item.filename
);
```

}

/* =====================================================
GALLERY BUTTONS
===================================================== */

document
.querySelectorAll(".numberButton")
.forEach(
button => {

```
        button.addEventListener(
            "click",
            () => {

                const index =
                    Number(
                        button.dataset.index
                    );


                openGalleryItem(
                    index
                );

            }
        );

    }
);
```

/* =====================================================
GALLERY NAVIGATION
===================================================== */

function updateGalleryNavigation() {

```
const item =
    galleryItems[
        currentGalleryIndex
    ];


currentGallery.textContent =
    item.number;


descriptionBody.textContent =
    item.description;


descriptionPanel.classList.remove(
    "expanded"
);


prevGallery.style.opacity =
    currentGalleryIndex === 0
        ? ".35"
        : "1";


nextGallery.style.opacity =
    currentGalleryIndex ===
    galleryItems.length - 1
        ? ".35"
        : "1";
```

}

prevGallery.addEventListener(
"click",
() => {

```
    openGalleryItem(
        currentGalleryIndex - 1
    );

}
```

);

nextGallery.addEventListener(
"click",
() => {

```
    openGalleryItem(
        currentGalleryIndex + 1
    );

}
```

);

/* =====================================================
DESCRIPTION
===================================================== */

descriptionHeader.addEventListener(
"click",
() => {

```
    descriptionPanel.classList.toggle(
        "expanded"
    );

}
```

);

/* =====================================================
MENU → GALLERY
===================================================== */

openGalleryButton.addEventListener(
"click",
() => {

```
    showScreen(
        galleryScreen
    );

}
```

);

/* =====================================================
GALLERY → MENU
===================================================== */

galleryBack.addEventListener(
"click",
() => {

```
    showScreen(
        menuScreen
    );

}
```

);

/* =====================================================
VIEWER → GALLERY
===================================================== */

viewerBack.addEventListener(
"click",
() => {

```
    descriptionPanel.classList.remove(
        "expanded"
    );


    showScreen(
        galleryScreen
    );

}
```

);

/* =====================================================
EMPTY MENU BUTTONS
===================================================== */

document
.getElementById("combineButton")
.addEventListener(
"click",
() => {

```
        alert(
            "Раздел «Объединить» пока не подключён."
        );

    }
);
```

document
.getElementById("treeButton")
.addEventListener(
"click",
() => {

```
        alert(
            "Раздел «Дерево» пока не подключён."
        );

    }
);
```

document
.getElementById("marketButton")
.addEventListener(
"click",
() => {

```
        alert(
            "Раздел «Маркет» пока не подключён."
        );

    }
);
```

/* =====================================================
ANIMATION
===================================================== */

function animate() {

```
requestAnimationFrame(
    animate
);


if (controls) {

    controls.update();

}


if (
    renderer &&
    scene &&
    camera
) {

    renderer.render(
        scene,
        camera
    );

}
```

}

/* =====================================================
INITIALIZATION
===================================================== */

updateGalleryNavigation();
