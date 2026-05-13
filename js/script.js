(function() {
    'use strict';

    // 1. تفعيل الوضع المظلم وحفظ التفضيل في localStorage
    const initDarkMode = () => {
        const toggle = document.getElementById('darkmodeToggle');
        if (!toggle) return;
        const root = document.documentElement;
        const saved = localStorage.getItem('theme');
        if (saved === 'dark') {
            root.setAttribute('data-theme', 'dark');
            toggle.innerHTML = '☀️';
        }
        toggle.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            if (isDark) {
                root.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                toggle.innerHTML = '🌙';
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                toggle.innerHTML = '☀️';
            }
        });
    };

    // 2. تفعيل الرابط النشط في شريط التنقل حسب الصفحة الحالية
    const setActiveNavLink = () => {
        const current = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('nav ul li a').forEach(link => {
            if (link.getAttribute('href') === current) link.classList.add('active');
        });
    };

    // 3. زر الرجوع للأعلى يظهر عند التمرير
    const initScrollTop = () => {
        if (document.querySelector('.scroll-top-btn')) return;
        const btn = document.createElement('button');
        btn.className = 'scroll-top-btn';
        btn.innerHTML = '⬆️';
        Object.assign(btn.style, {
            position: 'fixed', bottom: '30px', right: '20px', width: '50px', height: '50px',
            borderRadius: '50%', backgroundColor: 'var(--primary, #1e3a8a)', color: 'white',
            border: 'none', cursor: 'pointer', fontSize: '1.5rem', display: 'none',
            zIndex: '999', boxShadow: '0 4px 15px rgba(0,0,0,0.2)', transition: 'all 0.3s',
            alignItems: 'center', justifyContent: 'center'
        });
        btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
        btn.addEventListener('mouseenter', () => btn.style.transform = 'translateY(-3px)');
        btn.addEventListener('mouseleave', () => btn.style.transform = 'translateY(0)');
        document.body.appendChild(btn);
        window.addEventListener('scroll', () => {
            btn.style.display = window.scrollY > 300 ? 'flex' : 'none';
        });
    };

    // 4. دالة عرض الإشعارات المنبثقة (toast) بنجاح أو خطأ
    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    };

    // إضافة أنماط الإشعارات مرة واحدة فقط
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .toast { position: fixed; bottom: 80px; right: 20px; padding: 12px 24px; border-radius: 12px; font-weight: bold; z-index: 9999; animation: slideIn 0.3s ease; }
            .toast-success { background-color: #10b981; color: white; }
            .toast-error { background-color: #ef4444; color: white; }
            @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideOut { from { transform: translateX(0); opacity: 1; } to { transform: translateX(100%); opacity: 0; } }
        `;
        document.head.appendChild(style);
    }

    // عرض خطأ أسفل الحقل مع تغيير لون الحدود
    const showFieldError = (input, message) => {
        const group = input.closest('.form-group');
        if (group) {
            let err = group.querySelector('.error');
            if (!err) {
                err = document.createElement('small');
                err.className = 'error';
                group.appendChild(err);
            }
            err.textContent = message;
            err.style.cssText = 'color: #ef4444; font-size: 0.75rem; display: block;';
        }
        input.style.borderColor = '#ef4444';
        input.addEventListener('input', () => input.style.borderColor = '#e2e8f0', { once: true });
    };


    // 5. نموذج التسجيل: حفظ البيانات في localStorage 
    const initRegistration = () => {
        const form = document.getElementById('registerForm');
        if (!form) return;

        // معالجة إرسال النموذج
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const fields = {
                name: document.getElementById('name'),
                email: document.getElementById('email'),
                phone: document.getElementById('phone'),
                department: document.getElementById('department'),
                password: document.getElementById('password'),
                confirmPassword: document.getElementById('confirmPassword')
            };
            document.querySelectorAll('.error').forEach(el => el.textContent = '');
            let isValid = true;

            // التحقق من صحة الإدخالات
            if (!fields.name.value.trim() || fields.name.value.trim().length < 3) {
                showFieldError(fields.name, 'الاسم مطلوب (3 أحرف على الأقل)');
                isValid = false;
            }
            if (!fields.email.value.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email.value)) {
                showFieldError(fields.email, 'البريد الإلكتروني غير صحيح');
                isValid = false;
            }
            if (!fields.phone.value.trim() || !/^01[0-9]{9}$/.test(fields.phone.value)) {
                showFieldError(fields.phone, 'رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 01');
                isValid = false;
            }
            if (!fields.department.value) {
                showFieldError(fields.department, 'يرجى اختيار التخصص');
                isValid = false;
            }
            if (!fields.password.value || fields.password.value.length < 6) {
                showFieldError(fields.password, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
                isValid = false;
            }
            if (fields.password.value !== fields.confirmPassword.value) {
                showFieldError(fields.confirmPassword, 'كلمة المرور غير متطابقة');
                isValid = false;
            }

            if (isValid) {
                const students = JSON.parse(localStorage.getItem('students') || '[]');
                students.push({
                    name: fields.name.value.trim(),
                    email: fields.email.value.trim(),
                    phone: fields.phone.value.trim(),
                    department: fields.department.value,
                    registeredAt: new Date().toISOString()
                });
                localStorage.setItem('students', JSON.stringify(students));
                showToast('تم تسجيل بياناتك بنجاح! سيتم التواصل معك قريباً.', 'success');
                form.reset();
            }
        });
    };
    // 6. نموذج الاتصال: التحقق من الحقول وإظهار رسالة
    const initContactForm = () => {
        const form = document.querySelector('.contact-form');
        if (!form) return;
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const inputs = form.querySelectorAll('input, textarea');
            let isValid = true;
            inputs.forEach(input => {
                if (!input.value.trim()) {
                    input.style.borderColor = '#ef4444';
                    isValid = false;
                } else {
                    input.style.borderColor = '#e2e8f0';
                }
            });
            const email = form.querySelector('input[type="email"]');
            if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
                email.style.borderColor = '#ef4444';
                isValid = false;
            }
            if (isValid) {
                showToast('تم إرسال رسالتك بنجاح! سنرد عليك قريباً.', 'success');
                form.reset();
            } else {
                showToast('يرجى ملء جميع الحقول المطلوبة', 'error');
            }
        });
        form.querySelectorAll('input, textarea').forEach(input => {
            input.addEventListener('input', () => input.style.borderColor = '#e2e8f0');
        });
    };

    // 7. صفحة الأسئلة الشائعة: فتح/غلق الإجابات، البحث، التصفية
    const initFaq = () => {
        if (!document.querySelector('.faq-list')) return;

        document.querySelectorAll('.faq-item').forEach(item => {
            const q = item.querySelector('.faq-question');
            if (q) q.addEventListener('click', () => item.classList.toggle('active'));
        });

        if (window.location.hash) {
            const idx = parseInt(window.location.hash.replace('#question-', '')) - 1;
            const items = document.querySelectorAll('.faq-item');
            if (items[idx] && !isNaN(idx)) {
                items[idx].classList.add('active');
                items[idx].scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }

        const searchInput = document.getElementById('faqSearch');
        if (searchInput) {
            searchInput.addEventListener('input', function() {
                const term = this.value.toLowerCase().trim();
                document.querySelectorAll('.faq-item').forEach(item => {
                    const qText = item.querySelector('.faq-question span')?.innerText.toLowerCase() || '';
                    const aText = item.querySelector('.faq-answer')?.innerText.toLowerCase() || '';
                    item.style.display = (term === '' || qText.includes(term) || aText.includes(term)) ? '' : 'none';
                });
                document.querySelectorAll('.faq-category').forEach(cat => {
                    const visible = cat.querySelectorAll('.faq-item[style=""]').length;
                    cat.style.display = (visible === 0 && term !== '') ? 'none' : '';
                });
            });
        }

        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const filter = btn.getAttribute('data-filter');
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                document.querySelectorAll('.faq-category').forEach(cat => {
                    cat.style.display = (filter === 'all' || cat.getAttribute('data-category') === filter) ? '' : 'none';
                });
                if (searchInput) searchInput.value = '';
            });
        });
    };

    // 8. اختبار القدرات: تحميل الأسئلة من ملف .bat وحساب النتائج
    const initAptitudeTest = async () => {
        const examSection = document.getElementById('examSection');
        if (!examSection) return;

        let questions = [];
        let userAnswers = [];
        let currentIndex = 0;
        
        const specialties = {
            ai: { name: "الذكاء الاصطناعي", icon: "fa-brain", color: "#8b5cf6", description: "تطوير أنظمة ذكية قادرة على التعلم واتخاذ القرارات" },
            cs: { name: "علوم الحاسب", icon: "fa-code", color: "#3b82f6", description: "برمجة التطبيقات والمواقع وحل المشكلات البرمجية" },
            data: { name: "علوم البيانات", icon: "fa-chart-line", color: "#10b981", description: "تحليل البيانات واستخراج المعرفة لدعم القرارات" },
            cyber: { name: "الأمن السيبراني", icon: "fa-shield-halved", color: "#ef4444", description: "حماية الأنظمة والبيانات من الهجمات الإلكترونية" }
        };

        // دالة لتحميل الأسئلة من ملف .bat
        const loadQuestionsFromBatchFile = async () => {
            try {
                const response = await fetch('js/questions.bat');
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                const text = await response.text();
                const lines = text.split('\n');
                
                questions = [];
                for (let line of lines) {
                    line = line.trim();
                    // تجاهل الأسطر الفارغة وأسطر الأوامر
                    if (line === '' || line.startsWith('REM') || line.startsWith('@ECHO') || line.startsWith('@echo')) {
                        continue;
                    }
                    const parts = line.split('|');
                    if (parts.length >= 3) {
                        questions.push({
                            text: parts[0].trim(),
                            category: parts[1].trim(),
                            weight: parseInt(parts[2].trim()) || 1
                        });
                    }
                }
                
                if (questions.length === 0) {
                    throw new Error('الملف لا يحتوي على أسئلة صحيحة');
                }
                
                console.log(`تم تحميل ${questions.length} سؤال من ملف questions.bat`);
                return true;
            } catch (error) {
                console.error('خطأ في تحميل الأسئلة:', error);
                showToast('فشل تحميل أسئلة الاختبار. تأكد من وجود ملف questions.bat في مجلد js', 'error');
                return false;
            }
        };

        const renderQuestion = () => {
            if (questions.length === 0) return;
            const q = questions[currentIndex];
            const qEl = document.getElementById('questionText');
            const numEl = document.getElementById('currentQNumber');
            const totalEl = document.getElementById('totalQ');
            const prog = document.getElementById('progressFill');
            
            if (qEl) qEl.innerHTML = `<i class="fa-regular fa-circle-question"></i> ${q.text}`;
            if (numEl) numEl.textContent = currentIndex + 1;
            if (totalEl) totalEl.textContent = questions.length;
            if (prog) prog.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

            const opts = document.getElementById('optionsContainer');
            if (opts) {
                opts.innerHTML = '';
                const values = [
                    { value: 3, label: 'أوافق بشدة', icon: 'fa-face-smile' },
                    { value: 2, label: 'أوافق', icon: 'fa-face-smile' },
                    { value: 1, label: 'محايد', icon: 'fa-face-meh' },
                    { value: 0, label: 'لا أوافق', icon: 'fa-face-frown' },
                    { value: -1, label: 'لا أوافق بشدة', icon: 'fa-face-angry' }
                ];
                values.forEach(opt => {
                    const div = document.createElement('div');
                    div.className = 'option';
                    if (userAnswers[currentIndex] === opt.value) div.classList.add('selected');
                    div.innerHTML = `<input type="radio" name="question" value="${opt.value}" id="opt_${opt.value}"><label for="opt_${opt.value}"><i class="fa-regular ${opt.icon}"></i> ${opt.label}</label>`;
                    const radio = div.querySelector('input');
                    radio.addEventListener('change', (e) => {
                        userAnswers[currentIndex] = parseInt(e.target.value);
                        document.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
                        div.classList.add('selected');
                    });
                    if (userAnswers[currentIndex] === opt.value) radio.checked = true;
                    opts.appendChild(div);
                });
            }

            const prev = document.getElementById('prevBtn');
            const next = document.getElementById('nextBtn');
            if (prev) prev.style.display = currentIndex === 0 ? 'none' : 'block';
            if (next) next.innerHTML = currentIndex === questions.length - 1 ? 'إنهاء الاختبار <i class="fa-solid fa-check"></i>' : 'التالي <i class="fa-solid fa-arrow-left"></i>';
        };

        const calculateResults = () => {
            const scores = { ai: 0, cs: 0, data: 0, cyber: 0 };
            const maxScores = { ai: 0, cs: 0, data: 0, cyber: 0 };
            questions.forEach((q, i) => {
                const ans = userAnswers[i];
                const w = q.weight;
                if (ans !== null) scores[q.category] += (ans + 1) * w;
                maxScores[q.category] += 4 * w;
            });
            const perc = {};
            for (let cat in scores) perc[cat] = maxScores[cat] > 0 ? Math.round((scores[cat] / maxScores[cat]) * 100) : 0;
            const sorted = Object.entries(perc).map(([k, v]) => ({ key: k, name: specialties[k].name, percentage: v, icon: specialties[k].icon, color: specialties[k].color, description: specialties[k].description })).sort((a,b) => b.percentage - a.percentage);
            return { percentages: perc, sortedSpecialties: sorted };
        };

        const drawChart = (percentages) => {
            const canvas = document.getElementById('scoreChart');
            if (!canvas) return;
            const ctx = canvas.getContext('2d');
            const w = 150, h = 150;
            canvas.width = w; canvas.height = h;
            const cx = w/2, cy = h/2, r = 65;
            const avg = (percentages.ai + percentages.cs + percentages.data + percentages.cyber) / 4;
            ctx.clearRect(0, 0, w, h);
            ctx.beginPath();
            ctx.arc(cx, cy, r, 0, 2*Math.PI);
            ctx.fillStyle = '#e2e8f0';
            ctx.fill();
            const angle = (avg/100) * 2*Math.PI;
            ctx.beginPath();
            ctx.arc(cx, cy, r, -Math.PI/2, -Math.PI/2 + angle);
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#1e3a8a';
            ctx.fill();
            ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--dark').trim() || '#0f172a';
            ctx.font = 'bold 24px Cairo';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(`${Math.round(avg)}%`, cx, cy);
            ctx.font = '12px Cairo';
            ctx.fillStyle = '#64748b';
            ctx.fillText('التطابق الكلي', cx, cy + 30);
        };

        const showResults = () => {
            const unanswered = userAnswers.filter(a => a === null).length;
            if (unanswered > 0) {
                showToast(`⚠️ لم تقم بالإجابة على ${unanswered} سؤال من أصل ${questions.length}. يرجى إكمال جميع الأسئلة.`, 'error');
                return false;
            }
            const { percentages, sortedSpecialties } = calculateResults();
            document.getElementById('examSection').classList.add('hidden');
            document.getElementById('resultsSection').classList.remove('hidden');
            drawChart(percentages);

            const rankContainer = document.getElementById('specialtyRank');
            if (rankContainer) {
                rankContainer.innerHTML = '';
                sortedSpecialties.forEach((spec, idx) => {
                    const item = document.createElement('div');
                    item.className = 'rank-item';
                    item.innerHTML = `<div class="rank-number ${idx === 0 ? 'top1' : idx === 1 ? 'top2' : idx === 2 ? 'top3' : ''}">${idx+1}</div>
                        <div class="rank-info"><div class="rank-title"><i class="fa-solid ${spec.icon}"></i> ${spec.name}</div><div class="rank-description">${spec.description}</div></div>
                        <div class="rank-score">${spec.percentage}%</div>`;
                    rankContainer.appendChild(item);
                });
                const top = sortedSpecialties[0];
                const rec = document.createElement('div');
                rec.className = 'recommendation-box';
                rec.innerHTML = `<i class="fa-solid fa-star" style="color:#fbbf24;"></i> <strong>التخصص الأكثر توافقاً مع قدراتك:</strong> <span style="color:${top.color};font-size:1.2rem;font-weight:bold;">${top.name}</span><br><small>بنسبة تطابق ${top.percentage}%</small>`;
                rankContainer.appendChild(rec);
            }
            return true;
        };

        const restartExam = () => {
            userAnswers.fill(null);
            currentIndex = 0;
            renderQuestion();
            document.getElementById('examSection').classList.remove('hidden');
            document.getElementById('resultsSection').classList.add('hidden');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        const validateCurrent = () => {
            if (userAnswers[currentIndex] === null) {
                showToast('يرجى الإجابة على السؤال الحالي أولاً', 'error');
                return false;
            }
            return true;
        };

        const success = await loadQuestionsFromBatchFile();
        if (!success || questions.length === 0) {
            examSection.innerHTML = '<div class="exam-container"><div class="result-card" style="text-align:center;padding:3rem;"><i class="fa-solid fa-circle-exclamation" style="font-size:4rem;color:#ef4444;"></i><h2>خطأ في تحميل الاختبار</h2><p>لم يتم العثور على ملف الأسئلة questions.bat في مجلد js.</p><a href="index.html" class="register-link" style="display:inline-block;margin-top:1rem;">العودة للرئيسية</a></div></div>';
            return;
        }
        
        userAnswers = new Array(questions.length).fill(null);
        renderQuestion();
        
        document.getElementById('nextBtn')?.addEventListener('click', () => {
            if (currentIndex === questions.length - 1) { 
                if (validateCurrent()) showResults(); 
            } else { 
                if (validateCurrent()) { 
                    currentIndex++; 
                    renderQuestion(); 
                } 
            }
        });
        document.getElementById('prevBtn')?.addEventListener('click', () => { 
            if (currentIndex > 0) { 
                currentIndex--; 
                renderQuestion(); 
            } 
        });
        document.getElementById('restartBtn')?.addEventListener('click', restartExam);
    };

    // 9. قائمة الهامبرجر للشاشات الصغيرة
    const initMobileMenu = () => {
        const toggleBtn = document.getElementById('mobileMenuToggle');
        const nav = document.querySelector('nav');
        
        if (!toggleBtn || !nav) return;
        
        toggleBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            const icon = toggleBtn.querySelector('i');
            if (icon) {
                if (nav.classList.contains('active')) {
                    icon.className = 'fa-solid fa-xmark';
                } else {
                    icon.className = 'fa-solid fa-bars';
                }
            }
        });
        
        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                const icon = toggleBtn.querySelector('i');
                if (icon) icon.className = 'fa-solid fa-bars';
            });
        });
    };

    // 10. روابط وسائل التواصل الاجتماعي
    const initSocialLinks = () => {
        const urls = {
            'fa-facebook-f': 'https://www.facebook.com/',
            'fa-twitter': 'https://twitter.com/',
            'fa-instagram': 'https://www.instagram.com/',
            'fa-linkedin-in': 'https://www.linkedin.com/'
        };
        document.querySelectorAll('.social-links a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = link.querySelector('i');
                if (icon) {
                    for (const [cls, url] of Object.entries(urls)) {
                        if (icon.classList.contains(cls)) {
                            window.open(url, '_blank');
                            break;
                        }
                    }
                }
            });
        });
    };

    // 11. تشغيل جميع الوظائف عند تحميل الصفحة
    initDarkMode();
    setActiveNavLink();
    initScrollTop();
    initRegistration();
    initContactForm();
    initFaq();
    initAptitudeTest();
    initMobileMenu();
    initSocialLinks();
})();