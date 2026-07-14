export default function Home() {
  const calendarUrl =
    process.env.NEXT_PUBLIC_CALENDAR_URL ||
    "https://YOUR-PROJECT.vercel.app/api/calendar";

  const webcalUrl = calendarUrl.replace(/^https?:\/\//, "webcal://");

  return (
    <main
      style={{
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        background: "#f5f5f5",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <section
        style={{
          width: "100%",
          maxWidth: "680px",
          background: "#ffffff",
          borderRadius: "18px",
          padding: "40px 28px",
          textAlign: "center",
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        <h1 style={{ marginTop: 0 }}>تقويم الاتحاد السعودي للسهام</h1>

        <p style={{ lineHeight: 1.9, color: "#555" }}>
          اشترك في التقويم لمتابعة البطولات والمعسكرات والفعاليات القادمة.
        </p>

        <a
          href={webcalUrl}
          style={{
            display: "inline-block",
            marginTop: "16px",
            padding: "14px 28px",
            background: "#111111",
            color: "#ffffff",
            textDecoration: "none",
            borderRadius: "10px",
            fontSize: "18px",
            fontWeight: "bold",
          }}
        >
          الاشتراك في التقويم
        </a>

        <p style={{ marginTop: "24px", fontSize: "14px", color: "#777" }}>
          بعد رفع المشروع على Vercel، حدّث متغير البيئة
          NEXT_PUBLIC_CALENDAR_URL برابط التقويم.
        </p>
      </section>
    </main>
  );
}
