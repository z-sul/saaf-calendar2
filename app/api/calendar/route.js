from pathlib import Path
import zipfile, json, textwrap, shutil

base = Path("/mnt/data/saaf-calendar-direct")
if base.exists():
    shutil.rmtree(base)
(base / "app" / "api" / "calendar").mkdir(parents=True, exist_ok=True)

(base / "package.json").write_text(json.dumps({
    "name": "saaf-calendar-direct",
    "version": "1.0.0",
    "private": True,
    "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start"
    },
    "dependencies": {
        "next": "15.2.6",
        "react": "19.0.0",
        "react-dom": "19.0.0"
    }
}, indent=2), encoding="utf-8")

(base / ".gitignore").write_text("node_modules\n.next\n.vercel\n.env*\n", encoding="utf-8")

(base / "app" / "layout.js").write_text("""export const metadata = {
  title: "تقويم الاتحاد السعودي للسهام",
  description: "تحميل والاشتراك في تقويم الاتحاد السعودي للسهام",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
""", encoding="utf-8")

(base / "app" / "page.js").write_text("""export default function Home() {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://saaf-calendar2-pi.vercel.app";

  const downloadUrl = `${baseUrl}/api/calendar`;
  const subscribeUrl = downloadUrl.replace(/^https?:\\/\\//, "webcal://");

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f4f6f8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "700px",
          background: "#fff",
          borderRadius: "18px",
          padding: "44px 28px",
          textAlign: "center",
          boxShadow: "0 12px 32px rgba(0,0,0,0.09)",
        }}
      >
        <h1 style={{ marginTop: 0, marginBottom: "14px" }}>
          تقويم الاتحاد السعودي للسهام
        </h1>

        <p style={{ color: "#555", lineHeight: 1.9, marginBottom: "28px" }}>
          حمّل ملف التقويم مباشرة أو اشترك فيه لتظهر الفعاليات في تطبيق التقويم.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <a
            href={downloadUrl}
            style={{
              display: "inline-block",
              padding: "14px 26px",
              background: "#111",
              color: "#fff",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            تحميل التقويم مباشرة
          </a>

          <a
            href={subscribeUrl}
            style={{
              display: "inline-block",
              padding: "14px 26px",
              background: "#e9edf1",
              color: "#111",
              textDecoration: "none",
              borderRadius: "10px",
              fontWeight: "bold",
            }}
          >
            الاشتراك في التقويم
          </a>
        </div>

        <p style={{ marginTop: "26px", fontSize: "14px", color: "#777" }}>
          رابط التحميل عام ولا يحتاج إلى تسجيل دخول.
        </p>
      </section>
    </main>
  );
}
""", encoding="utf-8")

(base / "app" / "api" / "calendar" / "route.js").write_text("""function escapeICS(value = "") {
  return String(value)
    .replace(/\\\\/g, "\\\\\\\\")
    .replace(/\\r?\\n/g, "\\\\n")
    .replace(/,/g, "\\\\,")
    .replace(/;/g, "\\\\;");
}

function toICSDate(date) {
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\\.\\d{3}Z$/, "Z");
}

export async function GET() {
  const events = [
    {
      id: "test-001",
      title: "تجربة تقويم الاتحاد",
      start: "2026-07-20T09:00:00+03:00",
      end: "2026-07-20T11:00:00+03:00",
      location: "الرياض",
      description: "فعالية تجريبية لاختبار تحميل تقويم الاتحاد.",
    },
  ];

  const now = toICSDate(new Date());

  const calendarEvents = events
    .map(
      (event) => `BEGIN:VEVENT
UID:${escapeICS(event.id)}@saaf.events
DTSTAMP:${now}
DTSTART:${toICSDate(event.start)}
DTEND:${toICSDate(event.end)}
SUMMARY:${escapeICS(event.title)}
LOCATION:${escapeICS(event.location)}
DESCRIPTION:${escapeICS(event.description)}
STATUS:CONFIRMED
END:VEVENT`
    )
    .join("\\r\\n");

  const calendar = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Saudi Archery Federation//Events Calendar//AR
CALSCALE:GREGORIAN
METHOD:PUBLISH
X-WR-CALNAME:تقويم الاتحاد السعودي للسهام
X-WR-CALDESC:بطولات ومعسكرات وفعاليات الاتحاد السعودي للسهام
X-WR-TIMEZONE:Asia/Riyadh
${calendarEvents}
END:VCALENDAR`;

  return new Response(calendar, {
    status: 200,
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="saaf-calendar.ics"',
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
""", encoding="utf-8")

(base / "README.md").write_text("""# تقويم الاتحاد السعودي للسهام

هذه النسخة تدعم:

- تحميل ملف التقويم مباشرة بدون تسجيل دخول.
- زر اشتراك بصيغة webcal.
- فعالية تجريبية جاهزة.

ارفع محتويات المجلد إلى GitHub، وسيعيد Vercel النشر تلقائيًا.

تعديل الفعاليات من:
`app/api/calendar/route.js`
""", encoding="utf-8")

zip_path = Path("/mnt/data/saaf-calendar-direct-ready.zip")
if zip_path.exists():
    zip_path.unlink()

with zipfile.ZipFile(zip_path, "w", zipfile.ZIP_DEFLATED) as z:
    for file in base.rglob("*"):
        if file.is_file():
            z.write(file, file.relative_to(base.parent))

print(f"Created: {zip_path}")
