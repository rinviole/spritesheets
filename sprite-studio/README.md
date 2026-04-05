# Sprite Studio 🍌

Nano Banana (Gemini Image API) ile sprite sheet animasyon üreticisi.

## Netlify'a Deploy

### 1. GitHub'a yükle
```bash
git init
git add .
git commit -m "sprite studio"
git remote add origin https://github.com/KULLANICI_ADI/sprite-studio.git
git push -u origin main
```

### 2. Netlify'da yeni site oluştur
- netlify.com → "Add new site" → "Import an existing project"
- GitHub repo'nu seç
- Build settings otomatik algılanır (netlify.toml sayesinde)

### 3. Environment Variables ekle
Netlify Dashboard → Site → Environment Variables:

| Key | Value |
|-----|-------|
| `GEMINI_API_KEY` | Google AI Studio'dan aldığın key |
| `APP_PASSWORD` | Kendi belirlediğin şifre (örn: spritemaster42) |

### 4. Deploy et
"Deploy site" butonuna bas, 1-2 dakikada yayında.

## Kullanım
- Siteye git → şifreni gir → karakterini yükle → animasyon üret

## Maliyet
- Nano Banana (gemini-2.5-flash-image): ~$0.039 / frame
- 6 frame animasyon: ~$0.23
- Google AI Studio günlük ücretsiz kota: ~50 istek
