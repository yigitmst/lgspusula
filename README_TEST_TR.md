# LGSPusula — orijinal sürümün Vercel test dalı

Temel: 7 Ekim 2026 son çalışan Sites sürümü, kaynak commit
`43a061f7112b8c1f946f6eade8d06625990e6e65`. GitHub'a eksiksiz aktarım commit'i
`939955bc1ba8e8055bb47ecafee5573820cedaf8`.

Dal: `development/original-2026-10-07-vercel`. `main` değiştirilmez.
Eski tek dosyalık demo: `backup/simple-demo-2026-10-09`.

## Kurulum ve çalıştırma

Node.js 24.x, pnpm 11.25.0 kullanın.

```sh
corepack enable
pnpm install --frozen-lockfile
```

`.env.example` dosyasını `.env.local` olarak kopyalayın.
`LGS_RUNTIME=vercel-demo` ve kendi **private** Vercel Blob mağazanızın
`BLOB_READ_WRITE_TOKEN` değerini yerel dosyada tanımlayın. Gerçek token'ı
GitHub'a, ZIP'e veya istemciye koymayın.

```sh
pnpm run build:vercel
pnpm run start:vercel
```

Geliştirme: `pnpm run dev:vercel`. Demo giriş: `Admin` / `Admin`.
Öğretmen ve öğrenci rolleri demo ayarlarından seçilir. Veli için ayrı oturum
ekranı orijinal sürümde yoktur; öğretmen aile görüşmelerini mentorluk bölümünde tutar.

## Veri ve platform sınırı

Orijinal Worker/D1/R2 kaynakları, build dosyaları ve SQL migration'ları korunur.
Cloudflare için eski `build`, `dev`, `start` komutları halen ayrı akıştır.
Vercel test akışı `next build --webpack` kullanır; `cloudflare:workers` importu
sunucuda `lib/runtime/vercel-bindings.ts` test uyumluluk katmanına yönlendirilir.

Bu katman aynı SQL sorgularını Node SQLite ile çalıştırır. Her demo girişinin
veritabanı ayrı **private Blob** dosyasına kaydedilir; fotoğraflar da private
Blob'da saklanır. Yerel `/tmp` dosyası sadece işlem sırasında kullanılır ve silinir.
ETag koşullu yazımları, iki sekmenin aynı kaydı sessizce ezmesini engeller.
Tüm eski API alan doğrulamaları, görünürlük kuralları ve kayıt revizyonları korunur.
Bu, küçük demo için test depolamasıdır; gerçek öğrenciler için üretim veritabanı değildir.
Canlı Sites D1/R2 kaynaklarına, gerçek öğrenci verilerine ve canlı oturumlara bağlanmaz.

Vercel projesi: `lgspusula-test`. Mağaza: `lgspusula-test-private`.
Blob token yalnızca preview/development ortamlarına tanımlıdır.
Deployment preview olarak oluşturulur; production yayınına terfi ettirilmez.
Vercel kimlik doğrulama koruması korunur. URL'yi görmek için önce Vercel erişimi,
ardından uygulamanın demo girişi gerekir.

## Bu dalın ekran değişiklikleri

Öğretmen → Öğrencilerim ekranında üst boşluk, demo ayarları, başlık,
sekmeler ve filtrelerin aralıkları azaltıldı. Kartlar ve avatarlar aynen korundu.
Mesaj baloncuğunun mevcut mavi zemini %80 opaklık, hafif blur ve yumuşak
gölge ile düzenlendi. Öğrenci ekranının tasarımı yeniden yapılmadı.

## Testler

```sh
pnpm test
pnpm run build:vercel
LGS_TEST_URL=http://localhost:3000 node tests/vercel-api-smoke.mjs
```

Son komut ayrı demo girişleri açar; kurmaca kaynak/kayıt/mesaj/fotoğraf
işlemlerini, ziyaretçi ayrımını, sıfırlamayı ve çıkışı doğrular. Gerçek veri girmeyin.
Korunan uzak test deployment'ında testi çalıştırmak için yetkili oturum gerekir.

Sonraki revizyonlarda yalnızca istenen ekran değişikliği bu dala commit edilir,
testler ve build çalıştırılır, yeni preview deployment bağlantısı paylaşılır.
Ana dala geçiş için ayrıca kullanıcı onayı alınır.
