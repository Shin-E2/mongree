export function trialEndingEmailHtml({ nickname, trialEndDate }: { nickname: string; trialEndDate: string }) {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#FFF8F0;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF8F0;padding:40px 16px">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(140,100,70,0.10)">
        <tr><td style="background:linear-gradient(135deg,#FFF0E0,#FFE4CC);padding:36px 40px;text-align:center">
          <div style="font-size:48px;margin-bottom:12px">🐱</div>
          <h1 style="margin:0;font-size:22px;font-weight:800;color:#4A3728">Pro 체험이 곧 끝나요</h1>
        </td></tr>
        <tr><td style="padding:36px 40px">
          <p style="margin:0 0 16px;font-size:16px;color:#5A4838">안녕하세요, ${nickname}님 👋</p>
          <p style="margin:0 0 20px;font-size:15px;color:#6B5748;line-height:1.7">
            <strong>${trialEndDate}</strong>에 Pro 체험 기간이 종료됩니다.<br>
            몽이의 Pro 아이템, AI 월간 리포트, 무제한 일기 기능을 계속 사용하려면 구독을 이어주세요.
          </p>
          <div style="background:#FFF8F0;border-radius:12px;padding:20px;margin:0 0 24px">
            <p style="margin:0 0 8px;font-size:13px;font-weight:700;color:#A07858">Pro에서 계속 쓸 수 있는 것들</p>
            <ul style="margin:0;padding:0 0 0 20px;font-size:14px;color:#6B5748;line-height:2">
              <li>AI 월간 감정 리포트 (월 5회)</li>
              <li>Pro 전용 몽이 의상 · 액세서리</li>
              <li>무제한 일기</li>
              <li>공유 카드 스킨</li>
            </ul>
          </div>
          <div style="text-align:center;margin:0 0 28px">
            <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/pricing"
               style="display:inline-block;background:#F5A978;color:#fff;font-size:15px;font-weight:700;padding:14px 36px;border-radius:999px;text-decoration:none">
              Pro 구독 유지하기
            </a>
          </div>
          <p style="margin:0;font-size:13px;color:#A09080;text-align:center">
            구독하지 않으면 체험 종료 후 Starter 플랜으로 자동 전환됩니다.<br>기록은 그대로 남아 있어요.
          </p>
        </td></tr>
        <tr><td style="background:#FFF0E0;padding:20px 40px;text-align:center">
          <p style="margin:0;font-size:12px;color:#B09880">
            Mongree · 감정 일기장 · <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/privacy" style="color:#B09880">개인정보처리방침</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}
