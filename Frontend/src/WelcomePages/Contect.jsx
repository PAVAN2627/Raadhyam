import React, { useState } from 'react';
import FooterPage from "./FooterPage";
import NavBarpage from "./NavBarpage";

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        const whatsappMessage = `
*New Contact Message from Raadhyam Website*
*Name:* ${formData.name}
*Email:* ${formData.email}
*Phone:* ${formData.phone}
*Subject:* ${formData.subject}
*Message:*
${formData.message}
*Sent via Raadhyam Contact Form*
        `.trim();
        const encodedMessage = encodeURIComponent(whatsappMessage);
        const whatsappNumber = '916396949336';
        window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
        setIsLoading(false);
        setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    };

    const contactMethods = [
        {
            icon: '📧',
            title: 'Email Us',
            description: 'Send us an email anytime',
            value: 'raadhyammusicals@gmail.com',
            link: 'mailto:raadhyammusicals@gmail.com'
        },
        {
            icon: '📱',
            title: 'WhatsApp',
            description: 'Chat with us instantly',
            value: '+91 84103 37618',
            link: 'https://wa.me/918410337618'
        },
        {
            icon: '📍',
            title: 'Visit Us',
            description: 'Come say hello at our studio',
            value: 'Ashiyana PT.Deen Shop no.04 Sector 7 Dayal Upadhyay Puram Agra UP 282007',
            link: 'https://maps.app.goo.gl/b6rT2WkwkLrQJiis8'
        },
    ];

    const stats = [
        { icon: '🎵', value: '500+', label: 'Students' },
        { icon: '🎸', value: '50+',  label: 'Instruments' },
        { icon: '🎹', value: '10+',  label: 'Teachers' },
        { icon: '⭐', value: '5.0',  label: 'Rating' },
    ];

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: "'Lato', Arial, sans-serif" }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Lato:wght@300;400;600;700&display=swap');
                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                @keyframes floatNote {
                    0%,100% { transform: translateY(0) rotate(0deg); }
                    33%     { transform: translateY(-18px) rotate(5deg); }
                    66%     { transform: translateY(10px) rotate(-4deg); }
                }
                @keyframes shimmer {
                    0%   { background-position: -200% center; }
                    100% { background-position:  200% center; }
                }
                @keyframes drawLine {
                    from { width: 0; }
                    to   { width: 72px; }
                }
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(28px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .contact-input {
                    width: 100%;
                    padding: 12px 16px;
                    background: #fff;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 12px;
                    font-size: 0.9rem;
                    color: #1E293B;
                    font-family: 'Lato', sans-serif;
                    transition: border-color 0.25s, box-shadow 0.25s;
                    outline: none;
                }
                .contact-input:focus {
                    border-color: #D97706;
                    box-shadow: 0 0 0 3px rgba(217,119,6,0.12);
                }
                .contact-input::placeholder { color: #94A3B8; }

                .contact-method-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    padding: 16px;
                    border-radius: 14px;
                    border: 1.5px solid #E2E8F0;
                    background: #fff;
                    text-decoration: none;
                    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
                    box-shadow: 0 2px 10px rgba(30,41,59,0.05);
                }
                .contact-method-card:hover {
                    border-color: rgba(217,119,6,0.5);
                    box-shadow: 0 8px 28px rgba(217,119,6,0.12);
                    transform: translateY(-3px);
                }

                .stat-card {
                    background: #fff;
                    border: 1.5px solid #E2E8F0;
                    border-radius: 16px;
                    padding: 20px 16px;
                    text-align: center;
                    box-shadow: 0 2px 10px rgba(30,41,59,0.05);
                    transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
                }
                .stat-card:hover {
                    border-color: rgba(217,119,6,0.4);
                    box-shadow: 0 8px 24px rgba(217,119,6,0.1);
                    transform: translateY(-3px);
                }

                .section-tag {
                    display: inline-flex; align-items: center; gap: 7px;
                    background: rgba(217,119,6,0.1); border: 1px solid rgba(217,119,6,0.3);
                    color: #D97706; padding: 5px 16px; border-radius: 24px;
                    font-size: 0.72rem; font-weight: 700; letter-spacing: 0.16em;
                    text-transform: uppercase; margin-bottom: 1rem;
                    font-family: 'Lato', sans-serif;
                }
                .divider-amber {
                    height: 3px; width: 0;
                    background: linear-gradient(90deg,#D97706,#F59E0B);
                    border-radius: 2px; margin-top: 14px;
                    animation: drawLine 1s ease 0.4s forwards;
                }
                .amber-btn {
                    width: 100%;
                    background: linear-gradient(135deg,#D97706,#B45309);
                    color: #fff; border: none; border-radius: 12px;
                    padding: 14px 24px; font-size: 1rem; font-weight: 700;
                    cursor: pointer; letter-spacing: 0.04em;
                    box-shadow: 0 6px 22px rgba(217,119,6,0.35);
                    font-family: 'Lato', sans-serif;
                    transition: transform 0.25s, box-shadow 0.25s;
                    display: flex; align-items: center; justify-content: center; gap: 10px;
                }
                .amber-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 12px 32px rgba(217,119,6,0.5);
                }
                .amber-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                ::-webkit-scrollbar { width: 5px; }
                ::-webkit-scrollbar-track { background: #F8FAFC; }
                ::-webkit-scrollbar-thumb { background: #D97706; border-radius: 3px; }
            `}</style>

            <NavBarpage />

            {/* Floating notes */}
            {[
                { note: '♩', top: '14%', left: '3%',  delay: '0s',   size: '2rem' },
                { note: '♫', top: '22%', right: '4%', delay: '1.3s', size: '1.8rem' },
                { note: '♬', bottom: '25%', left: '6%', delay: '2.5s', size: '1.6rem' },
                { note: '♪', top: '60%', right: '8%', delay: '0.7s', size: '1.6rem' },
            ].map((n, i) => (
                <span key={i} style={{
                    position: 'fixed', userSelect: 'none', pointerEvents: 'none',
                    fontSize: n.size, color: '#D97706', opacity: 0.12,
                    top: n.top, bottom: n.bottom, left: n.left, right: n.right,
                    animation: `floatNote 7s ease-in-out ${n.delay} infinite`,
                    zIndex: 0,
                }}>{n.note}</span>
            ))}

            {/* Decorative circles */}
            <div style={{
                position: 'fixed', top: '-100px', right: '-100px',
                width: 400, height: 400, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(217,119,6,0.08) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />
            <div style={{
                position: 'fixed', bottom: '-80px', left: '-80px',
                width: 320, height: 320, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(217,119,6,0.06) 0%, transparent 70%)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            {/* ── HERO SECTION ── */}
            <section style={{
                paddingTop: 70, minHeight: '42vh',
                background: 'linear-gradient(135deg,#FFF8EE 0%,#FEF3C7 50%,#FFFBF5 100%)',
                position: 'relative', overflow: 'hidden',
                display: 'flex', alignItems: 'center',
            }}>
                {/* Decorative blobs */}
                <div style={{ position:'absolute', top:'-60px', right:'-60px', width:340, height:340, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,0.12) 0%,transparent 70%)', pointerEvents:'none' }} />
                <div style={{ position:'absolute', bottom:'-40px', left:'-40px', width:260, height:260, borderRadius:'50%', background:'radial-gradient(circle,rgba(217,119,6,0.08) 0%,transparent 70%)', pointerEvents:'none' }} />
                {/* Dot pattern */}
                <div style={{ position:'absolute', inset:0, opacity:0.35, pointerEvents:'none', backgroundImage:'radial-gradient(circle,rgba(217,119,6,0.18) 1px,transparent 1px)', backgroundSize:'32px 32px' }} />
                {/* Musical staff lines */}
                {[0,1,2,3,4].map(i => (
                    <div key={i} style={{ position:'absolute', left:0, right:0, top:`${20+i*14}%`, height:1, background:'rgba(217,119,6,0.06)', pointerEvents:'none' }} />
                ))}

                <div style={{ maxWidth:1280, margin:'0 auto', padding:'5rem 2rem 4rem', width:'100%', position:'relative', zIndex:2, textAlign:'center', animation:'fadeUp 0.8s ease both' }}>
                    <div className="section-tag" style={{ margin:'0 auto 1rem' }}>🎵 Reach Out</div>
                    <h1 style={{
                        fontFamily:"'Cormorant Garamond', Georgia, serif",
                        fontSize:'clamp(2.6rem,5vw,4rem)', fontWeight:700,
                        color:'#1E293B', lineHeight:1.1, letterSpacing:'-0.02em', marginBottom:'1rem',
                    }}>
                        Let's Create{' '}
                        <span style={{
                            background:'linear-gradient(90deg,#D97706,#F59E0B,#D97706)',
                            backgroundSize:'200% auto',
                            WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
                            animation:'shimmer 3s linear infinite',
                        }}>Music Together</span>
                    </h1>
                    <div className="divider-amber" style={{ margin:'0 auto 1.5rem' }} />
                    <p style={{ color:'#475569', fontSize:'1.1rem', lineHeight:1.8, maxWidth:540, margin:'0 auto 2rem' }}>
                        Have a question, want to enroll, or just want to say hello? We'd love to hear from you. Reach out and we'll respond within 24 hours.
                    </p>
                    {/* Quick contact pills */}
                    <div style={{ display:'flex', gap:12, justifyContent:'center', flexWrap:'wrap' }}>
                        {[
                            { icon:'📧', label:'raadhyammusicals@gmail.com', href:'mailto:raadhyammusicals@gmail.com' },
                            { icon:'💬', label:'WhatsApp Us', href:'https://wa.me/918410337618' },
                        ].map((c,i) => (
                            <a key={i} href={c.href} target="_blank" rel="noreferrer" style={{
                                display:'flex', alignItems:'center', gap:8,
                                background:'#fff', border:'1.5px solid rgba(217,119,6,0.3)',
                                borderRadius:24, padding:'8px 20px',
                                color:'#1E293B', fontSize:'0.85rem', fontWeight:700,
                                textDecoration:'none', fontFamily:"'Lato',sans-serif",
                                boxShadow:'0 2px 12px rgba(217,119,6,0.1)',
                                transition:'transform 0.2s, box-shadow 0.2s',
                            }}
                                onMouseEnter={e=>{ e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(217,119,6,0.2)'; }}
                                onMouseLeave={e=>{ e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='0 2px 12px rgba(217,119,6,0.1)'; }}
                            >{c.icon} {c.label}</a>
                        ))}
                    </div>
                </div>
            </section>

            <main style={{ position: 'relative', zIndex: 1, maxWidth: 1280, margin: '0 auto', padding: '4rem 2rem 60px' }}>

                {/* Two column grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                    gap: '2.5rem',
                    alignItems: 'start',
                }}>

                    {/* Left — Contact Info */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{
                            background: '#fff',
                            border: '1.5px solid #E2E8F0',
                            borderRadius: 24,
                            padding: '2rem',
                            boxShadow: '0 4px 20px rgba(30,41,59,0.06)',
                        }}>
                            {/* Top accent line */}
                            <div style={{
                                height: 3, borderRadius: '24px 24px 0 0',
                                background: 'linear-gradient(90deg,#D97706,#F59E0B)',
                                margin: '-2rem -2rem 1.5rem',
                            }} />

                            <h2 style={{
                                fontFamily: "'Cormorant Garamond', serif",
                                fontSize: '1.7rem', fontWeight: 700,
                                color: '#1E293B', marginBottom: '0.75rem',
                                display: 'flex', alignItems: 'center', gap: 10,
                            }}>
                                <span style={{ fontSize: '1.4rem' }}>💬</span> Let's Talk Music
                            </h2>
                            <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                                Whether you're looking for music lessons, instrument rentals, or want to collaborate — we're here to help you on your musical journey.
                            </p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                {contactMethods.map((method, i) => (
                                    <a key={i} href={method.link} target="_blank" rel="noopener noreferrer" className="contact-method-card">
                                        <div style={{
                                            width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                                            background: 'rgba(217,119,6,0.1)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.3rem',
                                        }}>{method.icon}</div>
                                        <div style={{ minWidth: 0 }}>
                                            <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.95rem', fontFamily: "'Cormorant Garamond', serif" }}>
                                                {method.title}
                                            </div>
                                            <div style={{ color: '#94A3B8', fontSize: '0.78rem', marginBottom: 2 }}>{method.description}</div>
                                            <div style={{ color: '#D97706', fontWeight: 600, fontSize: '0.85rem', wordBreak: 'break-word' }}>{method.value}</div>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Stats */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                            {stats.map((s, i) => (
                                <div key={i} className="stat-card">
                                    <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                                    <div style={{
                                        fontSize: '1.6rem', fontWeight: 800, color: '#D97706',
                                        fontFamily: "'Cormorant Garamond', serif", lineHeight: 1,
                                    }}>{s.value}</div>
                                    <div style={{ color: '#64748B', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 4, fontWeight: 600 }}>
                                        {s.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Form */}
                    <div style={{
                        background: '#fff',
                        border: '1.5px solid #E2E8F0',
                        borderRadius: 24,
                        padding: '2rem',
                        boxShadow: '0 4px 20px rgba(30,41,59,0.06)',
                    }}>
                        {/* Top accent line */}
                        <div style={{
                            height: 3, borderRadius: '24px 24px 0 0',
                            background: 'linear-gradient(90deg,#D97706,#F59E0B)',
                            margin: '-2rem -2rem 1.5rem',
                        }} />

                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: '1.7rem', fontWeight: 700,
                            color: '#1E293B', marginBottom: '0.5rem',
                            display: 'flex', alignItems: 'center', gap: 10,
                        }}>
                            <span style={{ fontSize: '1.4rem' }}>📝</span> Send us a Message
                        </h2>
                        <p style={{ color: '#64748B', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                            Fill out the form below and we'll get back to you via WhatsApp within 24 hours.
                        </p>

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6, letterSpacing: '0.04em' }}>
                                        👤 Full Name *
                                    </label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} required
                                        className="contact-input" placeholder="Enter your full name" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6, letterSpacing: '0.04em' }}>
                                        ✉️ Email Address *
                                    </label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} required
                                        className="contact-input" placeholder="Enter your email" />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6, letterSpacing: '0.04em' }}>
                                        📱 Phone Number
                                    </label>
                                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
                                        className="contact-input" placeholder="Your phone number" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6, letterSpacing: '0.04em' }}>
                                        🎯 Subject *
                                    </label>
                                    <select name="subject" value={formData.subject} onChange={handleChange} required
                                        className="contact-input" style={{ cursor: 'pointer' }}>
                                        <option value="">Select Enquiry Type</option>
                                        <option value="music-lessons">Music Lessons</option>
                                        <option value="instrument-rental">Instrument Rental</option>
                                        <option value="product-purchase">Product Purchase</option>
                                        <option value="event-booking">Event / Performance Booking</option>
                                        <option value="collaboration">Collaboration</option>
                                        <option value="custom-course">Custom Course Request</option>
                                        <option value="trial-class">Free Trial / Demo Class</option>
                                        <option value="pricing">Pricing & Packages</option>
                                        <option value="support">General Support</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: 6, letterSpacing: '0.04em' }}>
                                    💭 Your Message *
                                </label>
                                <textarea name="message" value={formData.message} onChange={handleChange} required rows="5"
                                    className="contact-input" style={{ resize: 'none' }}
                                    placeholder="Tell us about your musical needs, questions, or how we can help you..." />
                            </div>

                            <button type="submit" disabled={isLoading} className="amber-btn">
                                {isLoading ? (
                                    <>
                                        <div style={{
                                            width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)',
                                            borderTopColor: '#fff', borderRadius: '50%',
                                            animation: 'spin 0.7s linear infinite',
                                        }} />
                                        Sending to WhatsApp...
                                    </>
                                ) : (
                                    <>💬 Send via WhatsApp 🎵</>
                                )}
                            </button>

                            <p style={{ color: '#94A3B8', fontSize: '0.78rem', textAlign: 'center', lineHeight: 1.6 }}>
                                By submitting this form, you'll be redirected to WhatsApp to send your message directly to our team.
                            </p>
                        </form>
                    </div>
                </div>
            </main>

            <FooterPage />
        </div>
    );
};

export default ContactPage;