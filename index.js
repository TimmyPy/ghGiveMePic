// Initialize block
function initContextMenus() {
    chrome.contextMenus.create({
        title: 'Give me pic',
        id: 'gmpBase',
        contexts: ['image']
    });
    chrome.contextMenus.create({
        title: 'Buffer',
        id: 'gmpBuffer',
        contexts: ['image'],
        parentId: 'gmpBase'
    });
    chrome.contextMenus.create({
        title: 'Download',
        id: 'gmpDownload',
        contexts: ['image'],
        parentId: 'gmpBase'
    });
    chrome.contextMenus.create({
        title: 'Open new tab',
        id: 'gmpOpenNewTab',
        contexts: ['image'],
        parentId: 'gmpBase'
    });
}


// Utils
async function copyScript(imageUrl) {
    console.log(`Scripting: ${imageUrl}`);
    try {
        const imgResp = await fetch(imageUrl, {mode: "no-cors"});
        let blob = await imgResp.blob();
        blob = blob.slice(0, blob.size, 'image/png');
    	navigator.clipboard.write(
            [new ClipboardItem({[blob.type]: blob})]
        )
	    .then(
	    	(result) => console.log('The image was coppied to clipboard successfuly')
	    );
    } catch(e) {
	    console.error(`copyScript Error: ${e}`);
    }
}


// Main functions
async function copyToClipboard(imageUrl){
    let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: copyScript,
	    args: [imageUrl]
    }, (injectionResults) => {
        for (const frameResult of injectionResults)
            console.log('Frame Title: ' + frameResult.result);
    });
}

function downloadPict(imageUrl) {
    try {
        chrome.downloads.download({
            url: imageUrl,
            conflictAction: 'uniquify'
        }).then(
            (dId) => {
                console.log(`Download started successfully: ${dId}`);
            },
            (error) => {
                console.error(`Download failed: ${error}`);
            });
    } catch (e) {
        console.error(`Contact developer. Error occurred: ${e}`);
    }
}

function openNewTab(imageUrl) {
    try {
        chrome.tabs.create({
            active: false,
            url: imageUrl
        }).then(
            (resolve) => {
                console.log(`New tab opened successfully`);
            },
            (error) => {
                console.error(`New tab opening finished with error: ${error}`);
            }
        );
    } catch (e) {
       console.error(`Contact developer. Error occurred: ${e}`);
    }
}

// Chrome events
chrome.runtime.onInstalled.addListener(() => {
    initContextMenus();
});

chrome.contextMenus.onClicked.addListener((el) => {
    if (el.menuItemId === 'gmpBuffer') {
       copyToClipboard(el.srcUrl);
    } else if (el.menuItemId === 'gmpDownload') {
       downloadPict(el.srcUrl);
    } else if (el.menuItemId === 'gmpOpenNewTab') {
       openNewTab(el.srcUrl);
    } else {
       console.error(`Something bad happens: ${el}`);
    }
});