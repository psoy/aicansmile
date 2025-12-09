// EmailJS 대안 구현 (서버리스 함수를 사용할 수 없는 경우)
// 사용 방법:
// 1. EmailJS 계정 생성 (https://www.emailjs.com/)
// 2. 이메일 서비스 템플릿 설정
// 3. consulting.html에 EmailJS SDK 추가: <script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>
// 4. consulting.js 대신 이 파일 사용

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('consultingForm');
    const mobileMiddle = document.getElementById('mobileMiddle');
    const mobileLast = document.getElementById('mobileLast');
    const phoneMiddle = document.getElementById('phoneMiddle');
    const phoneLast = document.getElementById('phoneLast');

    // EmailJS 초기화 (YOUR_PUBLIC_KEY를 EmailJS Public Key로 교체)
    if (typeof emailjs !== 'undefined') {
        emailjs.init('YOUR_PUBLIC_KEY'); // EmailJS Public Key로 교체 필요
    }

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

            data.privacyAgree = privacyAgree.checked ? '동의함' : '동의하지 않음';

            // 로딩 상태 표시
            const submitButton = form.querySelector('.btn-submit');
            const originalButtonText = submitButton.textContent;
            submitButton.disabled = true;
            submitButton.textContent = '전송 중...';

            // EmailJS를 통한 이메일 전송
            try {
                // EmailJS 서비스 ID, 템플릿 ID, Public Key 설정 필요
                const serviceId = 'YOUR_SERVICE_ID'; // EmailJS Service ID
                const templateId = 'YOUR_TEMPLATE_ID'; // EmailJS Template ID

                const templateParams = {
                    business_type: data.businessType,
                    business_number: data.businessNumber,
                    company_name: data.companyName,
                    contact_name: data.contactName,
                    mobile_phone: data.mobilePhone,
                    phone: data.phone || '없음',
                    email: data.email,
                    address: data.address,
                    consulting_content: data.consultingContent,
                    source: data.source,
                    privacy_agree: data.privacyAgree,
                    submit_time: new Date().toLocaleString('ko-KR')
                };

                await emailjs.send(serviceId, templateId, templateParams);

                alert('컨설팅 신청이 완료되었습니다.\n영업일 기준 1~2일 내에 연락드리겠습니다.');
                form.reset();
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } catch (error) {
                console.error('EmailJS Error:', error);
                alert('컨설팅 신청 중 오류가 발생했습니다.\n잠시 후 다시 시도해주시거나 직접 이메일로 문의해주세요.\n\n이메일: aicansmile8@gmail.com');
            } finally {
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

