import { useEffect, useRef, useState, useCallback } from 'react';
import './index.css';

const LOGO = 'https://pioneergraniteandquartz.com/wp-content/uploads/2024/10/logowtagline_Pioneer.png';
const S = 'https://pioneergraniteandquartz.com';

const BRAND = '#3a7ca5';

// ─── Hooks ─────────────────────────────────────────────────
function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting ? e.target.classList.add('visible') : e.target.classList.remove('visible')),
      { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
    );
    document.querySelectorAll('.reveal,.reveal-left,.reveal-right,.reveal-scale,.reveal-top,.reveal-flip,.reveal-spiral,.stagger-children,.stagger-wild').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

function useScrollY() {
  const [y, setY] = useState(0);
  useEffect(() => {
    const h = () => setY(window.scrollY);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);
  return y;
}

function useCountUp(target: number, dur = 2000) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const tick = (now: number) => { const p = Math.min((now - t0) / dur, 1); setCount(Math.round((1 - Math.pow(1 - p, 3)) * target)); if (p < 1) requestAnimationFrame(tick); };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, dur]);
  return { count, ref };
}

function useParallax(speed = 0.3) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = () => { if (!ref.current) return; const r = ref.current.getBoundingClientRect(); const s = window.innerHeight - r.top; if (s > 0 && r.bottom > 0) ref.current.style.transform = `translateY(${s * speed}px)`; };
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, [speed]);
  return ref;
}


/* ================================================================ NAV ================================================================ */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => { const h = () => setScrolled(window.scrollY > 50); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);

  const links = [
    { l: 'About', h: '#about' }, { l: 'Services', h: '#services' }, { l: 'Materials', h: '#materials' },
    { l: 'Our Stock', h: '#stock' }, { l: 'Our Process', h: '#process' }, { l: 'Gallery', h: '#gallery' },
    { l: 'Reviews', h: '#reviews' }, { l: 'FAQ', h: '#faq' }, { l: 'Blog', h: '#blog' }, { l: 'Contact', h: '#contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass-light border-b border-gray-200/60 py-3 shadow-sm' : 'bg-white/60 backdrop-blur-sm py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <a href="#" className="group"><img src={LOGO} alt="Pioneer Granite and Quartz" className="h-14 w-auto transition-transform duration-300 group-hover:scale-105" /></a>
        <div className="hidden xl:flex items-center gap-6">
          {links.map((lk) => <a key={lk.h} href={lk.h} className="text-[13px] tracking-wide text-gray-500 hover:text-gray-900 transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[1px] after:bg-[#3a7ca5] after:transition-all after:duration-300 hover:after:w-full">{lk.l}</a>)}
          <a href="#quote" className={`ml-3 px-5 py-2.5 bg-[${BRAND}] text-white text-sm font-semibold tracking-wide hover:brightness-110 transition-all duration-300 hover:shadow-[0_0_25px_hsl(204,48%,44%,0.25)] btn-hover`}>GET FREE QUOTE</a>
        </div>
        <button onClick={() => setOpen(!open)} className="xl:hidden flex flex-col gap-1.5 p-2" aria-label="Menu">
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
          <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
        </button>
      </div>
      <div className={`xl:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-lg transition-all duration-500 ${open ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
        <div className="px-6 py-6 flex flex-col gap-4">
          {links.map((lk) => <a key={lk.h} href={lk.h} onClick={() => setOpen(false)} className="text-lg text-gray-600 hover:text-gray-900 transition-colors">{lk.l}</a>)}
          <a href="#quote" onClick={() => setOpen(false)} className="mt-2 px-5 py-3 bg-[#3a7ca5] text-white text-sm font-semibold tracking-wide text-center">GET FREE QUOTE</a>
        </div>
      </div>
    </nav>
  );
}


/* ================================================================ HERO ================================================================ */
function Hero() {
  const pRef = useParallax(0.15);
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white pt-24">
      <div ref={pRef} className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[hsl(204,48%,44%,0.04)] blur-[100px]" />
        <div className="absolute bottom-1/3 left-[15%] w-[400px] h-[400px] rounded-full bg-[hsl(204,50%,60%,0.04)] blur-[80px]" />
      </div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(hsl(204,48%,44%) 1px, transparent 1px), linear-gradient(90deg, hsl(204,48%,44%) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <div className="hero-animate-1 flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
          <div className="h-[1px] w-6 sm:w-8 bg-[#3a7ca5]/40" />
          <span className="text-[10px] sm:text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase text-[#3a7ca5]">Family-Owned &middot; Denver, CO &middot; Natural Stone Institute</span>
          <div className="h-[1px] w-6 sm:w-8 bg-[#3a7ca5]/40" />
        </div>
        <h1 className="hero-animate-2 font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-light leading-[1.08] tracking-tight mb-6 sm:mb-8">
          <span className="text-gray-900">Stone Surfaces,</span><br /><span className="text-gradient-animated">Crafted to Perfection</span>
        </h1>
        <p className="hero-animate-3 text-base sm:text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 sm:mb-12 leading-relaxed font-light px-2">
          Premier countertop fabrication and installation serving Denver and the Front Range for over 20 years.
          Granite, marble, quartzite, quartz, and porcelain &mdash; from your first visit to our Sheridan showroom
          through flawless installation, a dedicated member of our team walks you through every step.
        </p>
        <div className="hero-animate-4 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
          <a href="#quote" className="group w-full sm:w-auto px-8 py-4 bg-[#3a7ca5] text-white font-semibold tracking-wide text-sm transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_35px_hsl(204,48%,44%,0.3)] btn-hover text-center">
            <span className="flex items-center justify-center gap-2">SCHEDULE FREE MEASUREMENT<svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></span>
          </a>
          <a href="tel:7208122557" className="w-full sm:w-auto px-8 py-4 border border-gray-300 text-gray-500 text-sm tracking-wide hover:border-gray-500 hover:text-gray-800 transition-all duration-300 btn-hover text-center">CALL (720) 812-2557</a>
        </div>
        <div className="hero-line-animate mx-auto mt-14 sm:mt-20 brand-line-shimmer" />
      </div>
    </section>
  );
}


/* ================================================================ STATS ================================================================ */
function Stats() {
  const s1 = useCountUp(20); const s2 = useCountUp(5000, 2500); const s3 = useCountUp(100); const s4 = useCountUp(17);
  return (
    <section className="border-y border-gray-200 bg-[#f5f7f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 md:gap-0 md:divide-x divide-gray-200">
        {[{ r: s1, v: `${s1.count}+`, l: 'Years of Experience' }, { r: s2, v: `${s2.count}+`, l: 'Projects Completed' }, { r: s3, v: `${s3.count}%`, l: 'Satisfaction Rate' }, { r: s4, v: `${s4.count}+`, l: 'Cities Served' }].map((s) => (
          <div key={s.l} ref={s.r.ref} className="flex flex-col items-center text-center reveal-flip">
            <span className="text-4xl sm:text-5xl md:text-6xl font-display font-light text-gradient counter-number">{s.v}</span>
            <span className="mt-2 sm:mt-3 text-xs sm:text-sm tracking-[0.1em] sm:tracking-[0.15em] uppercase text-gray-400">{s.l}</span>
          </div>
        ))}
      </div>
    </section>
  );
}


/* ================================================================ ABOUT ================================================================ */
function About() {
  return (
    <section id="about" className="relative py-20 sm:py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-[hsl(204,48%,44%,0.03)] blur-[120px]" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-24 items-center">
          <div className="reveal-left relative">
            <div className="relative aspect-[4/5] overflow-hidden"><img src={`${S}/wp-content/uploads/2024/02/Pic-005-scaled-e1708901530995.jpg`} alt="Pioneer Granite showroom" className="w-full h-full object-cover" /></div>
            <div className="absolute -bottom-4 -right-2 sm:-bottom-6 sm:-right-6 lg:right-[-2rem] bg-white border border-gray-200 px-6 py-4 sm:px-8 sm:py-6 shadow-xl float">
              <span className="text-3xl font-display text-gradient">20+</span>
              <p className="text-xs tracking-[0.15em] uppercase text-gray-400 mt-1">Years Serving<br />Denver</p>
            </div>
          </div>
          <div className="reveal-right">
            <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">About Pioneer</span>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-light mt-4 mb-4 leading-tight text-gray-900">Family-Owned.<br /><span className="text-gradient">Denver Proud.</span></h2>
            <div className="brand-line-shimmer mb-8" />
            <p className="text-gray-500 leading-relaxed mb-6">Pioneer Granite and Quartz is a family-owned, full-service, premier countertop production and installation company located at <strong className="text-gray-700">3333 S Platte River Dr in Sheridan, Colorado</strong>. Voted Best Granite &amp; Quartz by customers and a proud member of the <strong className="text-gray-700">Natural Stone Institute</strong>, we&apos;ve been helping homeowners and businesses across the Denver metro area transform their spaces for over two decades.</p>
            <p className="text-gray-500 leading-relaxed mb-6">What sets us apart is our commitment to walking you through the entire process — from design decisions to installation. A dedicated member of our team is with you every step of the way. We work directly with stone suppliers across the country, giving you access to an extensive selection of natural granite, marble, quartzite, engineered quartz, and porcelain surfaces at competitive prices that big-box stores can&apos;t match.</p>
            <p className="text-gray-500 leading-relaxed mb-6">Our <strong className="text-gray-700">in-house fabrication facility</strong> in Sheridan uses state-of-the-art CNC equipment, and our experienced installation crews mean quality control from start to finish. We don&apos;t subcontract — every measurement, cut, and installation is handled by our own trained team. Whether it&apos;s a kitchen remodel, bathroom vanity upgrade, commercial buildout, or a stunning stone fireplace, Pioneer delivers craftsmanship you can trust.</p>
            <p className="text-gray-500 leading-relaxed mb-10">We serve both <strong className="text-gray-700">residential homeowners</strong> and <strong className="text-gray-700">commercial clients</strong> — from single-bathroom vanity upgrades to full restaurant buildouts and office lobbies. No project is too big or too small.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[{ l: 'Natural Stone Institute Member', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /> },
                { l: 'Voted Best by Customers', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /> },
                { l: 'Mon-Fri 8:30 AM - 4:30 PM', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /> },
                { l: 'In-House Fabrication Facility', i: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
                { l: 'Residential & Commercial', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /> },
                { l: 'Showroom Open to Public', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /> }]
              .map((x) => (<div key={x.l} className="flex items-center gap-3"><div className="w-10 h-10 flex items-center justify-center border border-[#3a7ca5]/25"><svg className="w-5 h-5 text-[#3a7ca5]" fill="none" viewBox="0 0 24 24" stroke="currentColor">{x.i}</svg></div><span className="text-sm text-gray-500">{x.l}</span></div>))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ SERVICES ================================================================ */
function Services() {
  const svcs = [
    { t: 'Granite Countertops', d: 'Granite is one of nature\u2019s most enduring materials — formed deep within the earth over millions of years, each slab carries its own unique pattern of minerals, colors, and veining that can never be replicated. At Pioneer, we source granite slabs from quarries around the world, including exotic varieties from Brazil, India, Italy, and Africa. Granite is naturally resistant to heat (you can set a hot pan directly on the surface), highly scratch-resistant, and when properly sealed once a year, virtually stain-proof. It\u2019s the ideal surface for busy kitchens, outdoor BBQ areas, and high-traffic spaces. Our team will help you choose from hundreds of colors and patterns, from classic blacks and whites to dramatic blues, greens, and reds.', img: `${S}/wp-content/uploads/2024/02/Pic-008-scaled-e1708901207908.jpg`, f: ['Unique One-of-a-Kind Slabs','Heat & Scratch Resistant','100+ Colors Available','Increases Home Resale Value','Lasts a Lifetime with Proper Care','Indoor & Outdoor Applications'] },
    { t: 'Kitchen Countertops', d: 'Your kitchen countertop is the most significant surface in your household — it\u2019s where meals are prepared, homework is done, and memories are made. As the centerpiece of your kitchen, the countertop material you choose impacts both daily function and long-term value. We specialize in both natural granite and engineered quartz for kitchens. Quartz offers precise color matching and consistency, making it ideal for large kitchens and islands where seam matching matters. Granite offers natural beauty with unmatched character. We handle everything: template measurements, sink and cooktop cutouts, custom edge profiles (beveled, bullnose, ogee, waterfall, and more), backsplash integration, and island fabrication. Our kitchen projects typically take 2\u20133 weeks from template to installation.', img: `${S}/wp-content/uploads/2024/02/Pic-004-scaled-e1708901591335.jpg`, f: ['Granite & Quartz Options','Custom Edge Profiles','Island & Peninsula Fabrication','Backsplash Integration','Sink & Cooktop Cutouts','2\u20133 Week Turnaround'] },
    { t: 'Bathroom Counters', d: 'Upgrade your bathroom with luxurious granite or quartz vanity tops that completely transform the space. Bathroom counters see daily use from toothpaste, cosmetics, hair products, and water splashes \u2014 so durability and stain resistance matter. Granite brings an elegant, natural appearance with exceptional scratch and stain resistance, while quartz is an ideal choice for modern, contemporary bathrooms with its uniform color and zero-maintenance surface (no sealing ever needed). We fabricate for single vanities, double vanities, floating vanities, and custom-shaped counters. Undermount sink cutouts, vessel sink platforms, and integrated backsplashes are all part of our standard service. Most bathroom vanity projects can be completed in under two weeks.', img: `${S}/wp-content/uploads/2024/02/Pic-002-scaled-e1708901902151.jpg`, f: ['Single & Double Vanities','Undermount & Vessel Sinks','Scratch & Stain Resistant','No-Maintenance Quartz Options','Custom Shapes Available','Under 2-Week Turnaround'] },
    { t: 'Kitchen Counters', d: 'From complete kitchen remodels to simple counter replacements, we handle projects of every scale and budget. Whether you\u2019re updating a rental property, renovating your forever home, or building new construction, Pioneer has the experience and inventory to deliver. We work closely with contractors, designers, and homeowners alike. Our process includes precise digital templating to ensure every counter, peninsula, bar top, and breakfast nook fits perfectly. We specialize in complex layouts with multiple seams, waterfall edges, and full-height backsplashes. Choose from granite\u2019s natural beauty or quartz\u2019s engineered consistency \u2014 both ensure durable, beautiful counters that last a lifetime.', img: `${S}/wp-content/uploads/2024/02/Pic-007-scaled-e1708902049180.jpg`, f: ['Full Remodels & Replacements','Bar Tops & Breakfast Nooks','Waterfall Edge Specialty','Contractor Partnerships','New Construction','Budget-Friendly Options'] },
    { t: 'Stone Fabricator', d: 'Our state-of-the-art fabrication facility in Sheridan, Colorado is equipped with advanced CNC machinery and operated by skilled craftsmen with decades of combined experience. We work with all premium stone types: granite, quartz, marble, quartzite, porcelain, and specialty materials. Every slab is precision-cut to your exact specifications using digital templates for a flawless fit. We offer a complete range of edge profiles: eased, beveled, bullnose (half and full), ogee, dupont, waterfall, mitered, and custom profiles. Our fabrication process includes sink and cooktop cutouts, seam placement optimization, and hand-finishing for a quality that machine-only shops can\u2019t match. We also fabricate for other contractors and installers in the Denver area.', img: `${S}/wp-content/uploads/2023/02/IMG_2993.jpg`, f: ['CNC Precision Cutting','10+ Edge Profile Options','Sink & Cooktop Cutouts','Hand-Finished Quality','Contractor Fabrication Services','All Stone Types'] },
    { t: 'Stone Fireplaces', d: 'A stone fireplace transforms a room from ordinary to extraordinary. Whether you\u2019ve been dreaming of a dramatic floor-to-ceiling granite surround, a sleek quartz mantel, or a rustic quartzite hearth, Pioneer designs and builds custom stone fireplaces that become the centerpiece of your living space. We offer traditional surrounds, modern linear designs, full wall treatments, and outdoor fireplace installations. Our team handles everything from design consultation and material selection through fabrication and professional installation. We work with gas, electric, and wood-burning fireplaces. We also provide fireplace restoration services \u2014 replacing outdated tile or brick with stunning natural stone.', img: `${S}/wp-content/uploads/2023/02/Garrett.jpg`, f: ['Full Surrounds & Mantels','Floor-to-Ceiling Designs','Indoor & Outdoor','Gas, Electric & Wood Burning','Restoration & Replacement','Modern to Traditional Styles'] },
  ];

  return (
    <section id="services" className="relative py-20 sm:py-32 bg-[#f5f7f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">What We Do</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">Our <span className="text-gradient">Services</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto">From granite countertops and kitchen remodels to stone fireplaces and commercial fabrication — we offer a full range of premium stone services backed by over 20 years of experience and premier customer service.</p>
        </div>
        <div className="space-y-20 sm:space-y-28">
          {svcs.map((s, i) => (
            <div key={s.t} className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-20 items-center">
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''} reveal-scale`}><div className="relative img-zoom aspect-[16/11] shadow-lg"><img src={s.img} alt={s.t} className="w-full h-full object-cover" /></div></div>
              <div className={`${i % 2 === 1 ? 'lg:order-1' : ''} ${i % 2 === 0 ? 'reveal-right' : 'reveal-left'}`}>
                <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-light mt-3 mb-2 text-gray-900">{s.t}</h3>
                <div className="brand-line-shimmer mb-6" />
                <p className="text-gray-500 leading-relaxed mb-6 sm:mb-8 text-sm sm:text-base">{s.d}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 mb-6 sm:mb-8">{s.f.map((f) => <div key={f} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-[#3a7ca5] flex-shrink-0" /><span className="text-xs sm:text-sm text-gray-500">{f}</span></div>)}</div>
                <a href="#quote" className="inline-flex items-center gap-2 text-sm text-[#3a7ca5] font-medium hover:text-[#5092b8] transition-all group btn-hover">Get a Free Quote<svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg></a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ MATERIALS ================================================================ */
function Materials() {
  const mats = [
    { n: 'Granite', d: 'The gold standard of natural stone countertops. Each slab is one-of-a-kind with unique minerals, veining, and movement. Heat-resistant up to 1,200\u00B0F, scratch-resistant, and stain-resistant when sealed annually. Sourced from quarries worldwide. Best for: kitchens, outdoor areas, and high-traffic surfaces.', care: 'Seal once yearly. Clean with mild soap and water.', img: `${S}/wp-content/uploads/2024/02/Pic-010-scaled.jpg` },
    { n: 'Marble', d: 'The epitome of luxury and timeless elegance. Known for its distinctive veining and warm, luminous surface. Softer than granite, marble develops a natural patina over time that many homeowners love. Best for: bathrooms, fireplaces, accent islands, and low-traffic statement pieces where beauty is the priority.', care: 'Seal every 6 months. Avoid acidic cleaners.', img: `${S}/wp-content/uploads/2024/02/Pic-009-scaled.jpg` },
    { n: 'Quartzite', d: 'Natural stone even harder than granite with stunning visual movement and depth. Quartzite starts as sandstone and is transformed by heat and pressure into an incredibly dense, durable material. It looks like marble but performs like granite. Best for: busy kitchens, outdoor kitchens, and anywhere you want beauty plus extreme durability.', care: 'Seal once yearly. Very low maintenance.', img: `${S}/wp-content/uploads/2024/02/Pic-001-scaled.jpg` },
    { n: 'Quartz', d: 'Engineered for precise color matching, consistency, and virtually zero maintenance. Made from 90\u201394% ground natural quartz bound with resins and pigments. Antimicrobial, non-porous (never needs sealing), and available in hundreds of colors from pure whites to dramatic marble-look patterns. Best for: kitchens, bathrooms, and anyone who wants a beautiful, worry-free surface.', care: 'No sealing needed. Wipe with soap and water.', img: `${S}/wp-content/uploads/2024/02/Pic-003-scaled-e1708902152880.jpg` },
    { n: 'Porcelain', d: 'Ultra-thin (as little as 6mm), ultra-durable engineered slabs that resist heat, scratches, UV rays, and stains. Porcelain countertops are kiln-fired at over 2,200\u00B0F, making them one of the most resilient surfaces available. Ideal for both indoor and outdoor use, including countertops, walls, and shower surrounds. Best for: outdoor kitchens, modern minimalist designs, and commercial spaces.', care: 'Zero maintenance. UV and frost resistant.', img: `${S}/wp-content/uploads/2023/02/IMG_066256.jpg` },
  ];

  return (
    <section id="materials" className="relative py-20 sm:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-20 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">Premium Selection</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">Our <span className="text-gradient">Materials</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto">We work directly with stone suppliers across the country to bring you the finest selection of natural and engineered stone at competitive prices. Visit our Sheridan showroom to see and touch every material in person — our team will help you compare options and find the perfect fit for your project and budget.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-wild">
          {mats.map((m) => (
            <div key={m.n} className="group bg-white border border-gray-200 overflow-hidden hover:border-[#3a7ca5]/30 transition-all duration-500 hover:shadow-lg card-tilt">
              <div className="aspect-[4/3] overflow-hidden"><img src={m.img} alt={m.n} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" /></div>
              <div className="p-6">
                <h3 className="font-display text-2xl font-light mb-2 text-gray-900 group-hover:text-[#3a7ca5] transition-colors">{m.n}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{m.d}</p>
                <p className="text-xs text-[#3a7ca5] font-medium"><span className="text-gray-400">Care:</span> {m.care}</p>
              </div>
            </div>
          ))}
          <div className="group bg-gradient-to-br from-[hsl(204,48%,44%,0.04)] to-[hsl(204,50%,60%,0.03)] border border-[#3a7ca5]/15 overflow-hidden hover:border-[#3a7ca5]/30 transition-all duration-500 flex flex-col justify-center items-center text-center p-8">
            <div className="w-16 h-16 border border-[#3a7ca5]/20 flex items-center justify-center mb-6"><svg className="w-8 h-8 text-[#3a7ca5]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg></div>
            <h3 className="font-display text-2xl font-light mb-2 text-gradient">Remnants &amp; Sinks</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">Browse our in-stock remnant slabs — smaller pieces from previous projects at great prices. Perfect for bathrooms, bar tops, laundry rooms, and smaller surfaces. We also carry a full selection of undermount sinks in stainless steel, porcelain, and quartz composite.</p>
            <a href="#stock" className="text-xs tracking-[0.2em] uppercase text-[#3a7ca5] hover:text-[#5092b8] transition-colors">View Our Stock &rarr;</a>
          </div>
        </div>
        <div className="mt-16 text-center reveal">
          <p className="text-sm text-gray-400">Not sure which material is right for you? <a href="#quote" className="text-[#3a7ca5] hover:underline">Schedule a free showroom visit</a> and we&apos;ll walk you through every option side by side.</p>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ STOCK ================================================================ */
function Stock() {
  const colors = [
    { n: 'Pioneer White', d: 'Quartz · Clean white' }, { n: 'Carrara Breve', d: 'Quartz · Subtle veining' }, { n: 'Valor White', d: 'Quartz · Bright white' },
    { n: 'Jasmine White', d: 'Quartz · Warm tone' }, { n: 'Calacatta Idilio', d: 'Quartz · Thick veins' }, { n: 'Calacatta Miraggio', d: 'Quartz · Bold dark veins' },
  ];
  const sinks = [
    { n: 'Single Bowl Stainless Steel', m: 'Stainless Steel · Undermount', d: 'Most popular kitchen option. Durable, easy-clean.' },
    { n: 'Double Bowl Stainless Steel', m: 'SS · 50/50 Split · 3118', d: 'Ideal for kitchens with separate wash and rinse zones.' },
    { n: 'Square Porcelain Undermount', m: 'Porcelain · 1813', d: 'Clean lines for modern bathrooms.' },
    { n: 'Oval Porcelain Undermount', m: 'Porcelain · 1714', d: 'Classic shape for traditional bath vanities.' },
    { n: 'Quartz Single Bowl (Black)', m: 'Quartz Composite · 3219', d: 'Scratch-resistant, heat-resistant, modern look.' },
    { n: 'Quartz Double Bowl (Black)', m: 'Quartz Composite · 50/50 · 3219', d: 'Full-size double bowl in durable quartz composite.' },
  ];

  return (
    <section id="stock" className="relative py-20 sm:py-32 bg-[#f5f7f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">In-Stock &amp; Ready</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">Our <span className="text-gradient">Stock</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto">Browse our in-stock quartz colors and sink options available for immediate projects. We also carry remnant slabs from granite, marble, and quartzite at great prices — perfect for bathrooms, bar tops, laundry rooms, and smaller surfaces. Visit our Sheridan showroom to see everything in person and take home free samples.</p>
        </div>
        <h3 className="font-display text-2xl font-light mb-8 text-center text-gray-900 reveal">Stock Quartz Colors</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-16 stagger-wild">
          {colors.map((c) => (<div key={c.n} className="bg-white border border-gray-200 p-5 text-center hover:border-[#3a7ca5]/30 hover:shadow-md transition-all duration-300 card-tilt"><div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-200" /><h4 className="text-sm font-medium text-gray-800 mb-1">{c.n}</h4><p className="text-xs text-gray-400">{c.d}</p></div>))}
        </div>
        <h3 className="font-display text-2xl font-light mb-8 text-center text-gray-900 reveal">Stock Sinks</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 stagger-wild">
          {sinks.map((s) => (<div key={s.n} className="bg-white border border-gray-200 p-6 hover:border-[#3a7ca5]/30 transition-all duration-300 card-tilt"><div className="flex items-center gap-4 mb-3"><div className="w-14 h-14 flex-shrink-0 bg-gray-50 border border-gray-200 flex items-center justify-center"><svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg></div><div><h4 className="text-sm font-medium text-gray-800">{s.n}</h4><p className="text-xs text-gray-400">{s.m}</p></div></div><p className="text-xs text-gray-500">{s.d}</p></div>))}
        </div>
        <p className="text-center mt-8 text-sm text-gray-400 reveal">Each sink includes spec sheets with technical measurements. Prices include sink + cutout with your countertop order. <a href="#contact" className="text-[#3a7ca5] hover:underline">Contact us</a> for current availability and pricing.</p>
      </div>
    </section>
  );
}


/* ================================================================ PROCESS ================================================================ */
function Process() {
  const steps = [
    { n: '01', t: 'Free Consultation', d: 'It all starts with a conversation. Call us at (720) 812-2557 or visit our showroom at 3333 S Platte River Dr in Sheridan. We\u2019ll discuss your vision, lifestyle, budget, and timeline. Whether it\u2019s a kitchen remodel, bathroom upgrade, commercial buildout, or fireplace surround \u2014 we\u2019ll walk you through your options and give you a ballpark estimate. There\u2019s never any pressure or obligation. This step typically takes 30\u201360 minutes.', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /> },
    { n: '02', t: 'Material Selection', d: 'Visit our showroom to browse our extensive inventory in person \u2014 there\u2019s no substitute for seeing and touching the stone yourself. Compare granite vs. marble vs. quartz vs. quartzite side by side. See our in-stock quartz colors, remnant slabs for budget-friendly projects, and our full sink selection. We\u2019ll help you weigh durability, maintenance, appearance, and cost to find the perfect stone for your space. Take home free samples to see how they look in your lighting. Most customers make their selection in a single visit.', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /> },
    { n: '03', t: 'Free In-Home Template', d: 'Our template team comes to your home or jobsite for precise digital measurements \u2014 completely free with no obligation. Using laser-guided technology, every angle, edge, sink cutout, cooktop opening, and seam placement is measured down to 1/16 of an inch to ensure a flawless fit. This process takes about 1\u20132 hours depending on the project size. For commercial projects, we coordinate directly with your contractor, architect, or project manager. The template is then sent to our fabrication team in digital format.', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" /> },
    { n: '04', t: 'Design Decisions & Edge Profiles', d: 'Now the fun part \u2014 finalize your design. Choose your edge profile from over 10 options: eased, beveled, half bullnose, full bullnose, ogee, dupont, waterfall, mitered, and custom shapes. Decide on backsplash height and integration, sink style (undermount, drop-in, farmhouse), faucet hole placement, and any special details like outlet cutouts or decorative corbels. Our team walks you through every decision with physical samples and 3D visualizations so nothing is overlooked.', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /> },
    { n: '05', t: 'Precision Fabrication', d: 'Your stone is cut and finished in our state-of-the-art fabrication facility right here in Sheridan. Using advanced CNC equipment paired with decades of hand-finishing expertise, our skilled fabricators cut, shape, and polish your countertops to exact specifications from the digital template. Custom edge profiles, sink and cooktop cutouts, and seam matching are all done in-house by our own team \u2014 never subcontracted. Fabrication typically takes 5\u20137 business days depending on complexity. Quality control checks happen at every stage.', i: <><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></> },
    { n: '06', t: 'Professional Installation', d: 'Our experienced installation crew arrives on schedule (we provide a 2-hour arrival window), handles your countertops with care using specialized suction equipment, and secures everything to perfection. We level and align every piece, apply color-matched adhesive at seams, seal natural stone surfaces, reconnect plumbing fixtures, and install your sink. When we\u2019re done, we do a full cleanup and walk you through care instructions. The entire installation typically takes 2\u20134 hours for a standard kitchen. Your satisfaction is guaranteed \u2014 that\u2019s the Pioneer promise.', i: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" /> },
  ];

  return (
    <section id="process" className="relative py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-14 sm:mb-20 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">How It Works</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">Our <span className="text-gradient">Process</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-2xl mx-auto">From first call to final install, a dedicated member of our team walks you through the entire process. Most projects are completed in 2\u20133 weeks from your first visit. Here&apos;s exactly what to expect at every stage.</p>
        </div>
        <div className="relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent via-[#3a7ca5]/20 to-transparent hidden md:block" />
          <div className="space-y-8 sm:space-y-12 md:space-y-24">
            {steps.map((s, i) => (
              <div key={s.n} className={`reveal relative flex flex-col md:flex-row items-start md:items-center gap-4 sm:gap-8 ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                {/* Mobile: icon + step header row */}
                <div className="flex md:hidden items-center gap-4 mb-1">
                  <div className="w-12 h-12 flex items-center justify-center bg-white border border-[#3a7ca5]/25 text-[#3a7ca5] shadow-sm flex-shrink-0"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">{s.i}</svg></div>
                  <div><span className="text-xs tracking-[0.2em] uppercase text-[#3a7ca5]/60">Step {s.n}</span><h3 className="font-display text-xl font-light text-gray-900">{s.t}</h3></div>
                </div>
                <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-16' : 'md:text-left md:pl-16'}`}>
                  <span className="hidden md:inline text-6xl font-display font-light text-gray-100">{s.n}</span>
                  <h3 className="hidden md:block font-display text-2xl md:text-3xl font-light -mt-6 mb-3 text-gray-900">{s.t}</h3>
                  <p className="text-gray-500 leading-relaxed text-sm sm:text-base">{s.d}</p>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-14 h-14 items-center justify-center bg-white border border-[#3a7ca5]/25 z-10 text-[#3a7ca5] shadow-sm pulse-glow"><svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">{s.i}</svg></div>
                <div className="flex-1 hidden md:block" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ GALLERY ================================================================ */
function Gallery() {
  const imgs = [
    { s: `${S}/wp-content/uploads/2024/02/Pic-005-scaled-e1708901530995.jpg`, l: 'Kitchen Installation' },
    { s: `${S}/wp-content/uploads/2023/02/Miller.jpg`, l: 'Miller Project' },
    { s: `${S}/wp-content/uploads/2023/02/IMG_2993.jpg`, l: 'Stone Fabrication' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-008-scaled-e1708901207908.jpg`, l: 'Granite Countertop' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-004-scaled-e1708901591335.jpg`, l: 'Kitchen Remodel' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-002-scaled-e1708901902151.jpg`, l: 'Bathroom Vanity' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-007-scaled-e1708902049180.jpg`, l: 'Modern Kitchen' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-010-scaled.jpg`, l: 'Natural Stone' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-009-scaled.jpg`, l: 'Marble Surface' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-001-scaled.jpg`, l: 'Quartzite Counter' },
    { s: `${S}/wp-content/uploads/2024/02/Pic-003-scaled-e1708902152880.jpg`, l: 'Quartz Kitchen' },
    { s: `${S}/wp-content/uploads/2023/02/Garrett.jpg`, l: 'Stone Fireplace' },
    { s: `${S}/wp-content/uploads/2023/02/IMG_066256.jpg`, l: 'Commercial Project' },
    { s: `${S}/wp-content/uploads/2023/02/IMG_066191.jpg`, l: 'Custom Fabrication' },
  ];
  const d = [...imgs, ...imgs];

  return (
    <section id="gallery" className="relative py-20 sm:py-32 bg-[#f5f7f9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-10 sm:mb-16">
        <div className="text-center reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">Our Work Tops Them All</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">Project <span className="text-gradient">Gallery</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto">Stunning stone fireplaces, kitchen &amp; bathroom countertops from real Pioneer projects across Denver and the Front Range. Hover to pause the carousel.</p>
        </div>
      </div>
      <div className="reveal-scale">
        <div className="flex auto-scroll" style={{ width: 'max-content' }}>
          {d.map((img, i) => (<div key={i} className="relative w-[280px] sm:w-[350px] md:w-[450px] h-[220px] sm:h-[300px] md:h-[350px] flex-shrink-0 mx-2 sm:mx-3 img-zoom group shadow-md"><img src={img.s} alt={img.l} className="w-full h-full object-cover" /><div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" /><div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"><span className="text-xs sm:text-sm font-light tracking-wide text-white bg-black/30 px-2 py-1 backdrop-blur-sm">{img.l}</span></div></div>))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ REVIEWS (Google Reviews Widget) ================================================================ */
function StarRating({ rating, size = 'sm' }: { rating: number; size?: 'sm' | 'lg' }) {
  const sz = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = Math.min(1, Math.max(0, rating - i));
        return (
          <div key={i} className="relative">
            <svg className={`${sz} text-gray-200`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            <div className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <svg className={`${sz} text-amber-400`} fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Reviews() {
  const GOOGLE_RATING = 5.0;
  const GOOGLE_COUNT = 72;
  const GOOGLE_URL = 'https://share.google/FiwSjlVlLs55f4bP2';
  const REVIEW_URL = 'https://search.google.com/local/writereview?placeid=ChIJXwlkYj-Ha4cRWpJVwSX0Ejg';

  const revs = [
    { n: 'Scott Rodman', t: 'Pioneer granite and quartz was awesome to work with from start to finish. Esperanza helped us decide on a quartz for our kitchen counters/backsplash that we both loved and that we could afford. The template person was extremely quick and knowledgeable and the install team worked incredibly hard. Highly recommend Pioneer for anyone looking for quality countertops at a fair price.', ago: '2 months ago' },
    { n: 'Olga Bloch', t: 'Pioneer Granite and Quartz were amazing!!! Esperanza was very helpful, patient and thorough in helping me choose the best countertop for my laundry room. Their attention to detail and customer service is unmatched in Denver. The installation was flawless and they cleaned up everything when they were done. I will definitely be using them again for my kitchen remodel.', ago: '3 months ago' },
    { n: 'Mark & Lisa H.', t: 'From the first call to the final installation, the Pioneer team was professional, punctual, and incredibly skilled. Our new granite countertops completely transformed our kitchen. The edges are perfect, the seams are nearly invisible, and the install crew was careful with every piece. Could not be happier with the results. We\u2019ve already recommended them to three neighbors!', ago: '4 months ago' },
    { n: 'Jennifer M.', t: 'We got quotes from five different companies and Pioneer was the best value by far \u2014 not the cheapest, but the best quality for the price. They helped us pick a stunning quartzite that looks like marble but is way more durable. The whole project from first visit to installation took just under three weeks. Their showroom is worth the trip alone.', ago: '5 months ago' },
    { n: 'David R.', t: 'Incredible experience from start to finish. We were nervous about spending this much on countertops but Pioneer made it easy. The showroom is gorgeous and the staff really knows their stuff. Our quartzite kitchen counters are absolutely stunning and the installation was flawless. Worth every penny.', ago: '6 months ago' },
    { n: 'Maria S.', t: 'Second time using Pioneer and they knocked it out of the park again. First time was our kitchen, this time our master bath. Esperanza remembered us and helped pick the perfect marble. The seam work is unbelievable \u2014 you literally cannot find them. These guys are the real deal.', ago: '7 months ago' },
  ];

  const [visibleCount, setVisibleCount] = useState(4);

  /* Rating bar breakdown (5 star dominant) */
  const bars = [
    { stars: 5, pct: 94 },
    { stars: 4, pct: 4 },
    { stars: 3, pct: 1 },
    { stars: 2, pct: 1 },
    { stars: 1, pct: 0 },
  ];

  return (
    <section id="reviews" className="relative py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">Verified Reviews</span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">What People <span className="text-gradient">Say</span></h2>
          <div className="brand-line-shimmer mx-auto" />
        </div>

        {/* ── Google Rating Summary Card ── */}
        <div className="reveal mb-12 sm:mb-16">
          <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="block max-w-3xl mx-auto">
            <div className="border border-gray-200 bg-white p-6 sm:p-8 hover:shadow-lg hover:border-[#3a7ca5]/20 transition-all duration-500">
              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-10">
                {/* Left: Google logo + overall rating */}
                <div className="flex flex-col items-center text-center flex-shrink-0">
                  <div className="flex items-center gap-2 mb-3">
                    <svg className="w-7 h-7" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
                    <span className="text-xs tracking-[0.15em] uppercase text-gray-400 font-medium">Google Reviews</span>
                  </div>
                  <span className="text-5xl sm:text-6xl font-display font-light text-gray-900">{GOOGLE_RATING}</span>
                  <StarRating rating={GOOGLE_RATING} size="lg" />
                  <span className="text-sm text-gray-400 mt-2">{GOOGLE_COUNT} reviews</span>
                </div>

                {/* Right: Rating breakdown bars */}
                <div className="flex-1 w-full space-y-1.5">
                  {bars.map((b) => (
                    <div key={b.stars} className="flex items-center gap-3">
                      <span className="text-xs text-gray-400 w-3 text-right">{b.stars}</span>
                      <svg className="w-3 h-3 text-amber-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                      <div className="flex-1 h-2 bg-gray-100 overflow-hidden">
                        <div className="h-full bg-amber-400 transition-all duration-1000" style={{ width: `${b.pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-300 w-8">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </a>
        </div>

        {/* ── Review Cards ── */}
        <div className="grid md:grid-cols-2 gap-6 sm:gap-8 stagger-wild">
          {revs.slice(0, visibleCount).map((r) => (
            <div key={r.n} className="relative p-6 sm:p-8 bg-white border border-gray-200 hover:border-[#3a7ca5]/30 transition-all duration-500 group hover:shadow-lg card-tilt">
              <div className="absolute top-5 right-6 text-5xl font-display text-gray-100 leading-none group-hover:text-[#3a7ca5]/10 transition-colors">&ldquo;</div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#3a7ca5]/10 flex items-center justify-center text-[#3a7ca5] font-display text-lg">{r.n[0]}</div>
                <div>
                  <span className="text-sm font-medium text-gray-800 block">{r.n}</span>
                  <span className="text-xs text-gray-400">{r.ago}</span>
                </div>
                <svg className="w-5 h-5 ml-auto flex-shrink-0" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              </div>
              <StarRating rating={5} />
              <p className="text-gray-500 leading-relaxed mt-4 text-sm">{r.t}</p>
            </div>
          ))}
        </div>

        {/* ── Show More / Leave Review CTAs ── */}
        <div className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 reveal">
          {visibleCount < revs.length && (
            <button onClick={() => setVisibleCount(revs.length)} className="px-6 py-3 border border-gray-300 text-sm text-gray-500 hover:border-gray-500 hover:text-gray-800 transition-all duration-300 btn-hover">
              Show More Reviews
            </button>
          )}
          <a href={GOOGLE_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 border border-gray-300 text-sm text-gray-500 hover:border-gray-500 hover:text-gray-800 transition-all duration-300 btn-hover flex items-center gap-2">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            See All {GOOGLE_COUNT} Reviews on Google
          </a>
          <a href={REVIEW_URL} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-[#3a7ca5] text-white text-sm font-semibold tracking-wide hover:brightness-110 transition-all duration-300 hover:shadow-[0_0_25px_hsl(204,48%,44%,0.25)] btn-hover flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
            Leave a Review
          </a>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ FAQ ================================================================ */
function FAQ() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  const faqs = [
    { q: 'How much do granite countertops cost?', a: 'Granite countertop pricing depends on several factors: the specific slab you choose (exotic granites cost more than common colors), the square footage of your project, edge profile complexity, number of cutouts (sinks, cooktops), and whether you need removal of existing countertops. At Pioneer, most granite kitchen projects range from $2,500 to $6,000+ installed. We provide free estimates after your showroom visit \u2014 call (720) 812-2557 to schedule.' },
    { q: 'What\u2019s the difference between granite and quartz?', a: 'Granite is a natural stone quarried from the earth \u2014 each slab is one-of-a-kind with unique patterns and colors. It\u2019s heat-resistant and incredibly durable but needs to be sealed once a year. Quartz is an engineered stone (90\u201394% ground quartz + resins) that offers precise color matching, is non-porous (never needs sealing), and is antimicrobial. Granite wins on natural beauty and heat resistance; quartz wins on consistency and zero maintenance. Both last a lifetime. Visit our showroom to compare them side by side.' },
    { q: 'How long does the whole process take from start to finish?', a: 'Most residential projects take 2\u20133 weeks from your first showroom visit to completed installation. Here\u2019s the typical breakdown: showroom visit and material selection (1 day), template/measurement (scheduled within 3\u20135 business days), fabrication (5\u20137 business days), and installation (2\u20134 hours). Commercial projects and large-scale jobs may take longer depending on scope. We\u2019ll give you a clear timeline during your consultation.' },
    { q: 'Do you offer free estimates and measurements?', a: 'Yes! Your initial showroom consultation is completely free, and our in-home template measurement is also free with no obligation. We\u2019ll give you a detailed written estimate after seeing your space. There\u2019s never any pressure \u2014 take your time deciding.' },
    { q: 'What areas do you serve?', a: 'We serve the entire Denver metro area and Front Range, including Denver, Englewood, Centennial, Littleton, Aurora, Westminster, Arvada, Highlands Ranch, Parker, Castle Rock, Superior, Greenwood Village, Louisville, Thornton, Lakewood, Broomfield, Sheridan, and surrounding communities. For larger commercial projects, we can work throughout Colorado.' },
    { q: 'Do you work with contractors and designers?', a: 'Absolutely. We partner with many general contractors, kitchen designers, architects, and builders across the Denver area. We offer contractor pricing, coordinate directly with project managers on scheduling and specifications, and can fabricate from architect-provided drawings. We also offer fabrication-only services for installers who need precision-cut stone.' },
    { q: 'What edge profiles do you offer?', a: 'We offer over 10 edge profiles: eased (straight), beveled, half bullnose, full bullnose, ogee, dupont, waterfall, mitered (for a thick slab look), pencil round, and custom profiles. Each edge changes the look and feel of your countertop dramatically. Visit our showroom to see and feel physical edge samples before deciding.' },
    { q: 'How do I care for my granite countertops?', a: 'Granite is low-maintenance: clean daily with mild dish soap and warm water or a granite-specific cleaner. Avoid harsh chemicals, bleach, and vinegar. Seal your granite once a year (a simple 15-minute process \u2014 we\u2019ll show you how). Blot spills quickly rather than wiping. With proper care, granite countertops will look beautiful for decades.' },
    { q: 'Do you sell remnant slabs?', a: 'Yes! We keep a rotating inventory of remnant slabs \u2014 smaller pieces left over from previous projects \u2014 at great prices. Remnants are perfect for bathroom vanities, bar tops, laundry room counters, desk tops, and other smaller surfaces. Availability changes frequently, so visit our showroom or call to ask what\u2019s currently in stock.' },
    { q: 'Can I visit your showroom without an appointment?', a: 'Yes, walk-ins are welcome during business hours (Monday\u2013Friday, 8:30 AM \u2013 4:30 PM). Saturday visits are available by appointment. However, if you\u2019d like dedicated one-on-one time with a team member, we recommend calling ahead at (720) 812-2557 to schedule. Our showroom is located at 3333 S Platte River Dr, Sheridan, CO 80110.' },
  ];

  return (
    <section id="faq" className="relative py-20 sm:py-32 bg-[#f5f7f9]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">Common Questions</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-gray-900">Frequently <span className="text-gradient">Asked</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto">Everything you need to know about working with Pioneer. Don&apos;t see your question? <a href="#contact" className="text-[#3a7ca5] hover:underline">Reach out</a> and we&apos;ll be happy to help.</p>
        </div>
        <div className="space-y-3 reveal">
          {faqs.map((f, i) => (
            <div key={i} className="bg-white border border-gray-200 overflow-hidden transition-all duration-300 hover:border-[#3a7ca5]/20">
              <button onClick={() => setOpenIdx(openIdx === i ? null : i)} className="w-full flex items-center justify-between px-6 py-5 text-left">
                <span className="text-sm font-medium text-gray-800 pr-4">{f.q}</span>
                <svg className={`w-5 h-5 text-[#3a7ca5] flex-shrink-0 transition-transform duration-300 ${openIdx === i ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className={`overflow-hidden transition-all duration-500 ${openIdx === i ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ SERVICE AREAS ================================================================ */
function Areas() {
  const a = ['Denver','Englewood','Centennial','Littleton','Aurora','Westminster','Arvada','Highlands Ranch','Parker','Castle Rock','Superior','Greenwood Village','Louisville','Thornton','Lakewood','Broomfield','Sheridan','Golden','Commerce City','Brighton','Lone Tree','Ken Caryl'];
  return (
    <section className="relative py-16 sm:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">Serving the Front Range</span>
          <h2 className="font-display text-3xl md:text-4xl font-light mt-4 mb-4 text-gray-900">Service <span className="text-gradient">Areas</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto">We serve homeowners, contractors, and businesses throughout the Denver metro area and beyond. Our installation teams travel across the Front Range daily.</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3 stagger-wild">
          {a.map((x) => <span key={x} className="px-4 sm:px-5 py-2 sm:py-2.5 border border-gray-200 text-xs sm:text-sm text-gray-500 hover:text-[#3a7ca5] hover:border-[#3a7ca5]/30 hover:bg-[hsl(204,48%,44%,0.04)] transition-all duration-300 cursor-default">{x}</span>)}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ BLOG ================================================================ */
function Blog() {
  const posts = [
    { t: 'Reviewing Your Different Stone Countertop Options', d: 'Granite vs. Marble vs. Quartz vs. Quartzite \u2014 a comprehensive comparison covering durability, maintenance, cost, appearance, and best use cases to help you choose the right material for your project.' },
    { t: 'Everything To Know About Sealing Granite Counters', d: 'Why proper sealing matters, how often to seal (annually is the standard), the best sealers to use, step-by-step instructions, and how to test if your granite needs resealing.' },
    { t: 'Countertop Edges: Pros and Cons Guide', d: 'A visual guide to over 10 edge profiles \u2014 eased, beveled, bullnose, ogee, waterfall, mitered, and more. Learn how each edge impacts look, feel, safety, and cost.' },
    { t: 'How To Care For Quartz Countertops', d: 'Quartz is low-maintenance but not maintenance-free. Learn the dos and don\u2019ts: what cleaners to use, how to avoid heat damage, and tips for keeping your quartz looking brand new for decades.' },
    { t: 'Granite\u2019s Journey: From Earth to Your Kitchen', d: 'Explore how granite forms deep within the earth over millions of years, how it\u2019s quarried and transported worldwide, and what makes each slab a unique work of natural art.' },
    { t: 'How To Clean Hard Water Stains Off Granite', d: 'Hard water mineral deposits can dull your granite\u2019s shine. Step-by-step instructions for safely removing buildup and restoring your countertop\u2019s natural luster without damaging the seal.' },
  ];
  return (
    <section id="blog" className="relative py-20 sm:py-32 bg-[#f5f7f9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#3a7ca5]">Learn More</span>
          <h2 className="font-display text-4xl md:text-5xl font-light mt-4 mb-4 text-gray-900">From Our <span className="text-gradient">Blog</span></h2>
          <div className="brand-line-shimmer mx-auto mb-6" />
          <p className="text-gray-500 max-w-xl mx-auto">Expert tips on stone care, material comparisons, edge profile guides, and design inspiration from the Pioneer team.</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 stagger-wild">
          {posts.map((p) => (
            <div key={p.t} className="bg-white border border-gray-200 p-6 hover:border-[#3a7ca5]/30 transition-all duration-500 group hover:shadow-md card-tilt blog-card-accent">
              <div className="w-10 h-10 bg-gray-50 flex items-center justify-center mb-4"><svg className="w-5 h-5 text-[#3a7ca5]/50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg></div>
              <h3 className="text-base font-medium text-gray-800 mb-2 group-hover:text-[#3a7ca5] transition-colors">{p.t}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{p.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ================================================================ CONTACT ================================================================ */
function Contact() {
  const [fd, setFd] = useState({ name: '', email: '', phone: '', service: '', material: '', message: '' });
  const [done, setDone] = useState(false);
  const submit = useCallback((e: React.FormEvent) => { e.preventDefault(); setDone(true); }, []);
  const inp = "w-full bg-white border border-gray-200 px-4 py-3 text-gray-800 text-sm placeholder:text-gray-300 focus:outline-none focus:border-[#3a7ca5]/50 focus:ring-1 focus:ring-[#3a7ca5]/20 transition-colors";
  const sel = inp + " appearance-none";

  return (
    <section id="quote" className="relative py-20 sm:py-32 bg-[#0c2d3f]">
      <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.3) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative" id="contact">
        <div className="text-center mb-20 reveal">
          <span className="text-xs tracking-[0.3em] uppercase text-[#5092b8]">Let&apos;s Get Started</span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-light mt-4 mb-4 text-white">Get Your Free Quote</h2>
          <div className="w-[60px] h-[2px] mx-auto bg-[#3a7ca5]/60" />
          <p className="text-white/50 max-w-xl mx-auto mt-6">Ready to transform your space? Fill out the form below, give us a call at (720) 812-2557, or stop by our showroom in Sheridan. We respond to all inquiries within one business day.</p>
        </div>
        <div className="grid lg:grid-cols-5 gap-16">
          <div className="lg:col-span-3 reveal-left">
            {done ? (
              <div className="text-center py-20 border border-white/20 bg-white/5">
                <svg className="w-16 h-16 mx-auto text-[#5092b8] mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <h3 className="font-display text-2xl text-white mb-3">Thank You!</h3>
                <p className="text-white/50">We&apos;ve received your request and will be in touch within one business day.</p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6 bg-white p-8 shadow-xl">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Full Name *</label><input type="text" required value={fd.name} onChange={e => setFd({...fd,name:e.target.value})} className={inp} placeholder="Your name" /></div>
                  <div><label className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Email *</label><input type="email" required value={fd.email} onChange={e => setFd({...fd,email:e.target.value})} className={inp} placeholder="your@email.com" /></div>
                </div>
                <div className="grid sm:grid-cols-2 gap-6">
                  <div><label className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Phone</label><input type="tel" value={fd.phone} onChange={e => setFd({...fd,phone:e.target.value})} className={inp} placeholder="(303) 555-0000" /></div>
                  <div><label className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Service Type</label>
                    <select value={fd.service} onChange={e => setFd({...fd,service:e.target.value})} className={sel}>
                      <option value="">Select a service</option>
                      {['Kitchen Countertops','Bathroom Counters','Kitchen Remodel','Stone Fireplace','Commercial Project','Stone Fabrication Only','Material / Remnant Purchase','Sink Purchase','Other'].map(o => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div><label className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Preferred Material</label>
                  <select value={fd.material} onChange={e => setFd({...fd,material:e.target.value})} className={sel}>
                    <option value="">Select material (optional)</option>
                    {['Granite','Marble','Quartzite','Quartz (Engineered)','Porcelain','Not Sure Yet'].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div><label className="block text-xs tracking-[0.15em] uppercase text-gray-400 mb-2">Project Details</label><textarea rows={4} value={fd.message} onChange={e => setFd({...fd,message:e.target.value})} className={inp + " resize-none"} placeholder="Tell us about your project \u2014 kitchen size, material preferences, timeline, budget range, etc." /></div>
                <button type="submit" className="w-full sm:w-auto px-10 py-4 bg-[#3a7ca5] text-white font-semibold text-sm tracking-wide hover:brightness-110 transition-all duration-300 hover:shadow-[0_0_30px_hsl(204,48%,44%,0.35)] btn-hover">REQUEST FREE QUOTE</button>
              </form>
            )}
          </div>
          <div className="lg:col-span-2 reveal-right space-y-8">
            <div><h3 className="font-display text-xl mb-4 text-white">Visit Our Showroom</h3><div className="flex items-start gap-3"><svg className="w-5 h-5 text-[#5092b8] mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg><div className="text-white/60 text-sm"><p className="text-white/80 font-medium">Pioneer Granite &amp; Quartz</p><p>3333 S Platte River Dr</p><p>Sheridan, CO 80110</p><p className="mt-1 text-[#5092b8]">Walk-ins welcome during business hours</p></div></div></div>
            <div><h3 className="font-display text-xl mb-4 text-white">Call Us</h3><div className="space-y-2"><a href="tel:7208122557" className="flex items-center gap-3 group"><svg className="w-5 h-5 text-[#5092b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span className="text-white/60 text-sm group-hover:text-white transition-colors">(720) 812-2557</span></a></div></div>
            <div><h3 className="font-display text-xl mb-4 text-white">Email</h3><a href="mailto:pioneergraniteandquartzoffice@gmail.com" className="flex items-center gap-3 group"><svg className="w-5 h-5 text-[#5092b8]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg><span className="text-white/60 text-sm group-hover:text-white transition-colors">pioneergraniteandquartzoffice@gmail.com</span></a></div>
            <div><h3 className="font-display text-xl mb-4 text-white">Hours</h3><div className="text-white/60 text-sm space-y-1"><p>Monday &ndash; Friday: 8:30 AM &ndash; 4:30 PM</p><p>Saturday: By Appointment</p><p>Sunday: Closed</p></div></div>
            <div><h3 className="font-display text-xl mb-4 text-white">Follow Us</h3><div className="flex gap-4">{[{h:'https://www.facebook.com/PioneerGraniteQuartz',i:<path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>},{h:'https://www.instagram.com/pioneergraniteandquartz',i:<path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>},{h:'https://www.youtube.com/channel/UCT-pQa7sFRRAu6CKf9lTLXA',i:<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>}].map(s => <a key={s.h} href={s.h} target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/15 flex items-center justify-center hover:border-[#5092b8] hover:text-[#5092b8] transition-all text-white/50"><svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">{s.i}</svg></a>)}</div></div>
            <div className="mt-6 aspect-[4/3] bg-white/5 border border-white/10 overflow-hidden"><iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3073.5!2d-105.0058162!3d39.6567794!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x876c7f3e!2sPioneer+Granite+and+Quartz!5e0!3m2!1sen!2sus!4v1234567890" width="100%" height="100%" style={{border:0}} allowFullScreen loading="lazy" title="Location" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}


/* ================================================================ FOOTER ================================================================ */
function Footer() {
  return (
    <footer className="bg-[#0a2233] border-t border-white/5 py-12 sm:py-16 pb-28 sm:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12">
          <div className="md:col-span-2"><img src={LOGO} alt="Pioneer Granite and Quartz" className="h-14 w-auto mb-4" /><p className="text-sm text-white/35 leading-relaxed max-w-md">A family-owned, full-service, premier countertop production and installation company serving Denver and the Front Range for over 20 years. Voted Best Granite &amp; Quartz by customers. Proud member of the Natural Stone Institute. Visit our showroom at 3333 S Platte River Dr, Sheridan, CO 80110.</p></div>
          <div><h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">Quick Links</h4><div className="space-y-2">{['About','Services','Materials','Our Stock','Our Process','Gallery','Reviews','FAQ','Blog','Contact'].map(l => <a key={l} href={`#${l.toLowerCase().replace(/ /g,'-')}`} className="block text-sm text-white/30 hover:text-white/60 transition-colors">{l}</a>)}</div></div>
          <div><h4 className="text-xs tracking-[0.2em] uppercase text-white/40 mb-4">Services</h4><div className="space-y-2">{['Granite Countertops','Kitchen Countertops','Bathroom Counters','Kitchen Counters','Stone Fabricator','Stone Fireplaces','Remnants & Sinks','Commercial Projects'].map(s => <span key={s} className="block text-sm text-white/30">{s}</span>)}</div></div>
        </div>
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} Pioneer Granite and Quartz. All rights reserved.</p>
          <p className="text-xs text-white/20">3333 S Platte River Dr, Sheridan, CO 80110 &middot; (720) 812-2557 &middot; pioneergraniteandquartzoffice@gmail.com</p>
        </div>
      </div>
    </footer>
  );
}


/* ================================================================ BACK TO TOP ================================================================ */
function BackToTop() {
  const y = useScrollY();
  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      className={`fixed bottom-20 sm:bottom-8 right-4 sm:right-8 z-40 w-11 h-11 bg-[#3a7ca5] text-white shadow-lg flex items-center justify-center transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_25px_hsl(204,48%,44%,0.3)] back-to-top ${y > 600 ? 'show' : ''}`}
      aria-label="Back to top"
    >
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
    </button>
  );
}

/* ================================================================ MOBILE CTA BAR ================================================================ */
function MobileCTA() {
  const y = useScrollY();
  return (
    <div className={`fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 mobile-cta-bar ${y > 400 ? 'show' : ''}`}>
      <div className="flex gap-3">
        <a href="#quote" className="flex-1 py-3 bg-[#3a7ca5] text-white text-sm font-semibold tracking-wide text-center btn-hover">FREE QUOTE</a>
        <a href="tel:7208122557" className="flex-1 py-3 border border-gray-300 text-gray-600 text-sm font-medium text-center btn-hover">CALL NOW</a>
      </div>
    </div>
  );
}


/* ================================================================ APP ================================================================ */
export default function App() {
  useScrollReveal();
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <Nav />
      <Hero />
      <Stats />
      <About />
      <Services />
      <Materials />
      <Stock />
      <Process />
      <Gallery />
      <Reviews />
      <FAQ />
      <Areas />
      <Blog />
      <Contact />
      <Footer />
      <BackToTop />
      <MobileCTA />
    </div>
  );
}
