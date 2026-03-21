# Video Optimization Guide

## Acción Requerida: Convertir Video del Hero a WebM

El componente Hero ahora soporta formato WebM para mejor compresión y performance. Necesitas convertir tu video existente.

### Ubicación del Video Actual
- **Archivo MP4**: `public/videos/ton618-hero.mp4`

### Crear Versión WebM

#### Opción 1: Usando FFmpeg (Recomendado)
```bash
# Instalar FFmpeg si no lo tienes: https://ffmpeg.org/download.html

# Convertir con alta calidad
ffmpeg -i public/videos/ton618-hero.mp4 -c:v libvpx-vp9 -crf 30 -b:v 0 -b:a 128k -c:a libopus public/videos/ton618-hero.webm

# Para mejor compresión (archivo más pequeño)
ffmpeg -i public/videos/ton618-hero.mp4 -c:v libvpx-vp9 -crf 35 -b:v 0 -b:a 96k -c:a libopus public/videos/ton618-hero.webm
```

#### Opción 2: Herramientas Online
- [CloudConvert](https://cloudconvert.com/mp4-to-webm)
- [Online-Convert](https://video.online-convert.com/convert-to-webm)

### Parámetros Recomendados
- **Codec**: VP9 (mejor compresión que VP8)
- **CRF**: 30-35 (menor = mejor calidad, mayor tamaño)
- **Resolución**: Mantener original o reducir a 1920x1080 si es mayor
- **Frame Rate**: 30fps es suficiente para video de fondo
- **Audio**: Opcional (el video es muted), pero si incluyes usar Opus a 96-128k

### Beneficios Esperados
- **Reducción de tamaño**: 30-50% más pequeño que MP4
- **Mejor compresión**: VP9 es más eficiente que H.264
- **Soporte de navegadores**: Chrome, Firefox, Edge, Opera (Safari fallback a MP4)

### Fallback Automático
El componente Hero ya está configurado para:
1. Intentar cargar WebM primero (mejor compresión)
2. Si falla, usar MP4 como fallback
3. Si ambos fallan, mostrar poster estático

### Verificación
Después de agregar el archivo WebM:
```bash
# Verificar que ambos archivos existen
ls public/videos/

# Debería mostrar:
# ton618-hero.mp4
# ton618-hero.webm
```

### Optimizaciones Adicionales Aplicadas
- ✅ `preload="none"` - El video solo se carga cuando es necesario
- ✅ Soporte multi-formato (WebM + MP4)
- ✅ Degradación elegante a poster si falla
- ✅ Respeta `prefers-reduced-motion`
