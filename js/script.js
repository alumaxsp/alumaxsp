/* ============================================
   ALUMAX SP - JavaScript
   ============================================ */

// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const navbarMenu = document.querySelector('.navbar-menu');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    navbarMenu.classList.toggle('active');
  });

  // Fechar menu ao clicar em um link
  document.querySelectorAll('.navbar-menu a').forEach(link => {
    link.addEventListener('click', () => {
      navbarMenu.classList.remove('active');
    });
  });
}

// Intersection Observer para animações fade-in
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Aplicar observer em elementos com classe fade-in-up
document.querySelectorAll('.fade-in-up').forEach(el => {
  observer.observe(el);
});

// Smooth scroll para links internos
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
let lastScrollTop = 0;

window.addEventListener('scroll', () => {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  if (scrollTop > 100) {
    navbar.style.boxShadow = '0 4px 16px rgba(15, 58, 125, 0.2)';
  } else {
    navbar.style.boxShadow = '0 4px 16px rgba(15, 58, 125, 0.15)';
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// WhatsApp CTA
function openWhatsApp(message = '') {
  const phone = '5511987654321'; // Substituir com número real
  const text = encodeURIComponent(message || 'Olá! Gostaria de saber mais sobre os serviços da ALUMAX SP.');
  window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
}

// Instagram CTA
function openInstagram() {
  window.open('https://www.instagram.com/alumaxsp?igsh=MXJpcnk2OTR2YWo3dg==', '_blank');
}

// Contador de números (para stats)
function animateCounter(element, target, duration = 2000) {
  let current = 0;
  const increment = target / (duration / 16);
  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Iniciar contadores quando visíveis
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !entry.target.dataset.animated) {
      entry.target.dataset.animated = 'true';
      const target = parseInt(entry.target.textContent);
      animateCounter(entry.target, target);
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-number').forEach(el => {
  statsObserver.observe(el);
});

// Galeria lightbox simples
function openGalleryItem(imageSrc, title) {
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.innerHTML = `
    <div class="lightbox-content">
      <button class="lightbox-close">&times;</button>
      <img src="${imageSrc}" alt="${title}">
      <p>${title}</p>
    </div>
  `;
  
  document.body.appendChild(lightbox);
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.remove();
    }
  });
}

// Adicionar CSS para lightbox dinamicamente
const lightboxStyle = document.createElement('style');
lightboxStyle.textContent = `
  .lightbox {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 2000;
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }

  .lightbox-content {
    position: relative;
    max-width: 90%;
    max-height: 90vh;
    background: white;
    border-radius: 8px;
    overflow: hidden;
  }

  .lightbox-content img {
    width: 100%;
    height: auto;
    display: block;
  }

  .lightbox-content p {
    padding: 20px;
    text-align: center;
    color: #333;
    margin: 0;
  }

  .lightbox-close {
    position: absolute;
    top: 10px;
    right: 10px;
    background: rgba(0, 0, 0, 0.7);
    color: white;
    border: none;
    width: 40px;
    height: 40px;
    border-radius: 50%;
    font-size: 28px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background 0.3s;
    z-index: 2001;
  }

  .lightbox-close:hover {
    background: rgba(0, 0, 0, 0.9);
  }
`;
document.head.appendChild(lightboxStyle);

// Form validation
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return false;

  const inputs = form.querySelectorAll('input, textarea');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = '#e74c3c';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

// Scroll to top button
const scrollTopBtn = document.createElement('button');
scrollTopBtn.innerHTML = '↑';
scrollTopBtn.className = 'scroll-top-btn';
scrollTopBtn.style.cssText = `
  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #00bcd4, #0f3a7d);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: none;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  z-index: 999;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(15, 58, 125, 0.2);
`;

document.body.appendChild(scrollTopBtn);

window.addEventListener('scroll', () => {
  if (window.pageYOffset > 300) {
    scrollTopBtn.style.display = 'flex';
  } else {
    scrollTopBtn.style.display = 'none';
  }
});

scrollTopBtn.addEventListener('click', () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

scrollTopBtn.addEventListener('mouseover', () => {
  scrollTopBtn.style.transform = 'scale(1.1)';
});

scrollTopBtn.addEventListener('mouseout', () => {
  scrollTopBtn.style.transform = 'scale(1)';
});

// Lazy loading de imagens
if ('IntersectionObserver' in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll('img.lazy').forEach(img => {
    imageObserver.observe(img);
  });
}

console.log('ALUMAX SP - Script carregado com sucesso!');
