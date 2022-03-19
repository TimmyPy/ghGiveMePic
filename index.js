function download_pict(image_url) {
    try {
        chrome.downloads.download({
            url: image_url,
            saveAs: true,
            filename: 'why_are_u_geh'
        }, (dId) => console.log(dId, chrome.runtime.lastError));
    } catch (e) {
        console.error(`Contact developer. Error occurred: ${e}`);
    }
}
function save_to_buffer(item_info, tab){
    console.log(item_info, tab);
}

async function open_new_tab(image_url) {
    try {
        await chrome.tabs.create({
            active: false,
            url: image_url
        });
    } catch (e) {
       console.error(`Contact developer. Error occurred: ${e}`);
    }
}
function init_context_menu() {
    chrome.contextMenus.create({
        title: 'Give me pic',
        id: 'gmp_base',
        contexts: ['image']
    });
    chrome.contextMenus.create({
        title: 'Buffer',
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

chrome.runtime.onInstalled.addListener(() => {
    init_context_menu();
    console.log('initialized');
});

chrome.contextMenus.onClicked.addListener((el) => {
   console.log(el.menuItemId, el.mediaType, el.srcUrl);
   if (el.menuItemId === 'gmp_buffer') {
       console.log('save to buffer');
   } else if (el.menuItemId === 'gmp_download') {
       download_pict(el.srcUrl);
   } else if (el.menuItemId === 'gmp_open_new_tab') {
       open_new_tab(el.srcUrl)
           .then(
               (resolve) => {},
               (reject) => {}
           );
   } else {
       console.log('some shit happens');
   }
});

chrome.downloads.onChanged.addListener((delta) => {
    console.log(delta)
    if (!delta.state || (delta.state.current != 'complete')) {
        return;
    }
    chrome.downloads.open(delta.id);
})