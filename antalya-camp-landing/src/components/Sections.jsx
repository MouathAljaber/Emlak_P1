import Icon, { Logo } from './Icon.jsx';
import { LINKS } from '../content.js';

function SectionHead({ label, title, text, center }) {
  return (
    <div className={`head${center ? ' center' : ''}`}>
      <span className="label">{label}</span>
      <h2>{title}</h2>
      {text && <p>{text}</p>}
    </div>
  );
}

export function Header({ t, lang, setLang }) {
  const links = [['about', t.nav.about], ['why', t.nav.why], ['services', t.nav.services], ['process', t.nav.process], ['emlak', t.nav.emlak], ['faq', t.nav.faq]];
  return (
    <header className="top">
      <div className="wrap">
        <a className="brand" href="#top" aria-label="Antalya Camp">
          <Logo />
          <span>Antalya<b>Camp</b></span>
        </a>
        <nav className="menu" aria-label="Navigation">
          {links.map(([id, label]) => <a key={id} href={`#${id}`}>{label}</a>)}
        </nav>
        <div className="lang" role="group" aria-label={t.nav.language}>
          {['de', 'en'].map((code) => (
            <button key={code} type="button" lang={code} aria-pressed={lang === code} onClick={() => setLang(code)}>
              {code.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
}

export function Hero({ t, lang }) {
  const [before, highlight, after] = t.hero.title;
  return (
    <section className="hero" id="top">
      {/* TODO: replace the stock photo with a licensed photo from an Antalya training camp. */}
      <img src="https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=2000&q=75" alt="" fetchpriority="high" />
      <div className="wrap">
        <a className="badge" href="#emlak"><Icon name="shield" size={18} />{t.hero.badge}</a>
        <h1>{before}<em>{highlight}</em>{after}</h1>
        <p className="lead">{t.hero.lead}</p>
        <div className="ctas">
          <a className="btn btn-accent" href="#why">{t.hero.primary} <Icon name="arrow" size={18} /></a>
          <a className="btn btn-outline" href={LINKS.website[lang]} target="_blank" rel="noopener">{t.hero.secondary}</a>
        </div>
        <div className="facts">
          {t.hero.facts.map((fact) => (
            <div className="fact" key={fact.label}><strong>{fact.value}</strong><span>{fact.label}</span></div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function About({ t }) {
  return (
    <section className="block" id="about">
      <div className="wrap split">
        <div>
          <SectionHead label={t.about.label} title={t.about.title} text={t.about.text} />
        </div>
        <div>
          <h3 className="sub">{t.about.teamsTitle}</h3>
          <ul className="teams">
            {t.about.teams.map((team) => (
              <li key={team.name}><strong>{team.name}</strong><span>{team.text}</span></li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export function WhyUs({ t }) {
  return (
    <section className="block tint" id="why">
      <div className="wrap">
        <SectionHead label={t.why.label} title={t.why.title} text={t.why.text} center />
        <div className="grid g3">
          {t.why.items.map((item, index) => (
            <article className={`card why${index === 0 ? ' featured' : ''}`} key={item.title}>
              <span className="icon"><Icon name={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Services({ t }) {
  return (
    <section className="block" id="services">
      <div className="wrap">
        <SectionHead label={t.services.label} title={t.services.title} text={t.services.text} />
        <div className="grid g4">
          {t.services.items.map((item) => (
            <article className="card" key={item.title}>
              <span className="icon"><Icon name={item.icon} /></span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Process({ t }) {
  return (
    <section className="block tint" id="process">
      <div className="wrap">
        <SectionHead label={t.process.label} title={t.process.title} />
        <ol className="grid g3 steps">
          {t.process.steps.map((step, index) => (
            <li className="card" key={step.title}>
              <span className="num">{index + 1}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </li>
          ))}
        </ol>
        <h3 className="sub week-title">{t.process.weekTitle}</h3>
        <ol className="week">
          {t.process.week.map((day) => (
            <li className={`day${day.highlight ? ' match' : ''}`} key={day.day}>
              <small>{day.day}</small>
              <h4>{day.title}</h4>
              <p>{day.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Emlak({ t }) {
  return (
    <section className="block" id="emlak">
      <div className="wrap">
        <div className="emlak-box">
          <div className="emlak-logo">
            <img src={LINKS.emlakLogo} alt="Emlak AG" width="200" height="46" loading="lazy" />
          </div>
          <div>
            <span className="label">{t.emlak.label}</span>
            <h2>{t.emlak.title}</h2>
            <p>{t.emlak.text}</p>
            <ul className="checks">
              {t.emlak.points.map((point) => <li key={point}><Icon name="check" size={20} />{point}</li>)}
            </ul>
            <a className="btn btn-primary" href={LINKS.emlak} target="_blank" rel="noopener noreferrer">{t.emlak.link} <Icon name="external" size={17} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Faq({ t }) {
  return (
    <section className="block tint" id="faq">
      <div className="wrap narrow">
        <SectionHead label={t.faq.label} title={t.faq.title} center />
        <div className="faq">
          {t.faq.items.map((item, index) => (
            <details key={item.q} open={index === 0}>
              <summary>{item.q}</summary>
              <p>{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing({ t, lang }) {
  return (
    <section className="closing">
      <div className="wrap">
        <div className="box">
          <h2>{t.closing.title}</h2>
          <p>{t.closing.text}</p>
          <div className="ctas center">
            <a className="btn btn-accent" href={LINKS.website[lang]} target="_blank" rel="noopener">{t.closing.website} <Icon name="arrow" size={18} /></a>
            <a className="btn btn-outline" href={LINKS.contact[lang]} target="_blank" rel="noopener">{t.closing.contact}</a>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Footer({ t, lang }) {
  return (
    <footer>
      <div className="wrap">
        <span>© {new Date().getFullYear()} Antalya Camp · {t.footer.rights}</span>
        <nav aria-label="Footer">
          <a href={LINKS.website[lang]} target="_blank" rel="noopener">{t.footer.website}</a>
          <a href={LINKS.imprint[lang]} target="_blank" rel="noopener">{t.footer.imprint}</a>
          <a href={LINKS.privacy[lang]} target="_blank" rel="noopener">{t.footer.privacy}</a>
        </nav>
      </div>
    </footer>
  );
}
