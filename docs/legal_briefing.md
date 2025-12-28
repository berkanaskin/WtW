# WtW Uygulaması - Hukuki Değerlendirme (Final)

**Tarih:** 28 Aralık 2025  
**Versiyon:** 3.0 (Tüm sorular yanıtlandı)

---

## ÖNEMLİ BULGULAR ÖZETİ

| Konu | Sonuç |
|------|-------|
| TMDB Attribution | ✅ Her durumda zorunlu (ticari lisans dahil) |
| YouTube API | ✅ Mevcut kullanım güvenli |
| OMDB API | ⚠️ **Ticari kullanım YASAK** - alternatif gerekli |

---

## 1. TMDB ATTRİBUTION - DETAYLI CEVAP

### Soru: "TMDB ile ticari anlaşma yapsam da zorunlu mu?"

**CEVAP: EVET, her durumda zorunlu.**

TMDB şartları açıkça belirtiyor:
> "You must use the TMDB logo to identify Your use of TMDB... You must place the following notice prominently in or on Your Application"

### Ticari Lisans Olsa Bile

- Logo kullanımı ✅ Zorunlu
- Disclaimer metni ✅ Zorunlu
- "Approved by TMDB ibaresi" ❌ Yazılamaz

### Gerekli Metin

```
"Bu uygulama TMDB API'sini kullanmaktadır ancak TMDB tarafından 
onaylanmış, sertifikalandırılmış veya desteklenmemektedir."
```

### Nereye Konulmalı

- Ayarlar > Hakkında sayfası
- Footer'da küçük metin
- TMDB logosu ile birlikte

---

## 2. YOUTUBE API - DETAYLI ANALİZ

### Soru: "Bizim kullandığımız şekliyle yasal sıkıntı var mı?"

**CEVAP: HAYIR, mevcut kullanımınız güvenli.**

### Mevcut Kullanım Analizi

| Özellik | Kodda Var mı? | Yasal mı? |
|---------|---------------|-----------|
| iFrame ile video embed | ✅ Var | ✅ İzinli |
| Video araması | ✅ Var | ✅ İzinli |
| Thumbnail gösterimi | ✅ Var | ✅ İzinli |
| Video indirme | ❌ Yok | ❌ Yasak |
| Video üzerine reklam | ❌ Yok | ❌ Yasak |
| YouTube dışı player | ❌ Yok | ❌ Yasak |

### Ticari Uygulamada YouTube Kullanım Şartları

✅ **İZİNLİ:**

- Film fragmanlarını iFrame ile göstermek
- YouTube Search API ile arama yapmak
- Uygulamanın başka yerlerinde reklam göstermek

❌ **YASAK:**

- Video oynatıcı üzerine/etrafına kendi reklamını koymak
- Sadece YouTube videoları toplamak için site kurmak
- Video indirme özelliği sunmak
- Player fonksiyonlarını değiştirmek

### Kod İncelemesi (`api.js`)

```javascript
// Mevcut kullanım - GÜVENLİ
async searchYouTube(query, maxResults = 8) {...}  // ✅ OK
async getMovieVideos(movieTitle, year) {...}      // ✅ OK
getYouTubeThumbnail(videoId) {...}                // ✅ OK
```

### Eklenecekler

- YouTube Terms of Service linki (footer)
- "YouTube is a trademark of Google Inc." ibaresi

---

## 3. OMDB API - KRİTİK SORUN

### Soru: "OMDB'de sıkıntı yaşamaz mıyım?"

**CEVAP: EVET, ticari kullanımda SIKIINTI YAŞARSIN.**

### OMDB Lisansı

```
Creative Commons Attribution-NonCommercial 4.0 International License
```

**Bu demek ki:**

- ❌ Ticari uygulamada kullanılamaz
- ❌ Reklam geliri olan uygulamada kullanılamaz
- ❌ Premium subscription olan uygulamada kullanılamaz

### Mevcut Kullanım

```javascript
// api.js satır 597-632
async getAllRatings(imdbId) {
    // OMDB'den IMDB, RT, Metacritic puanları alınıyor
    const response = await fetch(
        `https://www.omdbapi.com/?i=${imdbId}&apikey=${CONFIG.OMDB_API_KEY}`
    );
    ...
}
```

### Çözüm Seçenekleri

| Seçenek | Açıklama | Maliyet |
|---------|----------|---------|
| **A: OMDB'yi kaldır** | Puanları TMDB'den al | $0 |
| **B: movies-ratings2 API** | RapidAPI alternatifi | Mevcut RapidAPI key ile |
| **C: Patron ol** | OMDB Patreon | $1+/ay |

**ÖNERİ: Seçenek A veya B**

TMDB zaten `vote_average` sağlıyor. OMDB olmadan da çalışabilir.

---

## 4. YASAL METİNLER CHECKLIST

### Uygulama içinde eklenmesi gerekenler

#### 4.1 Gizlilik Politikası (Privacy Policy)

**Konum:** Ayarlar > Gizlilik Politikası

İçerik:

- [ ] Toplanan veriler (kullanıcı tercihleri, favoriler)
- [ ] Veri kullanım amacı
- [ ] Üçüncü taraf paylaşımları (API sağlayıcıları)
- [ ] Çerez kullanımı
- [ ] Kullanıcı hakları (silme, düzeltme)
- [ ] KVKK uyumu (Türkiye)
- [ ] GDPR uyumu (Avrupa)
- [ ] COPPA uyumu (çocuk gizliliği)
- [ ] İletişim bilgileri

#### 4.2 Kullanım Şartları (Terms of Service)

**Konum:** Ayarlar > Kullanım Şartları

İçerik:

- [ ] Hizmet tanımı
- [ ] Kullanıcı yükümlülükleri
- [ ] Fikri mülkiyet hakları
- [ ] Sorumluluk sınırlaması
- [ ] Değişiklik hakkı
- [ ] Uygulanacak hukuk

#### 4.3 Attribution (Kaynak Belirtme)

**Konum:** Ayarlar > Hakkında

```
Veri Kaynakları:
────────────────
[TMDB Logo]
Bu uygulama TMDB API'sini kullanmaktadır ancak TMDB 
tarafından onaylanmış veya desteklenmemektedir.

YouTube is a trademark of Google Inc.
```

#### 4.4 Telif İletişimi (DMCA)

**Konum:** Ayarlar > Telif Hakkı

```
Telif Hakkı Bildirimi
────────────────────
İçerikle ilgili telif hakkı ihlali taleplerinizi 
aşağıdaki adrese iletebilirsiniz:

📧 copyright@wtw-app.com

DMCA uyarısı aldığımız içerikler 24 saat içinde 
kaldırılacaktır.
```

---

## 5. ÖZET KARAR MATRİSİ

### Monetizasyon için Gerekli Değişiklikler

| API | Mevcut | Değişiklik Gerekli |
|-----|--------|-------------------|
| TMDB | ✅ OK | Attribution ekle |
| Streaming | ➕ Yeni | Entegre et |
| YouTube | ✅ OK | ToS linki ekle |
| OMDB | ❌ Sorunlu | Kaldır veya değiştir |

### Yasal Metinler

| Belge | Durum | Öncelik |
|-------|-------|---------|
| Privacy Policy | 📝 Hazırlanacak | 🔴 Kritik |
| Terms of Service | 📝 Hazırlanacak | 🔴 Kritik |
| Attribution | 📝 Eklenecek | 🔴 Kritik |
| DMCA Contact | 📝 Eklenecek | 🟡 Önemli |

---

## 6. SONRAKI ADIMLAR

1. **OMDB'yi kaldır veya değiştir** → Ticari kullanım için zorunlu
2. **Streaming Availability API ekle** → Gelir için yasal dayanak
3. **Yasal metinler hazırla** → Gizlilik + Kullanım Şartları
4. **Attribution ekle** → TMDB logo + disclaimer
5. **Avukata danış** → Son kontrol

---

*Bu döküman teknik değerlendirme amaçlıdır, hukuki tavsiye niteliği taşımaz.*
