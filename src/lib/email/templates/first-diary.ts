export function firstDiaryEmailHtml(nickname: string): string {
  return `<!DOCTYPE html>
<html lang="ko">
<head><meta charset="utf-8"><title>첫 일기를 남겼어요</title></head>
<body style="margin:0;padding:0;background:#faf8f4;font-family:sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#faf8f4;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:20px;padding:40px;border:1px solid #ede8df;">
          <tr>
            <td align="center" style="padding-bottom:24px;">
              <span style="font-size:48px;">🌱</span>
            </td>
          </tr>
          <tr>
            <td style="font-size:22px;font-weight:700;color:#2a2630;text-align:center;padding-bottom:8px;">
              ${nickname}님, 첫 일기를 남겼어요!
            </td>
          </tr>
          <tr>
            <td style="font-size:15px;color:#6b6580;text-align:center;line-height:1.8;padding-bottom:32px;">
              오늘 감정을 기록해줘서 고마워요.<br>
              매일 조금씩 남기다 보면 몽이도 함께 자라납니다.
            </td>
          </tr>
          <tr>
            <td align="center" style="padding-bottom:32px;">
              <a href="${process.env.NEXT_PUBLIC_SITE_URL ?? "https://mongree.app"}/home"
                 style="display:inline-block;background:#d4a96a;color:#2a2630;font-weight:700;font-size:15px;padding:14px 32px;border-radius:999px;text-decoration:none;">
                몽이 보러 가기
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
