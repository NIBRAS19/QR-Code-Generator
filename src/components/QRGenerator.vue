<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-50 via-blue-50 to-purple-50 p-4">
    <div class="max-w-7xl mx-auto">
      <header class="text-center mb-8 pt-8">
        <div class="inline-block mb-4">
          <div class="w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
            </svg>
          </div>
        </div>
        <h1 class="text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3">
          QR Code Generator
        </h1>
        <p class="text-gray-600 text-lg">Create professional branded QR codes with your company logo</p>
      </header>
      
      <div class="grid lg:grid-cols-5 gap-6">
        <!-- Controls Panel -->
        <div class="lg:col-span-3 space-y-6">
          <!-- Input Section -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/>
              </svg>
              <h2 class="text-lg font-bold text-gray-800">Content</h2>
            </div>
            
            <div class="space-y-4">
              <!-- Quick Templates -->
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="template in quickTemplates"
                  :key="template.label"
                  @click="applyTemplate(template)"
                  class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-indigo-100 hover:text-indigo-700 text-gray-700 transition"
                >
                  {{ template.label }}
                </button>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2" for="input-text">
                  Text or URL <span class="text-red-500">*</span>
                </label>
                <textarea
                  id="input-text"
                  v-model="inputText"
                  @input="debouncedGenerate"
                  placeholder="Enter text, URL, or use quick templates above..."
                  class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none resize-none font-mono text-sm transition"
                  rows="4"
                  aria-describedby="input-help"
                ></textarea>
                <div class="flex items-center justify-between mt-2">
                  <p id="input-help" class="text-xs text-gray-500">
                    <span v-if="isValidUrl" class="text-green-600 font-semibold">✓ Valid URL detected</span>
                    <span v-else-if="inputText" class="text-blue-600 font-semibold">Plain text</span>
                    <span v-else class="text-gray-400">Enter content to generate QR code</span>
                  </p>
                  <p class="text-xs text-gray-400">{{ inputText.length }} characters</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Customization Section -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"/>
              </svg>
              <h2 class="text-lg font-bold text-gray-800">Customization</h2>
            </div>

            <!-- Logo Section -->
            <div class="mb-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-xl">
              <div class="flex items-start gap-3">
                <div class="flex-shrink-0 w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <div class="flex items-center justify-between mb-2">
                    <p class="text-sm font-bold text-indigo-900">Company Logo Overlay</p>
                    <label class="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        v-model="logoEnabled"
                        @change="debouncedGenerate"
                        class="sr-only peer"
                      >
                      <div class="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                  <p class="text-xs text-indigo-700 mb-3">
                    {{ logoEnabled ? 'Your branding is applied to all QR codes' : 'Logo overlay is disabled' }}
                  </p>
                  
                  <div v-if="logoEnabled" class="mt-3">
                    <label class="block text-xs font-semibold text-indigo-900 mb-2">
                      Logo Size: {{ logoSize }}%
                    </label>
                    <div class="flex items-center gap-3">
                      <input
                        type="range"
                        v-model.number="logoSize"
                        @input="debouncedGenerate"
                        min="10"
                        max="30"
                        step="1"
                        class="flex-1"
                      />
                      <span class="text-xs font-mono bg-white px-2 py-1 rounded text-indigo-700 border border-indigo-200">{{ logoSize }}%</span>
                    </div>
                    <p class="text-xs text-indigo-600 mt-1">💡 Recommended: 15-20% for optimal scanning</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="space-y-5">
              <!-- Size Controls -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    QR Size: {{ qrSize }}px
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      type="range"
                      v-model.number="qrSize"
                      @input="debouncedGenerate"
                      min="128"
                      max="1024"
                      step="32"
                      class="flex-1"
                    />
                    <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{{ qrSize }}</span>
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Margin: {{ margin }}
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      type="range"
                      v-model.number="margin"
                      @input="debouncedGenerate"
                      min="0"
                      max="10"
                      class="flex-1"
                    />
                    <span class="text-xs font-mono bg-gray-100 px-2 py-1 rounded">{{ margin }}</span>
                  </div>
                </div>
              </div>
              
              <!-- Color Controls -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Foreground Color
                  </label>
                  <div class="flex gap-2">
                    <div class="relative">
                      <input
                        type="color"
                        v-model="fgColor"
                        @input="debouncedGenerate"
                        class="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                      />
                    </div>
                    <input
                      type="text"
                      v-model="fgColor"
                      @input="debouncedGenerate"
                      class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-mono text-sm uppercase"
                      placeholder="#000000"
                    />
                  </div>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Background Color
                  </label>
                  <div class="flex gap-2">
                    <div class="relative">
                      <input
                        type="color"
                        v-model="bgColor"
                        @input="debouncedGenerate"
                        class="w-12 h-10 rounded-lg cursor-pointer border-2 border-gray-200"
                      />
                    </div>
                    <input
                      type="text"
                      v-model="bgColor"
                      @input="debouncedGenerate"
                      class="flex-1 px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-mono text-sm uppercase"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>

              <!-- Quick Color Presets -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">Color Presets</label>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="preset in colorPresets"
                    :key="preset.name"
                    @click="applyColorPreset(preset)"
                    class="group relative w-12 h-12 rounded-lg border-2 border-gray-200 hover:border-indigo-400 transition overflow-hidden"
                    :title="preset.name"
                  >
                    <div class="absolute inset-0" :style="{ backgroundColor: preset.bg }">
                      <div class="absolute inset-2 rounded" :style="{ backgroundColor: preset.fg }"></div>
                    </div>
                  </button>
                </div>
              </div>
              
              <!-- Advanced Settings -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Error Correction
                  </label>
                  <select
                    v-model="errorLevel"
                    @change="debouncedGenerate"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
                  >
                    <option value="L">Low - 7% recovery</option>
                    <option value="M">Medium - 15% recovery</option>
                    <option value="Q">Quartile - 25% recovery</option>
                    <option value="H">High - 30% recovery</option>
                  </select>
                  <p class="text-xs text-gray-500 mt-1">⚡ High recommended for logo</p>
                </div>
                
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Export Format
                  </label>
                  <select
                    v-model="format"
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none text-sm"
                  >
                    <option value="png">PNG (Raster)</option>
                    <option value="svg">SVG (Vector)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="bg-red-50 border-2 border-red-200 rounded-xl p-4 flex items-start gap-3">
            <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <p class="text-red-700 text-sm flex-1">{{ error }}</p>
          </div>
        </div>
        
        <!-- Preview & Actions Panel -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Preview -->
          <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-6">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                </svg>
                <h2 class="text-lg font-bold text-gray-800">Preview</h2>
              </div>
              <span v-if="isGenerating" class="text-xs text-indigo-600 font-semibold animate-pulse">Generating...</span>
            </div>
            
            <div v-if="qrDataUrl" class="space-y-4">
              <div class="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-8 border-2 border-gray-200">
                <canvas ref="qrCanvas" class="max-w-full h-auto mx-auto shadow-lg rounded-lg"></canvas>
                
                <!-- Download watermark -->
                <div class="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs text-gray-600 font-semibold">
                  {{ qrSize }}x{{ qrSize }}px
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="grid grid-cols-2 gap-3">
                <button
                  @click="downloadQR"
                  class="px-4 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-200"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                  </svg>
                  Download
                </button>
                
                <!-- Share Button -->
              <button
                @click="shareQR"
                v-if="canShare"
                class="w-full px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-lg shadow-green-200"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                </svg>
                Share QR Code
              </button>
              </div>
            </div>
            
            <div v-else class="flex flex-col items-center justify-center py-20 text-gray-400">
              <div class="relative mb-4">
                <div class="w-32 h-32 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                  <svg class="w-20 h-20 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
                  </svg>
                </div>
              </div>
              <p class="text-lg font-semibold text-gray-500">No QR Code Yet</p>
              <p class="text-sm text-gray-400 mt-1">Enter content to generate</p>
            </div>
          </div>

          <!-- History Toggle -->
          <button
            @click="showHistory = !showHistory"
            class="w-full px-4 py-3 bg-white hover:bg-gray-50 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl transition flex items-center justify-center gap-2 shadow-sm"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            {{ showHistory ? 'Hide' : 'Show' }} History
            <span class="ml-auto bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full text-xs font-bold">
              {{ history.length }}
            </span>
          </button>
        </div>
      </div>

      <!-- History Panel -->
      <div v-if="showHistory" class="mt-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <h2 class="text-lg font-bold text-gray-800">Generation History</h2>
            <span class="text-sm text-gray-500">({{ history.length }}/{{ maxHistory }})</span>
          </div>
          <button
            v-if="history.length > 0"
            @click="clearHistory"
            class="text-sm text-red-600 hover:text-red-700 font-semibold flex items-center gap-1 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
            </svg>
            Clear All
          </button>
        </div>
        
        <div v-if="history.length === 0" class="text-center py-12 text-gray-400">
          <svg class="w-16 h-16 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
          </svg>
          <p class="font-semibold text-gray-500">No history yet</p>
          <p class="text-sm mt-1">Generated QR codes will appear here</p>
        </div>
        
        <div v-else class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <div
            v-for="(item, idx) in history"
            :key="item.id"
            class="group relative bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 hover:border-indigo-300 rounded-xl p-4 transition cursor-pointer"
            @click="restoreFromHistory(idx)"
          >
            <div class="aspect-square bg-white rounded-lg mb-3 p-2 shadow-sm">
              <img
                :src="item.dataUrl"
                alt="QR code"
                class="w-full h-full object-contain"
              />
            </div>
            <div>
              <p class="text-sm font-semibold text-gray-800 truncate mb-1" :title="item.text">
                {{ truncateText(item.text, 30) }}
              </p>
              <p class="text-xs text-gray-500 mb-2">
                {{ formatDate(item.timestamp) }}
              </p>
              <div class="flex gap-2">
                <button
                  @click.stop="restoreFromHistory(idx)"
                  class="flex-1 text-xs text-indigo-600 hover:text-indigo-700 font-semibold py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded transition"
                >
                  Restore
                </button>
                <button
                  @click.stop="deleteFromHistory(idx)"
                  class="text-xs text-red-600 hover:text-red-700 font-semibold py-1.5 px-3 bg-red-50 hover:bg-red-100 rounded transition"
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
</template>

<script>
import QRCode from 'qrcode';
import CompanyLogo from '@/assets/Logo.png';

export default {
  name: 'QRGenerator',
  data() {
    return {
      inputText: '',
      qrSize: 512,
      margin: 4,
      fgColor: '#000000',
      bgColor: '#ffffff',
      errorLevel: 'H',
      format: 'png',
      qrDataUrl: '',
      companyLogoSrc: CompanyLogo,
      logoSize: 18,
      logoEnabled: true,
      history: [],
      maxHistory: 20,
      showHistory: false,
      isGenerating: false,
      error: '',
      copySuccess: false,
      debounceTimer: null,
      generatedTime: null,
      quickTemplates: [
        { label: '🌐 Website', value: 'https://example.com' },
        { label: '📧 Email', value: 'mailto:contact@example.com' },
        { label: '📱 Phone', value: 'tel:+1234567890' },
        { label: '💬 SMS', value: 'sms:+1234567890' },
        { label: '📍 Location', value: 'geo:37.7749,-122.4194' },
        { label: '📶 WiFi', value: 'WIFI:T:WPA;S:NetworkName;P:Password;;' }
      ],
      colorPresets: [
        { name: 'Classic', fg: '#000000', bg: '#ffffff' },
        { name: 'Blue', fg: '#1e40af', bg: '#eff6ff' },
        { name: 'Purple', fg: '#7c3aed', bg: '#f5f3ff' },
        { name: 'Green', fg: '#059669', bg: '#ecfdf5' },
        { name: 'Red', fg: '#dc2626', bg: '#fef2f2' },
        { name: 'Orange', fg: '#ea580c', bg: '#fff7ed' },
        { name: 'Pink', fg: '#db2777', bg: '#fdf2f8' },
        { name: 'Dark', fg: '#ffffff', bg: '#1f2937' }
      ]
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
    },

    canShare() {
      return navigator.share !== undefined;
    }
  },
  
  mounted() {
    this.loadHistory();
    if (this.history.length > 0 && this.history[0].text) {
      this.restoreFromHistory(0);
    }
  },

  beforeUnmount() {
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
  },
  
  methods: {
    debouncedGenerate() {
      if (this.debounceTimer) {
        clearTimeout(this.debounceTimer);
      }
      this.debounceTimer = setTimeout(() => {
        this.generateQR();
      }, 300);
    },

    applyTemplate(template) {
      this.inputText = template.value;
      this.generateQR();
    },

    applyColorPreset(preset) {
      this.fgColor = preset.fg;
      this.bgColor = preset.bg;
      this.generateQR();
    },

    async generateQR() {
      if (!this.isValidInput) {
        this.qrDataUrl = '';
        this.error = '';
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
        
        const canvas = document.createElement('canvas');
        await QRCode.toCanvas(canvas, this.inputText, opts);
        
        await this.overlayCompanyLogo(canvas);
        
        this.qrDataUrl = canvas.toDataURL('image/png');
        this.generatedTime = Date.now();
        
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
        this.error = `Error: ${err.message}`;
      } finally {
        this.isGenerating = false;
      }
    },
    
    async overlayCompanyLogo(canvas) {
      if (!this.logoEnabled) {
        return Promise.resolve();
      }
      
      return new Promise((resolve, reject) => {
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = () => {
          const logoSizeRatio = this.logoSize / 100;
          const maxLogoSize = canvas.width * logoSizeRatio;
          
          let logoWidth, logoHeight;
          if (img.width > img.height) {
            logoWidth = maxLogoSize;
            logoHeight = (img.height / img.width) * maxLogoSize;
          } else {
            logoHeight = maxLogoSize;
            logoWidth = (img.width / img.height) * maxLogoSize;
          }
          
          const x = (canvas.width - logoWidth) / 2;
          const y = (canvas.height - logoHeight) / 2;
          
          const padding = logoWidth * 0.15;
          const radius = 8;
          
          // Draw rounded rectangle background
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(x - padding, y - padding, logoWidth + padding * 2, logoHeight + padding * 2, radius);
          ctx.fill();
          
          // Add subtle shadow
          ctx.shadowColor = 'rgba(0, 0, 0, 0.1)';
          ctx.shadowBlur = 10;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 2;
          
          ctx.drawImage(img, x, y, logoWidth, logoHeight);
          
          // Reset shadow
          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;
          
          resolve();
        };
        
        img.onerror = () => {
          console.warn('Logo not found, generating QR without logo');
          resolve();
        };
        
        img.src = this.companyLogoSrc;
      });
    },
    
    saveToHistory() {
      // Don't save duplicates
      const isDuplicate = this.history.some(item => 
        item.text === this.inputText && 
        item.fgColor === this.fgColor && 
        item.bgColor === this.bgColor
      );
      
      if (isDuplicate) return;

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
        logoEnabled: this.logoEnabled,
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
        localStorage.setItem('qr_generator_history', JSON.stringify(this.history));
      } catch (err) {
        console.error('Failed to save history:', err);
      }
    },
    
    loadHistory() {
      try {
        const stored = localStorage.getItem('qr_generator_history');
        if (stored) {
          this.history = JSON.parse(stored);
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
      this.logoEnabled = entry.logoEnabled !== undefined ? entry.logoEnabled : true;
      
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
      if (confirm('Clear all history? This cannot be undone.')) {
        this.history = [];
        this.persistHistory();
      }
    },
    
    downloadQR() {
      if (!this.qrDataUrl) return;
      
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      const fileName = `qrcode-${timestamp}.${this.format}`;
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

    async shareQR() {
      if (!this.qrDataUrl || !this.canShare) return;
      
      try {
        const blob = await (await fetch(this.qrDataUrl)).blob();
        const file = new File([blob], 'qrcode.png', { type: 'image/png' });
        
        await navigator.share({
          title: 'QR Code',
          text: this.inputText,
          files: [file]
        });
      } catch (err) {
        if (err.name !== 'AbortError') {
          this.error = 'Failed to share QR code';
        }
      }
    },
    
    formatDate(iso) {
      const date = new Date(iso);
      const now = new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      
      return date.toLocaleDateString();
    },

    formatRelativeTime() {
      if (!this.generatedTime) return 'just now';
      
      const seconds = Math.floor((Date.now() - this.generatedTime) / 1000);
      
      if (seconds < 10) return 'just now';
      if (seconds < 60) return `${seconds}s ago`;
      
      const minutes = Math.floor(seconds / 60);
      if (minutes < 60) return `${minutes}m ago`;
      
      const hours = Math.floor(minutes / 60);
      return `${hours}h ago`;
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
  height: 6px;
}

input[type="range"]::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
}

input[type="range"]::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: #4f46e5;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(79, 70, 229, 0.3);
  border: none;
}

canvas {
  image-rendering: crisp-edges;
  image-rendering: -moz-crisp-edges;
  image-rendering: -webkit-crisp-edges;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.group:hover img {
  transform: scale(1.05);
  transition: transform 0.2s;
}
</style>