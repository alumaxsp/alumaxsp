#!/usr/bin/env node

/**
 * 🧪 Script de Teste - ALUMAX SP v2
 * Valida se todo o sistema está configurado corretamente
 */

const fs = require('fs');
const path = require('path');

console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log('║                  🧪 TESTE DO SISTEMA - ALUMAX SP v2                       ║');
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

let passed = 0;
let failed = 0;

function checkFile(filename, description) {
  const filepath = path.join(__dirname, filename);
  if (fs.existsSync(filepath)) {
    console.log(`✅ ${description}`);
    console.log(`   └─ ${filename} (${fs.statSync(filepath).size} bytes)\n`);
    passed++;
    return true;
  } else {
    console.log(`❌ ${description}`);
    console.log(`   └─ Arquivo não encontrado: ${filename}\n`);
    failed++;
    return false;
  }
}

function checkJson(filename) {
  const filepath = path.join(__dirname, filename);
  try {
    const content = fs.readFileSync(filepath, 'utf8');
    JSON.parse(content);
    console.log(`✅ ${filename} - JSON válido\n`);
    passed++;
    return true;
  } catch (error) {
    console.log(`❌ ${filename} - JSON inválido: ${error.message}\n`);
    failed++;
    return false;
  }
}

// Verificações
console.log('📋 VERIFICANDO ARQUIVOS NECESSÁRIOS\n');

checkFile('index.html', 'Site Principal');
checkFile('admin-v2.html', 'Painel Admin v2');
checkFile('admin.html', 'Painel Admin Clássico');
checkFile('server.js', 'Backend Node.js');
checkFile('admin-v2.js', 'Lógica do Admin v2');
checkFile('content-manager.js', 'Gerenciador de Conteúdo');
checkJson('data.json', 'Banco de Dados');

console.log('\n📦 VERIFICANDO CONFIGURAÇÃO\n');

// Verificar package.json
if (fs.existsSync(path.join(__dirname, 'package.json'))) {
  const pkg = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
  console.log(`✅ package.json - Dependências: ${Object.keys(pkg.dependencies).join(', ')}\n`);
  passed++;
} else {
  console.log('❌ package.json não encontrado\n');
  failed++;
}

// Verificar conteúdo data.json
const dataFile = path.join(__dirname, 'data.json');
if (fs.existsSync(dataFile)) {
  try {
    const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
    console.log('✅ Estrutura de dados (data.json):');
    Object.keys(data).forEach(key => {
      console.log(`   ├─ ${key}`);
    });
    console.log();
    passed++;
  } catch (error) {
    console.log(`❌ Erro ao ler data.json: ${error.message}\n`);
    failed++;
  }
}

// Resumo
console.log('\n╔════════════════════════════════════════════════════════════════════════════╗');
console.log(`║  RESULTADO: ✅ ${passed} PASSOU   ❌ ${failed} FALHOU                                    ║`);
console.log('╚════════════════════════════════════════════════════════════════════════════╝\n');

if (failed === 0) {
  console.log('🎉 SISTEMA CONFIGURADO COM SUCESSO!\n');
  console.log('📝 Para iniciar:\n');
  console.log('   1. npm install  (primeira vez apenas)');
  console.log('   2. node server.js\n');
  console.log('🌐 Acesse:\n');
  console.log('   Site: http://localhost:3000');
  console.log('   Admin: http://localhost:3000/admin-v2.html\n');
  process.exit(0);
} else {
  console.log('⚠️ ALGUNS ARQUIVOS ESTÃO FALTANDO!\n');
  console.log('Por favor, verifique os erros acima e tente novamente.\n');
  process.exit(1);
}
