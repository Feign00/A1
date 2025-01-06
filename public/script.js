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
            // 表单提交事件
            this.contactForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleSubmit();
            });

            // 实时输入验证
            this.contactForm.querySelectorAll('input, textarea').forEach(input => {
                input.addEventListener('input', () => {
                    this.clearValidationErrors();
                    const value = input.value.trim();
                    
                    if (input.name === 'name' && value.length > 0 && value.length < 2) {
                        this.showValidationError('name', '姓名至少需要2个字符');
                    }
                    
                    if (input.name === 'email' && value.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                        this.showValidationError('email', '请输入有效的邮箱地址');
                    }
                    
                    if (input.name === 'message' && value.length > 0 && value.length < 10) {
                        this.showValidationError('message', '留言内容至少需要10个字符');
                    }
                });
            });
        } catch (error) {
            console.error('Form manager initialization failed:', error);
        }
    }

    clearValidationErrors() {
        // 清除所有错误状态
        this.contactForm.querySelectorAll('.error').forEach(el => {
            el.classList.remove('error');
        });
        this.contactForm.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
        });
    }

    showValidationError(fieldName, message) {
        // 显示单个字段的错误提示
        const input = this.contactForm.querySelector(`[name="${fieldName}"]`);
        const errorMessage = input.nextElementSibling;
        
        if (input && errorMessage && errorMessage.classList.contains('error-message')) {
            input.classList.add('error');
            errorMessage.textContent = message;
            errorMessage.style.display = 'block';
        }
    }

    async handleSubmit() {
        try {
            // 检查网络连接
            if (!navigator.onLine) {
                throw new Error('网络连接不可用，请检查您的网络设置');
            }

            // 清除之前的错误状态
            this.clearValidationErrors();
            
            // 获取表单数据
            const formData = new FormData(this.contactForm);
            const submitButton = this.contactForm.querySelector('button[type="submit"]');
            
            // 表单验证
            const name = formData.get('name')?.trim();
            const email = formData.get('email')?.trim();
            const message = formData.get('message')?.trim();
            
            let isValid = true;
            
            if (!name || name.length < 2) {
                this.showValidationError('name', '请输入有效的姓名（至少2个字符）');
                isValid = false;
            }
            
            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                this.showValidationError('email', '请输入有效的邮箱地址');
                isValid = false;
            }
            
            if (!message || message.length < 10) {
                this.showValidationError('message', '留言内容至少需要10个字符');
                isValid = false;
            }
            
            if (!isValid) {
                throw new Error('表单验证失败');
            }

            // 设置加载状态
            submitButton.classList.add('loading');
            submitButton.disabled = true;
            submitButton.textContent = '发送中...';

            try {
                // 模拟发送请求
                const response = await fetch('https://example.com/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: formData.get('name'),
                        email: formData.get('email'),
                        message: formData.get('message')
                    })
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `请求失败，状态码：${response.status}`);
                }

                const result = await response.json();
                
                // 显示成功提示
                ToastManager.show({
                    type: 'success',
                    message: result.message || '感谢您的留言！我们会尽快回复您。',
                    duration: 3000
                });
                
                this.contactForm.reset();
            } catch (fetchError) {
                console.error('请求失败:', fetchError);
                throw new Error(`请求失败：${fetchError.message}`);
            }
        } catch (error) {
            console.error('表单提交错误:', error);
            
            // 显示详细的错误提示
            ToastManager.show({
                type: 'error',
                message: error.message || '提交失败，请稍后重试',
                duration: 5000
            });
        } finally {
            const submitButton = this.contactForm.querySelector('button[type="submit"]');
            submitButton.disabled = false;
            submitButton.textContent = '发送消息';
            submitButton.classList.remove('loading');
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

class ToastManager {
    static queue = [];
    static container = null;
    static defaultOptions = {
        type: 'info',
        message: '',
        duration: 3000,
        position: 'bottom-right'
    };

    static init() {
        // 创建容器
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
    }

    static show(options) {
        // 合并默认选项
        const config = { ...this.defaultOptions, ...options };
        
        // 创建toast元素
        const toast = document.createElement('div');
        toast.className = `toast ${config.type}`;
        toast.textContent = config.message;
        
        // 添加到容器
        this.container.appendChild(toast);
        
        // 触发动画
        setTimeout(() => {
            toast.classList.add('show');
        }, 10);
        
        // 自动隐藏
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 300);
        }, config.duration);
    }
}

// Initialize managers
document.addEventListener('DOMContentLoaded', () => {
    ToastManager.init();
    new ModalManager();
    new ScrollManager();
    new FormManager();
    new NavigationManager();
});
