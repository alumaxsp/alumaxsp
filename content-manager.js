// Content Manager - Sistema de gerenciamento de conteúdo avançado
const ContentManager = {
  API_URL: 'http://localhost:3000',
  adminPassword: null,

  // Inicializar o gerenciador
  async init() {
    this.adminPassword = localStorage.getItem('adminPassword');
    if (!this.adminPassword) {
      console.error('Sem autenticação');
      return;
    }
    await this.loadContent();
  },

  // Carregar conteúdo do servidor
  async loadContent() {
    try {
      const response = await fetch(`${this.API_URL}/api/data/public`);
      if (!response.ok) throw new Error('Erro ao carregar dados');
      
      const data = await response.json();
      console.log('✅ Dados carregados:', data);
      this.renderContent(data);
      return data;
    } catch (error) {
      console.error('❌ Erro ao carregar conteúdo:', error);
      return null;
    }
  },

  // Renderizar conteúdo na página
  renderContent(data) {
    // 1. Atualizar SITE
    if (data.site) {
      document.title = data.site.title || document.title;
      const descMeta = document.querySelector('meta[name="description"]');
      if (descMeta) descMeta.setAttribute('content', data.site.description || '');
    }

    // 2. Atualizar HERO
    if (data.hero) {
      // Badge
      const badgeSpan = document.querySelector('.hero-badge span');
      if (badgeSpan) badgeSpan.textContent = data.hero.badge || '';

      // Título
      const heroH1 = document.querySelector('.hero-content h1');
      if (heroH1) {
        heroH1.innerHTML = (data.hero.title || '') + ' <span class="text-gradient">Sob Medida</span> com Qualidade e Acabamento Profissional.';
      }

      // Descrição
      const heroDesc = document.querySelector('.hero-desc');
      if (heroDesc) {
        heroDesc.textContent = data.hero.description || '';
      }

      // CTA Primário (WhatsApp)
      const ctaBtns = document.querySelectorAll('.btn-whatsapp');
      ctaBtns.forEach(btn => {
        const text = data.hero.cta_primary || 'Solicitar Orçamento';
        const icon = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>';
        btn.innerHTML = icon + '\n          ' + text;
      });
    }

    // 3. Atualizar DIFERENCIAIS
    if (data.diferenciais) {
      const difHeader = document.querySelector('#diferenciais .section-header h2');
      if (difHeader) difHeader.textContent = data.diferenciais.title || '';

      const difGrid = document.querySelector('.diferenciais-grid');
      if (difGrid && data.diferenciais.items && data.diferenciais.items.length > 0) {
        difGrid.innerHTML = '';
        data.diferenciais.items.forEach(item => {
          const card = document.createElement('div');
          card.className = 'dif-card';
          card.innerHTML = `
            <div class="dif-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="m8 12 2 2 4-4"/>
              </svg>
            </div>
            <h3>${this.escapeHtml(item.title)}</h3>
            <p>${this.escapeHtml(item.description)}</p>
          `;
          difGrid.appendChild(card);
        });
      }
    }

    // 4. Atualizar SERVIÇOS
    if (data.servicos && data.servicos.length > 0) {
      const servicosList = document.querySelector('.servicos-list');
      if (servicosList) {
        servicosList.innerHTML = '';
        data.servicos.forEach(servico => {
          const imagemPath = servico.imagem || `assets/servico-${servico.title.toLowerCase().replace(/\s+/g, '-')}.jpg`;
          const card = document.createElement('div');
          card.className = 'servico-card';
          card.innerHTML = `
            <div class="img-wrap">
              <img src="${imagemPath}" alt="${this.escapeHtml(servico.title)}" loading="lazy" onerror="this.src='assets/hero-bg.jpg'">
              <span class="servico-tag">${servico.categoria || 'Profissional'}</span>
            </div>
            <div class="content">
              <h3>${this.escapeHtml(servico.title)}</h3>
              <p>${this.escapeHtml(servico.description)}</p>
            </div>
          `;
          servicosList.appendChild(card);
        });
      }
    }

    // 5. Atualizar SOBRE
    if (data.sobre) {
      const sobreH2 = document.querySelector('#sobre .inst-title');
      if (sobreH2) sobreH2.textContent = data.sobre.title || '';

      const sobreP = document.querySelector('#sobre .inst-desc');
      if (sobreP) sobreP.innerHTML = data.sobre.description || '';

      // Estatísticas
      if (data.sobre.stats) {
        const bigNum = document.querySelector('#instStats .inst-big-number');
        if (bigNum) bigNum.textContent = data.sobre.stats.years || 0;

        const projectsNum = document.querySelector('#instStats .inst-small-stats .num');
        if (projectsNum) projectsNum.textContent = data.sobre.stats.projects || 0;
      }
    }

    // 6. Atualizar RODAPÉ
    if (data.footer) {
      const footerBottom = document.querySelector('.footer .bottom p');
      if (footerBottom) footerBottom.textContent = data.footer.copyright || '';
    }

    // 7. Atualizar Links WhatsApp globalmente
    if (data.site && data.site.phone) {
      const waLinks = document.querySelectorAll('a[href*="wa.me"]');
      waLinks.forEach(link => {
        const message = 'Olá!%20Gostaria%20de%20solicitar%20um%20orçamento.';
        link.href = `https://wa.me/${data.site.phone}?text=${message}`;
      });
    }

    console.log('✅ Conteúdo renderizado com sucesso!');
  },

  // Escapar caracteres HTML
  escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
  },

  // Salvar conteúdo
  async saveContent(data) {
    try {
      const response = await fetch(`${this.API_URL}/api/data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': this.adminPassword
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) throw new Error('Erro ao salvar');
      
      const result = await response.json();
      console.log('✅ Salvo com sucesso!', result);
      
      // Recarregar conteúdo
      await this.loadContent();
      return true;
    } catch (error) {
      console.error('❌ Erro ao salvar:', error);
      return false;
    }
  },

  // Upload de imagem
  async uploadImage(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target.result);
      };
      reader.readAsDataURL(file);
    });
  }
};

// Inicializar quando a página carregar
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    ContentManager.init();
  });
} else {
  ContentManager.init();
}
