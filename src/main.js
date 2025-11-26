import './style.css'

class WheelOfFortune {
  constructor() {
    this.items = []
    this.isSpinning = false
    this.rotation = 0
    this.templates = {
      pizzas: ['Margherita', 'Pepperoni', 'Quatro Queijos', 'Calabresa', 'Portuguesa', 'Frango com Catupiry', 'Napolitana', 'Bacon'],
      sorvetes: ['Chocolate', 'Morango', 'Baunilha', 'Flocos', 'Creme', 'Limão', 'Maracujá', 'Açaí'],
      cores: ['Vermelho', 'Azul', 'Verde', 'Amarelo', 'Roxo', 'Laranja', 'Rosa', 'Preto', 'Branco'],
      lugares: ['Praia', 'Montanha', 'Cidade', 'Floresta', 'Deserto', 'Ilha', 'Campo', 'Parque'],
      comidas: ['Pizza', 'Hambúrguer', 'Sushi', 'Taco', 'Lasanha', 'Churrasco', 'Pastel', 'Açaí', 'Coxinha', 'Batata Frita'],
      filmes: ['Ação', 'Aventura', 'Comédia', 'Drama', 'Terror', 'Ficção Científica', 'Romance', 'Suspense', 'Animação', 'Documentário', 'Fantasia', 'Crime']
    }
    this.init()
  }

  init() {
    document.querySelector('#app').innerHTML = `
      <div class="container">
        <div id="result" class="result hidden"></div>
        
        <div class="main-content">
          <div class="wheel-container">
            <div class="wheel-wrapper">
              <svg id="wheel" class="wheel" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="180" fill="#2a2a2a" stroke="#646cff" stroke-width="4"/>
                <g id="wheel-segments"></g>
                <circle cx="200" cy="200" r="30" fill="#1a1a1a" stroke="#646cff" stroke-width="3"/>
              </svg>
              <div class="wheel-pointer"></div>
              <div class="wheel-center">
                <button id="spin-btn" class="spin-btn" ${this.items.length === 0 ? 'disabled' : ''}>
                  GIRAR
                </button>
              </div>
            </div>
          </div>

          <div class="controls">
            <div class="templates-section">
              <h3>Sugestões:</h3>
              <div class="templates-container">
                <button class="template-btn" data-template="pizzas">🍕 Pizzas</button>
                <button class="template-btn" data-template="sorvetes">🍦 Sorvetes</button>
                <button class="template-btn" data-template="cores">🎨 Cores</button>
                <button class="template-btn" data-template="lugares">🌍 Lugares</button>
                <button class="template-btn" data-template="comidas">🍽️ Comidas</button>
                <button class="template-btn" data-template="filmes">🎬 Filmes</button>
              </div>
            </div>

            <div class="add-item-section">
              <input 
                type="text" 
                id="item-input" 
                placeholder="Digite o nome do item..." 
                class="item-input"
                maxlength="30"
              />
              <button id="add-btn" class="action-btn">Adicionar Item</button>
            </div>
            
            <div class="items-list">
              <h3>Itens na Roda:</h3>
              <div id="items-container" class="items-container">
                ${this.items.length === 0 ? '<p class="empty-message">Nenhum item ainda. Adicione alguns itens para começar!</p>' : ''}
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    this.setupEventListeners()
    this.updateWheel()
  }

  setupEventListeners() {
    const addBtn = document.querySelector('#add-btn')
    const itemInput = document.querySelector('#item-input')
    const spinBtn = document.querySelector('#spin-btn')

    addBtn.addEventListener('click', () => this.addItem())
    itemInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        this.addItem()
      }
    })

    spinBtn.addEventListener('click', () => this.spin())

    // Template buttons
    document.querySelectorAll('.template-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const templateName = e.target.getAttribute('data-template')
        this.loadTemplate(templateName)
      })
    })
  }

  loadTemplate(templateName) {
    if (this.templates[templateName]) {
      this.items = [...this.templates[templateName]]
      this.updateWheel()
      this.updateItemsList()
      this.updateSpinButton()
    }
  }

  addItem() {
    const input = document.querySelector('#item-input')
    const value = input.value.trim()

    if (value === '') {
      return
    }

    this.items.push(value)
    input.value = ''
    this.updateWheel()
    this.updateItemsList()
    this.updateSpinButton()
  }

  removeItem(item) {
    this.items = this.items.filter(i => i !== item)
    this.updateWheel()
    this.updateItemsList()
    this.updateSpinButton()
  }

  updateItemsList() {
    const container = document.querySelector('#items-container')
    
    if (this.items.length === 0) {
      container.innerHTML = '<p class="empty-message">Nenhum item ainda. Adicione alguns itens para começar!</p>'
      return
    }

    container.innerHTML = this.items.map((item, index) => `
      <div class="item-tag">
        <span>${item}</span>
        <button class="remove-btn" data-item="${item}" title="Remover">×</button>
      </div>
    `).join('')

    // Add event listeners to remove buttons
    container.querySelectorAll('.remove-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const item = e.target.getAttribute('data-item')
        this.removeItem(item)
      })
    })
  }

  updateSpinButton() {
    const spinBtn = document.querySelector('#spin-btn')
    spinBtn.disabled = this.items.length === 0 || this.isSpinning
  }

  updateWheel() {
    const wheel = document.querySelector('#wheel')
    const segmentsGroup = document.querySelector('#wheel-segments')
    
    if (this.items.length === 0) {
      segmentsGroup.innerHTML = ''
      return
    }

    const numItems = this.items.length
    const anglePerSegment = 360 / numItems
    const radius = 180
    const centerX = 200
    const centerY = 200

    segmentsGroup.innerHTML = ''

    // Generate colors
    const colors = this.generateColors(numItems)

    this.items.forEach((item, index) => {
      const startAngle = (index * anglePerSegment - 90) * (Math.PI / 180)
      const endAngle = ((index + 1) * anglePerSegment - 90) * (Math.PI / 180)

      // Create path for segment
      const x1 = centerX + radius * Math.cos(startAngle)
      const y1 = centerY + radius * Math.sin(startAngle)
      const x2 = centerX + radius * Math.cos(endAngle)
      const y2 = centerY + radius * Math.sin(endAngle)

      const largeArc = anglePerSegment > 180 ? 1 : 0

      const pathData = [
        `M ${centerX} ${centerY}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z'
      ].join(' ')

      // Create segment
      const segment = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      segment.setAttribute('d', pathData)
      segment.setAttribute('fill', colors[index])
      segment.setAttribute('stroke', '#1a1a1a')
      segment.setAttribute('stroke-width', '2')
      segmentsGroup.appendChild(segment)

      // Add text
      const textAngle = (index * anglePerSegment + anglePerSegment / 2 - 90) * (Math.PI / 180)
      const textRadius = radius * 0.7
      const textX = centerX + textRadius * Math.cos(textAngle)
      const textY = centerY + textRadius * Math.sin(textAngle)

      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', textX)
      text.setAttribute('y', textY)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('dominant-baseline', 'middle')
      text.setAttribute('fill', '#ffffff')
      text.setAttribute('font-size', '16')
      text.setAttribute('font-weight', 'bold')
      text.setAttribute('transform', `rotate(${index * anglePerSegment + anglePerSegment / 2} ${textX} ${textY})`)
      text.textContent = item.length > 15 ? item.substring(0, 15) + '...' : item
      segmentsGroup.appendChild(text)
    })
  }

  generateColors(count) {
    const colors = []
    const hueStep = 360 / count
    
    for (let i = 0; i < count; i++) {
      const hue = (i * hueStep) % 360
      colors.push(`hsl(${hue}, 70%, 50%)`)
    }
    
    return colors
  }

  spin() {
    if (this.isSpinning || this.items.length === 0) return

    this.isSpinning = true
    this.updateSpinButton()

    const wheel = document.querySelector('#wheel')
    const resultDiv = document.querySelector('#result')
    resultDiv.classList.add('hidden')

    // Random spin: 3-5 full rotations + random angle
    const spins = 3 + Math.random() * 2 // 3-5 spins
    const randomAngle = Math.random() * 360
    const totalRotation = this.rotation + spins * 360 + randomAngle

    wheel.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)'
    wheel.style.transform = `rotate(${totalRotation}deg)`

    // Calculate which item was selected
    setTimeout(() => {
      const normalizedRotation = (360 - (totalRotation % 360)) % 360
      const anglePerSegment = 360 / this.items.length
      const selectedIndex = Math.floor(normalizedRotation / anglePerSegment)
      const selectedItem = this.items[selectedIndex]

      this.rotation = totalRotation
      this.isSpinning = false
      this.updateSpinButton()

      // Show result
      resultDiv.textContent = `🎉 ${selectedItem} 🎉`
      resultDiv.classList.remove('hidden')
    }, 4000)
  }
}

// Initialize the wheel
new WheelOfFortune()
