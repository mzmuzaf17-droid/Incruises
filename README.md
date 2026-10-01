# inkruiz-guliston — Gulnora Ayupova (inCruises mustaqil hamkori) sayti

Vizitkadagi QR kod shu saytga olib keladi: **https://inkruiz-guliston.vercel.app/v**
Formadan kelgan har bir lid (ism + telefon) Telegram bot orqali darhol xabar bo'lib keladi.

## Papkada nima bor

| Fayl | Vazifasi |
|---|---|
| `index.html` | Saytning o'zi: inCruises haqida ma'lumot, qadamlar, lid formasi, kontaktlar |
| `api/lead.js` | Formadan kelgan ma'lumotni tekshirib, Telegramga yuboradi |
| `vercel.json` | `/v` manzilini (QR uchun) bosh sahifaga ulaydi + xavfsizlik sozlamalari |
| `favicon.svg` | Brauzer tabidagi kichik belgi |

## 1-qadam. GitHub'ga yuklash

1. github.com → **New repository** → nomi: `inkruiz-guliston` → **Create repository**.
2. **uploading an existing file** havolasini bosing.
3. Papkadagi hamma narsani (`api` papkasi bilan birga) sudrab tashlang → **Commit changes**.

## 2-qadam. Vercel'ga ulash

1. vercel.com → **Add New… → Project** → `inkruiz-guliston` repozitoriyasini **Import** qiling.
2. **Project Name** aynan `inkruiz-guliston` bo'lsin. QR kod shu nomga bog'langan.
3. **Framework Preset: Other**. Boshqa hech narsani o'zgartirmang → **Deploy**.
4. Tekshiring: https://inkruiz-guliston.vercel.app va https://inkruiz-guliston.vercel.app/v ochilishi kerak.

> Agar Vercel boshqa manzil bergan bo'lsa (masalan, `inkruiz-guliston-xxxx.vercel.app`), vizitkani chop etmang, avval QR kodni yangilash kerak.

## 3-qadam. Telegram bot

1. Telegramda **@BotFather** → `/newbot` → nom bering → **token**ni nusxalab oling (`123456:ABC...` ko'rinishida).
2. Gulnora yangi botni ochib **Start** tugmasini bossin. Bot faqat Start bosgan odamga yoza oladi.
3. Brauzerda oching (TOKEN o'rniga o'z tokeningiz):
   `https://api.telegram.org/botTOKEN/getUpdates`
   Javobda `"chat":{"id":123456789` qismini toping. Shu raqam **chat ID**.
   Bo'sh `[]` chiqsa, botga yana bir marta "salom" deb yozing va sahifani yangilang.

## 4-qadam. Vercel'ga kalitlarni qo'shish

Vercel → loyiha → **Settings → Environment Variables**:

| Key | Value |
|---|---|
| `TELEGRAM_BOT_TOKEN` | BotFather bergan token |
| `TELEGRAM_CHAT_ID` | Gulnoraning chat ID'si. Lidlar sizga ham kelsin desangiz, vergul bilan: `111111,222222` |

Keyin **Deployments → oxirgi deploy → ⋯ → Redeploy**. Kalitlar faqat qayta deploydan keyin ishlaydi.

## 5-qadam. Sinov

1. Saytdagi formaga o'z ismingiz va raqamingizni yozib yuboring. Telegramga "Yangi lid" xabari kelishi kerak.
2. `/v` manzili orqali kirilgan lidlarda **Manba: vizitka-QR** deb yoziladi. Shundan vizitkadan nechta mijoz kelganini bilasiz.
3. Vizitkani chop etishdan oldin QR kodni telefon bilan skanerlab, sayt ochilishini tekshiring.

## Bilish foydali

- Telegram sozlanmagan bo'lsa yoki xato bersa, forma mijozga Gulnoraning telefoni va Telegram kanalini ko'rsatadi, mijoz yo'qolmaydi.
- Spamga qarshi: yashirin maydon va "juda tez yuborildi" tekshiruvi bor.
- Lidlar hech qayerda saqlanmaydi, faqat Telegramga yuboriladi. Telegram chatini o'chirmang.
