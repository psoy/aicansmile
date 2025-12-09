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
        form.addEventListener('submit', (e) => {
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

            // 실제로는 서버로 전송해야 하지만, 여기서는 확인 메시지만 표시
            console.log('컨설팅 신청 데이터:', data);
            
            alert('컨설팅 신청이 완료되었습니다.\n영업일 기준 1~2일 내에 연락드리겠습니다.');
            
            // 홈으로 이동
            window.location.href = 'index.html';
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

