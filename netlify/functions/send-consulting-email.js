// Netlify Serverless Function: 컨설팅 신청 이메일 전송
const sgMail = require('@sendgrid/mail');

exports.handler = async (event, context) => {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
    };

    // OPTIONS 요청 처리 (CORS preflight)
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // POST 요청만 허용
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        // 환경 변수 확인
        const apiKey = process.env.SENDGRID_API_KEY;
        const recipientEmail = process.env.RECIPIENT_EMAIL || 'aicansmile8@gmail.com';
        const senderEmail = process.env.SENDER_EMAIL || 'noreply@aicansmile.com';

        if (!apiKey) {
            console.error('SendGrid API key not configured in environment variables');
            return {
                statusCode: 500,
                headers,
                body: JSON.stringify({ 
                    error: '이메일 서비스가 설정되지 않았습니다. 관리자에게 문의해주세요.',
                    details: 'SendGrid API key not configured'
                })
            };
        }

        // SendGrid 초기화
        sgMail.setApiKey(apiKey);

        // 요청 데이터 파싱
        const formData = JSON.parse(event.body);

        // 이메일 템플릿 생성
        const emailHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #6b5b7d 0%, #4a3a5c 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f5f5f5; padding: 20px; border-radius: 0 0 8px 8px; }
                    .section { background: white; margin-bottom: 15px; padding: 15px; border-radius: 5px; border-left: 4px solid #d4a574; }
                    .section-title { font-size: 18px; font-weight: bold; color: #4a3a5c; margin-bottom: 10px; }
                    .field { margin-bottom: 10px; }
                    .label { font-weight: bold; color: #666; }
                    .value { color: #333; margin-top: 5px; }
                    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>📝 새로운 AI 컨설팅 신청</h1>
                        <p>제출 시간: ${new Date().toLocaleString('ko-KR')}</p>
                    </div>
                    <div class="content">
                        <div class="section">
                            <div class="section-title">👤 사업자 정보</div>
                            <div class="field">
                                <div class="label">사업자 유형:</div>
                                <div class="value">${formData.businessType || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">사업자등록번호:</div>
                                <div class="value">${formData.businessNumber || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">회사명:</div>
                                <div class="value">${formData.companyName || 'N/A'}</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">📞 담당자 정보 및 연락처</div>
                            <div class="field">
                                <div class="label">담당자명:</div>
                                <div class="value">${formData.contactName || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">휴대 전화번호:</div>
                                <div class="value">${formData.mobilePhone || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">일반 전화번호:</div>
                                <div class="value">${formData.phone || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">E-mail:</div>
                                <div class="value">${formData.email || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">소재지:</div>
                                <div class="value">${formData.address || 'N/A'}</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">💡 컨설팅 신청 내용</div>
                            <div class="field">
                                <div class="label">컨설팅 신청 내용:</div>
                                <div class="value" style="white-space: pre-wrap;">${formData.consultingContent || 'N/A'}</div>
                            </div>
                            <div class="field">
                                <div class="label">신청 경로:</div>
                                <div class="value">${formData.source || 'N/A'}</div>
                            </div>
                        </div>

                        <div class="section">
                            <div class="section-title">✅ 개인정보 동의</div>
                            <div class="value">${formData.privacyAgree ? '동의함' : '동의하지 않음'}</div>
                        </div>
                    </div>
                    <div class="footer">
                        <p>이 이메일은 AICANSMILE 컨설팅 신청 폼에서 자동으로 전송되었습니다.</p>
                    </div>
                </div>
            </body>
            </html>
        `;

        // 이메일 전송
        const msg = {
            to: recipientEmail,
            from: senderEmail,
            subject: `[AICANSMILE] 새로운 컨설팅 신청 - ${formData.companyName || '알 수 없음'}`,
            html: emailHtml,
            text: `
새로운 AI 컨설팅 신청

사업자 정보:
- 사업자 유형: ${formData.businessType || 'N/A'}
- 사업자등록번호: ${formData.businessNumber || 'N/A'}
- 회사명: ${formData.companyName || 'N/A'}

담당자 정보:
- 담당자명: ${formData.contactName || 'N/A'}
- 휴대 전화번호: ${formData.mobilePhone || 'N/A'}
- 일반 전화번호: ${formData.phone || 'N/A'}
- E-mail: ${formData.email || 'N/A'}
- 소재지: ${formData.address || 'N/A'}

컨설팅 신청 내용:
${formData.consultingContent || 'N/A'}

신청 경로: ${formData.source || 'N/A'}

제출 시간: ${new Date().toLocaleString('ko-KR')}
            `.trim()
        };

        await sgMail.send(msg);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({ 
                success: true, 
                message: '이메일이 성공적으로 전송되었습니다.' 
            })
        };

    } catch (error) {
        console.error('Error sending email:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: '이메일 전송 중 오류가 발생했습니다.',
                details: error.message 
            })
        };
    }
};

