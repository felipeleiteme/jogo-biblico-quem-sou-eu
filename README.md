# 🎮 Quem Sou Eu? - Jogo Bíblico Interativo

Um jogo educativo e interativo para descobrir personagens bíblicos através de pistas progressivas. Desenvolvido com design minimalista e elegante, inspirado no estilo do jw.org.

## ✨ Características

- 🎯 **100 rodadas únicas** - Cada rodada apresenta um personagem bíblico diferente
- 🔍 **Pistas progressivas** - Das mais difíceis para as mais fáceis
- 🏆 **Sistema de pontuação** - Quanto menos pistas usar, mais pontos ganha
- 🎨 **Design minimalista** - Interface limpa e elegante
- 📱 **Totalmente responsivo** - Funciona em qualquer dispositivo
- 🌟 **Educativo** - Aprenda sobre personagens bíblicos de forma divertida

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript 5
- **Estilização**: Tailwind CSS 4, shadcn/ui
- **Banco de Dados**: SQLite com Prisma
- **Autenticação**: NextAuth.js
- **Estado**: Zustand
- **Animações**: Framer Motion

## 🎮 Como Jogar

1. **Inicie o jogo** clicando em "Começar Jogo"
2. **A primeira pista** (mais difícil) é revelada automaticamente
3. **Tente adivinhar** o personagem com base na pista
4. **Se não conseguir**, revele mais pistas (elas ficam mais fáceis)
5. **Digite seu palpite** e veja se está correto
6. **Continue para a próxima rodada** até completar as 100

## 📊 Sistema de Pontuação

- **5 pontos** - Acertou na primeira pista
- **4 pontos** - Acertou na segunda pista
- **3 pontos** - Acertou na terceira pista
- **2 pontos** - Acertou na quarta pista
- **1 ponto** - Acertou na quinta pista

**Pontuação máxima possível: 500 pontos!**

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn

### Passos
```bash
# Clone o repositório
git clone https://github.com/felipeleiteme/jogo-biblico-quem-sou-eu.git
cd jogo-biblico-quem-sou-eu

# Instale as dependências
npm install

# Configure o banco de dados
npm run db:push

# Execute em modo desenvolvimento
npm run dev

# Acesse http://localhost:3000
```

### Scripts Disponíveis
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build de produção
- `npm run start` - Servidor de produção
- `npm run lint` - Verificação de código
- `npm run db:push` - Sincronizar banco de dados

## 🎨 Design e Inspiração

O design foi criado com foco na simplicidade e elegância, inspirado no estilo minimalista do jw.org. Utilizamos:

- **Paleta de cores suaves** com suporte a tema claro/escuro
- **Tipografia clara** e legível
- **Espaçamento generoso** para melhor respiração visual
- **Animações sutis** para melhorar a experiência do usuário

## 📱 Personagens Bíblicos

O jogo inclui 100 personagens bíblicos conhecidos, desde figuras do Antigo Testamento até o Novo Testamento, proporcionando uma experiência educativa rica e diversificada.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:

- Reportar bugs
- Sugerir melhorias
- Adicionar novos personagens
- Melhorar o design
- Otimizar o código

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Felipe Leite** - Desenvolvedor Full Stack apaixonado por criar experiências educativas e interativas.

---

**Divirta-se aprendendo sobre a Bíblia de forma interativa! 🎯✨**
