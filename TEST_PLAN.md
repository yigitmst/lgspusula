# LGSPusula Test Planı

## Kapsam
Bu sürüm **demo prototiptir**, önceki uygulamanın tüm işlevlerini veya gerçek kullanıcı altyapısını içermez.

### Manuel kabul testleri
1. Öğrenci / Öğretmen / Veli demo görünümü değiştirilir; başlık metni değişir. Bunlar yetkilendirme değildir.
2. Çalışma ekle / tamamlandı işaretle / sil; rapor oranı güncellenir.
3. Ders ekle (Almanca), seçili dersin alt bölümü aynı konumda açılır; ders silinebilir.
4. HTTPS bağlantısıyla kaynak ekle; yeni bağlantı listelenir; geçersiz HTTP kabul edilmez.
5. Sahte mentorluk notu ekle/sil.
6. Tarayıcı yenile: bilgiler localStorage üzerinden korunur.
7. Demoyu sıfırla: başlangıç verileri geri döner.
8. Mobil 390px ve masaüstü 1440px görünümü kontrol edilir.
9. HTML injection denemeleri görsel metin olarak kalır.
10. Test linki için Vercel koruması ve gerçek erişim ayrıca doğrulanır.

## Yayın öncesi engeller
- Gerçek öğrenci kişisel verisi için merkezi veritabanı, kimlik doğrulama, sunucu tarafı rol yetkileri, veli erişimi, audit log ve veri saklama politikası gerekir.
- İçerik doğruluğu, müfredat, video lisansları ve gerçek yapay zekâ entegrasyonu ayrıca ele alınmalıdır.
- Demo **herkese açık GitHub reposunda** duruyor; sırlar/öğrenci verileri eklenmemeli.
