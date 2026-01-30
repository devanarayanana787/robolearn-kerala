/**
 * RoboLearn Kerala - Main JavaScript
 * Handles navigation, animations, and interactivity
 */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function () {
    initNavigation();
    initScrollAnimations();
    initSmoothScroll();
    initDarkModeToggle();
});

/**
 * Navigation functionality
 */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('navToggle');
    const navMobile = document.getElementById('navMobile');

    // Scroll effect for navbar
    if (navbar) {
        window.addEventListener('scroll', function () {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Mobile navigation toggle
    if (navToggle && navMobile) {
        navToggle.addEventListener('click', function () {
            navMobile.classList.toggle('active');
            navToggle.classList.toggle('active');

            // Animate hamburger to X
            const spans = navToggle.querySelectorAll('span');
            if (navMobile.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });

        // Close mobile nav when clicking links
        const mobileLinks = navMobile.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
                navMobile.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            });
        });
    }
}

/**
 * Scroll reveal animations
 */
function initScrollAnimations() {
    const revealElements = document.querySelectorAll('.reveal');

    const revealOnScroll = function () {
        const windowHeight = window.innerHeight;
        const revealPoint = 150;

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - revealPoint) {
                element.classList.add('active');
            }
        });
    };

    // Initial check
    revealOnScroll();

    // Check on scroll
    window.addEventListener('scroll', revealOnScroll);
}

/**
 * Smooth scroll for anchor links
 */
function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            // Skip if just # or empty
            if (href === '#' || href === '') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const navbarHeight = document.getElementById('navbar')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - navbarHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

/**
 * Dark mode toggle (future enhancement)
 */
function initDarkModeToggle() {
    // Check for saved preference or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Default to dark mode as designed
    const theme = savedTheme || (systemPrefersDark ? 'dark' : 'dark');
    document.documentElement.setAttribute('data-theme', theme);

    // Listen for system preference changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        if (!localStorage.getItem('theme')) {
            document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        }
    });
}

/**
 * Toggle theme function for dark mode button
 */
function toggleTheme() {
    const html = document.documentElement;
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

/**
 * Form validation helper
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
    return re.test(phone);
}

function validateForm(formElement) {
    const inputs = formElement.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;

    inputs.forEach(input => {
        // Remove previous error states
        input.classList.remove('error');

        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        }

        // Email validation
        if (input.type === 'email' && input.value && !validateEmail(input.value)) {
            input.classList.add('error');
            isValid = false;
        }

        // Phone validation
        if (input.type === 'tel' && input.value && !validatePhone(input.value)) {
            input.classList.add('error');
            isValid = false;
        }
    });

    return isValid;
}

/**
 * Toast notification
 */
function showToast(message, type = 'info') {
    // Remove existing toasts
    const existingToast = document.querySelector('.toast');
    if (existingToast) {
        existingToast.remove();
    }

    // Create toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
    <span>${message}</span>
    <button onclick="this.parentElement.remove()">✕</button>
  `;

    // Add styles
    toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 16px 24px;
    background: ${type === 'success' ? 'var(--success)' : type === 'error' ? 'var(--error)' : 'var(--primary)'};
    color: white;
    border-radius: var(--radius-lg);
    display: flex;
    align-items: center;
    gap: 12px;
    box-shadow: var(--shadow-lg);
    z-index: 9999;
    animation: slideInRight 0.3s ease;
  `;

    document.body.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => toast.remove(), 300);
        }
    }, 5000);
}

/**
 * Loading spinner
 */
function showLoading(element) {
    if (!element) return;

    element.dataset.originalContent = element.innerHTML;
    element.innerHTML = '<span class="spinner"></span> Loading...';
    element.disabled = true;
}

function hideLoading(element) {
    if (!element) return;

    element.innerHTML = element.dataset.originalContent || element.innerHTML;
    element.disabled = false;
}

/**
 * Sidebar toggle for dashboard pages
 */
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('open');
    }
}

/**
 * Export functions for global use
 */
window.RoboLearn = {
    toggleTheme,
    validateForm,
    showToast,
    showLoading,
    hideLoading,
    toggleSidebar
};
