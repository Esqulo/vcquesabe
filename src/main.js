import './style.css'
import logoImage from './assets/vcquesabelogo.png'

class WheelOfFortune {
  constructor() {
    this.items = []
    this.isSpinning = false
    this.rotation = 0
    this.templates = {
      simnao: ['Sim', 'Não'],
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
      <div class="ad-container ad-left" id="ad-left">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9791816249338036"
             data-ad-slot="1195589215"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
      
      <div class="container">
        <header class="app-header">
          <img src="${logoImage}" alt="vc que sabe" class="logo" />
          <h1>vc que sabe</h1>
          <button id="share-btn" class="share-btn" title="Compartilhar">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"></circle><circle cx="6" cy="12" r="3"></circle><circle cx="18" cy="19" r="3"></circle><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line></svg>
          </button>
        </header>
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
                <button class="template-btn" data-template="simnao">✅ Sim / Não</button>
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
      
      <div id="share-popup" class="share-popup hidden">
        <div class="share-content">
          <button id="close-share" class="close-share">×</button>
          <h3>Compartilhar Roda</h3>
          <div class="share-options">
            <button class="share-option" data-platform="copy">
              <span class="icon">📋</span> Copiar Link
            </button>
            <button class="share-option" data-platform="whatsapp">
              <span class="icon">💚</span> WhatsApp
            </button>
            <button class="share-option" data-platform="twitter">
              <span class="icon">🖤</span> X / Twitter
            </button>
            <button class="share-option" data-platform="instagram">
              <span class="icon">📸</span> Instagram
            </button>
          </div>
        </div>
      </div>

      <div class="ad-container ad-right" id="ad-right">
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9791816249338036"
             data-ad-slot="1195589215"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
      
      <div class="ad-container ad-bottom" id="ad-bottom">
        <!-- mobile bottom -->
        <ins class="adsbygoogle"
             style="display:block"
             data-ad-client="ca-pub-9791816249338036"
             data-ad-slot="5093104648"
             data-ad-format="auto"
             data-full-width-responsive="true"></ins>
      </div>
    `

    this.setupEventListeners()
    this.setupShareListeners()
    this.updateWheel()
    this.loadAds()
    this.loadFromUrl()
  }

  loadAds() {
    // Initialize Google AdSense ads
    try {
      const adLeft = document.getElementById('ad-left')
      const adRight = document.getElementById('ad-right')
      const adBottom = document.getElementById('ad-bottom')

      if (adLeft && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }

      if (adRight && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }

      if (adBottom && window.adsbygoogle) {
        (window.adsbygoogle = window.adsbygoogle || []).push({})
      }
    } catch (e) {
      console.error('Error loading ads:', e)
    }
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

  setupShareListeners() {
    const shareBtn = document.getElementById('share-btn')
    const sharePopup = document.getElementById('share-popup')
    const closeShare = document.getElementById('close-share')
    const shareOptions = document.querySelectorAll('.share-option')

    shareBtn.addEventListener('click', () => {
      sharePopup.classList.remove('hidden')
    })

    closeShare.addEventListener('click', () => {
      sharePopup.classList.add('hidden')
    })

    sharePopup.addEventListener('click', (e) => {
      if (e.target === sharePopup) {
        sharePopup.classList.add('hidden')
      }
    })

    shareOptions.forEach(btn => {
      btn.addEventListener('click', async () => {
        const platform = btn.getAttribute('data-platform')
        const url = window.location.href
        const text = 'Confira minha roda da sorte no vc que sabe!'

        switch (platform) {
          case 'copy':
            try {
              await navigator.clipboard.writeText(url)
              const originalText = btn.innerHTML
              btn.innerHTML = '<span class="icon">✅</span> Copiado!'
              setTimeout(() => {
                btn.innerHTML = originalText
              }, 2000)
            } catch (err) {
              console.error('Failed to copy:', err)
            }
            break
          case 'whatsapp':
            // Adding double newline and ensuring space to help WhatsApp recognize the link
            window.open(`https://wa.me/?text=${encodeURIComponent(text + '\n\n' + url)}`, '_blank')
            break
          case 'twitter':
            window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text + '\n')}`, '_blank')
            break
          case 'instagram':
            try {
              await navigator.clipboard.writeText(url)
              const originalText = btn.innerHTML
              btn.innerHTML = '<span class="icon">✅</span> Link Copiado!'
              setTimeout(() => {
                btn.innerHTML = originalText
              }, 2000)
              alert('Link copiado! Abra o Instagram para colar e compartilhar.')
            } catch (err) {
              console.error('Failed to copy:', err)
            }
            break
        }
      })
    })
  }

  loadTemplate(templateName) {
    if (this.templates[templateName]) {
      this.items = [...this.templates[templateName]]
      this.updateWheel()
      this.updateItemsList()
      this.updateSpinButton()
      this.updateUrl()
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
    this.updateUrl()
  }

  removeItem(item) {
    this.items = this.items.filter(i => i !== item)
    this.updateWheel()
    this.updateItemsList()
    this.updateSpinButton()
    this.updateUrl()
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

  updateUrl() {
    const url = new URL(window.location)
    if (this.items.length > 0) {
      url.searchParams.set('items', this.items.join(','))
    } else {
      url.searchParams.delete('items')
    }
    window.history.replaceState({}, '', url)
  }

  loadFromUrl() {
    const urlParams = new URLSearchParams(window.location.search)
    const itemsParam = urlParams.get('items')
    if (itemsParam) {
      this.items = itemsParam.split(',').filter(item => item.trim() !== '')
      this.updateWheel()
      this.updateItemsList()
      this.updateSpinButton()
    }
  }
}

// Initialize the wheel
new WheelOfFortune()
