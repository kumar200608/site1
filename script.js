// ===== SafeHer India — Interactive Features =====

document.addEventListener('DOMContentLoaded', () => {
    // ===== SUPABASE INITIALIZATION =====
    const supabaseUrl = 'https://dynfmafntewpfqmpzrot.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5bmZtYWZudGV3cGZxbXB6cm90Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjcxMzcsImV4cCI6MjA4NzE0MzEzN30.iutjUT5zCfwk_S9e7cb4SyWKoBUE2N71WOfKFdzuDJ8';

    // Check if Supabase JS library is loaded (from CDN) to prevent errors on pages without the script
    const supabase = window.supabase ? window.supabase.createClient(supabaseUrl, supabaseKey) : null;

    // ===== LANGUAGE DROPDOWN =====
    const langToggle = document.getElementById('lang-toggle');
    const langList = document.getElementById('lang-list');

    if (langToggle && langList) {
        langToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            langList.classList.toggle('open');
        });

        document.addEventListener('click', () => {
            langList.classList.remove('open');
        });

        langList.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                langList.querySelectorAll('a').forEach(a => a.classList.remove('active'));
                e.target.classList.add('active');
                langToggle.childNodes[2].textContent = ` ${e.target.textContent} `;
                langList.classList.remove('open');
            }
        });
    }

    // ===== MOBILE HAMBURGER MENU =====
    const hamburger = document.getElementById('hamburger');
    const topBarActions = document.querySelector('.top-bar__actions');
    const navBar = document.getElementById('nav-bar');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('open');
            if (topBarActions) topBarActions.classList.toggle('mobile-open');
            if (navBar) navBar.classList.toggle('mobile-open');
        });
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav-bar__list a, .top-bar__actions a').forEach(link => {
        link.addEventListener('click', () => {
            if (hamburger && hamburger.classList.contains('open')) {
                hamburger.classList.remove('open');
                if (topBarActions) topBarActions.classList.remove('mobile-open');
                if (navBar) navBar.classList.remove('mobile-open');
            }
        });
    });

    // ===== TESTIMONIALS CAROUSEL =====
    const track = document.getElementById('carousel-track');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (track && prevBtn && nextBtn && dotsContainer) {
        const slides = track.querySelectorAll('.carousel__slide');
        const totalSlides = slides.length;
        let currentIndex = 0;
        let autoPlayInterval;

        // Create dots
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel__dot');
            if (i === 0) dot.classList.add('active');
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.dataset.index = i;
            dotsContainer.appendChild(dot);
        });

        const dots = dotsContainer.querySelectorAll('.carousel__dot');

        function goToSlide(index) {
            if (index < 0) index = totalSlides - 1;
            if (index >= totalSlides) index = 0;
            currentIndex = index;
            track.style.transform = `translateX(-${currentIndex * 100}%)`;

            dots.forEach(d => d.classList.remove('active'));
            if (dots[currentIndex]) dots[currentIndex].classList.add('active');
        }

        prevBtn.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
            resetAutoPlay();
        });

        nextBtn.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
            resetAutoPlay();
        });

        dotsContainer.addEventListener('click', (e) => {
            if (e.target.classList.contains('carousel__dot')) {
                goToSlide(parseInt(e.target.dataset.index));
                resetAutoPlay();
            }
        });

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => {
                goToSlide(currentIndex + 1);
            }, 6000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }

        startAutoPlay();

        // Touch / Swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) goToSlide(currentIndex + 1);
                else goToSlide(currentIndex - 1);
                resetAutoPlay();
            }
        }, { passive: true });
    }

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetEl = document.querySelector(targetId);
            if (targetEl) {
                e.preventDefault();
                targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== SCROLL ANIMATIONS =====
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -40px 0px' };
    const animateOnScroll = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                animateOnScroll.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.not-alone__inner, .info-card, .what-is__grid, .privacy-section__inner, .who-for__grid, .need-more__grid, .step-card, .about-grid, .stat-card, .partner-card, .platform-card'
    );
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        animateOnScroll.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `.animate-in { opacity: 1 !important; transform: translateY(0) !important; }`;
    document.head.appendChild(style);

    // ===== VIDEO PLAY BUTTON (mock) =====
    const videoPlayBtn = document.getElementById('video-play');
    if (videoPlayBtn) {
        videoPlayBtn.addEventListener('click', () => {
            const progressBar = document.querySelector('.video-progress__bar');
            if (progressBar) {
                progressBar.style.transition = 'width 3s ease';
                progressBar.style.width = '100%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 0.3s ease';
                    progressBar.style.width = '0%';
                }, 3500);
            }
        });
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.accordion-trigger').forEach(trigger => {
        trigger.addEventListener('click', () => {
            const content = trigger.nextElementSibling;
            const isOpen = trigger.getAttribute('aria-expanded') === 'true';

            // Close all items in the same category
            const parent = trigger.closest('.faq-category');
            if (parent) {
                parent.querySelectorAll('.accordion-trigger').forEach(t => {
                    t.setAttribute('aria-expanded', 'false');
                    t.nextElementSibling.classList.remove('open');
                });
            }

            // Toggle current
            if (!isOpen) {
                trigger.setAttribute('aria-expanded', 'true');
                content.classList.add('open');
            }
        });
    });

    // ===== CREATE CASE WIZARD =====
    const steps = document.querySelectorAll('.wizard-step');
    let selectedFiles = [];

    // Map internal step strings to a logical step number for progress bar
    const stepProgressMap = {
        '1-1': { num: 1, percent: 11 },
        '1-2': { num: 2, percent: 22 },
        '1-2b': { num: 3, percent: 33 },
        '1-3': { num: 4, percent: 44 },
        '1-4': { num: 5, percent: 55 },
        '1-5': { num: 6, percent: 66 },
        '2': { num: 7, percent: 77 }, // File Upload
        '3': { num: 8, percent: 88 }, // Password
        '4': { num: 9, percent: 100 }, // Review
        'success': { num: 9, percent: 100 }
    };

    function showStep(stepId) {
        steps.forEach(s => s.classList.remove('active'));
        const targetStr = stepId.toString().startsWith('step-') ? stepId : `step-${stepId}`;
        const target = document.getElementById(targetStr);
        if (target) {
            target.style.display = 'block';
            target.classList.add('active');
        }

        // Hide others properly for visual flow
        steps.forEach(s => {
            if (s.id !== targetStr) s.style.display = 'none';
        });

        // Update progress bar matching screenshots
        const progNode = stepProgressMap[stepId];
        const progText = document.getElementById('progress-text');
        const progFill = document.getElementById('progress-fill');

        if (progNode && progText && progFill) {
            progText.textContent = `${progNode.num} / 9 (${progNode.percent}%)`;
            progFill.style.width = `${progNode.percent}%`;
        }
    }

    // Dynamic questionnaire buttons
    document.querySelectorAll('.q-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const next = e.currentTarget.getAttribute('data-next');

            // Special handling for the URL Step (1-2b)
            if (next === '1-3' && e.currentTarget.closest('#step-1-2b')) {
                const urlInput = document.getElementById('content-url');
                if (urlInput && urlInput.value.trim() !== '') {
                    const originalText = e.currentTarget.textContent;
                    e.currentTarget.disabled = true;
                    e.currentTarget.style.opacity = '0.7';

                    let scanProgress = 0;
                    e.currentTarget.textContent = `Scanning URL... ${scanProgress}%`;

                    // Simulate AI content detection scan ticking from 0 to 100
                    const scanInterval = setInterval(() => {
                        scanProgress += Math.floor(Math.random() * 5) + 2; // Tick up by 2-6% randomly

                        if (scanProgress >= 100) {
                            scanProgress = 100;
                            clearInterval(scanInterval);

                            e.currentTarget.textContent = originalText;
                            e.currentTarget.disabled = false;
                            e.currentTarget.style.opacity = '1';

                            const resultDiv = document.getElementById('url-scan-result');
                            if (resultDiv) {
                                resultDiv.style.display = 'block';
                                resultDiv.style.backgroundColor = '#fef2f2';
                                resultDiv.style.borderColor = '#fca5a5';
                                resultDiv.style.color = '#b91c1c';
                                resultDiv.innerHTML = '⚠️ Content flagged as potentially sensitive.';

                                // Let the user read the result before auto-advancing
                                setTimeout(() => {
                                    resultDiv.style.display = 'none'; // reset for next time
                                    showStep(next);
                                }, 1200);
                            } else {
                                showStep(next);
                            }
                        } else {
                            e.currentTarget.textContent = `Scanning URL... ${scanProgress}%`;
                        }
                    }, 40); // 40ms * ~25 ticks = ~1 second scan

                    return; // Prevent immediate navigation
                }
            }

            if (next) showStep(next);
        });
    });

    // Step 2: File Upload
    const uploadZone = document.getElementById('upload-zone');
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const toStep3Btn = document.getElementById('to-step-3');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('drag-over');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('drag-over');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('drag-over');
            handleFiles(e.dataTransfer.files);
        });

        fileInput.addEventListener('change', () => {
            handleFiles(fileInput.files);
            fileInput.value = '';
        });
    }

    async function handleFiles(files) {
        for (const file of files) {
            if (selectedFiles.length >= 20) {
                alert('You can upload a maximum of 20 photos/videos per request.');
                break;
            }

            // Avoid duplicates by name + size
            if (selectedFiles.find(f => f.file.name === file.name && f.file.size === file.size)) continue;

            try {
                // Generate local hash using Web Crypto API (simulating StopNCII local client hashing)
                const arrayBuffer = await file.arrayBuffer();
                const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
                const hashArray = Array.from(new Uint8Array(hashBuffer));
                const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

                selectedFiles.push({ file, hash: hashHex });
            } catch (e) {
                console.error("Hashing failed for", file.name, e);
                alert(`Failed to hash ${file.name}`);
            }
        }
        renderFileList();
    }

    function renderFileList() {
        if (!fileList) return;
        fileList.innerHTML = '';
        selectedFiles.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'file-item';
            div.style.flexDirection = 'column';
            div.style.alignItems = 'flex-start';

            const sizeKB = (item.file.size / 1024).toFixed(1);

            // Show thumbnail if image
            let thumbHtml = '';
            if (item.file.type.startsWith('image/')) {
                const objUrl = URL.createObjectURL(item.file);
                thumbHtml = `<img src="${objUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; margin-right: 12px; float: left;">`;
            } else if (item.file.type.startsWith('video/')) {
                thumbHtml = `<div style="width: 40px; height: 40px; background: #eee; border-radius: 4px; margin-right: 12px; float: left; display: flex; align-items: center; justify-content: center;"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg></div>`;
            }

            div.innerHTML = `
                    <div style="display: flex; align-items: center; width: 100%; justify-content: space-between;">
                        <div style="display: flex; align-items: center;">
                            ${thumbHtml}
                            <div>
                                <div class="file-item__name" style="font-weight: 600;">${item.file.name}</div>
                                <div class="file-item__size" style="font-size: 0.8rem; color: #666;">${sizeKB} KB — Hashed</div>
                            </div>
                        </div>
                        <button class="file-item__remove" data-idx="${idx}" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
                    </div>
                    <div style="font-family: monospace; font-size: 0.75rem; color: #888; margin-top: 8px; word-break: break-all; width: 100%;">
                        Hash: ${item.hash}
                    </div>
                `;
            fileList.appendChild(div);
        });

        if (toStep3Btn) toStep3Btn.disabled = selectedFiles.length === 0;

        fileList.querySelectorAll('.file-item__remove').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.dataset.idx);
                // Revoke object URL to free memory
                if (selectedFiles[idx].file.type.startsWith('image/')) {
                    const img = e.currentTarget.parentElement.querySelector('img');
                    if (img) URL.revokeObjectURL(img.src);
                }
                selectedFiles.splice(idx, 1);
                renderFileList();
            });
        });
    }

    // Back buttons
    const backTo1 = document.getElementById('back-to-1');
    const backTo2 = document.getElementById('back-to-2');
    const backTo3 = document.getElementById('back-to-3');
    if (backTo1) backTo1.addEventListener('click', () => showStep(1));
    if (backTo2) backTo2.addEventListener('click', () => showStep(2));
    if (backTo3) backTo3.addEventListener('click', () => showStep(3));

    // To Step 3
    if (toStep3Btn) toStep3Btn.addEventListener('click', () => showStep(3));

    // Step 3: Password
    const casePassword = document.getElementById('case-password');
    const casePasswordConfirm = document.getElementById('case-password-confirm');
    const toStep4Btn = document.getElementById('to-step-4');

    function checkPassword() {
        if (!casePassword || !casePasswordConfirm || !toStep4Btn) return;
        const valid = casePassword.value.length >= 10 && casePassword.value === casePasswordConfirm.value;
        toStep4Btn.disabled = !valid;
    }

    if (casePassword) casePassword.addEventListener('input', checkPassword);
    if (casePasswordConfirm) casePasswordConfirm.addEventListener('input', checkPassword);

    if (toStep4Btn) {
        toStep4Btn.addEventListener('click', () => {
            // Update review
            const reviewFileCount = document.getElementById('review-file-count');
            const reviewEmail = document.getElementById('review-email');
            const caseEmail = document.getElementById('case-email');
            if (reviewFileCount) reviewFileCount.textContent = selectedFiles.length;
            if (reviewEmail && caseEmail) reviewEmail.textContent = caseEmail.value || 'Not provided';
            showStep(4);
        });
    }

    // Step 4: Review & Submit
    const confirmChecks = ['confirm-person', 'confirm-age'];
    const submitBtn = document.getElementById('submit-case');

    function checkConfirmations() {
        const allChecked = confirmChecks.every(id => {
            const el = document.getElementById(id);
            return el && el.checked;
        });
        if (submitBtn) submitBtn.disabled = !allChecked;
    }

    confirmChecks.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', checkConfirmations);
    });

    if (submitBtn) {
        submitBtn.addEventListener('click', async () => {
            // Generate case number
            const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
            let caseNum = 'SHI-';
            for (let i = 0; i < 7; i++) caseNum += chars.charAt(Math.floor(Math.random() * chars.length));

            const caseNumberDisplay = document.getElementById('case-number-display');
            if (caseNumberDisplay) caseNumberDisplay.textContent = caseNum;

            const pwd = document.getElementById('case-password').value;
            const email = document.getElementById('case-email').value;
            const contentUrl = document.getElementById('content-url') ? document.getElementById('content-url').value : '';

            const caseData = {
                case_number: caseNum,
                password: pwd,
                email: email,
                content_url: contentUrl,
                date_created: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                hashes: selectedFiles.map(f => ({
                    name: f.file.name,
                    hash: f.hash,
                    type: f.file.type.startsWith('image/') ? 'image' : 'video',
                    status: 'Monitoring'
                }))
            };

            // UI feedback while saving
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Submitting...';
            submitBtn.disabled = true;

            // Save to Supabase
            if (supabase) {
                const { error } = await supabase.from('cases').insert([caseData]);

                if (error) {
                    console.error('Supabase Error:', error);
                    alert('There was an error creating your case. Please try again.');
                    submitBtn.textContent = originalBtnText;
                    submitBtn.disabled = false;
                    return;
                }
            } else {
                console.warn('Supabase not initialized. Make sure you are connected to the internet and the Supabase script is loaded.');
            }

            // Hide all steps, show success
            steps.forEach(s => s.classList.remove('active'));
            const successStep = document.getElementById('step-success');
            if (successStep) {
                successStep.style.display = 'block';
                successStep.classList.add('active');
            }
            const wizardHeader = document.querySelector('.wizard-header');
            if (wizardHeader) wizardHeader.style.display = 'none';
        });
    }

    // Copy case number
    const copyBtn = document.getElementById('copy-case-number');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            const caseNum = document.getElementById('case-number-display');
            if (caseNum) {
                navigator.clipboard.writeText(caseNum.textContent).then(() => {
                    copyBtn.textContent = 'Copied!';
                    setTimeout(() => { copyBtn.textContent = 'Copy'; }, 2000);
                });
            }
        });
    }

    // ===== CHECK CASE STATUS =====
    const checkStatusBtn = document.getElementById('check-status-btn');
    const statusLogin = document.getElementById('status-login');
    const statusResult = document.getElementById('status-result');

    if (checkStatusBtn && statusLogin && statusResult) {
        checkStatusBtn.addEventListener('click', async () => {
            const caseNumber = document.getElementById('status-case-number').value.trim();
            const password = document.getElementById('status-password').value;

            if (!caseNumber || !password) {
                alert('Please enter both your case number and password.');
                return;
            }

            // UI feedback while loading
            const originalBtnText = checkStatusBtn.textContent;
            checkStatusBtn.textContent = 'Checking...';
            checkStatusBtn.disabled = true;

            let userCase = null;

            if (supabase) {
                // Query Supabase
                const { data, error } = await supabase
                    .from('cases')
                    .select('*')
                    .eq('case_number', caseNumber)
                    .eq('password', password)
                    .single();

                if (error || !data) {
                    console.error('Supabase lookup error:', error);
                    alert('Invalid case number or password. Please try again.');
                    checkStatusBtn.textContent = originalBtnText;
                    checkStatusBtn.disabled = false;
                    return;
                }
                userCase = data;

                // Supabase returns hashes as a parsed JSON object (or array depending on storage)
                // If it's stored as a stringified array in jsonb, we may need to parse. Assuming it's an array:
                if (typeof userCase.hashes === 'string') {
                    try { userCase.hashes = JSON.parse(userCase.hashes); } catch (e) { userCase.hashes = []; }
                }
            } else {
                console.warn('Supabase not initialized.');
                alert('Database connection error.');
                checkStatusBtn.textContent = originalBtnText;
                checkStatusBtn.disabled = false;
                return;
            }

            // Validation passed — show dashboard
            statusLogin.style.display = 'none';
            statusResult.style.display = 'block';

            // Populate summary stats
            const displayCase = document.getElementById('status-display-case');
            if (displayCase) displayCase.textContent = caseNumber;

            // Render actual saved hashes
            const hashesContainer = document.querySelector('.status-hashes');
            const detailsHtml = `
                <div class="status-detail-row">
                    <span class="status-label">Case Number</span>
                    <span class="status-value" id="status-display-case">${caseNumber}</span>
                </div>
                <div class="status-detail-row">
                    <span class="status-label">Date Created</span>
                    <span class="status-value">${userCase.dateCreated}</span>
                </div>
                <div class="status-detail-row">
                    <span class="status-label">Hashes Submitted</span>
                    <span class="status-value">${userCase.hashes.length}</span>
                </div>
                <div class="status-detail-row">
                    <span class="status-label">Matches Found</span>
                    <span class="status-value">0</span>
                </div>
                <div class="status-detail-row">
                    <span class="status-label">Last Checked</span>
                    <span class="status-value">${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
            `;
            document.querySelector('.status-details').innerHTML = detailsHtml;

            if (hashesContainer) {
                hashesContainer.innerHTML = '<h3>Hash Details</h3>';

                userCase.hashes.forEach(h => {
                    const iconPath = h.type === 'video'
                        ? '<polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/>'
                        : '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/>';

                    hashesContainer.innerHTML += `
                        <div class="hash-item">
                            <div class="hash-item__icon">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--orange)" stroke-width="2">
                                    ${iconPath}
                                </svg>
                            </div>
                            <div class="hash-item__details">
                                <span class="hash-item__name">${h.name}</span>
                                <span class="hash-item__status hash-item__status--pending">${h.status}</span>
                            </div>
                        </div>
                    `;
                });
            }
        });
    }

    // Withdraw button
    const withdrawBtn = document.getElementById('withdraw-btn');
    const withdrawModal = document.getElementById('withdraw-modal');
    const cancelWithdraw = document.getElementById('cancel-withdraw');
    const confirmWithdraw = document.getElementById('confirm-withdraw');

    if (withdrawBtn && withdrawModal) {
        withdrawBtn.addEventListener('click', () => {
            withdrawModal.style.display = 'flex';
        });
    }
    if (cancelWithdraw && withdrawModal) {
        cancelWithdraw.addEventListener('click', () => {
            withdrawModal.style.display = 'none';
        });
    }
    if (confirmWithdraw && withdrawModal && statusResult && statusLogin) {
        confirmWithdraw.addEventListener('click', async () => {
            const caseNumber = document.getElementById('status-case-number').value.trim();

            const originalBtnText = confirmWithdraw.textContent;
            confirmWithdraw.textContent = 'Processing...';
            confirmWithdraw.disabled = true;

            if (supabase) {
                const { error } = await supabase.from('cases').delete().eq('case_number', caseNumber);

                if (error) {
                    console.error('Supabase delete error:', error);
                    alert('There was an error withdrawing your case. Please try again later.');
                    confirmWithdraw.textContent = originalBtnText;
                    confirmWithdraw.disabled = false;
                    return;
                }
            } else {
                console.warn('Supabase not initialized.');
            }

            withdrawModal.style.display = 'none';
            statusResult.style.display = 'none';
            statusLogin.style.display = 'block';

            // clear form
            document.getElementById('status-case-number').value = '';
            document.getElementById('status-password').value = '';

            alert('Your case has been withdrawn successfully. All hashes will be removed from the system.');

            confirmWithdraw.textContent = originalBtnText;
            confirmWithdraw.disabled = false;
        });
    }

    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn && statusResult && statusLogin) {
        logoutBtn.addEventListener('click', () => {
            statusResult.style.display = 'none';
            statusLogin.style.display = 'block';

            // clear form
            document.getElementById('status-case-number').value = '';
            document.getElementById('status-password').value = '';
        });
    }

});
