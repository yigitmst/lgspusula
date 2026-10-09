# LGSPusula — 7 Ekim 2026 kaynak kodu arşivi

Bu paket, son yayımlanan çalışan sürümün Git kaynaklarını aynen içerir.
Kaynak commit: `43a061f7112b8c1f946f6eade8d06625990e6e65`.
Sites sürümü: 16 (`appgver_ecd7d91c016c8191b2d9d5abeefd1d9c`).
Yayımlanma: 7 Ekim 2026, 20:26 UTC.
Demo adresi: https://lgs-pusula-demo.yigitmst.chatgpt.site

## İçerik ve değişiklik sınırı

Orijinal uygulama kaynaklarına, tasarımına veya işlevlerine dokunulmadı.
`app`, `components`, `hooks`, `lib`, `db`, `drizzle`, `public`, `build`,
`scripts`, `tests`, `examples`, `vendor` ve tüm takip edilen kök yapılandırmaları
dahil. Avatarlar, hareketli tema görselleri ve stiller de bulunur.
`package.json`, `pnpm-lock.yaml` ve pnpm çalışma alanı ayarları dahil.
Bağımlılıklar kurulumda lockfile üzerinden yüklenir; `node_modules` taşınmaz.
Derlenmiş çıktılar, Git geçmişi, yerel veritabanları, oturumlar, kullanıcıların
yüklediği R2 fotoğrafları ve gizli anahtarlar aktarılmaz.
Örnek öğrenci verileri `lib/seed.json` içinde, tablolar dört SQL migration içinde.
Bu arşiv canlı veritabanı yedeği değildir.

Yalnızca bu açıklama, `.env.example`, `export/configure-cloudflare.mjs` ve
`EXPORT_MANIFEST.json` dışa aktarma amacıyla eklendi. Manifest, her orijinal
dosyanın SHA-256 değerini içerir. Orijinal `README.md` başlangıç şablonuna aittir;
güncel demo kurulumunda bu açıklamayı esas alın.

## Yerel kurulum

Node.js >=22.13.0 ve package.json'daki pnpm sürümünü kullanın.
Arşivi açın ve proje klasöründe:

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm run build
```

Yerel DB tablolarını ilk kurulumda sırayla oluşturun:

```sh
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_true_skreet.sql
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0001_whole_agent_zero.sql
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0002_gigantic_banshee.sql
pnpm exec wrangler d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0003_tearful_cammi.sql
pnpm run dev
```

Zaten uygulanmış SQL dosyalarını tekrar çalıştırmayın. Terminalde yazan yerel
adresi açın. Demo kullanıcı adı `Admin`, şifre `Admin` (mevcut davranış korunmuştur).
Demo, uygulamaya gömülü örnek verileri ilk kullanımda oluşturur.
Yeni ortamda kurulum/çalıştırma ayrıca doğrulanmalıdır; arşiv doğrulaması dosya
bütünlüğü ve orijinal kaynak eşitliği üzerindendir.

## Cloudflare ve veritabanı

Sunucu `cloudflare:workers` üzerinden `DB` (D1) ve `BUCKET` (R2) kullanır.
SQL şemaları `drizzle/`, veri erişimi `db/`, bağlama tipleri
`cloudflare-env.d.ts`, yerel bağlama ayarları `vite.config.ts` içindedir.
Kök `wrangler.jsonc` yoktur; build `dist/server/wrangler.json` üretir.
`.openai/hosting.json` orijinal Sites tanımlamasıdır; proje kimliği gizli anahtar
değildir. Yeni bağımsız Cloudflare hesabınıza bağlantı sağlamaz.

Bağımsız Cloudflare test ortamı için kendi D1 veritabanınızı ve R2 bucket'ınızı
oluşturun. `.env.example` dosyasını yerelde `.env` olarak kopyalayın, kendi
kimliklerinizi girin. Wrangler oturumunu kendi hesabınızla açabilir ya da API
token'ını yalnızca yerel/CI gizli değişkeni olarak sağlayabilirsiniz.
Build sonrasında bağlamaları kendi kaynaklarınıza yönlendirmek için:

```sh
node --env-file=.env export/configure-cloudflare.mjs
pnpm exec wrangler d1 migrations apply DB --remote --config dist/server/wrangler.json
pnpm exec wrangler deploy --config dist/server/wrangler.json
```

Son iki komut yeni uzak ortamda tabloları oluşturur ve yayın yapar; yalnızca
yayınlamaya hazır olduğunuzda çalıştırın. Her yeni build'den sonra yapılandırma
adımını yeniden çalıştırın. Token dosyaya veya GitHub'a eklenmemelidir.

## GitHub: yigitmst/lgspusula

Arşiv içindeki proje klasörünün içeriğini deponun köküne aktarın; gizli dosyaları
da dahil edin. Repo zaten doluysa mevcut içeriği ve değişiklikleri önce inceleyin.
Orijinal `.gitignore`, `.env*` desenini dışlar. Şablonu Git'e eklemek için:

```sh
git add -f .env.example
```

Gerçek `.env` dosyasını eklemeyin. Diğer kaynakları normal Git akışınızla ekleyin.
Arşivde GitHub/Vercel hesabına erişim bilgisi bulunmaz.

## Vercel test sürümü için durum

Bu kaynak sürümü Vinext + Cloudflare Workers/D1/R2 mimarisindedir.
Standart Next.js/Vercel projesi olarak doğrudan çalışacağı garanti edilmez.
Özellikle `cloudflare:workers` importları, D1 sorguları, R2 fotoğraf API'leri
ve Worker build/başlatma akışı Vercel sunucu ortamına uyarlanmalıdır.
Vercel'e sadece ortam değişkeni eklemek DB/BUCKET nesnelerini oluşturmaz.

Tasarımı ve işlevleri değiştirmeme talebiniz nedeniyle bu pakette platform
göçü yapılmadı. Yanıltıcı bir `vercel.json` eklenmedi. GitHub'a kaynak aktarımı
için paket tamdır; Vercel yayını ayrı bir uyarlama ve uçtan uca doğrulama gerektirir.
