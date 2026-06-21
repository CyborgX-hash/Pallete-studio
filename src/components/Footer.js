'use client';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-branding">
          <a
            href="https://digitalheroesco.com"
            target="_blank"
            rel="noopener noreferrer"
            className="dh-button"
            id="built-for-dh-btn"
          >
            Built for Digital Heroes
          </a>
        </div>

        <div className="footer-info">
          <p className="footer-name">Saksham Sontakke</p>
          <p className="footer-email">
            <a href="mailto:sakshamsontakke713@gmail.com">
              sakshamsontakke713@gmail.com
            </a>
          </p>
        </div>

        <div className="footer-copy">
          <p>© {new Date().getFullYear()} Color Palette Generator. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
