// ============================================
// ADMIN v2 - JavaScript Logic
// ============================================

const API_URL = 'http://localhost:3000';
const PASSWORD_HEADER = 'x-admin-password';
let currentPassword = '';
let currentData = {};

// ============================================
// AUTHENTICATION
// ============================================

function handleLogin() {
  const password = document.getElementById('passwordInput').value;
  const errorDiv = document.getElementById('loginError');
  
  if (!password) {
    showError(errorDiv, 'Por favor, digite a senha');
    return;
  }

  if (password === '0000') {
    currentPassword = password;
    localStorage.setItem('admin_session', password);
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('adminContainer').classList.remove('hidden');
    loadData();
  } else {
    showError(errorDiv, '❌ Senha incorreta!');
  }
}

function handleLogout() {
  if (confirm('Tem certeza que deseja sair?')) {
    localStorage.removeItem('admin_session');
    currentPassword = '';
    currentData = {};
    document.getElementById('adminContainer').classList.add('hidden');
    document.getElementById('loginContainer').classList.remove('hidden');
    document.getElementById('passwordInput').value = '';
  }
}

function checkSession() {
  const session = localStorage.getItem('admin_session');
  if (session === '0000') {
    currentPassword = session;
    document.getElementById('loginContainer').classList.add('hidden');
    document.getElementById('adminContainer').classList.remove('hidden');
    loadData();
  }
}

// ============================================
// DATA MANAGEMENT
// ============================================

async function loadData() {
  try {
    const headers = {};
    headers[PASSWORD_HEADER] = currentPassword;
    
    const response = await fetch(`${API_URL}/api/data`, { headers });
    if (!response.ok) throw new Error('Erro ao carregar dados');
    
    currentData = await response.json();
    populateForm();
  } catch (error) {
    console.error('Erro ao carregar dados:', error);
    showError(document.getElementById('errorMsg'), 'Erro ao conectar com servidor');
  }
}

function reloadData() {
  loadData();
  showSuccess(document.getElementById('successMsg'), '✅ Dados recarregados!');
}

async function saveSection(section) {
  try {
    const headers = {};
    headers[PASSWORD_HEADER] = currentPassword;
    headers['Content-Type'] = 'application/json';
    
    // Coletar dados do formulário
    collectFormData(section);
    
    const response = await fetch(`${API_URL}/api/data`, {
      method: 'POST',
      headers,
      body: JSON.stringify(currentData)
    });

    if (!response.ok) throw new Error('Erro ao salvar');
    
    showSuccess(document.getElementById('successMsg'), `✅ ${section.toUpperCase()} salvo com sucesso!`);
    setTimeout(() => window.open('http://localhost:3000', 'site'), 500);
  } catch (error) {
    console.error('Erro ao salvar:', error);
    showError(document.getElementById('errorMsg'), 'Erro ao salvar dados. Tente novamente.');
  }
}

// ============================================
// FORM POPULATION
// ============================================

function populateForm() {
  // Site
  document.getElementById('siteTitle').value = currentData.site?.title || '';
  document.getElementById('sitePhone').value = currentData.site?.phone || '';
  document.getElementById('siteDescription').value = currentData.site?.description || '';

  // Hero
  document.getElementById('heroBadge').value = currentData.hero?.badge || '';
  document.getElementById('heroTitle').value = currentData.hero?.title || '';
  document.getElementById('heroDescription').value = currentData.hero?.description || '';
  document.getElementById('heroCtaPrimary').value = currentData.hero?.cta_primary || '';
  document.getElementById('heroCtaSecondary').value = currentData.hero?.cta_secondary || '';

  // Diferenciais
  document.getElementById('difTitle').value = currentData.diferenciais?.title || '';
  document.getElementById('difDescription').value = currentData.diferenciais?.description || '';
  renderDiferenciais();

  // Serviços
  renderServicos();

  // Sobre
  document.getElementById('sobreTitle').value = currentData.sobre?.title || '';
  document.getElementById('sobreDescription').value = currentData.sobre?.description || '';
  document.getElementById('sobreYears').value = currentData.sobre?.stats?.years || '';
  document.getElementById('sobreProjects').value = currentData.sobre?.stats?.projects || '';

  // Footer
  document.getElementById('footerCopyright').value = currentData.footer?.copyright || '';
  document.getElementById('footerAddress').value = currentData.footer?.address || '';
  document.getElementById('footerEmail').value = currentData.footer?.email || '';
}

function collectFormData(section) {
  if (section === 'site') {
    currentData.site = {
      title: document.getElementById('siteTitle').value,
      phone: document.getElementById('sitePhone').value,
      description: document.getElementById('siteDescription').value
    };
  }
  
  if (section === 'hero') {
    currentData.hero = {
      badge: document.getElementById('heroBadge').value,
      title: document.getElementById('heroTitle').value,
      description: document.getElementById('heroDescription').value,
      cta_primary: document.getElementById('heroCtaPrimary').value,
      cta_secondary: document.getElementById('heroCtaSecondary').value
    };
  }

  if (section === 'diferenciais') {
    currentData.diferenciais = {
      title: document.getElementById('difTitle').value,
      description: document.getElementById('difDescription').value,
      items: collectDiferenciais()
    };
  }

  if (section === 'servicos') {
    currentData.servicos = collectServicos();
  }

  if (section === 'sobre') {
    currentData.sobre = {
      title: document.getElementById('sobreTitle').value,
      description: document.getElementById('sobreDescription').value,
      stats: {
        years: parseInt(document.getElementById('sobreYears').value) || 0,
        projects: parseInt(document.getElementById('sobreProjects').value) || 0
      }
    };
  }

  if (section === 'footer') {
    currentData.footer = {
      copyright: document.getElementById('footerCopyright').value,
      address: document.getElementById('footerAddress').value,
      email: document.getElementById('footerEmail').value
    };
  }
}

// ============================================
// DIFERENCIAIS MANAGEMENT
// ============================================

function renderDiferenciais() {
  const container = document.getElementById('diferenciaisItems');
  const items = currentData.diferenciais?.items || [];
  
  container.innerHTML = '';
  items.forEach((item, index) => {
    container.innerHTML += `
      <div class="item">
        <div style="display: grid; gap: 10px;">
          <input type="text" value="${item.title || ''}" placeholder="Título do diferencial"
            onchange="updateDiferencial(${index}, 'title', this.value)"/>
          <textarea placeholder="Descrição" rows="2"
            onchange="updateDiferencial(${index}, 'description', this.value)">${item.description || ''}</textarea>
          <button class="btn-delete" onclick="deleteDiferencial(${index})">🗑️ Remover</button>
        </div>
      </div>
    `;
  });
}

function updateDiferencial(index, field, value) {
  if (!currentData.diferenciais) currentData.diferenciais = { items: [] };
  if (!currentData.diferenciais.items[index]) currentData.diferenciais.items[index] = {};
  currentData.diferenciais.items[index][field] = value;
}

function deleteDiferencial(index) {
  if (confirm('Tem certeza?')) {
    currentData.diferenciais.items.splice(index, 1);
    renderDiferenciais();
  }
}

function addDiferencial() {
  if (!currentData.diferenciais) currentData.diferenciais = { items: [] };
  currentData.diferenciais.items.push({ title: '', description: '' });
  renderDiferenciais();
}

function collectDiferenciais() {
  const items = [];
  document.querySelectorAll('#diferenciaisItems .item').forEach((el, index) => {
    const inputs = el.querySelectorAll('input, textarea');
    items.push({
      title: inputs[0].value,
      description: inputs[1].value
    });
  });
  return items;
}

// ============================================
// SERVIÇOS MANAGEMENT
// ============================================

function renderServicos() {
  const container = document.getElementById('servicosItems');
  const items = currentData.servicos || [];
  
  container.innerHTML = '';
  items.forEach((item, index) => {
    container.innerHTML += `
      <div class="item">
        <div style="display: grid; gap: 10px;">
          <input type="text" value="${item.title || ''}" placeholder="Título do serviço"
            onchange="updateServico(${index}, 'title', this.value)"/>
          <textarea placeholder="Descrição" rows="2"
            onchange="updateServico(${index}, 'description', this.value)">${item.description || ''}</textarea>
          <input type="text" value="${item.categoria || ''}" placeholder="Categoria"
            onchange="updateServico(${index}, 'categoria', this.value)"/>
          <button class="btn-delete" onclick="deleteServico(${index})">🗑️ Remover</button>
        </div>
      </div>
    `;
  });
}

function updateServico(index, field, value) {
  if (!currentData.servicos) currentData.servicos = [];
  if (!currentData.servicos[index]) currentData.servicos[index] = {};
  currentData.servicos[index][field] = value;
}

function deleteServico(index) {
  if (confirm('Tem certeza?')) {
    currentData.servicos.splice(index, 1);
    renderServicos();
  }
}

function addServico() {
  if (!currentData.servicos) currentData.servicos = [];
  currentData.servicos.push({ title: '', description: '', categoria: '' });
  renderServicos();
}

function collectServicos() {
  const items = [];
  document.querySelectorAll('#servicosItems .item').forEach((el) => {
    const inputs = el.querySelectorAll('input, textarea');
    items.push({
      title: inputs[0].value,
      description: inputs[1].value,
      categoria: inputs[2].value
    });
  });
  return items;
}

// ============================================
// UI HELPERS
// ============================================

function switchSection(section) {
  // Esconder todas as seções
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  
  // Mostrar a seção selecionada
  const sectionMap = {
    'site': 'siteSection',
    'hero': 'heroSection',
    'diferenciais': 'diferenciaisSection',
    'servicos': 'servicosSection',
    'sobre': 'sobreSection',
    'footer': 'footerSection'
  };
  
  if (sectionMap[section]) {
    document.getElementById(sectionMap[section]).classList.add('active');
  }

  // Atualizar botão ativo
  document.querySelectorAll('.sidebar-btn').forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');
}

function showError(element, message) {
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 4000);
}

function showSuccess(element, message) {
  element.textContent = message;
  element.classList.add('show');
  setTimeout(() => element.classList.remove('show'), 3000);
}

// ============================================
// INIT
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  checkSession();
  
  // Fechar mensagens ao clicar fora
  document.addEventListener('click', (e) => {
    if (e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA' && e.target.tagName !== 'BUTTON') {
      // Reset
    }
  });
});

// Permitir Enter em inputs
document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter' && e.target.id === 'passwordInput') {
    handleLogin();
  }
});
