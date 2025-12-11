// 컨설팅 폼 JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultingForm');
    const mobileMiddle = document.getElementById('mobileMiddle');
    const mobileLast = document.getElementById('mobileLast');
    const phoneMiddle = document.getElementById('phoneMiddle');
    const phoneLast = document.getElementById('phoneLast');

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

    // 폼 제출
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // 필수 체크박스 확인
            const privacyAgree = document.getElementById('privacyAgree');
            if (!privacyAgree.checked) {
                alert('개인정보 수집/이용 동의는 필수입니다.');
                privacyAgree.focus();
                return;
            }

            // 폼 데이터 수집
            const formData = new FormData(form);
            const data = {};
            formData.forEach((value, key) => {
                if (key === 'mobilePrefix' || key === 'mobileMiddle' || key === 'mobileLast') {
                    if (!data.mobilePhone) data.mobilePhone = '';
                    data.mobilePhone += (data.mobilePhone ? '-' : '') + value;
                } else if (key === 'phonePrefix' || key === 'phoneMiddle' || key === 'phoneLast') {
                    if (value) {
                        if (!data.phone) data.phone = '';
                        data.phone += (data.phone ? '-' : '') + value;
                    }
                } else {
                    data[key] = value;
                }
            });

            data.privacyAgree = privacyAgree.checked;

            // 로딩 상태 표시
            const submitButton = form.querySelector('.btn-submit');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = '전송 중...';

            // Netlify Function을 통한 이메일 전송
            try {
                const response = await fetch('/api/send-consulting-email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok && result.success) {
                    alert('컨설팅 신청이 완료되었습니다.\n영업일 기준 1~2일 내에 연락드리겠습니다.');
                    form.reset();
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1000);
                } else {
                    throw new Error(result.error || '이메일 전송에 실패했습니다.');
                }
            } catch (error) {
                console.error('이메일 전송 오류:', error);
                alert('컨설팅 신청 중 오류가 발생했습니다.\n\n오류: ' + error.message + '\n\n직접 이메일로 문의해주세요.\n이메일: aicansmile8@gmail.com');
                submitButton.disabled = false;
                submitButton.textContent = originalButtonText;
            }
        });
    }

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

