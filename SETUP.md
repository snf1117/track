
# הגדרת המערכת על שרת לינוקס

## דרישות מקדימות
```bash
# התקן Node.js ו-npm
sudo apt update
sudo apt install nodejs npm

# או עבור Fedora/CentOS:
sudo dnf install nodejs npm
```

## התקנה
1. **שכפל את הפרויקט מ-GitHub**
2. **התקן תלויות עבור הקליינט:**
```bash
npm install
```

3. **התקן תלויות עבור השרת:**
```bash
cd server
npm install
cd ..
```

## הגדרת המייל
**חשוב!** ערוך את הקובץ `server/index.js` ועדכן את הגדרות המייל:

```javascript
const transporter = nodemailer.createTransporter({
  service: 'gmail', // או ספק המייל שלך
  auth: {
    user: 'your-email@gmail.com', // המייל שלך
    pass: 'your-app-password' // סיסמת אפליקציה של Gmail
  }
});
```

### יצירת סיסמת אפליקציה ב-Gmail:
1. כנס להגדרות Google Account
2. Security → 2-Step Verification
3. App passwords → יצר סיסמת אפליקציה חדשה
4. השתמש בסיסמה הזו בקוד

## הרצה
1. **הפעל את השרת:**
```bash
cd server
npm start
```
השרת ירוץ על http://localhost:3001

2. **בטרמינל נפרד, הפעל את הקליינט:**
```bash
npm run dev
```
האתר יהיה זמין על http://localhost:8080

## גישה מהרשת
אם אתה רוצה שאחרים יוכלו לגשת מהרשת:
```bash
# הרץ את הקליינט עם גישה לרשת
npm run dev -- --host 0.0.0.0
```

## פרטי הכניסה
- **מנהל ברירת מחדל:** 
  - שם משתמש: `admin`
  - סיסמה: `admin123`

## מה יעבוד:
✅ בסיס נתונים SQLite מקומי  
✅ שליחת מיילים אמיתיים  
✅ הרשמה וכניסה אמיתית  
✅ יצירת משלוחים עם מעקב  
✅ עדכון סטטוס עם מיילים  
✅ פאנל ניהול מלא  

## קבצי הנתונים:
- `shipments.db` - בסיס הנתונים (נוצר אוטומטית)
- כל הנתונים נשמרים וזמינים בין הפעלות

## פתרון בעיות:
- ודא שהשרת רץ על פורט 3001
- בדוק שהגדרות המייל נכונות
- ודא שלא חוסמים פורטים בחומת האש
