// 제품/서비스 데이터
const menuData = {
    'ai-solutions': [
        {
            name: 'AI 비즈니스 분석 플랫폼',
            description: '머신러닝 기반 데이터 분석으로 비즈니스 인사이트 제공',
            price: '문의'
        },
        {
            name: '자연어 처리 솔루션',
            description: '고급 NLP 기술을 활용한 텍스트 분석 및 처리 시스템',
            price: '문의'
        },
        {
            name: '컴퓨터 비전 시스템',
            description: '이미지 인식 및 분석을 위한 AI 기반 컴퓨터 비전 솔루션',
            price: '문의'
        },
        {
            name: '챗봇 플랫폼',
            description: '대화형 AI 챗봇 구축 및 관리 플랫폼',
            price: '문의'
        },
        {
            name: '추천 시스템',
            description: '개인화된 추천을 제공하는 AI 기반 추천 엔진',
            price: '문의'
        },
        {
            name: '음성 인식 솔루션',
            description: '정확한 음성 인식 및 음성-텍스트 변환 시스템',
            price: '문의'
        }
    ],
    'enterprise': [
        {
            name: 'ERP 통합 솔루션',
            description: '기업 리소스 계획을 위한 통합 관리 시스템',
            price: '문의'
        },
        {
            name: 'CRM 플랫폼',
            description: '고객 관계 관리를 위한 종합 솔루션',
            price: '문의'
        },
        {
            name: '클라우드 마이그레이션',
            description: '기존 시스템의 클라우드 전환 지원 서비스',
            price: '문의'
        },
        {
            name: '보안 솔루션',
            description: '엔터프라이즈급 보안 및 데이터 보호 시스템',
            price: '문의'
        },
        {
            name: '모바일 앱 개발',
            description: '기업용 모바일 애플리케이션 개발 및 유지보수',
            price: '문의'
        },
        {
            name: 'API 통합 서비스',
            description: '다양한 시스템 간 API 연동 및 통합 솔루션',
            price: '문의'
        }
    ],
    'consulting': [
        {
            name: 'AI 전략 컨설팅',
            description: '기업의 AI 도입 전략 수립 및 로드맵 설계',
            price: '문의'
        },
        {
            name: '디지털 전환 컨설팅',
            description: '기업의 디지털 혁신을 위한 종합 컨설팅',
            price: '문의'
        },
        {
            name: '데이터 분석 컨설팅',
            description: '빅데이터 분석 및 활용 방안 제시',
            price: '문의'
        },
        {
            name: '시스템 아키텍처 설계',
            description: '확장 가능한 시스템 아키텍처 설계 및 검토',
            price: '문의'
        },
        {
            name: '기술 리뷰 및 감사',
            description: '기존 시스템의 기술적 검토 및 개선 방안 제시',
            price: '문의'
        },
        {
            name: '교육 및 트레이닝',
            description: 'AI 및 소프트웨어 기술 교육 프로그램',
            price: '문의'
        }
    ]
};

// DOM 요소 선택
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const tabButtons = document.querySelectorAll('.tab-btn');
const menuGrid = document.getElementById('menuGrid');

// 모바일 네비게이션 토글
if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // 햄버거 아이콘 애니메이션
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translateY(8px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translateY(-8px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
}

// 제품/서비스 아이템 렌더링 함수
function renderMenu(category) {
    const items = menuData[category] || [];
    menuGrid.innerHTML = '';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        menuItem.innerHTML = `
            <h3 class="menu-item-name">${item.name}</h3>
            <p class="menu-item-description">${item.description}</p>
            <p class="menu-item-price">${item.price}</p>
        `;
        menuGrid.appendChild(menuItem);
    });
    
    // 페이드인 애니메이션
    const menuItems = menuGrid.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        setTimeout(() => {
            item.style.transition = 'all 0.5s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

// 탭 버튼 클릭 이벤트
tabButtons.forEach(button => {
    button.addEventListener('click', () => {
        // 모든 탭 버튼에서 active 클래스 제거
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // 클릭한 버튼에 active 클래스 추가
        button.classList.add('active');
        
        // 선택한 카테고리로 메뉴 렌더링
        const category = button.getAttribute('data-category');
        renderMenu(category);
    });
});

// 네비게이션 링크 클릭 시 모바일 메뉴 닫기
const navLinks = document.querySelectorAll('.nav-menu a');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            navMenu.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });
});

// 스크롤 시 네비게이션 스타일 변경
let lastScroll = 0;
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
    }
    
    lastScroll = currentScroll;
});

// 초기 제품/서비스 렌더링 (AI 솔루션)
document.addEventListener('DOMContentLoaded', () => {
    renderMenu('ai-solutions');
});

// 섹션 스크롤 애니메이션
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 관찰할 요소들
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// 첫 번째 섹션(hero)은 즉시 표시
if (sections[0]) {
    sections[0].style.opacity = '1';
    sections[0].style.transform = 'translateY(0)';
}


