class ModalManager {
    constructor() {
        this.modal = document.getElementById('login-modal');
        this.init();
    }

    init() {
        try {
            // 事件委托处理登录模态框
            document.body.addEventListener('click', (e) => {
                if (e.target.matches('#open-login')) {
                    this.showModal();
                } else if (e.target.matches('#close-login')) {
                    this.hideModal();
                }
            });
        } catch (error) {
            console.error('Modal initialization failed:', error);
        }
    }

    showModal() {
        try {
            this.modal.style.display = 'flex';
        } catch (error) {
            console.error('Error showing modal:', error);
        }
    }

    hideModal() {
        try {
            this.modal.style.display = 'none';
        } catch (error) {
            console.error('Error hiding modal:', error);
        }
    }
}

class ScrollManager {
    constructor() {
        this.sections = document.querySelectorAll('section');
        this.backToTopButton = document.getElementById('back-to-top');
        this.lastScrollTime = 0;
        this.throttleDelay = 100;
        this.init();
    }

    init() {
        try {
            // 节流处理滚动事件
            window.addEventListener('scroll', () => {
                const now = Date.now();
                if (now - this.lastScrollTime >= this.throttleDelay) {
                    this.handleScroll();
                    this.lastScrollTime = now;
                }
            });

            this.backToTopButton.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });
        } catch (error) {
            console.error('Scroll manager initialization failed:', error);
        }
    }

    handleScroll() {
        try {
            let current = '';
            this.sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (pageYOffset >= sectionTop - sectionHeight / 3) {
                    current = section.getAttribute('id');
                }
            });

            document.querySelectorAll('.nav-links a').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href').slice(1) === current) {
                    link.classList.add('active');
                }
            });

            this.backToTopButton.style.display = window.pageYOffset > 300 ? 'block' : 'none';
        } catch (error) {
            console.error('Error handling scroll:', error);
        }
    }
}

class FormManager {
    constructor() {
        this.contactForm = document.getElementById('contact-form');
        this.init();
    }

    init() {
        try {
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });
        } catch (error) {
            console.error('Form manager initialization failed:', error);
        }
    }

    handleSubmit() {
        try {
            alert('感谢您的留言！我们会尽快回复您。');
            this.contactForm.reset();
        } catch (error) {
            console.error('Error handling form submission:', error);
        }
    }
}

class NavigationManager {
    constructor() {
        this.burger = document.querySelector('.burger');
        this.nav = document.querySelector('.nav-links');
        this.init();
    }

    init() {
        try {
            this.burger.addEventListener('click', () => {
                this.toggleNavigation();
            });
        } catch (error) {
            console.error('Navigation manager initialization failed:', error);
        }
    }

    toggleNavigation() {
        try {
            this.nav.classList.toggle('nav-active');
            this.burger.classList.toggle('toggle');
        } catch (error) {
            console.error('Error toggling navigation:', error);
        }
    }
}

// Initialize Swiper
const swiper = new Swiper('.swiper', {
    loop: true,
    pagination: {
        el: '.swiper-pagination',
    },
    navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
    },
    autoplay: {
        delay: 5000,
    },
});

// Initialize managers
document.addEventListener('DOMContentLoaded', () => {
    new ModalManager();
    new ScrollManager();
    new FormManager();
    new NavigationManager();
});
