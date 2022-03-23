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

// https://github.com/Montoya/bunny-hold/blob/main/docs/view.html

// Unpkg imports
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const evmChains = window.evmChains;

// Web3modal instance
let web3Modal;

// Chosen wallet provider given by the dialog window
let provider;


// Address of the selected account
let selectedAccount;

// Contracts
let bunnyContract;

function init() {
    // Check that the web page is run in a secure context,
    // as otherwise MetaMask won't be available
    if(location.protocol !== 'https:') {
        // https://ethereum.stackexchange.com/a/62217/620
        alert("This will not work unless the website is served on https")
        return
    }

    // Tell Web3modal what providers we have available.
    // Built-in web browser provider (only one can exist as a time)
    // like MetaMask, Brave or Opera is added automatically by Web3modal
    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
            infuraId: 'e863eafb372342c4848530b42d99556d',
            }
        }
    }

    web3Modal = new Web3Modal({
        cacheProvider: false, // optional
        providerOptions, // required
        disableInjectedProvider: false, // optional. For MetaMask / Brave / Opera.
        theme: 'dark',
    });
    
    console.log("Web3Modal instance is", web3Modal)
}

/*
    Kick in the UI action after Web3modal dialog has chosen a provider
*/
async function fetchAccountData() {

    // document.getElementById('loading').style.display = 'none';

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider)

    console.log("Web3 instance is", web3)

    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId()
    // Load chain information over an HTTP API
    const chainData = evmChains.getChain(chainId)
    console.log('Connected chain is: '+chainData.name)

    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts()

    // MetaMask does not give you all accounts, only the selected account
    console.log("Got accounts", accounts)
    selectedAccount = accounts[0]

}

/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {
  await fetchAccountData(provider)
}

/**
 * Connect wallet button pressed.
 */
async function onConnect() {

    console.log("Opening a dialog", web3Modal)
    try {
    provider = await web3Modal.connectTo('walletconnect')
    } catch(e) {
    console.log("Could not get a wallet connection", e)
    return
    }

    // Subscribe to accounts change
    provider.on("accountsChanged", accounts => {
    fetchAccountData();
    })

    // Subscribe to chainId change
    provider.on("chainChanged", chainId => {
    fetchAccountData();
    })

    // Subscribe to networkId change
    provider.on("networkChanged", networkId => {
    fetchAccountData();
    })

    await refreshAccountData()
}


/**
* Disconnect wallet button pressed.
*/
async function onDisconnect() {

    console.log("Killing the wallet connection", provider)
  
    // TODO: Which providers have close method?
    if(provider.close) {
      await provider.close()
  
      // If the cached provider is not cleared,
      // WalletConnect will default to the existing session
      // and does not allow to re-scan the QR code with a new wallet.
      // Depending on your use case you may want or want not his behavior.
      await web3Modal.clearCachedProvider()
      provider = null
    }
  
    selectedAccount = null
}

window.addEventListener('load', async () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
        // Use Mist/MetaMask's provider
        web3js = new Web3(Web3.currentProvider)
        console.log(Web3.currentProvider)
    } else {
        // console.log(web3)
        // Handle the case where the user doesn't have Metamask installed
        // Probably show them a message prompting them to install Metamask
        alert('no web3 provider. try installing MetaMask')
    }

    init()
    let connect = document.querySelector('#connect')
    let disconnect = document.querySelector('#disconnect')
    connect.addEventListener('click', e => {
        // e.preventDefault()
        onConnect()
        if (accounts.length > 0) {
            connect.style.display = 'none'
            disconnect.style.display = 'flex'
        }
    })
    disconnect.addEventListener('click', e => { 
        // e.preventDefault()
        onDisconnect()
        disconnect.style.display = 'none'
        connect.style.display = 'flex'
    })
})
