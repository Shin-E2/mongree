export function inactivityReminderEmailHtml({ nickname, lastDiaryDate }: { nickname: string; lastDiaryDate: string }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;padding:40px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(140,100,70,0.10)">
        <tr><td style="background:linear-gradient(135deg,#F0F8FF,#E0EEFF);padding:36px 40px;text-align:center">
          <div style="font-size:48px;margin-bottom:12px">😴</div>
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#2C3A5A">몽이가 기다리고 있어요</h1>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <p style="margin:0 0 16px;font-size:16px;color:#3A4858">안녕하세요, ${nickname}님 👋</p>
          <p style="margin:0 0 20px;font-size:15px;color:#4A5868;line-height:1.7">
            마지막 기록 이후 며칠이 지났어요. (${lastDiaryDate})<br>
            짧아도 괜찮아요. 오늘의 감정 하나만 남겨보세요.
          </p>
          <div style="background:#F5F8FF;border-radius:12px;padding:20px;margin:0 0 24px;text-align:center">
            <p style="margin:0;font-size:14px;color:#4A5868;line-height:1.8">
              "짧은 기록이 쌓이면 나만의 감정 지도가 돼요."<br>
              <span style="font-size:13px;color:#7A8898">몽이 일기 팁</span>
            </p>
          </div>
          <div style="text-align:center;margin:0 0 28px">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/diary/new"
               style="display:inline-block;background:#7BBDE4;color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:999px;text-decoration:none">
              오늘 기록 남기기
            </a>
          </div>
          <p style="margin:0;font-size:13px;color:#A09080;text-align:center">
            이 메일을 받고 싶지 않으시면 앱 설정에서 알림을 끌 수 있어요.
          </p>
        </td></tr>
        <tr><td style="background:#EFF5FF;padding:20px 40px;text-align:center">
          <p style="margin:0;font-size:12px;color:#8098B8">
            Mongree · 감정 일기장 · <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/privacy" style="color:#8098B8">개인정보처리방침</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
