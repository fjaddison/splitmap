let dragged

let container = document.createElement('div')
container.id = 'selection-container'
document.body.appendChild(container)

let modal = document.createElement('div')
modal.id = 'mint-modal'
modal.classList.add('invis')
document.body.appendChild(modal)

for (i = 0; i < 4; i++) {
    let modalNode = document.createElement('div')
    modalNode.classList.add('modal-node')
    modalNode.innerHTML = `${i + 1}`
    modalNode.draggable = true
    modalNode.style.background = `rgb(${95 + (i * 50)}, 0, 50)`
    modal.appendChild(modalNode)
}

document.addEventListener('dragstart', e => {
    // store a ref. on the dragged elem
    dragged = e.target
})

document.addEventListener("dragover", e => {
    // prevent default to allow drop
    e.preventDefault()
})

document.addEventListener('drop', e => {
    e.preventDefault()   

    if (e.target.className == 'modal-node' && e.target != dragged) {
        let index
        let temp = e.target.cloneNode(true)
        let parent = e.target.parentNode
        for (i=0;i<parent.children.length;i++) {
            if (parent.children[i] == dragged) {
                index = i
            }
        }
        
        parent.replaceChild(dragged, e.target)
        parent.insertBefore(temp, parent.children[index])
    }
})

for (i = 0; i < 100; i++) {
    let containerChild = document.createElement('div')
    containerChild.classList.add('container-element')
    container.appendChild(containerChild)
    handleChildImage(containerChild)
    let containerInfo = document.createElement('div')
    containerInfo.classList.add('container-info')
    containerChild.appendChild(containerInfo)
    handleChildTitleArtist(containerInfo)
    handleSlabs(containerInfo)
    handleAffinity(containerInfo)
    handleMintBtn(containerInfo)
}

function handleChildImage(el) {
    let img = document.createElement('img')
    img.classList.add('container-image')
    img.src = 'gen.png'
    img.alt = 'genesis blitmap'
    el.appendChild(img)
}

function handleChildTitleArtist(el) {
    let containerTitleArtist = document.createElement('div')
    let containerTitle = document.createElement('p')
    let containerArtist = document.createElement('p')
    containerTitle.classList.add('card-title')
    containerTitle.innerHTML = '"Genesis"'
    containerArtist.innerHTML = 'by dom'
    el.appendChild(containerTitleArtist)
    containerTitleArtist.appendChild(containerTitle)
    containerTitleArtist.appendChild(containerArtist)
}

function handleSlabs(el) {
    let slabContainer = document.createElement('div')
    let slabs = [['&#9698;', '#000000'], ['&#9699;', '#0600ff'], ['&#9698;', '#d5719e'], ['&#9698;', '#fff568']]
    slabs.forEach(s => {
        let slabSpan = document.createElement('span')
        slabSpan.innerHTML = s[0]
        slabSpan.style = `color: ${s[1]}; padding: 0 3px;`
        slabContainer.appendChild(slabSpan)
    })
    el.appendChild(slabContainer)
}

function handleAffinity(el) {
    let affinity = document.createElement('p')
    affinity.innerHTML = 'Water III'
    el.appendChild(affinity)
}

function handleMintBtn(el) {
    let btn = document.createElement('div')
    btn.classList.add('mint-btn')
    btn.innerHTML = 'Add To Composition'
    el.appendChild(btn)
}

let buttons = document.querySelectorAll('.mint-btn')

buttons.forEach(b => {
    b.addEventListener('click', (e) => {
        let index = Array.prototype.indexOf.call(buttons, e.target)
        console.log(index)
    })
})

