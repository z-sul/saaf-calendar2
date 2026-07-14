function escapeICS(value = "") {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function toICSDate(date) {
  return new Date(date)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

export async function GET() {
  // عدّل أو أضف الفعاليات هنا.
  // الأوقات أدناه مكتوبة بتوقيت السعودية (+03:00).
  const events = [
    {
      id: "event-001",
      title: "بطولة الاتحاد السعودي للسهام",
      start: "2026-08-01T09:00:00+03:00",
      end: "2026-08-01T17:00:00+03:00",
      location: "الرياض",
      description: "بطولة الاتحاد السعودي للسهام",
    },
    {
      id: "event-002",
      title: "معسكر المنتخب الوطني",
      start: "2026-08-10T09:00:00+03:00",
      end: "2026-08-15T17:00:00+03:00",
      location: "الرياض",
      description: "معسكر تدريبي للمنتخب الوطني",
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
    .join("\r\n");

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
      "Content-Disposition": 'inline; filename="saaf-calendar.ics"',
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
