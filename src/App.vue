<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-4">
    <div class="max-w-6xl mx-auto">
      <header class="text-center mb-8 pt-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">QR Code Generator</h1>
        <p class="text-gray-600">Create branded QR codes with automatic company logo</p>
      </header>
      
      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Controls Panel -->
        <div class="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2" for="input-text">
              Text or URL
            </label>
            <textarea
              id="input-text"
              v-model="inputText"
              @input="generateQR"
              placeholder="Enter text or URL to encode..."
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none"
              rows="3"
              aria-describedby="input-help"
            ></textarea>
            <p id="input-help" class="text-xs text-gray-500 mt-1">
              <span v-if="isValidUrl" class="text-green-600">✓ Valid URL</span>
              <span v-else-if="inputText">Plain text</span>
            </p>
          </div>

          <!-- Logo Info -->
          <div class="p-4 bg-indigo-50 border-2 border-indigo-200 rounded-lg">
            <div class="flex items-center gap-3">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="flex-1">
                <p class="text-sm font-semibold text-indigo-900">Company logo automatically applied</p>
                <p class="text-xs text-indigo-700 mt-1">All QR codes include your branding at the center</p>
              </div>
            </div>
          </div>

          <!-- Logo Size Control -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2" for="logo-size">
              Logo Size: {{ logoSize }}%
            </label>
            <input
              id="logo-size"
              type="range"
              v-model.number="logoSize"
              @input="generateQR"
              min="10"
              max="30"
              step="1"
              class="w-full"
            />
            <p class="text-xs text-gray-500 mt-1">Recommended: 15-20% for best scannability</p>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2" for="qr-size">
                Size: {{ qrSize }}px
              </label>
              <input
                id="qr-size"
                type="range"
                v-model.number="qrSize"
                @input="generateQR"
                min="128"
                max="512"
                step="32"
                class="w-full"
              />
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2" for="qr-margin">
                Margin: {{ margin }}
              </label>
              <input
                id="qr-margin"
                type="range"
                v-model.number="margin"
                @input="generateQR"
                min="0"
                max="10"
                class="w-full"
              />
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2" for="fg-color">
                Foreground
              </label>
              <div class="flex gap-2">
                <input
                  id="fg-color"
                  type="color"
                  v-model="fgColor"
                  @input="generateQR"
                  class="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  v-model="fgColor"
                  @input="generateQR"
                  class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2" for="bg-color">
                Background
              </label>
              <div class="flex gap-2">
                <input
                  id="bg-color"
                  type="color"
                  v-model="bgColor"
                  @input="generateQR"
                  class="w-12 h-10 rounded cursor-pointer"
                />
                <input
                  type="text"
                  v-model="bgColor"
                  @input="generateQR"
                  class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>
          </div>
          
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2" for="error-level">
                Error Correction
              </label>
              <select
                id="error-level"
                v-model="errorLevel"
                @change="generateQR"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="L">Low (7%)</option>
                <option value="M">Medium (15%)</option>
                <option value="Q">Quartile (25%)</option>
                <option value="H">High (30%)</option>
              </select>
              <p class="text-xs text-gray-500 mt-1">High recommended for logo overlay</p>
            </div>
            
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2" for="format">
                Format
              </label>
              <select
                id="format"
                v-model="format"
                @change="generateQR"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
              >
                <option value="png">PNG</option>
                <option value="svg">SVG</option>
              </select>
            </div>
          </div>
          
          <div v-if="error" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
          
          <button
            @click="showHistory = !showHistory"
            class="w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-lg transition"
          >
            {{ showHistory ? 'Hide' : 'Show' }} History ({{ history.length }})
          </button>
        </div>
        
        <!-- Preview Panel -->
        <div class="space-y-6">
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Preview</h2>
            
            <div v-if="qrDataUrl" class="space-y-4">
              <div class="flex justify-center items-center bg-gray-50 rounded-lg p-8">
                <div class="relative inline-block">
                  <canvas ref="qrCanvas" class="max-w-full h-auto"></canvas>
                </div>
              </div>
              
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="downloadQR"
                  class="px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  aria-label="Download QR code"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download
                </button>
                
                <button
                  @click="copyToClipboard"
                  class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  aria-label="Copy QR code to clipboard"
                >
                  <svg v-if="!copySuccess" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
                  </svg>
                  <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                  </svg>
                  {{ copySuccess ? 'Copied!' : 'Copy' }}
                </button>
              </div>
            </div>
            
            <div v-else class="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg class="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
              </svg>
              <p class="text-lg">Enter text to generate QR code</p>
            </div>
          </div>
          
          <!-- History Panel -->
          <div v-if="showHistory" class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">History</h2>
              <button
                v-if="history.length > 0"
                @click="clearHistory"
                class="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            </div>
            
            <div v-if="history.length === 0" class="text-center py-8 text-gray-400">
              <p>No history yet</p>
            </div>
            
            <div v-else class="space-y-3 max-h-96 overflow-y-auto">
              <div
                v-for="(item, idx) in history"
                :key="item.id"
                class="flex gap-3 p-3 border-2 border-gray-100 rounded-lg hover:border-indigo-200 transition"
              >
                <img
                  :src="item.dataUrl"
                  alt="QR code thumbnail"
                  class="w-16 h-16 object-contain bg-gray-50 rounded"
                />
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-semibold text-gray-800 truncate">
                    {{ truncateText(item.text) }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ formatDate(item.timestamp) }}
                  </p>
                  <div class="flex gap-2 mt-2">
                    <button
                      @click="restoreFromHistory(idx)"
                      class="text-xs text-indigo-600 hover:text-indigo-700 font-semibold"
                    >
                      Restore
                    </button>
                    <button
                      @click="deleteFromHistory(idx)"
                      class="text-xs text-red-600 hover:text-red-700 font-semibold"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import QRCode from 'qrcode';
// Import the company logo from assets
import CompanyLogo from '@/assets/Logo.png';

export default {
  name: 'App',
  data() {
    return {
      inputText: '',
      qrSize: 256,
      margin: 4,
      fgColor: '#000000',
      bgColor: '#ffffff',
      errorLevel: 'H',
      format: 'png',
      qrDataUrl: '',
      companyLogoSrc: CompanyLogo, // Automatically loaded company logo
      logoSize: 18,
      history: [],
      maxHistory: 10,
      showHistory: false,
      isGenerating: false,
      error: '',
      copySuccess: false
    };
  },
  
  computed: {
    isValidInput() {
      return this.inputText.trim().length > 0;
    },
    
    isValidUrl() {
      if (!this.inputText.trim()) return false;
      try {
        new URL(this.inputText);
        return true;
      } catch {
        return false;
      }
    }
  },
  
  mounted() {
    this.loadHistory();
    if (this.history.length > 0) {
      this.restoreFromHistory(0);
    }
  },
  
  methods: {
    async generateQR() {
      if (!this.isValidInput) {
        this.error = 'Please enter text or URL';
        return;
      }
      
      this.isGenerating = true;
      this.error = '';
      
      try {
        const opts = {
          errorCorrectionLevel: this.errorLevel,
          width: this.qrSize,
          margin: this.margin,
          color: {
            dark: this.fgColor,
            light: this.bgColor
          }
        };
        
        // Generate QR code to canvas
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, this.inputText, opts);
        
        // Automatically overlay company logo on every QR code
        await this.overlayCompanyLogo(canvas);
        
        // Convert canvas to data URL
        this.qrDataUrl = canvas.toDataURL('image/png');
        
        // Update the display canvas
        this.$nextTick(() => {
          if (this.$refs.qrCanvas) {
            const ctx = this.$refs.qrCanvas.getContext('2d');
            this.$refs.qrCanvas.width = canvas.width;
            this.$refs.qrCanvas.height = canvas.height;
            ctx.drawImage(canvas, 0, 0);
          }
        });
        
        this.saveToHistory();
      } catch (err) {
        this.error = `Error generating QR code: ${err.message}`;
      } finally {
        this.isGenerating = false;
      }
    },
    
    async overlayCompanyLogo(canvas) {
      return new Promise((resolve, reject) => {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          // Calculate logo size (percentage of QR code size)
          const logoSizeRatio = this.logoSize / 100;
          const maxLogoSize = canvas.width * logoSizeRatio;
          
          // Maintain aspect ratio
          let logoWidth, logoHeight;
          if (img.width > img.height) {
            logoWidth = maxLogoSize;
            logoHeight = (img.height / img.width) * maxLogoSize;
          } else {
            logoHeight = maxLogoSize;
            logoWidth = (img.width / img.height) * maxLogoSize;
          }
          
          // Calculate center position
          const x = (canvas.width - logoWidth) / 2;
          const y = (canvas.height - logoHeight) / 2;
          
          // Add white background with padding for better visibility
          const padding = logoWidth * 0.1;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(
            x - padding,
            y - padding,
            logoWidth + padding * 2,
            logoHeight + padding * 2
          );
          
          // Draw company logo
          ctx.drawImage(img, x, y, logoWidth, logoHeight);
          resolve();
        };
        
        img.onerror = () => {
          reject(new Error('Failed to load company logo. Please check if Logo.png exists in src/assets/'));
        };
        
        // Load company logo automatically
        img.src = this.companyLogoSrc;
      });
    },
    
    saveToHistory() {
      const entry = {
        id: Date.now(),
        text: this.inputText,
        size: this.qrSize,
        margin: this.margin,
        fgColor: this.fgColor,
        bgColor: this.bgColor,
        errorLevel: this.errorLevel,
        format: this.format,
        dataUrl: this.qrDataUrl,
        logoSize: this.logoSize,
        timestamp: new Date().toISOString()
      };
      
      this.history.unshift(entry);
      if (this.history.length > this.maxHistory) {
        this.history = this.history.slice(0, this.maxHistory);
      }
      
      this.persistHistory();
    },
    
    persistHistory() {
      try {
        this._historyStore = JSON.stringify(this.history);
      } catch (err) {
        console.error('Failed to save history:', err);
      }
    },
    
    loadHistory() {
      try {
        if (this._historyStore) {
          this.history = JSON.parse(this._historyStore);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
        this.history = [];
      }
    },
    
    restoreFromHistory(idx) {
      const entry = this.history[idx];
      if (!entry) return;
      
      this.inputText = entry.text;
      this.qrSize = entry.size;
      this.margin = entry.margin;
      this.fgColor = entry.fgColor;
      this.bgColor = entry.bgColor;
      this.errorLevel = entry.errorLevel;
      this.format = entry.format;
      this.qrDataUrl = entry.dataUrl;
      this.logoSize = entry.logoSize || 18;
      
      // Update canvas display
      this.$nextTick(() => {
        if (this.$refs.qrCanvas && entry.dataUrl) {
          const img = new Image();
          img.onload = () => {
            const ctx = this.$refs.qrCanvas.getContext('2d');
            this.$refs.qrCanvas.width = img.width;
            this.$refs.qrCanvas.height = img.height;
            ctx.drawImage(img, 0, 0);
          };
          img.src = entry.dataUrl;
        }
      });
    },
    
    deleteFromHistory(idx) {
      this.history.splice(idx, 1);
      this.persistHistory();
    },
    
    clearHistory() {
      if (confirm('Clear all history?')) {
        this.history = [];
        this.persistHistory();
      }
    },
    
    downloadQR() {
      if (!this.qrDataUrl) return;
      
      const link = document.createElement('a');
      const fileName = `qrcode-branded-${Date.now()}.${this.format}`;
      link.href = this.qrDataUrl;
      link.download = fileName;
      link.click();
    },
    
    async copyToClipboard() {
      if (!this.qrDataUrl) return;
      
      try {
        const blob = await (await fetch(this.qrDataUrl)).blob();
        await navigator.clipboard.write([
          new ClipboardItem({ [blob.type]: blob })
        ]);
        
        this.copySuccess = true;
        setTimeout(() => this.copySuccess = false, 2000);
      } catch (err) {
        this.error = 'Failed to copy to clipboard';
      }
    },
    
    formatDate(iso) {
      return new Date(iso).toLocaleString();
    },
    
    truncateText(text, len = 30) {
      return text.length > len ? text.substring(0, len) + '...' : text;
    }
  }
};
</script>

<style scoped>
input[type="range"] {
  accent-color: #4f46e5;
}

canvas {
  image-rendering: crisp-edges;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
}
</style>