"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import NavLogo from '@/components/NavLogo';

interface VisibilityState {
  header: boolean;
  experience: boolean;
  skills: boolean;
  education: boolean;
  projects: boolean;
  involvement: boolean;
}

export default function Projects() {
  const [isStyledView, setIsStyledView] = useState(false);
  const [isVisible, setIsVisible] = useState<VisibilityState>({
    header: false,
    experience: false,
    skills: false,
    education: false,
    projects: false,
    involvement: false
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id as keyof VisibilityState]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isStyledView]);

  const StyledResume = () => (
    <div className="w-full space-y-24 py-12">
      {/* Floating Header */}
      <header 
        id="header"
        data-animate
        className={`text-center space-y-6 transition-all duration-1000 transform
          ${isVisible['header'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="relative inline-block">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#e2c48d] to-[#f6bf10] blur opacity-30"></div>
          <h1 className="relative text-7xl font-[var(--font-cinzel)] italic" 
              style={{ color: '#f6bf10' }}>
            Myles C. Harris
          </h1>
        </div>
        <p className="text-3xl text-[#3a2c1a] opacity-80 font-light tracking-wide">
          Software Engineer
        </p>
        <p className="text-xl opacity-70 font-light tracking-wider">
          Atlanta born, Los Angeles based
        </p>
        <p className="text-lg opacity-60 font-light">
          mylescharris18@gmail.com • (678) 951-7549
        </p>
      </header>

      {/* Experience Section */}
      <section 
        id="experience"
        data-animate
        className={`space-y-12 transition-all duration-1000 delay-300 transform
          ${isVisible['experience'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Experience</h2>
        <div className="space-y-16">
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-2xl font-semibold tracking-wide">Dell Technologies</h3>
                  <p className="text-lg opacity-80">Software Engineer II</p>
                </div>
                <span className="text-[#a67c52] tracking-wider">Oct 2022 - Present</span>
              </div>
              <ul className="text-lg opacity-80 leading-relaxed font-light pl-4 space-y-3 border-l border-[#e2c48d]">
                <li>Designed and shipped a real‑time incident‑correlation microservice (Java, Python, Kafka) that ingests 2 B+ events/day and cut mean‑time‑to‑resolve by up to 900% across Fortune 100 customers.</li>
                <li>Spearheaded an in-house performance-monitoring platform that trimmed developer&aposs manual test cycles 75% and enabled data-backed product strategy.</li>
                <li>Built, refactored, and tested high throughput REST APIs across several enterprise microservices. Increased test coverage to &gt;90%.</li>
              </ul>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative space-y-4">
              <div className="flex justify-between items-baseline">
                <div>
                  <h3 className="text-2xl font-semibold tracking-wide">Northrop Grumman Corp.</h3>
                  <p className="text-lg opacity-80">Embedded Software Engineer</p>
                </div>
                <span className="text-[#a67c52] tracking-wider">July 2019 - Oct 2022</span>
              </div>
              <ul className="text-lg opacity-80 leading-relaxed font-light pl-4 space-y-3 border-l border-[#e2c48d]">
                <li>Led / Evaluated software and firmware development for a team of 6 - 12 engineers. Consistently met DO-178C standards while implementing sensor / radar libraries.</li>
                <li>Led Scrum-of-Scrums for 8 cross-functional teams (~80 engineers), using backlog analytics to clear blockers and sustain velocity.</li>
                <li>Developed JavaFX UI and C++ back‑end for satellite defense application, reducing operator planning time 35%.</li>
                <li>Engineered flight‑qualified electro‑mechanical assemblies using FEA & 3D modeling.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section 
        id="projects"
        data-animate
        className={`space-y-12 transition-all duration-1000 delay-400 transform
          ${isVisible['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Projects</h2>
        <div className="space-y-12">
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative space-y-4">
              <h3 className="text-2xl font-semibold tracking-wide">ML Stock Screener</h3>
              <p className="text-lg opacity-80 leading-relaxed font-light pl-4 border-l border-[#e2c48d]">
                Trained Gradient‑Boosting & LSTM models achieving ~0.92 F1 on 10 yrs of S&P 500 data; utilized alongside K-Means Clustering algorithm; deployed in Jupyter Notebooks, serving 1 k+ weekly queries.
              </p>
            </div>
          </div>

          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative space-y-4">
              <h3 className="text-2xl font-semibold tracking-wide">Electric Prosthetic Arm</h3>
              <p className="text-lg opacity-80 leading-relaxed font-light pl-4 border-l border-[#e2c48d]">
                Led interdisciplinary team to deliver EMG‑controlled prosthetic prototype 98% cheaper than commercial devices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section - Floating Cards */}
      <section 
        id="skills"
        data-animate
        className={`transition-all duration-1000 delay-500 transform
          ${isVisible['skills'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Skills</h2>
        <div className="space-y-8">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {["Java", "C / C++", "Python", "HTML / CSS"].map((skill) => (
              <div 
                key={skill}
                className="group relative transform hover:scale-105 transition-all duration-500"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#e2c48d] to-[#f6bf10] rounded-2xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl text-center hover:shadow-xl transition-all duration-500">
                  <p className="font-light text-lg tracking-wide">{skill}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {["Node.js", "React", "Express.js", "Scikit-Learn", "TensorFlow", "NumPy / Pandas"].map((skill) => (
              <div 
                key={skill}
                className="group relative transform hover:scale-105 transition-all duration-500"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#e2c48d] to-[#f6bf10] rounded-2xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl text-center hover:shadow-xl transition-all duration-500">
                  <p className="font-light text-lg tracking-wide">{skill}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {["PostgreSQL", "AWS", "Jenkins / Maven", "Atlassian suite", "Git", "GitHub"].map((skill) => (
              <div 
                key={skill}
                className="group relative transform hover:scale-105 transition-all duration-500"
              >
                <div className="absolute -inset-2 bg-gradient-to-r from-[#e2c48d] to-[#f6bf10] rounded-2xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-500"></div>
                <div className="relative p-6 bg-white bg-opacity-80 backdrop-blur-sm rounded-xl text-center hover:shadow-xl transition-all duration-500">
                  <p className="font-light text-lg tracking-wide">{skill}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Involvement Section */}
      <section 
        id="involvement"
        data-animate
        className={`space-y-8 transition-all duration-1000 delay-600 transform
          ${isVisible['involvement'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Involvement</h2>
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-50"></div>
            <div className="relative p-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold tracking-wide">National Society of Black Engineers</h3>
                <span className="text-[#a67c52] tracking-wider">2023 - Present</span>
              </div>
              <p className="text-lg opacity-80 font-light">Atlanta Professionals Chapter</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-50"></div>
            <div className="relative p-8 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-semibold tracking-wide">NGC African American Task Group</h3>
                <span className="text-[#a67c52] tracking-wider">2019 - 2022</span>
              </div>
              <p className="text-lg opacity-80 font-light">Communications Lead / Vice-Chair</p>
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section 
        id="education"
        data-animate
        className={`space-y-8 transition-all duration-1000 delay-700 transform
          ${isVisible['education'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <h2 className="text-4xl font-light text-center mb-16 tracking-wide">Education</h2>
        <div className="space-y-8">
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-50"></div>
            <div className="relative p-8 text-center space-y-4">
              <h3 className="text-2xl font-semibold tracking-wide">Master of Science</h3>
              <p className="text-xl opacity-80 font-light">Software Engineering</p>
              <p className="text-xl font-light">Mercer University</p>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-white rounded-3xl opacity-50"></div>
            <div className="relative p-8 text-center space-y-4">
              <h3 className="text-2xl font-semibold tracking-wide">Bachelor of Science</h3>
              <p className="text-xl opacity-80 font-light">Mechanical Engineering</p>
              <p className="text-xl font-light">Mercer University</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );

  return (
    <>
      <NavLogo />
      <main className="max-w-4xl mx-auto py-16 px-4 text-[#3a2c1a] font-serif">
        {/* Resume Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-tight">Resume</h2>
            
            {/* Toggle Switch */}
            <div className="flex items-center gap-3">
              <span className="text-sm opacity-80">Simple</span>
              <button
                onClick={() => setIsStyledView(!isStyledView)}
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300"
                style={{ backgroundColor: isStyledView ? '#e2c48d' : '#d1d5db' }}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-300 ${
                    isStyledView ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-sm opacity-80">Styled</span>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {/* Download button */}
            <div className="flex items-center gap-4 p-6 border border-[#e2c48d] rounded-lg hover:border-[#a67c52] transition-colors">
              <Image
                src="/file.svg"
                alt="Resume file icon"
                width={32}
                height={32}
                className="opacity-80"
              />
              <div className="flex-1">
                <h3 className="text-xl mb-2">Myles Harris - Resume</h3>
                <p className="text-lg opacity-80 mb-4">Software Engineer</p>
              </div>
              <a
                href="/mylesHarris_Resume_v3.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-[#e2c48d] text-[#3a2c1a] rounded hover:bg-[#a67c52] transition-colors"
              >
                Download PDF
              </a>
            </div>
            
            {/* Resume Display */}
            {isStyledView ? (
              <StyledResume />
            ) : (
              <div className="w-full h-[1200px] border border-[#e2c48d] rounded-lg overflow-hidden">
                <iframe
                  src={`/mylesHarris_Resume_v3.pdf#view=FitH`}
                  className="w-full h-full"
                  frameBorder="0"
                >
                  <p>It appears your browser doesn&apos;t support embedded PDFs. You can <a href="/mylesHarris_Resume_v3.pdf" className="text-[#a67c52] underline">download the PDF</a> instead.</p>
                </iframe>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
} 

export const metadata = {
  title: "Myles Harris | Portfolio",
  description: "Myles Harris | Portfolio",
};