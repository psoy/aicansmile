// 사업 포트폴리오 데이터
const menuData = {
    'clef-ai': [
        {
            name: 'Clef.ai (클레프 AI)',
            description: '나만의 24시간 AI 음악 연습 파트너',
            subtitle: 'EdTech / Arts',
            logo: 'Gemini_Generated_Image_bjq7qfbjq7qfbjq7.png',
            features: [
                'AI 마에스트로 Q&A: 연주 기법, 악상 기호, 연습 팁 실시간 답변',
                '맞춤형 연습 스케줄링: 사용자 실력/목표 기반 데일리 루틴 생성',
                '음악 이론 통합 검색: 난해한 이론을 연주에 적용 가능하도록 쉽게 풀이'
            ],
            tech: 'RAG (Retrieval-Augmented Generation), LangChain / LlamaIndex, OpenAI GPT-4 / Claude, OMR (Optical Music Recognition), Audio Analysis (Librosa, Essentia), Vector Database (Pinecone, Weaviate), NLP (Natural Language Processing)',
            detail: 'Clef.ai는 첼로와 피아노 학습자를 위한 지능형 레슨 보조 서비스입니다. 레슨과 레슨 사이, 혼자 연습할 때 겪는 막막함을 해소합니다. 단순 검색을 넘어 악기 연주법과 음악 이론에 특화된 심층 가이드를 제공합니다.'
        }
    ],
    'jurins-theme': [
        {
            name: 'Jurin\'s Theme (주린스테마)',
            description: '초보 투자자를 위한 감성 분석 기반 주식 길라잡이',
            subtitle: 'FinTech',
            logo: 'KakaoTalk_20251209_200717706_01.jpg',
            features: [
                '뉴스 감성 분석: 방대한 금융 뉴스를 분석하여 긍정/부정 시그널 포착',
                '맞춤형 종목 추천: 투자 성향에 따른 테마별 유망 종목 큐레이션',
                '쉬운 시황 브리핑: 어려운 경제 용어를 쉽게 풀어쓴 데일리 리포트'
            ],
            tech: 'Transformer Models (BERT, FinBERT), Sentiment Analysis, Time Series Forecasting (Prophet, LSTM), Real-time Data Processing (Apache Kafka, Spark Streaming), Graph Neural Networks, Explainable AI (SHAP, LIME), Big Data Analytics, AI Recommendation System',
            detail: '주린스테마는 복잡한 주식 시장에서 길을 잃기 쉬운 초보 투자자(주린이)를 위해 탄생했습니다. 딱딱한 재무 제표뿐만 아니라, 시장의 뉴스 트렌드와 투자자 심리(Sentiment)를 분석하여 이해하기 쉬운 리포트를 제공합니다.'
        }
    ],
    'silo-vision': [
        {
            name: 'SiloVisionX (사일로비전X)',
            description: '컴퓨터 비전으로 완성하는 스마트 농업의 눈',
            subtitle: 'AgriTech',
            logo: 'Gemini_Generated_Image_gyrce8gyrce8gyrc.png',
            features: [
                '자동 객체 인식: 드론/모바일 촬영 곤포 사일리지 자동 식별',
                '정밀 카운팅 & 재고 관리: 대량의 물량도 오차 없이 집계',
                '현장 데이터 시각화: 농장별 생산량 및 재고 현황 대시보드'
            ],
            tech: 'Computer Vision (YOLOv8 / YOLOv10, DETR, Vision Transformer), Edge Computing (TensorFlow Lite, ONNX Runtime), IoT Integration (MQTT, LoRaWAN), Cloud Platforms (AWS IoT, Google Cloud IoT), Edge AI, Image Processing',
            detail: '농축산업 현장의 생산성을 극대화하기 위한 AI 비전 솔루션입니다. 광활한 농지나 적재된 곤포 사일리지(Silage Bales)를 이미지 한 장으로 정확하게 인식하고 카운팅하여, 재고 관리의 자동화와 효율화를 실현합니다.'
        }
    ],
    'snap-speak': [
        {
            name: 'Snap&Speak (스냅앤스피크)',
            description: '사진 한 장으로 내 수준에 맞는 AI 원어민 대화',
            subtitle: 'EdTech / B2C',
            logo: 'Gemini_Generated_Image_ftg0hxftg0hxftg0.png',
            features: [
                '사진 기반 대화 생성: 일상 사진으로 실전 회화 연습',
                '수준별 맞춤형 대화: 사용자 레벨에 맞는 AI 원어민 대화 생성',
                '글로벌 K-Culture 타겟: K-Culture 팬덤을 위한 실전 회화 앱',
                '오프라인 작동: 네트워크 없이도 사용 가능한 경량화 버전'
            ],
            tech: 'Multimodal AI (GPT-4V, Claude 3), Neural TTS (ElevenLabs, Google TTS), Speech Recognition (Whisper), Few-shot Learning, On-device ML (Core ML, TensorFlow Lite), TTS (Text-to-Speech), Image Recognition, NLP, Edge AI',
            detail: 'Snap&Speak은 사진 한 장으로 내 수준에 맞는 AI 원어민 대화(TTS)를 생성하는 실전 회화 앱입니다. 글로벌 K-Culture 커뮤니티를 타겟으로 하며, 광고 및 구독 모델로 수익화합니다. Impact Lab에서는 경량화 버전을 개발도상국 교육 현장에 제공합니다.'
        }
    ],
    'miriface': [
        {
            name: 'MiriFace (미리페이스)',
            description: '시술 전 AI/AR로 보톡스 결과를 미리 시뮬레이션',
            subtitle: 'BeautyTech / Medical',
            features: [
                'AI/AR 시뮬레이션: 보톡스 시술 전 결과를 미리 확인',
                '고객 불안 해소: 시술 전 시각적 결과로 신뢰도 향상',
                '병원 B2B 솔루션: 의료진과 고객 간 소통 도구'
            ],
            tech: '3D Face Reconstruction (MediaPipe, FaceX-Zoo), AR Frameworks (ARKit, ARCore), GANs (StyleGAN, Face Swapping), Computer Vision, AR (Augmented Reality), Face Recognition, Medical AI Ethics, Privacy-preserving AI',
            detail: 'MiriFace는 시술 전 AI/AR로 보톡스 결과를 미리 시뮬레이션하여 고객의 불안을 해소하는 병원 B2B 솔루션입니다. 시각적 결과를 통해 고객과 의료진 간의 신뢰를 구축합니다.'
        }
    ],
    'aihunjang': [
        {
            name: 'AIHUNJANG (AI훈장)',
            description: '복잡한 매뉴얼을 학습한 RAG 기반 사내 Q&A 에이전트',
            subtitle: 'Enterprise / Knowledge Management',
            features: [
                'RAG 기반 Q&A: 복잡한 매뉴얼과 문서를 학습한 지능형 에이전트',
                '사내 지식 관리: 조직 내 지식 자산의 효율적 활용',
                'B2B SaaS: 기업 내부 지식 공유 플랫폼'
            ],
            tech: 'RAG (Retrieval-Augmented Generation), Vector Databases (Pinecone, Qdrant), Graph Databases (Neo4j, ArangoDB), Multi-agent Systems (AutoGPT, LangGraph), Fine-tuning (LoRA, QLoRA), API Integration (OpenAI, Anthropic), Knowledge Graph, NLP',
            detail: 'AIHUNJANG은 복잡한 매뉴얼을 학습한 RAG 기반 사내 Q&A 에이전트입니다. 기업의 지식 자산을 AI로 활용하여 직원들의 업무 효율성을 극대화하는 B2B SaaS 솔루션입니다.'
        }
    ],
    'vallyway': [
        {
            name: 'VallyWay (밸리웨이)',
            description: '기술과 인문학을 결합한 테크 순례 여행 프로그램',
            subtitle: 'Travel / Experience',
            features: [
                '테크 순례: 기술과 인문학을 결합한 특별한 여행 경험',
                '교육 프로그램: 기술 기업 방문 및 인문학적 통찰 제공',
                '커뮤니티 형성: 참가자 간 네트워킹 및 지식 공유'
            ],
            tech: 'Recommendation Systems (Collaborative Filtering, Content-based), Social Network Analysis, Content Generation (GPT-4), Payment Integration (Stripe, Toss), Mobile Apps (React Native, Flutter), Platform, Community Management, Content Curation',
            detail: 'VallyWay는 기술과 인문학을 결합한 테크 순례 여행 프로그램입니다. 기술 기업 방문과 인문학적 통찰을 통해 참가자들에게 특별한 경험과 네트워킹 기회를 제공합니다.'
        }
    ],
    'choicecafe': [
        {
            name: 'ChoiceCafe (초이스카페)',
            description: '중년 여성을 위한 하이퍼-퍼스널 AI 카페 검색',
            subtitle: 'Lifestyle / B2C',
            features: [
                '하이퍼-퍼스널 추천: 개인 취향에 맞는 카페 추천',
                '중년 여성 타겟: 특정 연령대와 성별에 최적화된 서비스',
                '라이프스타일 맞춤: 분위기, 메뉴, 위치 등 종합 고려'
            ],
            tech: 'Deep Learning Recommenders (Neural Collaborative Filtering), Geospatial AI (Google Maps API, Mapbox), User Behavior Analytics (Mixpanel, Amplitude), Real-time Personalization, Multi-modal Search, Recommendation System, Personalization AI, Location-based Services',
            detail: 'ChoiceCafe는 중년 여성을 위한 하이퍼-퍼스널 AI 카페 검색 서비스입니다. 개인의 취향과 라이프스타일을 분석하여 최적의 카페를 추천합니다.'
        }
    ],
    'doljob': [
        {
            name: 'Doljob (돌잡)',
            description: 'AI 기반 첫돌 성장 영상 제작 서비스',
            subtitle: 'Memory / Recording',
            features: [
                'AI 영상 제작: 첫돌 아이의 성장 과정을 자동으로 영상화',
                '추억 보존: 소중한 순간들을 체계적으로 기록',
                '개인화된 콘텐츠: 가족의 스토리를 담은 맞춤형 영상'
            ],
            tech: 'Video Generation (Runway ML, Pika Labs), Storytelling AI (GPT-4), Face Recognition (FaceNet, ArcFace), Video Editing (FFmpeg, OpenCV), Cloud Storage (AWS S3, Google Cloud Storage), Video Generation AI, Image Processing, Storytelling AI',
            detail: 'Doljob은 AI 기반 첫돌 성장 영상 제작 서비스입니다. 아이의 성장 과정을 자동으로 분석하고 편집하여 가족만의 특별한 추억 영상을 만들어드립니다.'
        }
    ],
    'mypa': [
        {
            name: 'MYPA (마이파)',
            description: '과거 댓글을 삭제하고 디지털 발자국을 관리하는 에이전트',
            subtitle: 'Privacy / Digital Footprint',
            features: [
                '디지털 발자국 관리: 과거 온라인 활동 추적 및 관리',
                '자동 댓글 삭제: 불필요한 댓글과 게시물 자동 정리',
                '프라이버시 보호: 개인 정보 보호 및 디지털 신원 관리'
            ],
            tech: 'Privacy-preserving ML (Federated Learning, Differential Privacy), Web Scraping (Scrapy, Selenium), Data Anonymization, GDPR Compliance Tools, Blockchain (선택적), Privacy AI, Data Management',
            detail: 'MYPA는 과거 댓글을 삭제하고 디지털 발자국을 관리하는 프라이버시 에이전트입니다. 개인의 온라인 활동을 추적하고 관리하여 프라이버시를 보호합니다.'
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

// 사업 포트폴리오 아이템 렌더링 함수
function renderMenu(category) {
    const items = menuData[category] || [];
    menuGrid.innerHTML = '';
    
    items.forEach(item => {
        const menuItem = document.createElement('div');
        menuItem.className = 'menu-item';
        
        const featuresList = item.features.map(feature => `<li>${feature}</li>`).join('');
        
        const logoHtml = item.logo ? `<img src="${item.logo}" alt="${item.name} Logo" class="project-logo">` : '';
        
        menuItem.innerHTML = `
            ${logoHtml}
            <div class="project-header">
                <h3 class="menu-item-name">${item.name}</h3>
                <span class="project-subtitle">${item.subtitle}</span>
            </div>
            <p class="project-tagline">${item.description}</p>
            <p class="project-detail">${item.detail}</p>
            <div class="project-features">
                <h4>핵심 기능 (Key Features)</h4>
                <ul>${featuresList}</ul>
            </div>
            <div class="project-tech">
                <h4>기술 스택 (Tech Stack)</h4>
                <p>${item.tech}</p>
            </div>
        `;
        menuItem.setAttribute('data-aos', 'fade-up');
        menuItem.setAttribute('data-aos-duration', '800');
        menuGrid.appendChild(menuItem);
        
        // AOS 새로고침 (동적으로 추가된 요소에 애니메이션 적용)
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
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

// 초기 사업 포트폴리오 렌더링 (Clef.ai)
document.addEventListener('DOMContentLoaded', () => {
    renderMenu('clef-ai');
    
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

// AOS가 있으면 기존 Intersection Observer는 사용하지 않음
// AOS가 모든 스크롤 애니메이션을 처리합니다


