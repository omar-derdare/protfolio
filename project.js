
    // --- Portfolio card image sliders (3 images each, auto-rotating) ---
    document.addEventListener('DOMContentLoaded', function () {
        document.querySelectorAll('.portfolio-slider-wrapper').forEach(function (wrapper, wrapperIndex) {
            var slides = wrapper.querySelectorAll('.slider-slide');
            var dots = wrapper.querySelectorAll('.slider-dot');
            if (slides.length <= 1) return;

            var current = 0;

            function goTo(index) {
                slides[current].classList.remove('slide-active');
                dots[current] && dots[current].classList.remove('active');
                current = index;
                slides[current].classList.add('slide-active');
                dots[current] && dots[current].classList.add('active');
            }

            // Stagger start times slightly so cards don't all flip in sync
            var intervalMs = 3500;
            var startDelay = (wrapperIndex % 5) * 400;

            setTimeout(function () {
                setInterval(function () {
                    goTo((current + 1) % slides.length);
                }, intervalMs);
            }, startDelay);

            // Allow manual navigation via dots
            dots.forEach(function (dot, i) {
                dot.addEventListener('click', function (e) {
                    e.stopPropagation();
                    goTo(i);
                });
            });
        });
    });


    // =================================================================
    // Dashboard Access modal — one reusable component shared by every
    // fullstack card's "Dashboard" button (data-project / data-dashboard-*
    // attributes), replacing the old per-card inline alert().
    // =================================================================
    (function () {
        var overlay = document.getElementById('dashboard-access-overlay');
        var card = overlay.querySelector('.dashboard-access-card');
        var projectEl = document.getElementById('dashboard-access-project');
        var userEl = document.getElementById('dashboard-access-user');
        var passEl = document.getElementById('dashboard-access-pass');
        var goBtn = document.getElementById('dashboard-access-go');
        var closeBtn = document.getElementById('dashboard-access-close');
        var cancelBtn = document.getElementById('dashboard-access-cancel');

        function openModal(trigger) {
            var project = trigger.getAttribute('data-project') || 'Project';
            var dashboardUrl = trigger.getAttribute('data-dashboard-url') || '#';
            var user = trigger.getAttribute('data-dashboard-user') || '—';
            var pass = trigger.getAttribute('data-dashboard-pass') || '—';

            // textContent everywhere — never innerHTML — so nothing here can
            // be used to inject markup even if a data attribute changes later.
            projectEl.textContent = project;
            userEl.textContent = user;
            passEl.textContent = pass;
            goBtn.href = dashboardUrl;

            overlay.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }

        function closeModal() {
            overlay.classList.add('hidden');
            document.body.style.overflow = '';
        }

        document.querySelectorAll('.dashboard-trigger').forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                openModal(btn);
            });
        });

        closeBtn.addEventListener('click', closeModal);
        cancelBtn.addEventListener('click', closeModal);
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) closeModal();
        });
        card.addEventListener('click', function (e) {
            e.stopPropagation();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closeModal();
        });

        // Copy-to-clipboard for username/password rows.
        document.querySelectorAll('.credential-copy-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var targetId = btn.getAttribute('data-copy-target');
                var target = document.getElementById(targetId);
                if (!target) return;

                var text = target.textContent;
                var restoreIcon = btn.innerHTML;

                function markCopied() {
                    btn.classList.add('copied');
                    btn.innerHTML = '<i class="ph ph-check"></i>';
                    setTimeout(function () {
                        btn.classList.remove('copied');
                        btn.innerHTML = restoreIcon;
                    }, 1400);
                }

                if (navigator.clipboard && navigator.clipboard.writeText) {
                    navigator.clipboard.writeText(text).then(markCopied).catch(function () {
                        markCopied(); // clipboard API can fail silently in some contexts; UI still confirms intent
                    });
                } else {
                    markCopied();
                }
            });
        });
    })();