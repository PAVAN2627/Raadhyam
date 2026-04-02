import { Link } from "react-router-dom";

const IconInstagram = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    width="20"
    height="20"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
  </svg>
);

const IconYouTube = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" />
    <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white" />
  </svg>
);

const IconWhatsApp = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
  </svg>
);

const FooterPage = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Forum&family=Manrope:wght@400;500;600;700;800&display=swap');

        .ft-root { font-family:'Manrope',system-ui,sans-serif; background: #ffffff; }

        .ft-link {
          color: #4b5563;
          text-decoration: none;
          font-size: .95rem;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          gap: .5rem;
          transition: color .25s, transform .25s;
          position: relative;
          padding-bottom: 2px;
        }
        .ft-link::after {
          content:'';
          position:absolute;
          bottom:0; left:0;
          width:0; height:2px;
          background:linear-gradient(90deg,#ef7e1a,#f4a14f);
          border-radius:2px;
          transition:width .3s ease;
        }
        .ft-link:hover { color:#ea580c; transform:translateX(4px); }
        .ft-link:hover::after { width:100%; }

        .ft-social {
          width:44px; height:44px;
          border-radius:12px;
          background:rgba(239,126,26,.1);
          border:1px solid rgba(239,126,26,.2);
          display:flex; align-items:center; justify-content:center;
          color:#ea580c;
          text-decoration:none;
          transition:all .3s cubic-bezier(.4,0,.2,1);
        }
        .ft-social:hover {
          background:linear-gradient(135deg,#ef7e1a,#f4a14f);
          color:#ffffff;
          border-color:transparent;
          transform:translateY(-4px);
          box-shadow:0 10px 24px rgba(239,126,26,.3);
        }

        .ft-head {
          font-family:'Manrope',sans-serif;
          font-size:.9rem;
          font-weight:800;
          letter-spacing:.1em;
          text-transform:uppercase;
          color:#111827;
          margin-bottom:1.5rem;
          display:flex;
          align-items:center;
          gap:.5rem;
        }
        .ft-head::before {
          content:'';
          display:inline-block;
          width:20px; height:3.5px;
          background:linear-gradient(90deg,#ef7e1a,#f4a14f);
          border-radius:3px;
          flex-shrink:0;
        }

        .ft-contact-row {
          display:flex;
          align-items:flex-start;
          gap:.8rem;
          margin-bottom:1rem;
          color:#4b5563;
          font-size:.95rem;
          line-height:1.6;
          font-weight: 500;
        }
        .ft-contact-icon {
          width:36px; height:36px;
          border-radius:10px;
          background:rgba(239,126,26,.12);
          color:#ea580c;
          display:flex; align-items:center; justify-content:center;
          font-size:.9rem;
          font-weight:700;
          flex-shrink:0;
          margin-top:2px;
        }

        @media(max-width:768px){
          .ft-grid { grid-template-columns:1fr 1fr !important; }
          .ft-brand { grid-column:1/-1 !important; }
        }
        @media(max-width:480px){
          .ft-grid { grid-template-columns:1fr !important; }
          .ft-bot-row { flex-direction:column !important; gap:.75rem !important; text-align:center; }
        }
      `}</style>

      <footer className="ft-root">
        <div style={{ height: 5, background: "linear-gradient(90deg,#ef7e1a,#f4a14f)" }} />

        <div
          style={{
            background: "#ffffff",
            padding: "5rem 1.5rem 4rem",
            borderTop: "1px solid rgba(0,0,0,.05)",
          }}
        >
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              className="ft-grid"
              style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1.4fr", gap: "4rem" }}
            >
              <div className="ft-brand">
                <Link to="/" style={{ display: "inline-block", marginBottom: "1.25rem", textDecoration: "none" }}>
                  <img src="/Raadhyam.png" alt="Raadhyam" style={{ height: 56, filter: 'invert(1) hue-rotate(180deg) contrast(1.5)' }} />
                </Link>
                <p style={{ color: "#4b5563", fontWeight: 500, fontSize: "1rem", lineHeight: 1.7, marginBottom: "2rem", maxWidth: 320 }}>
                  Professional music education rooted in the Guru-Shishya tradition. Online & offline classes for all ages, all instruments, all skill levels.
                </p>
                <div style={{ display: "flex", gap: ".75rem" }}>
                  <a
                    href="https://www.instagram.com/learnwith_raadhyam/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-social"
                    aria-label="Instagram"
                  >
                    <IconInstagram />
                  </a>
                  <a
                    href="https://www.youtube.com/@raadhyammusicacademy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-social"
                    aria-label="YouTube"
                  >
                    <IconYouTube />
                  </a>
                  <a
                    href="https://wa.me/919837088802"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ft-social"
                    aria-label="WhatsApp"
                  >
                    <IconWhatsApp />
                  </a>
                </div>
              </div>

              <div>
                <p className="ft-head">Quick Links</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                  <Link to="/" className="ft-link">Home</Link>
                  <Link to="/About-Us" className="ft-link">About Us</Link>
                  <Link to="/Courses" className="ft-link">Courses</Link>
                  <Link to="/Notes" className="ft-link">Notes</Link>
                  <Link to="/Contact-Us" className="ft-link">Contact Us</Link>
                  <Link to="/login" className="ft-link">Student Login</Link>
                </div>
              </div>

              <div>
                <p className="ft-head">Courses</p>
                <div style={{ display: "flex", flexDirection: "column", gap: ".8rem" }}>
                  {[
                    "Vocal Training",
                    "Guitar & Strings",
                    "Keyboard & Piano",
                    "Percussion",
                    "Wind Instruments",
                    "Music Theory",
                  ].map((course) => (
                    <span key={course} style={{ color: "#4b5563", fontWeight: 500, fontSize: ".95rem", lineHeight: 1.5 }}>
                      {course}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="ft-head">Contact Us</p>
                <div className="ft-contact-row">
                  <div className="ft-contact-icon">E</div>
                  <a href="mailto:raadhyammusicals@gmail.com" style={{ color: "#4b5563", textDecoration: "none", wordBreak: "break-all" }}>
                    raadhyammusicals@gmail.com
                  </a>
                </div>
                <div className="ft-contact-row">
                  <div className="ft-contact-icon">P</div>
                  <div>
                    <a href="tel:+918410337618" style={{ color: "#4b5563", textDecoration: "none", display: "block" }}>+91 84103 37618</a>
                    <a href="tel:+919412318590" style={{ color: "#4b5563", textDecoration: "none", display: "block", marginTop: "4px" }}>+91 94123 18590</a>
                  </div>
                </div>
                <div className="ft-contact-row">
                  <div className="ft-contact-icon">L</div>
                  <span>Ashiyana PT. Deen, Shop no.04, Sector 7, Dayal Upadhyay Puram, Agra, UP 282007</span>
                </div>
                <div className="ft-contact-row">
                  <div className="ft-contact-icon">W</div>
                  <span>Online Classes Available Worldwide</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={{ background: "#f9fafb", padding: "1.5rem 1.5rem", borderTop: "1px solid rgba(0,0,0,.06)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div
              className="ft-bot-row"
              style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}
            >
              <p style={{ color: "#6b7280", fontSize: ".875rem", margin: 0, fontWeight: 500 }}>
                Copyright {year} <span style={{ color: "#111827", fontWeight: 700 }}>Raadhyam Musical Classes</span>. All rights reserved.
              </p>
              <p style={{ color: "#6b7280", fontSize: ".875rem", margin: 0, display: "flex", alignItems: "center", gap: ".35rem", fontWeight: 500 }}>
                Made with <span style={{ color: "#ef7e1a", fontSize: "1.2rem", fontWeight: 800 }}>+</span> for Music Lovers
              </p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

export default FooterPage;
