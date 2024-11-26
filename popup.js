document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('urlInput');
  const searchInput = document.getElementById('searchInput');
  const submitBtn = document.getElementById('submitBtn');

  // 处理按钮点击事件
  submitBtn.addEventListener('click', navigateToUrl);
  
  // 处理回车键事件
  urlInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      navigateToUrl();
    }
  });

  // 导航到输入的URL并执行搜索
  function navigateToUrl() {
    let url = urlInput.value.trim();
    let searchText = searchInput.value.trim();
    
    // 如果用户没有输入协议，添加 https://
    if (url && !url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }

    // 使用chrome.tabs API导航到新的URL
    if (url) {
      chrome.tabs.update({ url: url }, function(tab) {
        // 等待页面加载完成后执行搜索脚本
        if (url.includes('baidu.com')) {
          function injectScript(tabId) {
            chrome.scripting.executeScript({
              target: { tabId: tabId },
              args: [searchText], // 传递搜索词参数
              func: (searchText) => {
                function performSearch(searchText) {
                  // 添加延迟确保页面完全加载
                  setTimeout(() => {
                    // 百度搜索框的选择器
                    const searchInput = document.querySelector('#kw');
                    // 百度一下按钮的选择器
                    const searchButton = document.querySelector('#su');
                    
                    if (searchInput && searchButton) {
                      // 设置搜索词
                      searchInput.value = searchText;
                      
                      // 创建并触发输入事件
                      const inputEvent = new Event('input', { bubbles: true });
                      searchInput.dispatchEvent(inputEvent);
                      
                      // 创建并触发change事件
                      const changeEvent = new Event('change', { bubbles: true });
                      searchInput.dispatchEvent(changeEvent);
                      
                      // 短暂延迟后点击搜索按钮
                      setTimeout(() => {
                        // 创建并触发点击事件
                        const clickEvent = new MouseEvent('click', {
                          bubbles: true,
                          cancelable: true,
                          view: window
                        });
                        searchButton.dispatchEvent(clickEvent);
                      }, 100);
                    }
                  }, 500);
                }
                performSearch(searchText);
              }
            }).catch(err => console.error('脚本注入失败:', err));
          }

          // 监听页面加载状态
          chrome.tabs.onUpdated.addListener(function listener(tabId, info) {
            if (tabId === tab.id && info.status === 'complete') {
              // 延迟注入脚本，确保页面完全加载
              setTimeout(() => {
                injectScript(tab.id);
              }, 500);

              // 再次尝试注入（以防第一次失败）
              setTimeout(() => {
                injectScript(tab.id);
              }, 1500);

              // 移除监听器
              chrome.tabs.onUpdated.removeListener(listener);
            }
          });
        }
      });
    }
  }
}); 