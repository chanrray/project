(function() {
            'use strict';

            // ==================== Toast Utility ====================
            let toastTimeout;
            function showToast(message, duration) {
                duration = duration || 2000;
                const toastEl = document.getElementById('toast');
                toastEl.textContent = message;
                toastEl.classList.add('show');
                clearTimeout(toastTimeout);
                toastTimeout = setTimeout(function() {
                    toastEl.classList.remove('show');
                }, duration);
            }

            // ==================== Novel Data ====================
            const uploadedNovels = [];
            const novelFileInput = document.getElementById('novelFileInput');
            const uploadBtn = document.getElementById('uploadBtn');
            const articleTitle = document.getElementById('articleTitle');
            const articleContent = document.getElementById('articleContent');
            const readCountEl = document.getElementById('readCount');
            const novelSearchInput = document.getElementById('novelSearchInput');
            const novelSearchBtn = document.getElementById('novelSearchBtn');
            const uploadedNovelList = document.getElementById('uploadedNovelList');
            const novelListItems = document.getElementById('novelListItems');

            let currentNovelId = null;

            // ==================== File Upload ====================
            uploadBtn.addEventListener('click', function() {
                novelFileInput.click();
            });

            novelFileInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (!file) return;

                // Check if it's a .txt file
                if (!file.name.toLowerCase().endsWith('.txt')) {
                    showToast('⚠️ 请选择TXT格式的文件');
                    novelFileInput.value = '';
                    return;
                }

                // Check file size (limit to 10MB)
                if (file.size > 10 * 1024 * 1024) {
                    showToast('⚠️ 文件过大，请选择10MB以下的文件');
                    novelFileInput.value = '';
                    return;
                }

                const reader = new FileReader();
                reader.onload = function(event) {
                    let content = event.target.result;
                    // Try to decode as UTF-8
                    try {
                        content = new TextDecoder('utf-8').decode(new TextEncoder().encode(content));
                    } catch (e) {
                        // fallback to default string
                    }

                    if (!content || content.trim().length === 0) {
                        showToast('⚠️ 文件内容为空');
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
                    currentNovelId = novel.id;

                    // Display content
                    displayNovel(novel);
                    updateNovelList();
                    showToast('✅ 小说「' + novelName + '」上传成功！');

                    novelFileInput.value = '';
                };

                reader.onerror = function() {
                    showToast('⚠️ 文件读取失败，请重试');
                    novelFileInput.value = '';
                };

                reader.readAsText(file, 'utf-8');
            });

            function displayNovel(novel) {
                articleTitle.textContent = '📖 ' + novel.name;
                // Split content into paragraphs
                const paragraphs = novel.content.split(/\n{2,}|\r\n{2,}/).filter(function(p) {
                    return p.trim().length > 0;
                });
                if (paragraphs.length === 0) {
                    const lines = novel.content.split(/\n|\r\n/).filter(function(l) { return l.trim().length > 0;
                        });
                    articleContent.innerHTML = lines.map(function(line) {
                        return '<p class="blog-para">' + escapeHtml(line.trim()) + '</p>';
                    }).join('');
                } else {
                    articleContent.innerHTML = paragraphs.map(function(para) {
                        return '<p class="blog-para">' + escapeHtml(para.trim()) + '</p>';
                    }).join('');
                }
                readCountEl.textContent = novel.readCount + ' 阅读';
                //showToast('📖 正在阅读：' + novel.name);
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
                novelListItems.innerHTML = uploadedNovels.map(function(novel) {
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
            window._openNovel = function(id) {
                const novel = uploadedNovels.find(function(n) { return n.id === id; });
                if (novel) {
                    currentNovelId = id;
                    displayNovel(novel);
                }
            };

            window._deleteNovel = function(id) {
                const idx = uploadedNovels.findIndex(function(n) { return n.id === id; });
                if (idx > -1) {
                    const name = uploadedNovels[idx].name;
                    uploadedNovels.splice(idx, 1);
                    updateNovelList();
                    if (currentNovelId === id) {
                        if (uploadedNovels.length > 0) {
                            displayNovel(uploadedNovels[0]);
                            currentNovelId = uploadedNovels[0].id;
                        } else {
                            articleTitle.textContent = '📖 欢迎使用阅读工具';
                            articleContent.innerHTML = '<p>👆 点击右侧「上传文档」按钮，选择TXT格式的小说文件即可开始阅读。</p>' +
                                '<p>上传后小说内容将在此区域显示，左侧搜索框可以搜索已上传的小说。</p>';
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
                    showToast('📭 尚未上传任何小说');
                    return;
                }

                const modeRadios = document.querySelectorAll('input[name="searchMode"]');
                let mode = 'name';
                modeRadios.forEach(function(radio) {
                    if (radio.checked) mode = radio.value;
                });

                const results = uploadedNovels.filter(function(novel) {
                    if (mode === 'name') {
                        return novel.name.toLowerCase().includes(query);
                    } else {
                        return novel.content.toLowerCase().includes(query);
                    }
                });

                if (results.length === 0) {
                    showToast('🔍 未找到包含「' + query + '」的小说');
                    return;
                }
                if (results.length === 1) {
                    displayNovel(results[0]);
                    currentNovelId = results[0].id;
                    showToast('✅ 找到1本匹配的小说');
                } else {
                    // Show list of matches
                    showToast('✅ 找到' + results.length + '本匹配的小说，点击左侧列表阅读');
                    // Highlight in the list - scroll to list
                    uploadedNovelList.style.display = 'block';
                    // Re-render with highlights
                    novelListItems.innerHTML = uploadedNovels.map(function(novel) {
                        const isMatch = results.some(function(r) { return r.id === novel.id; });
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
            novelSearchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    performNovelSearch();
                }
            });

            // Radio button click handling
            document.querySelectorAll('input[name="searchMode"]').forEach(function(radio) {
                radio.addEventListener('change', function() {
                    document.querySelectorAll('.el-radio-button').forEach(function(label) {
                        label.classList.remove('is-active');
                    });
                    if (radio.checked) {
                        radio.closest('.el-radio-button').classList.add('is-active');
                    }
                });
            });

            // ==================== Stock Data ====================
            const stockDatabase = [
                { code: '300139', name: '晓程科技', price: 46.12, change: -1.44, changePct: -3.03 },
                { code: '601212', name: '白银有色', price: 5.44, change: -0.05, changePct: -0.91 },
                { code: '000603', name: '盛达资源', price: 31.98, change: -0.23, changePct: -0.71 },
                { code: '600519', name: '贵州茅台', price: 1688.00, change: 12.50, changePct: 0.75 },
                { code: '000858', name: '五粮液', price: 138.50, change: 2.10, changePct: 1.54 },
                { code: '601318', name: '中国平安', price: 52.30, change: -0.45, changePct: -0.85 },
                { code: '002594', name: '比亚迪', price: 305.60, change: 5.80, changePct: 1.93 },
                { code: '688981', name: '中芯国际', price: 95.20, change: 3.15, changePct: 3.42 },
                { code: '300750', name: '宁德时代', price: 256.80, change: -2.30, changePct: -0.89 },
                { code: '603259', name: '药明康德', price: 78.90, change: 1.20, changePct: 1.54 },
                { code: '002415', name: '海康威视', price: 32.45, change: -0.35, changePct: -1.07 },
                { code: '000001', name: '平安银行', price: 12.15, change: 0.08, changePct: 0.66 },
                { code: '601988', name: '中国银行', price: 5.68, change: 0.03, changePct: 0.53 },
                { code: '600036', name: '招商银行', price: 42.35, change: 0.65, changePct: 1.56 },
                { code: '601668', name: '中国建筑', price: 6.42, change: -0.04, changePct: -0.62 },
                { code: '601857', name: '中国石油', price: 8.95, change: 0.12, changePct: 1.36 },
                { code: '600028', name: '中国石化', price: 6.78, change: 0.05, changePct: 0.74 },
                { code: '002230', name: '科大讯飞', price: 52.40, change: 1.85, changePct: 3.66 },
                { code: '300059', name: '东方财富', price: 18.75, change: -0.20, changePct: -1.06 },
                { code: '688111', name: '金山办公', price: 320.50, change: 8.90, changePct: 2.86 }
            ];

            let watchlistStocks = [
                { code: '300139', name: '晓程科技', price: 46.12, change: -1.44, changePct: -3.03 },
                { code: '601212', name: '白银有色', price: 5.44, change: -0.05, changePct: -0.91 },
                { code: '000603', name: '盛达资源', price: 31.98, change: -0.23, changePct: -0.71 }
            ];

            const stockSearchInput = document.getElementById('stockSearchInput');
            const stockSearchBtn = document.getElementById('stockSearchBtn');
            const stockRefreshBtn = document.getElementById('stockRefreshBtn');
            const stockListEl = document.getElementById('stockList');

            function renderStockList() {
                if (watchlistStocks.length === 0) {
                    stockListEl.innerHTML =
                        '<div style="text-align:center; padding:16px; font-size:12px; color:#999;">暂无自选股票，请输入代码搜索添加</div>';
                    return;
                }
                stockListEl.innerHTML = watchlistStocks.map(function(stock) {
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
                        '" title="删除自选股">✕</button>' +
                        '</div>';
                }).join('');

                // Attach remove handlers
                stockListEl.querySelectorAll('.remove-icon').forEach(function(btn) {
                    btn.addEventListener('click', function(e) {
                        e.stopPropagation();
                        const code = btn.getAttribute('data-code');
                        removeStock(code);
                    });
                });
            }

            function removeStock(code) {
                const idx = watchlistStocks.findIndex(function(s) { return s.code === code; });
                if (idx > -1) {
                    const name = watchlistStocks[idx].name;
                    watchlistStocks.splice(idx, 1);
                    renderStockList();
                    showToast('🗑️ 已删除「' + name + '」');
                }
            }

            function addStock(code) {
                const trimmedCode = code.trim();
                if (!trimmedCode) {
                    showToast('⚠️ 请输入股票代码');
                    return;
                }
                // Check if already in watchlist
                if (watchlistStocks.some(function(s) { return s.code === trimmedCode; })) {
                    showToast('⚠️ 该股票已在自选列表中');
                    return;
                }
                // Search in database
                const stock = stockDatabase.find(function(s) { return s.code === trimmedCode; });
                if (stock) {
                    watchlistStocks.push({ ...stock });
                    renderStockList();
                    showToast('✅ 已添加「' + stock.name + '」到自选股');
                } else {
                    // Simulate adding a new stock with random data
                    const newStock = {
                        code: trimmedCode,
                        name: '股票' + trimmedCode,
                        price: +(Math.random() * 100 + 5).toFixed(2),
                        change: +(Math.random() * 4 - 2).toFixed(2),
                        changePct: +(Math.random() * 8 - 4).toFixed(2)
                    };
                    watchlistStocks.push(newStock);
                    renderStockList();
                    showToast('✅ 已添加股票代码 ' + trimmedCode);
                }
                stockSearchInput.value = '';
            }

            stockSearchBtn.addEventListener('click', function() {
                addStock(stockSearchInput.value);
            });
            stockSearchInput.addEventListener('keydown', function(e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    addStock(stockSearchInput.value);
                }
            });

            stockRefreshBtn.addEventListener('click', function() {
                // Simulate price refresh with random fluctuations
                watchlistStocks = watchlistStocks.map(function(stock) {
                    const drift = (Math.random() - 0.5) * 0.8;
                    const newPrice = Math.max(0.01, stock.price + drift);
                    const newChange = +(stock.change + drift * 0.3).toFixed(2);
                    const newPct = +((drift / stock.price) * 100).toFixed(2);
                    return {
                        ...stock,
                        price: +newPrice.toFixed(2),
                        change: newChange,
                        changePct: newPct
                    };
                });
                renderStockList();
                showToast('🔄 股票价格已刷新');
            });

            // ==================== Holiday Countdown ====================
            function updateHolidayCountdown() {
                const now = new Date();
                // Mid-Autumn Festival 2026 is around Sep 25, 2026
                const target = new Date('2026-09-25T00:00:00+08:00');
                const diff = target - now;
                if (diff <= 0) {
                    document.getElementById('holidayCountdown').textContent = '🎉 中秋节到了！';
                    return;
                }
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((diff % (1000 * 60)) / 1000);
                document.getElementById('holidayCountdown').textContent =
                    days + '天 ' + hours + '时 ' + minutes + '分 ' + seconds + '秒';
            }
            updateHolidayCountdown();
            setInterval(updateHolidayCountdown, 1000);

            // ==================== Init ====================
            renderStockList();
            updateNovelList();

            // Auto demo: simulate a pre-loaded novel
            const demoNovel = {
                id: 'demo001',
                name: '欢迎使用阅读工具',
                content: '欢迎使用摸鱼阅读工具\n\n这是一个完全仿照CSDN风格的个人阅读平台。\n\n📖 核心功能：\n1. 上传TXT小说：点击右侧「上传文档」按钮，选择本地TXT文件即可阅读。\n2. 搜索小说：在左侧搜索框输入关键词，可搜索已上传小说的名称或内容。\n3. 查看股票：右侧股票面板支持搜索添加自选股，可删除和刷新。\n\n💡 使用提示：\n- 上传的小说会显示在左侧列表中\n- 点击小说名称可切换阅读\n- 股票面板支持代码搜索添加\n\n其他所有按钮仅保留样式，功能已禁用。\n\n祝您摸鱼愉快！🐟',
                uploadTime: '2026-08-14 04:51',
                readCount: 184
            };
            uploadedNovels.push(demoNovel);
            currentNovelId = 'demo001';
            displayNovel(demoNovel);
            updateNovelList();

            console.log('✅ 页面初始化完成');
})();