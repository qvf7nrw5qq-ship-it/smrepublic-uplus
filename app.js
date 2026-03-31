// ===== Helpers =====
const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => document.querySelectorAll(sel);

// ===== Modal (지역별 전화) =====
const modal = $("#callModal");
const openModal = () => {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};
const closeModal = () => {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

["#btnCallTop","#btnCallHero","#btnCallBottom","#btnCallFab","#btnCallSticky"]
  .forEach(id => $(id)?.addEventListener("click", openModal));

$("#modalClose")?.addEventListener("click", closeModal);
$("#modalX")?.addEventListener("click", closeModal);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// 카드 섹션의 “전화 상담” 버튼들
$$(".btnCallAny").forEach(btn => btn.addEventListener("click", openModal));

// ===== Slider =====
const track = $("#sliderTrack");
const slides = $$("#sliderTrack .slider__slide");
const dotsWrap = $("#dots");
const prevBtn = $("#prevBtn");
const nextBtn = $("#nextBtn");
const viewport = $("#sliderViewport");

let idx = 0;
let timer = null;

function renderDots() {
  if (!dotsWrap) return;
  dotsWrap.innerHTML = "";
  slides.forEach((_, i) => {
    const b = document.createElement("button");
    b.className = "dotbtn" + (i === idx ? " active" : "");
    b.addEventListener("click", () => go(i, true));
    dotsWrap.appendChild(b);
  });
}

function go(nextIndex, resetAuto = false) {
  if (!track || slides.length === 0) return;
  idx = (nextIndex + slides.length) % slides.length;
  track.style.transform = `translateX(-${idx * 100}%)`;
  renderDots();
  if (resetAuto) startAuto();
}

function startAuto() {
  if (timer) clearInterval(timer);
  timer = setInterval(() => go(idx + 1), 4200);
}

prevBtn?.addEventListener("click", () => go(idx - 1, true));
nextBtn?.addEventListener("click", () => go(idx + 1, true));

viewport?.addEventListener("mouseenter", () => timer && clearInterval(timer));
viewport?.addEventListener("mouseleave", () => startAuto());

renderDots();
startAuto();

// ===== Scroll: Top button + Sticky CTA =====
const btnTop = $("#btnTop");
const sticky = $("#stickyCta");

function onScroll() {
  const y = window.scrollY || document.documentElement.scrollTop;

  // top 버튼: 300px부터 표시
  if (btnTop) btnTop.style.display = y > 300 ? "flex" : "none";

  // 모바일 스티키 CTA: 250px부터 표시(모바일에서만 CSS가 display:grid)
  if (sticky) sticky.style.opacity = y > 250 ? "1" : "0";
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

btnTop?.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// ===== Reveal Animation =====
const reveals = $$(".reveal");

if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("show");
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });

  reveals.forEach((el) => io.observe(el));
} else {
  // fallback
  const revealFallback = () => {
    const wh = window.innerHeight;
    reveals.forEach((el) => {
      const top = el.getBoundingClientRect().top;
      if (top < wh - 80) el.classList.add("show");
    });
  };
  window.addEventListener("scroll", revealFallback, { passive: true });
  revealFallback();
}
// 배너 슬라이더
(function () {

const track = document.querySelector(".slider_track");
const slides = document.querySelectorAll(".slide");
const prev = document.getElementById("btnPrev");
const next = document.getElementById("btnNext");

if(!track) return;

let index = 0;
const max = slides.length;

function move(i){
index = (i + max) % max;
track.style.transform = "translateX(-"+(index*100)+"%)";
}

prev.addEventListener("click", () => move(index-1));
next.addEventListener("click", () => move(index+1));

})();
document.querySelectorAll(".btnScrollCta").forEach(btn=>{
btn.addEventListener("click",()=>{
document.getElementById("cta").scrollIntoView({
behavior:"smooth"
});
});
});
/* ===== 개인정보 동의 / 버튼 연결 ===== */

const consentModal = document.getElementById("consentModal");
const consentBackdrop = document.getElementById("consentBackdrop");
const consentClose = document.getElementById("consentClose");
const consentCancel = document.getElementById("consentCancel");
const consentConfirm = document.getElementById("consentConfirm");
const consentRequired = document.getElementById("consentRequired");

const policyModal = document.getElementById("policyModal");
const policyBackdrop = document.getElementById("policyBackdrop");
const policyClose = document.getElementById("policyClose");
const policyConfirm = document.getElementById("policyConfirm");
const openPolicyLink = document.getElementById("openPolicyLink");

let pendingAction = null;

function updateConsentButton() {
  if (!consentConfirm || !consentRequired) return;
  consentConfirm.disabled = !consentRequired.checked;
}

function openConsent(action) {
  pendingAction = action;
  if (consentRequired) consentRequired.checked = false;
  updateConsentButton();

  if (consentModal) {
    consentModal.classList.add("open");
  }
}

function closeConsent() {
  if (consentModal) {
    consentModal.classList.remove("open");
  }
}

function openPolicy() {
  if (policyModal) {
    policyModal.classList.add("open");
  }
}

function closePolicy() {
  if (policyModal) {
    policyModal.classList.remove("open");
  }
}

consentRequired?.addEventListener("change", updateConsentButton);
consentBackdrop?.addEventListener("click", closeConsent);
consentClose?.addEventListener("click", closeConsent);
consentCancel?.addEventListener("click", closeConsent);

openPolicyLink?.addEventListener("click", function (e) {
  e.preventDefault();
  openPolicy();
});

policyBackdrop?.addEventListener("click", closePolicy);
policyClose?.addEventListener("click", closePolicy);
policyConfirm?.addEventListener("click", closePolicy);

consentConfirm?.addEventListener("click", function () {
  if (!consentRequired.checked) {
    alert("필수 동의에 체크해주세요.");
    return;
  }

  const action = pendingAction;
  closeConsent();

  if (!action) return;

  if (action.type === "phone-modal") {
    openModal();
  }

  if (action.type === "phone-call") {
    window.location.href = "tel:" + action.tel;
  }

  if (action.type === "kakao") {
    window.open(action.url, "_blank", "noopener");
  }

  if (action.type === "scroll-cta") {
    document.getElementById("cta")?.scrollIntoView({
      behavior: "smooth"
    });
  }
});

/* 매장 전화 버튼 */
["btnCallTop", "btnCallHero", "btnCallBottom", "btnCallFab", "btnCallSticky"].forEach(function (id) {
  const el = document.getElementById(id);
  if (!el) return;

  el.addEventListener("click", function (e) {
    e.preventDefault();
    openConsent({ type: "phone-modal" });
  });
});

/* 카드 안 버튼 */
document.querySelectorAll(".btnCallAny").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    openConsent({ type: "phone-modal" });
  });
});

document.querySelectorAll(".btnScrollCta").forEach(function (btn) {
  btn.addEventListener("click", function (e) {
    e.preventDefault();
    openConsent({ type: "scroll-cta" });
  });
});

/* 카카오 버튼 */
document.querySelectorAll(".consent-kakao").forEach(function (link) {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    const url = link.dataset.href;
    openConsent({ type: "kakao", url: url });
  });
});
/* ===== 슬라이더 ===== */
const sliderTrack = document.getElementById("sliderTrack");
const prevSlideBtn = document.getElementById("prevSlide");
const nextSlideBtn = document.getElementById("nextSlide");
const sliderDots = document.querySelectorAll(".slider__dot");

let currentSlide = 0;
const totalSlides = 2;

function updateSlider() {
  if (!sliderTrack) return;
  sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

  sliderDots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentSlide);
  });
}

prevSlideBtn?.addEventListener("click", () => {
  currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
  updateSlider();
});

nextSlideBtn?.addEventListener("click", () => {
  currentSlide = (currentSlide + 1) % totalSlides;
  updateSlider();
});

sliderDots.forEach((dot) => {
  dot.addEventListener("click", () => {
    currentSlide = Number(dot.dataset.slide);
    updateSlider();
  });
});

updateSlider();
function quickConnect() {
  const ok = confirm("지금 바로 연결할까요?");
  if (ok) {
 const contactSection = document.getElementById("cta");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  }
}

function toggleModels(id) {
  const target = document.getElementById(id);
  const allLists = document.querySelectorAll('.model_list');

  allLists.forEach(list => {
    if (list !== target) {
      list.classList.remove('active');
    }
  });

  target.classList.toggle('active');
}
function changeGalaxyImage(imageSrc) {
  const galaxyImage = document.getElementById("galaxyImage");
  if (galaxyImage) {
    galaxyImage.src = imageSrc;
  }
}

function changeIphoneImage(imageSrc) {
  const iphoneImage = document.getElementById("iphoneImage");
  if (iphoneImage) {
    iphoneImage.src = imageSrc;
  }
}

function changeInternetImage(imageSrc) {
  const internetImage = document.getElementById("internetImage");
  if (internetImage) {
    internetImage.src = imageSrc;
  }
}
function toggleModels(id) {
  const target = document.getElementById(id);
  const allLists = document.querySelectorAll(".model_list");

  allLists.forEach(list => {
    if (list !== target) {
      list.classList.remove("active");
    }
  });

  target.classList.toggle("active");
}

function quickConnect() {
  const contactSection = document.getElementById("cta");
  if (contactSection) {
    contactSection.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  }
}
function openImageModal(imageSrc) {
  closeImageModal();

  const overlay = document.createElement("div");
  overlay.id = "runtimeImageModal";
  overlay.style.position = "fixed";
  overlay.style.inset = "0";
  overlay.style.background = "rgba(0,0,0,0.6)";
  overlay.style.zIndex = "99999";
  overlay.style.display = "flex";
  overlay.style.alignItems = "center";
  overlay.style.justifyContent = "center";
  overlay.style.padding = "20px";

  const panel = document.createElement("div");
  panel.style.position = "relative";
  panel.style.background = "#fff";
  panel.style.borderRadius = "24px";
  panel.style.padding = "20px";
  panel.style.maxWidth = "760px";
  panel.style.width = "100%";
  panel.style.maxHeight = "88vh";
  panel.style.boxShadow = "0 20px 50px rgba(0,0,0,0.18)";

  const closeBtn = document.createElement("button");
  closeBtn.innerHTML = "×";
  closeBtn.style.position = "absolute";
  closeBtn.style.top = "10px";
  closeBtn.style.right = "14px";
  closeBtn.style.border = "none";
  closeBtn.style.background = "#fff";
  closeBtn.style.fontSize = "34px";
  closeBtn.style.lineHeight = "1";
  closeBtn.style.cursor = "pointer";
  closeBtn.onclick = closeImageModal;

  const img = document.createElement("img");
  img.src = imageSrc;
  img.alt = "상세 이미지";
  img.style.width = "100%";
  img.style.maxHeight = "75vh";
  img.style.objectFit = "contain";
  img.style.display = "block";
  img.style.borderRadius = "16px";

  overlay.onclick = function (e) {
    if (e.target === overlay) closeImageModal();
  };

  panel.appendChild(closeBtn);
  panel.appendChild(img);
  overlay.appendChild(panel);
  document.body.appendChild(overlay);
}

function closeImageModal() {
  const oldModal = document.getElementById("runtimeImageModal");
  if (oldModal) oldModal.remove();
}
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('quickPolicyBtn');
  if (!btn) return;

  btn.addEventListener('click', function(e) {
    e.preventDefault();
    openConsent(null);
  });
});
// ===== 계산 팝업 =====
const DEVICE_DATA = {
  s26: {
    name: 'Galaxy S26',
    image: 's26.png',
    retail: 1254000,
    support: 500000,
    extra_mnp: 423000,
    extra_change: 357000
  },
  s26plus: {
    name: 'Galaxy S26+',
    image: 's26plus.png',
    retail: 1354000,
    support: 500000,
    extra_mnp: 0,
    extra_change: 0
  },
  s26ultra: {
    name: 'Galaxy S26 Ultra',
    image: 's26ultra.png',
    retail: 1698400,
    support: 500000,
    extra_mnp: 0,
    extra_change: 0
  },
  s25: {
    name: 'Galaxy S25',
    image: 's25.png',
    retail: 1155000,
    support: 500000,
    extra_mnp: 0,
    extra_change: 0
  },
  s25plus: {
    name: 'Galaxy S25+',
    image: 's25plus.png',
    retail: 1353000,
    support: 500000,
    extra_mnp: 0,
    extra_change: 0
  },
  s25ultra: {
    name: 'Galaxy S25 Ultra',
    image: 's25ultra.png',
    retail: 1698400,
    support: 500000,
    extra_mnp: 0,
    extra_change: 0
  },
  flip7: {
    name: 'Galaxy Z Flip7',
    image: 'flip7.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  fold7: {
    name: 'Galaxy Z Fold7',
    image: 'fold7.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  s25fe: {
    name: 'Galaxy S25 FE',
    image: 's25fe.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  s25edge: {
    name: 'Galaxy S25 Edge',
    image: 's25edge.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  iphone17: {
    name: 'iPhone 17',
    image: 'iphone17.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  iphone17air: {
    name: 'iPhone 17 Air',
    image: 'iphone17air.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  iphone17pro: {
    name: 'iPhone 17 Pro',
    image: 'iphone17pro.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  iphone17promax: {
    name: 'iPhone 17 Pro Max',
    image: 'iphone17promax.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  iphone17e: {
    name: 'iPhone 17e',
    image: 'iphone17e.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  buddy4: {
    name: 'Galaxy 버디4',
    image: 'buddy4.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  monoo2: {
    name: '키즈폰 무너에디션2',
    image: 'monoo2.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  a17: {
    name: 'Galaxy A17',
    image: 'a17.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  },
  a36: {
    name: 'Galaxy A36',
    image: 'a36.png',
    retail: 0,
    support: 0,
    extra_mnp: 0,
    extra_change: 0
  }
};

let currentDeviceKey = 's26';
let currentJoinType = 'mnp';

function formatWon(num) {
  return Number(num || 0).toLocaleString('ko-KR') + '원';
}

function openCalcModal(deviceKey) {
  currentDeviceKey = deviceKey;
  currentJoinType = 'mnp';

  const modal = document.getElementById('calcModal');
  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  renderCalcModal();
}

function closeCalcModal() {
  const modal = document.getElementById('calcModal');
  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = '';
}

function setCalcType(type) {
  currentJoinType = type;
  renderCalcModal();
}

function renderCalcModal() {
  const data = DEVICE_DATA[currentDeviceKey];
  if (!data) return;

  const extra = currentJoinType === 'mnp' ? data.extra_mnp : data.extra_change;
  const typeLabel = currentJoinType === 'mnp' ? '번호이동' : '기기변경';
  const devicePrice = data.retail - data.support - extra;

  document.getElementById('calcModelName').textContent = data.name;
  document.getElementById('summaryModelName').textContent = data.name;
  document.getElementById('calcImage').src = data.image;
  document.getElementById('calcImage').alt = data.name;

document.getElementById('typeText').textContent = `LGU+ | ${typeLabel} | 공시지원금`;
  document.getElementById('retailPrice').textContent = formatWon(data.retail);
  document.getElementById('officialSupport').textContent = '-' + formatWon(data.support);
  document.getElementById('extraDiscount').textContent = '-' + formatWon(extra);
  document.getElementById('devicePrice').textContent = formatWon(devicePrice);

  const mnpBtn = document.getElementById('typeMnpBtn');
  const changeBtn = document.getElementById('typeChangeBtn');

  if (mnpBtn) mnpBtn.classList.toggle('active', currentJoinType === 'mnp');
  if (changeBtn) changeBtn.classList.toggle('active', currentJoinType === 'change');
}

document.addEventListener('click', function (e) {
  const modal = document.getElementById('calcModal');
  if (modal && e.target === modal) {
    closeCalcModal();
  }
});
function toggleModels(listId) {
  const target = document.getElementById(listId);
  if (!target) return;

  target.classList.toggle('open');
}
function openCalcModal(deviceKey) {
  currentDeviceKey = deviceKey;

  const modal = document.getElementById('calcModal');
  if (!modal) {
    console.error('calcModal 없음');
    return;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  renderCalcModal();
}
function openCalcModal(deviceKey) {
  console.log('열림:', deviceKey);

  currentDeviceKey = deviceKey;

  const modal = document.getElementById('calcModal');
  if (!modal) {
    alert('calcModal 없음');
    return;
  }

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';

  renderCalcModal();
}
