# Cuentos y Tarjetas 🇦🇷🇨🇴

אפליקציה אישית ללימוד ספרדית (ספרדית → אנגלית), לטלפון. אוצר מילים והבנת הנקרא, בספרדית של אמריקה הלטינית.

A personal mobile-first Spanish learning app (Spanish → English), Latin American Spanish.

## מה יש בה
- **סיפורים מדורגים** (Inicial A2 / Intermedio B1 / Avanzado B2): הקשה על מילה פותחת תרגום, הקראה עם הדגשת משפט, שאלות הבנה.
- **כרטיסיות עם FSRS-4.5**: מצב מעורב, רק חזרות, רק חדשות, חזרה חופשית, סלנג לטיני. תרגול בלי הגבלה.
- **סלנג של ארגנטינה וקולומביה**: 47 ביטויים עם משפטי דוגמה, וסיפורים מבואנוס איירס וממדג'ין.
- **זמנים ונטיות**: 10 זמנים (כולל estar + gerundio, ir a, perfecto, pluscuamperfecto), 29 פעלים, כולל vos.
- **מבחן רמה** אדפטיבי, **סיפורים חדשים עם Claude**, **ימי תרגול**.

## פיתוח
```bash
node build.js                 # src/ → index.html
node tests/check-gloss.js     # כל מילה בסיפורים מתורגמת
CHROME_PATH=/usr/bin/google-chrome python3 tests/e2e.py   # בדיקות בדפדפן (Playwright)
```
`index.html` נבנה אוטומטית — עורכים רק את `src/`. האפיון והמחקר: [`docs/SPEC.md`](docs/SPEC.md).

## אפליקציה חיה
https://claude.ai/artifact/VG9uPZPJy9F59EmkXEDXZc
