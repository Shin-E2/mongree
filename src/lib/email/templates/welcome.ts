export function welcomeEmailHtml(nickname: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><title>몽리에 오신 것을 환영합니다</title></head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;padding:40px;border:1px solid #ede8df;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:48px;">🌿</span>
            </td>
          </tr>
          <tr>
            <td style="font-size:22px;font-weight:700;color:#2a2630;text-align:center;padding-bottom:8px;">
              ${nickname}님, 환영해요!
            </td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#6b6580;text-align:center;line-height:1.8;padding-bottom:32px;">
              몽리는 감정을 기록하고 돌아보는 곳이에요.<br>
              오늘 느낀 감정을 몽이와 함께 남겨보세요.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/diary/new"
                 style="display:inline-block;background:#d4a96a;color:#2a2630;font-weight:700;font-size:15px;padding:14px 32px;border-radius:999px;text-decoration:none;">
                첫 일기 쓰러 가기
              </a>
            </td>
          </tr>
          <tr>
            <td style="font-size:12px;color:#9e98b0;text-align:center;border-top:1px solid #ede8df;padding-top:24px;">
              몽리 · 감정 일기 · <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/privacy" style="color:#9e98b0;">개인정보처리방침</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}
