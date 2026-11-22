// 컨설팅 폼 JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultingForm');
    const resultBox = document.getElementById('consultingResult');
    const mobileMiddle = document.getElementById('mobileMiddle');
    const mobileLast = document.getElementById('mobileLast');
    const phoneMiddle = document.getElementById('phoneMiddle');
    const phoneLast = document.getElementById('phoneLast');

    const CONTACT_EMAIL = 'aicansmile8@gmail.com';
    const CONTACT_PHONE = '010-3201-7076';
    const FORM_NAME = 'consulting';

    // 전화번호 숫자만 입력
    [mobileMiddle, mobileLast, phoneMiddle, phoneLast].forEach(input => {
        if (input) {
            input.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/[^0-9]/g, '');
            });
        }
    });

    // 사업자등록번호 숫자만 입력
    const businessNumber = document.getElementById('businessNumber');
    if (businessNumber) {
        businessNumber.addEventListener('input', (e) => {
            e.target.value = e.target.value.replace(/[^0-9-]/g, '');
        });
    }

    if (!form) return;

    // 입력값 정리 (전화번호 세 칸을 하나로 묶음)
    function collectData(formData) {
        const data = {};
        formData.forEach((value, key) => {
            if (key === 'mobilePrefix' || key === 'mobileMiddle' || key === 'mobileLast') {
                if (!data.mobilePhone) data.mobilePhone = '';
                if (value) data.mobilePhone += (data.mobilePhone ? '-' : '') + value;
            } else if (key === 'phonePrefix' || key === 'phoneMiddle' || key === 'phoneLast') {
                if (value) {
                    if (!data.phone) data.phone = '';
                    data.phone += (data.phone ? '-' : '') + value;
                }
            } else if (key !== 'bot-field') {
                data[key] = value;
            }
        });
        return data;
    }

    function escapeHtml(str) {
        return String(str == null ? '' : str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function buildMessage(data) {
        const lines = [
            '[AICANSMILE 컨설팅 신청]',
            '',
            '■ 사업자 정보',
            '사업자 유형: ' + (data.businessType || '-'),
            '사업자등록번호: ' + (data.businessNumber || '-'),
            '회사명: ' + (data.companyName || '-'),
            '',
            '■ 담당자 정보',
            '담당자명: ' + (data.contactName || '-'),
            '휴대 전화: ' + (data.mobilePhone || '-'),
            '일반 전화: ' + (data.phone || '-'),
            'E-mail: ' + (data.email || '-'),
            '소재지: ' + (data.address || '-'),
            '',
            '■ 신청 내용',
            '신청경로: ' + (data.source || '-'),
            (data.consultingContent || '-'),
            '',
            '개인정보 수집/이용 동의: ' + (data.privacyAgree ? '동의함' : '미동의'),
            '',
            '(AICANSMILE 홈페이지 컨설팅 신청 폼에서 발송)'
        ];
        return lines.join('\n');
    }

    function showSuccess(data) {
        form.reset();
        const subject = '[AICANSMILE] ' + (data.companyName || '컨설팅') + ' 컨설팅 신청이 접수되었습니다';
        resultBox.hidden = false;
        resultBox.className = 'consulting-result success';
        resultBox.innerHTML =
            '<h3>✅ 컨설팅 신청이 접수되었습니다</h3>' +
            '<p><strong>' + escapeHtml(data.contactName || '') + '</strong> 님, 신청해 주셔서 감사합니다. ' +
            '영업일 기준 1~2일 내에 <strong>' + escapeHtml(data.email || '') + '</strong> 또는 ' +
            '<strong>' + escapeHtml(data.mobilePhone || '') + '</strong>로 연락드리겠습니다.</p>' +
            '<p class="result-sub">급하신 경우 ' + CONTACT_PHONE + ' · ' + CONTACT_EMAIL + ' 로 연락 주세요.</p>' +
            '<div class="result-actions">' +
            '<a class="btn-submit" href="index.html">홈으로 돌아가기</a>' +
            '</div>';
        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    // 자동 접수가 불가능한 상황에서도 신청이 막히지 않도록 이메일 전송 경로를 안내
    function showFallback(data) {
        const subject = '[AICANSMILE] ' + (data.companyName || '컨설팅') + ' 컨설팅 신청';
        const body = buildMessage(data);
        const mailto = 'mailto:' + CONTACT_EMAIL +
            '?subject=' + encodeURIComponent(subject) +
            '&body=' + encodeURIComponent(body);

        resultBox.hidden = false;
        resultBox.className = 'consulting-result fallback';
        resultBox.innerHTML =
            '<h3>신청서가 준비되었습니다</h3>' +
            '<p>지금 자동 접수가 원활하지 않아, 작성하신 내용을 그대로 담은 메일로 보내 드릴게요. ' +
            '아래 버튼을 누르고 <strong>보내기</strong>만 하시면 접수됩니다.</p>' +
            '<div class="result-actions">' +
            '<a class="btn-submit" id="mailtoLink" href="' + escapeHtml(mailto) + '">이메일 앱으로 바로 보내기</a>' +
            '<button type="button" class="btn-cancel" id="copyEmailBtn">이메일 주소 복사 (' + CONTACT_EMAIL + ')</button>' +
            '</div>' +
            '<p class="result-sub">전화 문의: ' + CONTACT_PHONE + ' · 메일: ' + CONTACT_EMAIL + '</p>' +
            '<details class="result-preview"><summary>보내질 내용 미리보기</summary>' +
            '<pre>' + escapeHtml(subject + '\n\n' + body) + '</pre></details>';

        const copyBtn = document.getElementById('copyEmailBtn');
        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                const text = CONTACT_EMAIL;
                try {
                    if (navigator.clipboard && window.isSecureContext) {
                        await navigator.clipboard.writeText(text);
                    } else {
                        const ta = document.createElement('textarea');
                        ta.value = text;
                        ta.style.position = 'fixed';
                        ta.style.opacity = '0';
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                    }
                    copyBtn.textContent = '복사되었습니다 ✓ (' + CONTACT_EMAIL + ')';
                } catch (err) {
                    alert('이메일 주소: ' + text);
                }
            });
        }

        resultBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // 필수 체크박스 확인
        const privacyAgree = document.getElementById('privacyAgree');
        if (!privacyAgree.checked) {
            alert('개인정보 수집/이용 동의는 필수입니다.');
            privacyAgree.focus();
            return;
        }

        const formData = new FormData(form);
        formData.set('form-name', FORM_NAME);
        const data = collectData(formData);
        data.privacyAgree = privacyAgree.checked ? '동의함' : '미동의';

        // 로딩 상태 표시
        const submitButton = form.querySelector('.btn-submit');
        const originalButtonText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.textContent = '전송 중...';
        if (resultBox) {
            resultBox.hidden = true;
            resultBox.innerHTML = '';
        }

        try {
            // Netlify Forms로 접수 (별도 API 키 불필요, 대시보드에 저장)
            const params = new URLSearchParams();
            formData.forEach((value, key) => {
                if (key !== 'bot-field') params.append(key, value);
            });

            const response = await fetch('/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            if (!response.ok) {
                throw new Error('HTTP ' + response.status);
            }

            showSuccess(data);
        } catch (error) {
            console.error('컨설팅 접수 오류:', error);
            showFallback(data);
        } finally {
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }
    });

    // AOS 초기화
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 100
        });
    }
});
