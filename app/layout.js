export const metadata = {
  title: "تقويم الاتحاد السعودي للسهام",
  description: "تقويم البطولات والمعسكرات والفعاليات",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
