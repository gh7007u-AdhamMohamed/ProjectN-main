import { Link } from 'react-router-dom'

const AboutPage = () => {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

        .about-root {
          min-height: 100vh;
          background: #080c10;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'DM Sans', sans-serif;
          position: relative;
          overflow: hidden;
          padding: 40px 24px;
        }

        .about-root::before {
          content: '';
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(46,134,171,.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(46,134,171,.06) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%);
        }

        .orb { position:absolute;border-radius:50%;filter:blur(90px);opacity:.15;animation:drift 9s ease-in-out infinite alternate }
        .orb-1 { width:500px;height:500px;background:#2e86ab;top:-150px;right:-150px;animation-delay:0s }
        .orb-2 { width:350px;height:350px;background:#00c6ae;bottom:-100px;left:-80px;animation-delay:-4s }
        @keyframes drift { from{transform:translate(0,0)}to{transform:translate(25px,15px)} }

        /* ── top nav strip ── */
        .about-nav {
          position: relative; z-index: 10;
          width: 100%; max-width: 720px;
          display: flex; justify-content: space-between; align-items: center;
          margin-bottom: 48px;
        }
        .about-nav .brand {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 13px; letter-spacing: 4px; color: #2e86ab;
          display: flex; align-items: center; gap: 8px;
        }
        .about-nav .brand::before {
          content: ''; display: block; width: 22px; height: 2px;
          background: linear-gradient(90deg,#2e86ab,#00c6ae); border-radius: 2px;
        }
        .back-btn {
          font-size: 12px; font-weight: 600; letter-spacing: .5px;
          color: rgba(240,244,248,.35); text-decoration: none;
          border: 1px solid rgba(240,244,248,.1); border-radius: 8px;
          padding: 7px 14px; transition: all .2s;
        }
        .back-btn:hover { color: #f0f4f8; border-color: rgba(46,134,171,.4) }

        /* ── card ── */
        .about-card {
          position: relative; z-index: 10;
          width: 100%; max-width: 720px;
          background: rgba(13,27,42,.85);
          border: 1px solid rgba(46,134,171,.2);
          border-radius: 24px;
          overflow: hidden;
          backdrop-filter: blur(20px);
          box-shadow: 0 40px 100px rgba(0,0,0,.6), inset 0 1px 0 rgba(255,255,255,.05);
          animation: fadeUp .55s cubic-bezier(.16,1,.3,1) both;
        }
        @keyframes fadeUp { from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)} }

        /* top accent bar */
        .card-accent {
          height: 4px;
          background: linear-gradient(90deg, #2e86ab 0%, #00c6ae 50%, #f4a261 100%);
        }

        .card-body { padding: 48px 48px 40px; }

        /* ── hero row ── */
        .hero-row {
          display: flex; align-items: center; gap: 32px; margin-bottom: 40px;
        }

        .avatar {
          width: 88px; height: 88px; border-radius: 50%; flex-shrink: 0;
          background: linear-gradient(135deg, #2e86ab, #00c6ae);
          display: flex; align-items: center; justify-content: center;
          font-family: 'Bebas Neue', sans-serif; font-size: 32px;
          color: #fff; letter-spacing: 1px;
          box-shadow: 0 0 0 4px rgba(46,134,171,.2), 0 0 40px rgba(46,134,171,.3);
          position: relative;
        }
        .avatar::after {
          content: '';
          position: absolute; inset: -6px;
          border-radius: 50%;
          border: 1.5px solid rgba(46,134,171,.3);
          animation: pulse 2.5s ease-in-out infinite;
        }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(1.08)} }

        .hero-text {}
        .hero-role {
          font-size: 11px; font-weight: 700; letter-spacing: 2.5px;
          text-transform: uppercase; color: #2e86ab; margin-bottom: 6px;
        }
        .hero-name {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 48px; letter-spacing: 1px;
          color: #f0f4f8; line-height: 1; margin-bottom: 8px;
        }
        .hero-desc {
          font-size: 13px; color: rgba(240,244,248,.4); line-height: 1.6;
          max-width: 340px;
        }

        /* ── divider ── */
        .divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(46,134,171,.3), transparent);
          margin-bottom: 36px;
        }

        /* ── contact section ── */
        .contact-title {
          font-size: 10px; font-weight: 700; letter-spacing: 2px;
          text-transform: uppercase; color: rgba(240,244,248,.3);
          margin-bottom: 16px;
        }

        .contact-grid { display: flex; flex-direction: column; gap: 12px; }

        .contact-item {
          display: flex; align-items: center; gap: 16px;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(46,134,171,.12);
          border-radius: 12px; padding: 14px 18px;
          text-decoration: none;
          transition: all .2s;
          cursor: default;
        }
        .contact-item.link { cursor: pointer }
        .contact-item.link:hover {
          background: rgba(46,134,171,.1);
          border-color: rgba(46,134,171,.35);
          transform: translateX(4px);
        }

        .contact-icon {
          width: 40px; height: 40px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .icon-wa  { background: rgba(37,211,102,.12); }
        .icon-dev { background: rgba(46,134,171,.12); }

        .contact-info {}
        .contact-label {
          font-size: 10px; font-weight: 700; letter-spacing: 1px;
          text-transform: uppercase; color: rgba(240,244,248,.3); margin-bottom: 2px;
        }
        .contact-value {
          font-size: 15px; font-weight: 600; color: #f0f4f8; letter-spacing: .3px;
        }
        .contact-sub {
          font-size: 11px; color: rgba(240,244,248,.3); margin-top: 1px;
        }

        .wa-btn-wrap { margin-top: 28px }
        .wa-btn {
          display: inline-flex; align-items: center; gap: 10px;
          background: linear-gradient(135deg, #25d366, #128c3e);
          color: #fff; text-decoration: none;
          font-size: 14px; font-weight: 600; letter-spacing: .3px;
          padding: 13px 24px; border-radius: 12px;
          transition: opacity .2s, transform .15s;
          box-shadow: 0 8px 24px rgba(37,211,102,.25);
        }
        .wa-btn:hover { opacity: .9; transform: translateY(-2px) }
        .wa-btn:active { transform: translateY(0) }

        /* ── footer ── */
        .about-footer {
          position: relative; z-index: 10;
          margin-top: 32px;
          font-size: 12px; color: rgba(240,244,248,.18);
          font-family: 'IBM Plex Mono', monospace;
          letter-spacing: .5px;
        }

        @media(max-width:520px){
          .hero-row{flex-direction:column;text-align:center;gap:20px}
          .hero-desc{max-width:100%}
          .card-body{padding:32px 24px 28px}
          .hero-name{font-size:38px}
        }
      `}</style>

      <div className="about-root">
        <div className="orb orb-1" />
        <div className="orb orb-2" />

        {/* Nav */}
        <div className="about-nav">
          <div className="brand">PROJECT N</div>
          <Link to="/receipts" className="back-btn">← Back to App</Link>
        </div>

        {/* Card */}
        <div className="about-card">
          <div className="card-accent" />
          <div className="card-body">

            {/* Hero */}
            <div className="hero-row">
              <div className="avatar">AM</div>
              <div className="hero-text">
                <div className="hero-role">Developer & Creator</div>
                <div className="hero-name">Adham Mohamed</div>
                <div className="hero-desc">
                  Built ProjectN — a payment order management system for tracking receipts, approvals, and wallet transactions.
                </div>
              </div>
            </div>

            <div className="divider" />

            {/* Contact */}
            <div className="contact-title">Contact</div>
            <div className="contact-grid">

              <div className="contact-item">
                <div className="contact-icon icon-dev">👨‍💻</div>
                <div className="contact-info">
                  <div className="contact-label">Full Name</div>
                  <div className="contact-value">Adham Mohamed</div>
                  <div className="contact-sub">Software Developer</div>
                </div>
              </div>

              <a
                className="contact-item link"
                href="https://wa.me/201098032870"
                target="_blank"
                rel="noreferrer"
              >
                <div className="contact-icon icon-wa">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#25d366">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </div>
                <div className="contact-info">
                  <div className="contact-label">WhatsApp</div>
                  <div className="contact-value">01098032870</div>
                  <div className="contact-sub">Tap to open WhatsApp ↗</div>
                </div>
              </a>

            </div>

            {/* CTA */}
            <div className="wa-btn-wrap">
              <a href="https://wa.me/201098032870" target="_blank" rel="noreferrer" className="wa-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Chat on WhatsApp
              </a>
            </div>

          </div>
        </div>

        <div className="about-footer">ProjectN · Built by Adham Mohamed · 2025</div>
      </div>
    </>
  )
}

export default AboutPage