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
        } else {
            console.log('未找到搜索框或搜索按钮');
        }
    }, 500); // 等待500ms确保页面加载
}

// 立即执行搜索
performSearch('湖州旅游');

// 如果第一次执行失败，再次尝试
setTimeout(() => {
    performSearch('湖州旅游');
}, 1000); 