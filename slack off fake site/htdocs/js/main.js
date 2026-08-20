(function () {
    'use strict';

    // ==================== Toast Utility ====================
    let toastTimeout;
    function showToast(message, duration) {
        duration = duration || 2000;
        const toastEl = document.getElementById('toast');
        toastEl.textContent = message;
        toastEl.classList.add('show');
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(function () {
            toastEl.classList.remove('show');
        }, duration);
    }

    // ==================== Novel Data ====================
    const uploadedNovels = [];
    const novelFileInput = document.getElementById('novelFileInput');
    const uploadBtn = document.getElementById('uploadBtn');
    const articleTitle = document.getElementById('articleTitle');
    const articleContent = document.getElementById('articleContent');
    const DEFAULT_ARTICLE_CONTENT = articleContent.innerHTML;
    const readCountEl = document.getElementById('readCount');
    const novelSearchInput = document.getElementById('novelSearchInput');
    const novelSearchBtn = document.getElementById('novelSearchBtn');
    const uploadedNovelList = document.getElementById('uploadedNovelList');
    const novelListItems = document.getElementById('novelListItems');
    const NOVEL_STORAGE_KEY = 'uploaded_novels';
    const PAGE_SIZE = 1200;
    let currentPage = 1;
    let totalPages = 0;
    let currentNovelContent = '';
    let currentNovelId = null;

    // ==================== File Upload ====================
    uploadBtn.addEventListener('click', function () {
        novelFileInput.click();
    });

    novelFileInput.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file)
            return;
        if (!file.name.toLowerCase().endsWith('.txt')) {
            showToast('⚠️ Please choose TXT file');
            novelFileInput.value = '';
            return;
        }
        if (file.size > 10 * 1024 * 1024) {
            showToast('⚠️ File too large，over than 10MB');
            novelFileInput.value = '';
            return;
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            let content = event.target.result;
            try {
                content = new TextDecoder('utf-8').decode(new TextEncoder().encode(content));
            } catch (e) {
                // fallback to default string
            }
            if (!content || content.trim().length === 0) {
                showToast('⚠️ Empty file');
                novelFileInput.value = '';
                return;
            }
            const novelName = file.name.replace(/\.txt$/i, '');
            const novel = {
                id: Date.now().toString(),
                name: novelName,
                content: content,
                uploadTime: new Date().toLocaleString(),
                readCount: Math.floor(Math.random() * 500) + 50
            };
            uploadedNovels.push(novel);
            saveNovels()
            currentNovelId = novel.id;

            displayNovel(novel);
            updateNovelList();
            showToast('✅ 「' + novelName + '」update sucess！');
            novelFileInput.value = '';
        };
        reader.onerror = function () {
            showToast('⚠️ File read failed');
            novelFileInput.value = '';
        };
        reader.readAsText(file, 'utf-8');
    });
    function saveNovels() {
        try {
            localStorage.setItem(NOVEL_STORAGE_KEY, JSON.stringify(uploadedNovels));
        } catch (e) {
            console.warn('Save novels failed:', e);
        }
    }

    function loadNovels() {
        try {
            const data = localStorage.getItem(NOVEL_STORAGE_KEY);
            if (data) {
                const novels = JSON.parse(data);
                uploadedNovels.length = 0;
                uploadedNovels.push(...novels);
                return true;
            }
        } catch (e) {
            console.warn('Load novels failed:', e);
        }
        return false;
    }
    function displayNovel(novel, pageNum) {
        if (pageNum === undefined || pageNum === null) {
            pageNum = loadNovelPage(novel.id);
        }
        articleTitle.textContent = '📖 ' + novel.name;
        currentNovelContent = novel.content;
        totalPages = Math.ceil(currentNovelContent.length / PAGE_SIZE);
        if (totalPages === 0)
            totalPages = 1;
        if (pageNum < 1)
            pageNum = 1;
        if (pageNum > totalPages)
            pageNum = totalPages;
        currentPage = pageNum;
        currentNovelId = novel.id;
        saveNovelPage(novel.id, currentPage);
        const start = (pageNum - 1) * PAGE_SIZE;
        const end = Math.min(start + PAGE_SIZE, currentNovelContent.length);
        const pageContent = currentNovelContent.substring(start, end);
        const paragraphs = pageContent.split(/\n{2,}|\r\n{2,}/).filter(function (p) {
            return p.trim().length > 0;
        });
        if (paragraphs.length === 0) {
            const lines = pageContent.split(/\n|\r\n/).filter(function (l) {
                return l.trim().length > 0;
            });
            articleContent.innerHTML = lines.map(function (line) {
                return '<p>' + escapeHtml(line.trim()) + '</p>';
            }).join('');
        } else {
            articleContent.innerHTML = paragraphs.map(function (para) {
                return '<p>' + escapeHtml(para.trim()) + '</p>';
            }).join('');
        }
        readCountEl.textContent = novel.readCount + ' 阅读';
        updatePaginationUI();
    }

    function saveNovelPage(novelId, page) {
        try {
            localStorage.setItem('novel_page_' + novelId, String(page));
        } catch (e) {
            console.warn('Save page failed:', e);
        }
    }

    function loadNovelPage(novelId) {
        try {
            const val = localStorage.getItem('novel_page_' + novelId);
            if (val !== null) {
                const page = parseInt(val, 10);
                return isNaN(page) ? 1 : page;
            }
        } catch (e) {
            console.warn('Load page failed:', e);
        }
        return 1;
    }

    function updatePaginationUI() {
        const container = document.getElementById('paginationContainer');
        const progressEl = document.getElementById('pageProgress');
        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        const jumpInput = document.getElementById('jumpPageInput');
        const progressBar = document.getElementById('progressBarInner');
        if (totalPages <= 1) {
            container.style.display = 'none';
            return;
        }
        container.style.display = 'block';
        if (progressBar) {
            const percent = (currentPage / totalPages) * 100;
            progressBar.style.width = percent + '%';
            progressBar.setAttribute('aria-valuenow', percent);
        }
        progressEl.textContent = currentPage + ' / ' + totalPages;
        prevBtn.disabled = (currentPage === 1);
        nextBtn.disabled = (currentPage === totalPages);
        jumpInput.max = totalPages;
        jumpInput.value = currentPage;
    }

    function goToPage(page) {
        if (page < 1 || page > totalPages)
            return;
        const novel = uploadedNovels.find(function (n) {
            return n.id === currentNovelId;
        });
        if (novel) {
            displayNovel(novel, page);
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    }
    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    function updateNovelList() {
        if (uploadedNovels.length === 0) {
            uploadedNovelList.style.display = 'none';
            return;
        }
        uploadedNovelList.style.display = 'block';
        novelListItems.innerHTML = uploadedNovels.map(function (novel) {
            return '<div style="display:flex; align-items:center; gap:6px; padding:6px 8px;' +
            'background:#fafafa; border-radius:4px; font-size:12px; cursor:pointer;" ' +
            'onclick="window._openNovel(\'' + novel.id + '\')" title="点击阅读">' +
            '<span>📄</span>' +
            '<span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' +
            escapeHtml(novel.name) + '</span>' +
            '<span style="color:#999; font-size:10px;">' + novel.uploadTime + '</span>' +
            '<span style="color:#f56c6c; cursor:pointer;" onclick="event.stopPropagation(); window._deleteNovel(\'' +
            novel.id + '\')" title="删除">✕</span>' +
            '</div>';
        }).join('');
    }

    // Expose functions globally for inline onclick
    window._openNovel = function (id) {
        const novel = uploadedNovels.find(function (n) {
            return n.id === id;
        });
        if (novel) {
            currentNovelId = id;
            displayNovel(novel);
        }
    };

    window._deleteNovel = function (id) {
        const idx = uploadedNovels.findIndex(function (n) {
            return n.id === id;
        });
        if (idx > -1) {
            const name = uploadedNovels[idx].name;
            uploadedNovels.splice(idx, 1);
            saveNovels()
            updateNovelList();
            if (currentNovelId === id) {
                if (uploadedNovels.length > 0) {
                    displayNovel(uploadedNovels[0]);
                    currentNovelId = uploadedNovels[0].id;
                } else {
                    articleTitle.textContent = '📖 欢迎使用阅读工具';
                    articleContent.innerHTML = DEFAULT_ARTICLE_CONTENT;
                    currentNovelId = null;
                }
            }
            showToast('🗑️ 已删除「' + name + '」');
        }
    };

    // ==================== Novel Search ====================
    function performNovelSearch() {
        const query = novelSearchInput.value.trim().toLowerCase();
        if (!query) {
            showToast('⚠️ 请输入搜索关键词');
            return;
        }
        if (uploadedNovels.length === 0) {
            showToast('📭 尚未上传任何文档');
            return;
        }

        const modeRadios = document.querySelectorAll('input[name="searchMode"]');
        let mode = 'name';
        modeRadios.forEach(function (radio) {
            if (radio.checked)
                mode = radio.value;
        });

        const results = uploadedNovels.filter(function (novel) {
            if (mode === 'name') {
                return novel.name.toLowerCase().includes(query);
            } else {
                return novel.content.toLowerCase().includes(query);
            }
        });

        if (results.length === 0) {
            showToast('🔍 未找到包含「' + query + '」的文档');
            return;
        }
        if (results.length === 1) {
            displayNovel(results[0]);
            currentNovelId = results[0].id;
            showToast('✅ 找到1本匹配的文档');
        } else {
            showToast('✅ 找到' + results.length + '本匹配的文档，点击左侧列表阅读');
            uploadedNovelList.style.display = 'block';
            novelListItems.innerHTML = uploadedNovels.map(function (novel) {
                const isMatch = results.some(function (r) {
                    return r.id === novel.id;
                });
                return '<div style="display:flex; align-items:center; gap:6px; padding:6px 8px;' +
                'background:' + (isMatch ? '#fff5f2' : '#fafafa') + '; border-radius:4px;' +
                (isMatch ? 'border:1px solid #fed0c4;' : '') +
                'font-size:12px; cursor:pointer;" ' +
                'onclick="window._openNovel(\'' + novel.id + '\')" title="点击阅读">' +
                '<span>' + (isMatch ? '⭐' : '📄') + '</span>' +
                '<span style="flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">' +
                escapeHtml(novel.name) + '</span>' +
                '<span style="color:#999; font-size:10px;">' + novel.uploadTime + '</span>' +
                '<span style="color:#f56c6c; cursor:pointer;" onclick="event.stopPropagation(); window._deleteNovel(\'' +
                novel.id + '\')" title="删除">✕</span>' +
                '</div>';
            }).join('');
        }
    }

    novelSearchBtn.addEventListener('click', performNovelSearch);
    novelSearchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            performNovelSearch();
        }
    });

    document.querySelectorAll('input[name="searchMode"]').forEach(function (radio) {
        radio.addEventListener('change', function () {
            document.querySelectorAll('.el-radio-button').forEach(function (label) {
                label.classList.remove('is-active');
            });
            if (radio.checked) {
                radio.closest('.el-radio-button').classList.add('is-active');
            }
        });
    });

    // ==================== Stock Data ====================
    const STORAGE_KEY = 'stock_watchlist'; // localStorage key for persisting watchlist
    let watchlistStocks = [];
    const stockSearchInput = document.getElementById('stockSearchInput');
    const stockSearchBtn = document.getElementById('stockSearchBtn');
    const stockRefreshBtn = document.getElementById('stockRefreshBtn');
    const stockListEl = document.getElementById('stockList');

    function parseStockData(raw) {
        try {
            const match = raw.match(/"([^"]*)"/);
            if (!match)
                return null;
            const fields = match[1].split('~');
            if (fields.length < 35)
                return null;
            return {
                code: fields[2] || '',
                name: fields[1] || 'unknow',
                price: parseFloat(fields[3]) || 0,
                lastClose: parseFloat(fields[4]) || 0,
                open: parseFloat(fields[5]) || 0,
                volume: parseInt(fields[6]) || 0,
                high: parseFloat(fields[33]) || 0,
                low: parseFloat(fields[34]) || 0,
                change: parseFloat(fields[31]) || 0,
                changePct: parseFloat(fields[32]) || 0,
                turnover: parseFloat(fields[38]) || 0,
                pe: parseFloat(fields[39]) || 0,
                marketCap: parseFloat(fields[45]) || 0,
                updateTime: fields[30] || ''
            };
        } catch (e) {
            console.error('Parse error:', e);
            return null;
        }
    }

    async function fetchStockData(code) {
        try {
            const url = `https://qt.gtimg.cn/q=${code}`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('gbk');
            const raw = decoder.decode(buffer);
            return parseStockData(raw);
        } catch (error) {
            console.error(`❌ Failed to fetch ${code}:`, error);
            return null;
        }
    }

    async function fetchMultipleStocks(codes) {
        if (codes.length === 0)
            return [];
        try {
            const url = `https://qt.gtimg.cn/q=${codes.join(',')}`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const buffer = await response.arrayBuffer();
            const decoder = new TextDecoder('gbk');
            const raw = decoder.decode(buffer);
            const lines = raw.split('\n').filter(line => line.trim().length > 0);
            const results = [];
            for (const line of lines) {
                const data = parseStockData(line);
                if (data)
                    results.push(data);
            }
            return results;
        } catch (error) {
            console.error('❌ Batch fetch failed:', error);
            return [];
        }
    }

    function getMarketPrefix(code) {
        const cleanCode = code.trim();
        if (cleanCode.startsWith('6'))
            return 'sh'; // 60xxxx: shanghai
        if (cleanCode.startsWith('0') || cleanCode.startsWith('3'))
            return 'sz'; // 00xxxx, 30xxxx: shenzhen
        if (cleanCode.startsWith('8') || cleanCode.startsWith('4'))
            return 'bj'; // 8xxxxx, 4xxxxx: beijing
        return 'sz'; // Default to Shenzhen
    }

    function isValidStockCode(input) {
        return /^\d{6}$/.test(input.trim());
    }

    function saveWatchlist() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlistStocks));
        } catch (e) {
            console.warn('Failed to save watchlist:', e);
        }
    }

    function loadWatchlist() {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            if (data) {
                watchlistStocks = JSON.parse(data);
                return true;
            }
        } catch (e) {
            console.warn('Failed to load watchlist:', e);
        }
        return false;
    }

    function renderStockList() {
        if (watchlistStocks.length === 0) {
            stockListEl.innerHTML =
                '<div style="text-align:center; padding:16px; font-size:12px; color:#999;">📭 Empty list,please add.</div>';
            return;
        }
        stockListEl.innerHTML = watchlistStocks.map(function (stock) {
            const isUp = stock.change >= 0;
            const changeClass = isUp ? 'price-up' : 'price-down';
            const arrowIcon = isUp ? '▲' : '▼';
            const changeStr = (isUp ? '+' : '') + stock.change.toFixed(2) + ' (' +
            (isUp ? '+' : '') + stock.changePct.toFixed(2) + '%)';
            return '<div class="stock-item">' +
            '<div class="stock-main-info">' +
            '<div class="stock-symbol">' + escapeHtml(stock.code) + '</div>' +
            '<div class="stock-name">' + escapeHtml(stock.name) + '</div>' +
            '</div>' +
            '<div class="stock-price-info">' +
            '<div class="current-price">' + stock.price.toFixed(2) + '</div>' +
            '<div class="price-change ' + changeClass + '">' + arrowIcon + ' ' + changeStr +
            '</div>' +
            '</div>' +
            '<button class="remove-icon" data-code="' + escapeHtml(stock.code) +
            '" title="从自选删除">✕</button>' +
            '</div>';
        }).join('');
        stockListEl.querySelectorAll('.remove-icon').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.stopPropagation();
                const code = btn.getAttribute('data-code');
                removeStock(code);
            });
        });
    }

    function removeStock(code) {
        const idx = watchlistStocks.findIndex(function (s) {
            return s.code === code;
        });
        if (idx > -1) {
            const name = watchlistStocks[idx].name;
            watchlistStocks.splice(idx, 1);
            saveWatchlist();
            renderStockList();
            showToast('🗑️ Deleted「' + name + '」');
        }
    }

    async function addStock(input) {
        const trimmed = input.trim();
        if (!isValidStockCode(trimmed)) {
            showToast('⚠️ Please input the right stock code');
            return;
        }
        if (watchlistStocks.some(function (s) {
                return s.code === trimmed;
            })) {
            showToast('⚠️ ' + trimmed + ' Already in the list');
            stockSearchInput.value = '';
            return;
        }
        const prefix = getMarketPrefix(trimmed);
        const fullCode = prefix + trimmed;
        showToast('⏳ Searching ' + trimmed + ' ...');
        const data = await fetchStockData(fullCode);
        if (data && data.name && data.name !== 'unknow') {
            watchlistStocks.push({
                code: trimmed,
                name: data.name,
                price: data.price,
                change: data.change,
                changePct: data.changePct,
                high: data.high,
                low: data.low,
                volume: data.volume,
                turnover: data.turnover,
                pe: data.pe,
                marketCap: data.marketCap,
                updateTime: data.updateTime
            });
            saveWatchlist();
            renderStockList();
            showToast('✅ Added「' + data.name + '」（' + trimmed + '）');
            stockSearchInput.value = '';
        } else {
            showToast('❌ Unalbe to find ' + trimmed + '，please try again later');
        }
    }

    async function refreshAllStocks() {
        if (watchlistStocks.length === 0) {
            //showToast('📭 Empty list,no need to flash');
            return;
        }
        //showToast('🔄 Flashing...');
        const fullCodes = watchlistStocks.map(function (stock) {
            return getMarketPrefix(stock.code) + stock.code;
        });
        const results = await fetchMultipleStocks(fullCodes);
        if (results.length === 0) {
            showToast('⚠️ Flash failed，please try again later');
            return;
        }
        // Update watchlist with fetched data (match by code)
        let updatedCount = 0;
        for (const newData of results) {
            const existing = watchlistStocks.find(function (s) {
                return s.code === newData.code;
            });
            if (existing) {
                existing.price = newData.price;
                existing.change = newData.change;
                existing.changePct = newData.changePct;
                existing.high = newData.high;
                existing.low = newData.low;
                existing.volume = newData.volume;
                existing.turnover = newData.turnover;
                existing.pe = newData.pe;
                existing.marketCap = newData.marketCap;
                existing.updateTime = newData.updateTime;
                updatedCount++;
            }
        }
        saveWatchlist();
        renderStockList();
        //showToast('✅ Flashed sucessed for' + updatedCount);
    }
    //Event Bindings
    stockSearchBtn.addEventListener('click', function () {
        addStock(stockSearchInput.value);
    });
    stockSearchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            addStock(stockSearchInput.value);
        }
    });
    stockRefreshBtn.addEventListener('click', refreshAllStocks);
    //Init default watchlist
    if (!loadWatchlist() || watchlistStocks.length === 0) {
        watchlistStocks = [];
        saveWatchlist();
    }
    renderStockList();
    // Auto-refresh once on load (with slight delay to avoid blocking)
    setTimeout(refreshAllStocks, 500);

    console.log('✅ Stock module initialized (real-time API + localStorage)');
    // ==================== Holiday Countdown ====================
    let nearestHoliday = null; // Currently nearest holiday { date, name }

    /**
     * Fetch holiday data for a given year from the public API
     * @param {number|string} year - Year in YYYY format
     * @returns {Promise<Array|null>} Array of holiday/workday objects or null on error
     */
    async function fetchHolidaysForYear(year) {
        try {
            const url = `https://api.apisbo.com/holidays/year/${year}`;
            const response = await fetch(url);
            if (!response.ok)
                throw new Error(`HTTP ${response.status}`);
            const result = await response.json();
            if (result.code === 0 && Array.isArray(result.data)) {
                return result.data;
            } else {
                throw new Error(result.msg || 'API returned unexpected data');
            }
        } catch (error) {
            console.error('❌ Failed to fetch holidays:', error);
            return null;
        }
    }

    /**
     * Find the nearest upcoming holiday (type === 'holiday') from today onward
     * @param {Array} data - Array of holiday/workday objects
     * @returns {Object|null} The nearest holiday object or null if none found
     */
    function findNearestHoliday(data) {
        const now = new Date();
        // Normalize to midnight (local time) for date-only comparison
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        const upcoming = data
            .filter(item => item.type === 'holiday')
            .map(item => ({
                    ...item,
                    dateObj: new Date(item.date)
                }))
            .filter(item => item.dateObj >= today)
            .sort((a, b) => a.dateObj - b.dateObj);
        return upcoming.length > 0 ? upcoming[0] : null;
    }

    /*Update the countdown display and also the holiday label in the DOM*/
    function updateCountdownDisplay() {
        const countdownEl = document.getElementById('holidayCountdown');
        const labelEl = document.querySelector('.hero-label'); // The <span> with "距离 xxx 还有"

        if (!nearestHoliday) {
            countdownEl.textContent = '📅 No upcoming holidays';
            if (labelEl)
                labelEl.textContent = '距离 假期 还有';
            return;
        }
        // Set the holiday name in the label.
        if (labelEl) {
            labelEl.textContent = `距离 ${nearestHoliday.name} 还有`;
        }
        const now = new Date();
        // Target date in Beijing time (UTC+8) to avoid timezone offset issues
        const target = new Date(nearestHoliday.date + 'T00:00:00+08:00');
        const diff = target - now;
        if (diff <= 0) {
            countdownEl.textContent = `🎉 ${nearestHoliday.name} is here!`;
            return;
        }
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        countdownEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    /*Initialize: try current year, then next year if no holidays remain*/
    async function initHoliday() {
        const year = new Date().getFullYear();
        let data = await fetchHolidaysForYear(year);
        let nearest = null;

        if (data) {
            nearest = findNearestHoliday(data);
            if (nearest) {
                nearestHoliday = nearest;
            } else {
                // No holidays left this year → try next year
                const nextYear = year + 1;
                const nextData = await fetchHolidaysForYear(nextYear);
                if (nextData) {
                    nearest = findNearestHoliday(nextData);
                    if (nearest)
                        nearestHoliday = nearest;
                }
            }
        }

        if (!nearestHoliday) {
            document.getElementById('holidayCountdown').textContent = '⚠️ No holiday data available';
            // Still try to set a fallback label
            const labelEl = document.querySelector('.hero-label');
            if (labelEl)
                labelEl.textContent = '距离 假期 还有';
        }
        updateCountdownDisplay();
        setInterval(updateCountdownDisplay, 1000);
    }
    // Start the holiday module when the page loads
    initHoliday();

    // ==================== Init Novel====================
    updateNovelList();
    if (!loadNovels() || uploadedNovels.length === 0) {
        const demoNovel = {
            id: 'demo001',
            name: '欢迎使用阅读工具',
            content: '欢迎使用阅读工具\n\n这是一个仿照CSDN风格的个人阅读平台。\n\n📖 核心功能：\n1. 上传TXT小说：点击右侧「上传文档」按钮，选择本地TXT文件即可阅读。\n2. 搜索小说：在左侧搜索框输入关键词，可搜索已上传小说的名称或内容。\n3. 查看股票：右侧股票面板支持搜索添加自选股，可删除和刷新。\n\n💡 使用提示：\n- 上传的小说会显示在左侧列表中\n- 点击小说名称可切换阅读\n- 股票面板支持代码搜索添加\n\n其他所有按钮仅保留样式，功能已禁用。\n\n祝您阅读愉快！🐟',
            uploadTime: '2026-08-14 04:51',
            readCount: 184
        };
        uploadedNovels.push(demoNovel);
    }
    if (uploadedNovels.length > 0) {
        currentNovelId = uploadedNovels[0].id;
        displayNovel(uploadedNovels[0]);
    } else {
        // 显示空白占位
        articleTitle.textContent = '📖 欢迎使用阅读工具';
        articleContent.innerHTML = DEFAULT_ARTICLE_CONTENT;
    }
    updateNovelList();

    document.getElementById('prevPageBtn').addEventListener('click', function () {
        goToPage(currentPage - 1);
    });
    document.getElementById('nextPageBtn').addEventListener('click', function () {
        goToPage(currentPage + 1);
    });
    document.getElementById('jumpPageBtn').addEventListener('click', function () {
        const input = document.getElementById('jumpPageInput');
        let val = parseInt(input.value, 10);
        if (isNaN(val) || val < 1)
            val = 1;
        if (val > totalPages)
            val = totalPages;
        goToPage(val);
    });

    document.getElementById('jumpPageInput').addEventListener('keydown', function (e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            document.getElementById('jumpPageBtn').click();
        }
    });
    document.addEventListener('keydown', function (e) {
        const tag = e.target.tagName.toLowerCase();
        if (tag === 'input' || tag === 'textarea' || tag === 'select')
            return;
        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            if (currentPage > 1)
                goToPage(currentPage - 1);
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            if (currentPage < totalPages)
                goToPage(currentPage + 1);
        }
    });
    console.log('✅ 页面初始化完成');
})();
