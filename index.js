// Initialize block
function init_context_menu() {
    chrome.contextMenus.create({
        title: 'Give me pic',
        id: 'gmp_base',
        contexts: ['image']
    });
    chrome.contextMenus.create({
        title: 'Buffer (not working yet)',
        id: 'gmp_buffer',
        contexts: ['image'],
        parentId: 'gmp_base'
    });
    chrome.contextMenus.create({
        title: 'Download',
        id: 'gmp_download',
        contexts: ['image'],
        parentId: 'gmp_base'
    });
    chrome.contextMenus.create({
        title: 'Open new tab',
        id: 'gmp_open_new_tab',
        contexts: ['image'],
        parentId: 'gmp_base'
    });
}

// Main functions
function download_pict(image_url) {
    try {
        chrome.downloads.download({
            url: image_url,
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

function open_new_tab(image_url) {
    try {
        chrome.tabs.create({
            active: false,
            url: image_url
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
    init_context_menu();
});

chrome.contextMenus.onClicked.addListener((el) => {
   if (el.menuItemId === 'gmp_buffer') {
       console.log('buffer do not work');
   } else if (el.menuItemId === 'gmp_download') {
       download_pict(el.srcUrl);
   } else if (el.menuItemId === 'gmp_open_new_tab') {
       open_new_tab(el.srcUrl);
   } else {
       console.log('some shit happens');
   }
});