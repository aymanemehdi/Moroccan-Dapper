import { Resend } from 'resend'
import type { NewsletterSubscription } from '@/features/newsletter/types'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function sanitizeSubject(str: string): string {
  return str.replace(/[\r\n\x00-\x1F\x7F]/g, '')
}

export interface PostEmailData {
  title: string
  slug: string
  excerpt: string | null
  cover_image: string | null
}

export async function sendNewsletterEmail(
  subscriber: NewsletterSubscription,
  post: PostEmailData
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY
  const fromEmail = process.env.RESEND_FROM_EMAIL
  if (!apiKey) throw new Error('RESEND_API_KEY is not configured')
  if (!fromEmail) throw new Error('RESEND_FROM_EMAIL is not configured')
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/+$/, '')
  const resend = new Resend(apiKey)
  const postUrl = `${siteUrl}/blog/${post.slug}`
  const unsubscribeUrl = `${siteUrl}/api/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`
  const title = escapeHtml(post.title)
  const excerpt = post.excerpt ? escapeHtml(post.excerpt) : ''
  await resend.emails.send({
    from: fromEmail,
    to: subscriber.email,
    subject: sanitizeSubject(`New post: ${post.title}`),
    html: `
      <div style="margin:0;padding:0;background:#fffdf7;color:#101614;font-family:Arial,Helvetica,sans-serif;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#fffdf7;">
          <tr>
            <td align="center" style="padding:32px 16px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;">
                <tr>
                  <td style="padding:0 0 24px;text-align:center;">
                    <a href="${escapeHtml(siteUrl)}" style="color:#101614;font-size:13px;font-weight:800;letter-spacing:3px;text-decoration:none;text-transform:uppercase;">Moroccan Dapper</a>
                  </td>
                </tr>
                <tr>
                  <td style="border:2px solid #101614;background:#ffffff;box-shadow:5px 5px 0 #101614;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                      <tr>
                        <td style="padding:32px 28px 12px;">
                          <span style="display:inline-block;border:2px solid #101614;background:#f2c94c;color:#101614;font-size:11px;font-weight:800;letter-spacing:2px;padding:5px 8px;text-transform:uppercase;">New article</span>
                          <h1 style="margin:18px 0 10px;color:#101614;font-size:30px;line-height:1.15;">${title}</h1>
                          ${excerpt ? `<p style="margin:0;color:#756b62;font-size:16px;line-height:1.6;">${excerpt}</p>` : ''}
                        </td>
                      </tr>
                      ${post.cover_image ? `<tr><td style="padding:16px 28px 0;"><img src="${escapeHtml(post.cover_image)}" alt="${title}" width="540" style="display:block;width:100%;height:auto;border:2px solid #101614;" /></td></tr>` : ''}
                      <tr>
                        <td style="padding:28px;">
                          <a href="${escapeHtml(postUrl)}" style="display:inline-block;border:2px solid #101614;background:#101614;color:#ffffff;font-size:14px;font-weight:800;padding:13px 20px;text-decoration:none;">Read the article &rarr;</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td style="padding:28px 4px 0;color:#756b62;font-size:12px;line-height:1.6;text-align:center;">
                    You're receiving this because you subscribed to Moroccan Dapper updates.<br />
                    <a href="${escapeHtml(unsubscribeUrl)}" style="color:#101614;font-weight:700;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </div>
    `,
  })
}
