<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-4">
    <div class="max-w-4xl mx-auto">
      <header class="text-center mb-8 pt-8">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">QR Code Scanner</h1>
        <p class="text-gray-600">Scan QR codes using your camera or upload an image</p>
      </header>

      <div class="grid lg:grid-cols-2 gap-6">
        <!-- Scanner Panel -->
        <div class="bg-white rounded-2xl shadow-xl p-6 space-y-6">
          <div class="flex gap-3 mb-4">
            <button
              @click="scanMode = 'camera'"
              :class="[
                'flex-1 px-4 py-3 font-semibold rounded-lg transition',
                scanMode === 'camera'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                Camera
              </div>
            </button>
            <button
              @click="scanMode = 'upload'"
              :class="[
                'flex-1 px-4 py-3 font-semibold rounded-lg transition',
                scanMode === 'upload'
                  ? 'bg-purple-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              ]"
            >
              <div class="flex items-center justify-center gap-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                </svg>
                Upload
              </div>
            </button>
          </div>

          <!-- Camera Mode -->
          <div v-if="scanMode === 'camera'" class="space-y-4">
            <div class="relative bg-gray-900 rounded-lg overflow-hidden aspect-square">
              <video
                ref="videoElement"
                autoplay
                playsinline
                class="w-full h-full object-cover"
                :class="{ 'hidden': !isCameraActive }"
              ></video>
              
              <canvas
                ref="canvasElement"
                class="hidden"
              ></canvas>

              <!-- Scanning Overlay -->
              <div v-if="isCameraActive && isScanning" class="absolute inset-0 flex items-center justify-center">
                <div class="relative w-64 h-64">
                  <div class="absolute inset-0 border-4 border-purple-500 rounded-lg animate-pulse"></div>
                  <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-lg"></div>
                  <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-lg"></div>
                  <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-lg"></div>
                  <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-lg"></div>
                </div>
              </div>

              <!-- Placeholder -->
              <div v-if="!isCameraActive" class="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
                <svg class="w-20 h-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
                <p class="text-sm">Camera not active</p>
              </div>
            </div>

            <div class="flex gap-3">
              <button
                v-if="!isCameraActive"
                @click="startCamera"
                class="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                Start Camera
              </button>
              <button
                v-else
                @click="stopCamera"
                class="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z"/>
                </svg>
                Stop Camera
              </button>
            </div>

            <!-- Camera Selection -->
            <div v-if="cameras.length > 1">
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Select Camera
              </label>
              <select
                v-model="selectedCamera"
                @change="switchCamera"
                class="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
              >
                <option v-for="camera in cameras" :key="camera.deviceId" :value="camera.deviceId">
                  {{ camera.label || `Camera ${cameras.indexOf(camera) + 1}` }}
                </option>
              </select>
            </div>
          </div>

          <!-- Upload Mode -->
          <div v-if="scanMode === 'upload'" class="space-y-4">
            <div
              @drop.prevent="handleFileDrop"
              @dragover.prevent
              @dragenter="isDragging = true"
              @dragleave="isDragging = false"
              :class="[
                'border-4 border-dashed rounded-lg p-8 text-center cursor-pointer transition',
                isDragging
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-300 hover:border-purple-400'
              ]"
              @click="$refs.fileInput.click()"
            >
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                @change="handleFileSelect"
                class="hidden"
              />
              
              <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"/>
              </svg>
              
              <p class="text-lg font-semibold text-gray-700 mb-2">
                Drop image here or click to upload
              </p>
              <p class="text-sm text-gray-500">
                Supports: JPG, PNG, GIF, WebP
              </p>
            </div>

            <div v-if="uploadedImage" class="relative bg-gray-100 rounded-lg p-4">
              <img :src="uploadedImage" alt="Uploaded image" class="max-w-full h-auto mx-auto rounded" />
              <button
                @click="clearUpload"
                class="absolute top-6 right-6 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Error Display -->
          <div v-if="error" class="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
            <p class="text-red-700 text-sm">{{ error }}</p>
          </div>
        </div>

        <!-- Results Panel -->
        <div class="space-y-6">
          <!-- Current Result -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <h2 class="text-xl font-bold text-gray-800 mb-4">Scan Result</h2>
            
            <div v-if="currentResult" class="space-y-4">
              <div class="p-4 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg">
                <p class="text-sm font-semibold text-purple-900 mb-2">Decoded Content:</p>
                <p class="text-gray-800 break-all">{{ currentResult.text }}</p>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button
                  v-if="isUrl(currentResult.text)"
                  @click="openUrl(currentResult.text)"
                  class="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                  </svg>
                  Open URL
                </button>
                
                <button
                  @click="copyResult"
                  class="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition flex items-center justify-center gap-2"
                  :class="{ 'col-span-2': !isUrl(currentResult.text) }"
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

              <div class="text-xs text-gray-500 text-center">
                Scanned {{ formatDate(currentResult.timestamp) }}
              </div>
            </div>
            
            <div v-else class="flex flex-col items-center justify-center py-16 text-gray-400">
              <svg class="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"/>
              </svg>
              <p class="text-lg">No QR code scanned yet</p>
            </div>
          </div>

          <!-- Scan History -->
          <div class="bg-white rounded-2xl shadow-xl p-6">
            <div class="flex justify-between items-center mb-4">
              <h2 class="text-xl font-bold text-gray-800">Scan History</h2>
              <button
                v-if="scanHistory.length > 0"
                @click="clearHistory"
                class="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All
              </button>
            </div>
            
            <div v-if="scanHistory.length === 0" class="text-center py-8 text-gray-400">
              <p>No scan history yet</p>
            </div>
            
            <div v-else class="space-y-3 max-h-80 overflow-y-auto">
              <div
                v-for="(item, idx) in scanHistory"
                :key="item.id"
                class="p-3 border-2 border-gray-100 rounded-lg hover:border-purple-200 transition"
              >
                <p class="text-sm font-semibold text-gray-800 truncate mb-1">
                  {{ truncateText(item.text) }}
                </p>
                <p class="text-xs text-gray-500 mb-2">
                  {{ formatDate(item.timestamp) }}
                </p>
                <div class="flex gap-2">
                  <button
                    @click="restoreResult(item)"
                    class="text-xs text-purple-600 hover:text-purple-700 font-semibold"
                  >
                    View
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
</template>

<script>
import jsQR from 'jsqr';

export default {
  name: 'QRScanner',
  data() {
    return {
      scanMode: 'camera',
      isCameraActive: false,
      isScanning: false,
      currentResult: null,
      scanHistory: [],
      maxHistory: 20,
      error: '',
      copySuccess: false,
      isDragging: false,
      uploadedImage: null,
      stream: null,
      scanInterval: null,
      cameras: [],
      selectedCamera: null
    };
  },
  
  mounted() {
    this.loadHistory();
    this.getCameras();
  },
  
  beforeUnmount() {
    this.stopCamera();
  },
  
  methods: {
    async getCameras() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        this.cameras = devices.filter(device => device.kind === 'videoinput');
        if (this.cameras.length > 0) {
          this.selectedCamera = this.cameras[0].deviceId;
        }
      } catch (err) {
        console.error('Error getting cameras:', err);
      }
    },
    
    async startCamera() {
      try {
        this.error = '';
        const constraints = {
          video: {
            deviceId: this.selectedCamera ? { exact: this.selectedCamera } : undefined,
            facingMode: this.selectedCamera ? undefined : 'environment'
          }
        };
        
        this.stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.$refs.videoElement.srcObject = this.stream;
        this.isCameraActive = true;
        this.isScanning = true;
        
        // Start scanning loop
        this.scanInterval = setInterval(() => {
          this.scanFrame();
        }, 300);
      } catch (err) {
        this.error = `Camera error: ${err.message}`;
      }
    },
    
    stopCamera() {
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      if (this.scanInterval) {
        clearInterval(this.scanInterval);
        this.scanInterval = null;
      }
      this.isCameraActive = false;
      this.isScanning = false;
    },
    
    async switchCamera() {
      if (this.isCameraActive) {
        this.stopCamera();
        await this.startCamera();
      }
    },
    
    scanFrame() {
      const video = this.$refs.videoElement;
      const canvas = this.$refs.canvasElement;
      
      if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
        return;
      }
      
      canvas.height = video.videoHeight;
      canvas.width = video.videoWidth;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: 'dontInvert'
      });
      
      if (code) {
        this.handleScanResult(code.data);
        // Optional: stop camera after successful scan
        // this.stopCamera();
      }
    },
    
    handleFileSelect(event) {
      const file = event.target.files[0];
      if (file) {
        this.processImageFile(file);
      }
    },
    
    handleFileDrop(event) {
      this.isDragging = false;
      const file = event.dataTransfer.files[0];
      if (file && file.type.startsWith('image/')) {
        this.processImageFile(file);
      } else {
        this.error = 'Please drop a valid image file';
      }
    },
    
    processImageFile(file) {
      this.error = '';
      const reader = new FileReader();
      
      reader.onload = (e) => {
        this.uploadedImage = e.target.result;
        this.scanImageData(e.target.result);
      };
      
      reader.onerror = () => {
        this.error = 'Failed to read image file';
      };
      
      reader.readAsDataURL(file);
    },
    
    scanImageData(imageSrc) {
      const img = new Image();
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        
        if (code) {
          this.handleScanResult(code.data);
        } else {
          this.error = 'No QR code found in the image';
        }
      };
      
      img.onerror = () => {
        this.error = 'Failed to load image';
      };
      
      img.src = imageSrc;
    },
    
    handleScanResult(text) {
      const result = {
        id: Date.now(),
        text: text,
        timestamp: new Date().toISOString()
      };
      
      this.currentResult = result;
      this.scanHistory.unshift(result);
      
      if (this.scanHistory.length > this.maxHistory) {
        this.scanHistory = this.scanHistory.slice(0, this.maxHistory);
      }
      
      this.persistHistory();
      this.error = '';
    },
    
    clearUpload() {
      this.uploadedImage = null;
      if (this.$refs.fileInput) {
        this.$refs.fileInput.value = '';
      }
    },
    
    isUrl(text) {
      try {
        new URL(text);
        return true;
      } catch {
        return false;
      }
    },
    
    openUrl(url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    
    async copyResult() {
      if (!this.currentResult) return;
      
      try {
        await navigator.clipboard.writeText(this.currentResult.text);
        this.copySuccess = true;
        setTimeout(() => this.copySuccess = false, 2000);
      } catch (err) {
        this.error = 'Failed to copy to clipboard';
      }
    },
    
    restoreResult(item) {
      this.currentResult = item;
    },
    
    deleteFromHistory(idx) {
      this.scanHistory.splice(idx, 1);
      this.persistHistory();
    },
    
    clearHistory() {
      if (confirm('Clear all scan history?')) {
        this.scanHistory = [];
        this.persistHistory();
      }
    },
    
    persistHistory() {
      try {
        this._scanHistoryStore = JSON.stringify(this.scanHistory);
      } catch (err) {
        console.error('Failed to save history:', err);
      }
    },
    
    loadHistory() {
      try {
        if (this._scanHistoryStore) {
          this.scanHistory = JSON.parse(this._scanHistoryStore);
        }
      } catch (err) {
        console.error('Failed to load history:', err);
        this.scanHistory = [];
      }
    },
    
    formatDate(iso) {
      return new Date(iso).toLocaleString();
    },
    
    truncateText(text, len = 40) {
      return text.length > len ? text.substring(0, len) + '...' : text;
    }
  }
};
</script>

<style scoped>
input[type="range"] {
  accent-color: #9333ea;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
</style>