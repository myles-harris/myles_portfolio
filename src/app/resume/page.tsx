"use client";
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface VisibilityState {
  header: boolean;
  experience: boolean;
  skills: boolean;
  education: boolean;
  projects: boolean;
  involvement: boolean;
}

export default function Resume() {
  const [isStyledView, setIsStyledView] = useState(false);
  const [isVisible, setIsVisible] = useState<VisibilityState>({
    header: true,
    experience: true,
    skills: true,
    education: true,
    projects: true,
    involvement: true
  });

  // Set styled view as default after initial render
  useEffect(() => {
    setIsStyledView(true);
  }, []);

  useEffect(() => {
    if (!isStyledView) {
      setIsVisible({
        header: true,
        experience: true,
        skills: true,
        education: true,
        projects: true,
        involvement: true
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          console.log('Intersection observed:', entry.target.id, entry.isIntersecting);
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id as keyof VisibilityState]: entry.isIntersecting
          }));
        });
      },
      { 
        threshold: [0, 0.1, 0.5, 1],
        rootMargin: '0px 0px -10% 0px'
      }
    );

    const elements = document.querySelectorAll('[data-animate]');
    console.log('Found animate elements:', elements.length);
    elements.forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, [isStyledView]);

  const StyledResume = () => {
    console.log('Rendering StyledResume component, visibility state:', isVisible);
    return (
      <div className="w-full py-12 space-y-24">
        {/* Floating Header */}
        <header 
          id="header"
          data-animate
          className={`text-center space-y-6 transition-all duration-700 ease-out transform bg-[#3a2c1a]/5 backdrop-blur-sm rounded-xl p-8
            ${isVisible['header'] ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}`}
        >
          <div className="relative inline-block">
            <div className="absolute -inset-1 bg-gradient-to-r from-[#e2c48d] to-[#f6bf10] blur opacity-30"></div>
            <h1 className="relative text-7xl font-[var(--font-cinzel)] italic text-[#f6bf10] z-10 drop-shadow-lg">
              Myles C. Harris
            </h1>
          </div>
          <p className="text-3xl text-[#3a2c1a] font-light tracking-wide drop-shadow">
            Software Engineer
          </p>
          <p className="text-xl text-[#3a2c1a] font-light tracking-wider drop-shadow">
            Atlanta born, Los Angeles based
          </p>
          <p className="text-lg text-[#3a2c1a] font-light drop-shadow">
            mylescharris18@gmail.com • (678) 951-7549
          </p>
        </header>

        {/* Experience Section */}
        <section 
          id="experience"
          data-animate
          className={`space-y-12 transition-all duration-700 ease-out transform bg-[#3a2c1a]/5 backdrop-blur-sm rounded-xl p-8
            ${isVisible['experience'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-light text-center mb-16 tracking-wide text-[#3a2c1a] drop-shadow-lg">Experience</h2>
          <div className="space-y-16">
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative space-y-4 bg-[#3a2c1a]/5 rounded-lg p-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a] drop-shadow">Dell Technologies</h3>
                    <p className="text-lg text-[#3a2c1a] font-light">Software Engineer II</p>
                  </div>
                  <span className="text-[#a67c52] tracking-wider font-medium">Sept 2023 - Present</span>
                </div>
                <ul className="text-lg text-[#3a2c1a] leading-relaxed font-light pl-4 space-y-3 border-l border-[#e2c48d]">
                  <li>Designed and shipped a real‑time incident‑correlation microservice (Java, Python, Kafka) that ingests 2 B+ events/day and cut mean‑time‑to‑resolve by up to 900% across Fortune 100 customers.</li>
                  <li>Spearheaded an in-house performance-monitoring platform that trimmed developer's manual test cycles 75% and enabled data-backed product strategy.</li>
                  <li>Built, refactored, and tested high throughput REST APIs across several enterprise microservices. Increased test coverage to &gt;90%.</li>
                </ul>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative space-y-4 bg-[#3a2c1a]/5 rounded-lg p-6">
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a] drop-shadow">Northrop Grumman Corp.</h3>
                    <p className="text-lg text-[#3a2c1a] font-light">Embedded Software Engineer</p>
                  </div>
                  <span className="text-[#a67c52] tracking-wider font-medium">July 2019 - Oct 2022</span>
                </div>
                <ul className="text-lg text-[#3a2c1a] leading-relaxed font-light pl-4 space-y-3 border-l border-[#e2c48d]">
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
          className={`space-y-12 transition-all duration-700 ease-out transform
            ${isVisible['projects'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-light text-center mb-16 tracking-wide text-[#3a2c1a]">Projects</h2>
          <div className="space-y-12">
            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative space-y-4">
                <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a]">ML Stock Screener</h3>
                <p className="text-lg text-[#3a2c1a] opacity-80 leading-relaxed font-light pl-4 border-l border-[#e2c48d]">
                  Trained Gradient‑Boosting & LSTM models achieving ~0.92 F1 on 10 yrs of S&P 500 data; utilized alongside K-Means Clustering algorithm; deployed in Jupyter Notebooks, serving 1 k+ weekly queries.
                </p>
              </div>
            </div>

            <div className="group relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative space-y-4">
                <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a]">Electric Prosthetic Arm</h3>
                <p className="text-lg text-[#3a2c1a] opacity-80 leading-relaxed font-light pl-4 border-l border-[#e2c48d]">
                  Led interdisciplinary team to deliver EMG‑controlled prosthetic prototype 98% cheaper than commercial devices.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section 
          id="skills"
          data-animate
          className={`transition-all duration-700 ease-out transform bg-[#3a2c1a]/5 backdrop-blur-sm rounded-xl p-8
            ${isVisible['skills'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-light text-center mb-16 tracking-wide text-[#3a2c1a] drop-shadow-lg">Skills</h2>
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {["Java", "C / C++", "Python", "HTML / CSS"].map((skill) => (
                <div 
                  key={skill}
                  className="group relative transform hover:scale-105 transition-all duration-500"
                >
                  <div className="absolute -inset-2 bg-gradient-to-r from-[#e2c48d] to-[#f6bf10] rounded-2xl opacity-20 blur-sm group-hover:opacity-30 transition-opacity duration-500"></div>
                  <div className="relative p-6 backdrop-blur-sm bg-[#3a2c1a]/5 rounded-xl text-center hover:shadow-xl transition-all duration-500">
                    <p className="font-light text-lg tracking-wide text-[#3a2c1a] drop-shadow">{skill}</p>
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
                  <div className="relative p-6 backdrop-blur-sm bg-[#3a2c1a]/5 rounded-xl text-center hover:shadow-xl transition-all duration-500">
                    <p className="font-light text-lg tracking-wide text-[#3a2c1a] drop-shadow">{skill}</p>
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
                  <div className="relative p-6 backdrop-blur-sm bg-[#3a2c1a]/5 rounded-xl text-center hover:shadow-xl transition-all duration-500">
                    <p className="font-light text-lg tracking-wide text-[#3a2c1a] drop-shadow">{skill}</p>
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
          className={`space-y-8 transition-all duration-700 ease-out transform
            ${isVisible['involvement'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-light text-center mb-16 tracking-wide text-[#3a2c1a]">Involvement</h2>
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-50"></div>
              <div className="relative p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a]">National Society of Black Engineers</h3>
                  <span className="text-[#a67c52] tracking-wider">2023 - Present</span>
                </div>
                <p className="text-lg text-[#3a2c1a] opacity-80 font-light">Atlanta Professionals Chapter</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-50"></div>
              <div className="relative p-8 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a]">NGC African American Task Group</h3>
                  <span className="text-[#a67c52] tracking-wider">2019 - 2022</span>
                </div>
                <p className="text-lg text-[#3a2c1a] opacity-80 font-light">Communications Lead / Vice-Chair</p>
              </div>
            </div>
          </div>
        </section>

        {/* Education Section */}
        <section 
          id="education"
          data-animate
          className={`space-y-8 transition-all duration-700 ease-out transform
            ${isVisible['education'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        >
          <h2 className="text-4xl font-light text-center mb-16 tracking-wide text-[#3a2c1a]">Education</h2>
          <div className="space-y-8">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-50"></div>
              <div className="relative p-8 text-center space-y-4">
                <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a]">Master of Science</h3>
                <p className="text-xl text-[#3a2c1a] opacity-80 font-light">Software Engineering</p>
                <p className="text-xl font-light text-[#3a2c1a]">Mercer University</p>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-[#fff8e7] to-transparent rounded-3xl opacity-50"></div>
              <div className="relative p-8 text-center space-y-4">
                <h3 className="text-2xl font-semibold tracking-wide text-[#3a2c1a]">Bachelor of Science</h3>
                <p className="text-xl text-[#3a2c1a] opacity-80 font-light">Mechanical Engineering</p>
                <p className="text-xl font-light text-[#3a2c1a]">Mercer University</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  };

  return (
    <main className="w-full text-[#3a2c1a] font-serif">
      {/* Resume Section */}
      <section className="pt-32">
        {/* Toggle Switch */}
        <div className="fixed left-32 top-8 flex flex-col items-center gap-3 z-10">
          <span className="text-sm opacity-80">Simple</span>
          <button
            onClick={() => {
              console.log('Toggle clicked, switching to:', !isStyledView);
              setIsStyledView(!isStyledView);
            }}
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

        {/* Resume Display */}
        <div className="relative min-h-[1200px] overflow-hidden">
          {isStyledView ? (
            <div key="styled-view" className="absolute inset-0">
              {/* Timeline Container */}
              <div className="relative h-[50vh] pt-12">
                {/* Timeline Navigation Hint */}
                <div className="absolute right-8 bottom-4 flex items-center gap-4 text-[#3a2c1a] z-20">
                  <span className="text-base font-semibold tracking-wider">Scroll Right for History</span>
                  <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>

                {/* Main Timeline Scroll Area */}
                <div className="h-full overflow-x-auto overflow-y-hidden">
                  <div className="inline-flex gap-8 pl-16 pr-8 pt-4 items-start" style={{ minWidth: "max-content" }}>
                    {/* Experience Section */}
                    <div className="relative flex gap-8 items-start">
                      {/* Section Label */}
                      <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                        <h2 className="text-[2.75rem] font-semibold tracking-[0.2em] text-white whitespace-nowrap opacity-90 origin-center -rotate-90 -translate-x-44">
                          EXPERIENCE
                        </h2>
                      </div>

                      {/* Dell Technologies - Software Engineer II */}
                      <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg ml-16">
                        <div className="absolute -top-4 left-8 bg-[#f6bf10] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                          Sept 2023 - Present
                        </div>
                        <h3 className="text-2xl font-semibold text-[#3a2c1a]">Dell Technologies</h3>
                        <p className="text-lg text-[#3a2c1a]/80">Software Engineer II</p>
                        <div className="space-y-3 text-[#3a2c1a] mt-3">
                          <p>• Real‑time incident‑correlation microservice (Java, Python, Kafka)</p>
                          <p>• 2B+ events/day processing with 900% MTTR improvement</p>
                          <p>• In-house performance monitoring platform with JMeter</p>
                          <p>• 75% reduction in test cycles</p>
                          <p>• High throughput REST APIs with &gt;90% test coverage</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {["Java", "Python", "Kafka", "REST APIs", "Microservices"].map((tech) => (
                            <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Dell Technologies - SQA Engineer II */}
                      <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg">
                        <div className="absolute -top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                          Nov 2022 - Sept 2023
                        </div>
                        <h3 className="text-2xl font-semibold text-[#3a2c1a]">Dell Technologies</h3>
                        <p className="text-lg text-[#3a2c1a]/80">Software Quality Assurance Engineer II</p>
                        <p className="text-sm text-[#3a2c1a]/60 italic">(Acquired from Moogsoft)</p>
                        <div className="space-y-3 text-[#3a2c1a] mt-3">
                          <p>• Designed/Implemented automated testing frameworks</p>
                          <p>• Enterprise microservices testing and quality assurance</p>
                          <p>• End-to-end test automation development</p>
                          <p>• Performance testing and monitoring</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {["Test Automation", "JMeter", "CI/CD", "Quality Assurance"].map((tech) => (
                            <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Northrop Grumman - Embedded Software Engineer */}
                      <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg">
                        <div className="absolute -top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                          Oct 2021 - Oct 2022
                        </div>
                        <h3 className="text-2xl font-semibold text-[#3a2c1a]">Northrop Grumman</h3>
                        <p className="text-lg text-[#3a2c1a]/80">Embedded Software Engineer</p>
                        <div className="space-y-3 text-[#3a2c1a] mt-3">
                          <p>• Led 6-12 engineer team for DO-178C compliance</p>
                          <p>• GPS/Inertial Navigation System development</p>
                          <p>• Scrum-of-Scrums leader for 80+ engineers</p>
                          <p>• Drove timeline forecasts and priority management</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {["DO-178C", "Embedded Systems", "Scrum", "Team Leadership"].map((tech) => (
                            <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Northrop Grumman - Software Engineer */}
                      <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg">
                        <div className="absolute -top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                          Sept 2020 - Oct 2021
                        </div>
                        <h3 className="text-2xl font-semibold text-[#3a2c1a]">Northrop Grumman</h3>
                        <p className="text-lg text-[#3a2c1a]/80">Software Engineer</p>
                        <div className="space-y-3 text-[#3a2c1a] mt-3">
                          <p>• JavaFX UI & C++ backend for defense systems</p>
                          <p>• Real-time classification decisions</p>
                          <p>• 35% reduction in planning time</p>
                          <p>• Satellite defense application development</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {["C++", "JavaFX", "UI Development", "Defense Systems"].map((tech) => (
                            <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Northrop Grumman - Associate Mechanical Engineer */}
                      <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg">
                        <div className="absolute -top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                          July 2019 - Sept 2020
                        </div>
                        <h3 className="text-2xl font-semibold text-[#3a2c1a]">Northrop Grumman</h3>
                        <p className="text-lg text-[#3a2c1a]/80">Associate Mechanical Engineer</p>
                        <div className="space-y-3 text-[#3a2c1a] mt-3">
                          <p>• Flight-qualified assemblies using FEA & 3D modeling</p>
                          <p>• 2x modernized parts library</p>
                          <p>• Met MIL-STD specifications</p>
                          <p>• Electro-mechanical systems design</p>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          {["FEA", "3D Modeling", "MIL-STD", "Mechanical Design"].map((tech) => (
                            <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Timeline Section Separator */}
                      <div className="flex flex-col items-center justify-center px-2">
                        <div className="h-full w-px bg-gradient-to-b from-transparent via-[#e2c48d] to-transparent"></div>
                      </div>

                      {/* Projects Section */}
                      <div className="flex gap-4 items-start relative">
                        {/* Projects Section Label */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                          <h2 className="text-[2.75rem] font-semibold tracking-[0.2em] text-white whitespace-nowrap opacity-90 origin-center -rotate-90 -translate-x-44">
                            PROJECTS
                          </h2>
                        </div>

                        {/* ML Stock Screener Project */}
                        <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg ml-8">
                          <div className="absolute -top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                            Project
                          </div>
                          <h3 className="text-2xl font-semibold text-[#3a2c1a]">ML Stock Screener</h3>
                          <p className="text-lg text-[#3a2c1a]/80">Personal Project</p>
                          <p className="text-sm text-[#3a2c1a]/60">2023</p>
                          <div className="space-y-3 text-[#3a2c1a] mt-3">
                            <p>• Gradient‑Boosting & LSTM models with 0.92 F1 score</p>
                            <p>• 10 years of S&P 500 data analysis</p>
                            <p>• K-Means Clustering implementation</p>
                            <p>• 1k+ weekly queries served</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {["Python", "TensorFlow", "Scikit-learn", "Jupyter", "Machine Learning"].map((tech) => (
                              <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Electric Prosthetic Arm Project */}
                        <div className="relative flex flex-col items-start gap-4 bg-white rounded-xl p-8 max-w-xl shadow-lg">
                          <div className="absolute -top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                            Project
                          </div>
                          <h3 className="text-2xl font-semibold text-[#3a2c1a]">Electric Prosthetic Arm</h3>
                          <p className="text-lg text-[#3a2c1a]/80">Mercer Engineering Expo</p>
                          <p className="text-sm text-[#3a2c1a]/60">2019</p>
                          <div className="space-y-3 text-[#3a2c1a] mt-3">
                            <p>• EMG‑controlled prosthetic prototype</p>
                            <p>• 98% cost reduction vs commercial options</p>
                            <p>• Led interdisciplinary team</p>
                            <p>• Award-winning senior design project</p>
                          </div>
                          <div className="flex flex-wrap gap-2 mt-4">
                            {["EMG", "Arduino", "3D Printing", "Team Leadership"].map((tech) => (
                              <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sticky Sections Container */}
              <div className="sticky top-0 mt-4 px-8">
                <style jsx>{`
                  .adaptive-text {
                    mix-blend-mode: difference;
                    color: #ffffff;
                  }
                  .adaptive-text-container {
                    isolation: isolate;
                  }
                  .adaptive-tag {
                    mix-blend-mode: difference;
                    color: #ffffff;
                    background: rgba(226, 196, 141, 0.8);
                  }
                `}</style>
                <div className="bg-[#3a2c1a]/5 backdrop-blur-sm rounded-xl p-6">
                  <div className="grid grid-cols-3 gap-16">
                    {/* Technical Skills Section */}
                    <div className="px-4 adaptive-text-container">
                      <h2 className="text-xl font-semibold adaptive-text mb-4">Technical Skills</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-semibold adaptive-text mb-2">Languages</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {["Java", "C / C++", "Python", "HTML / CSS"].map((skill) => (
                              <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold adaptive-text mb-2">Frameworks</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {["Node.js", "React", "Express.js", "Scikit-Learn", "TensorFlow", "NumPy / Pandas"].map((skill) => (
                              <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold adaptive-text mb-2">Tools</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {["PostgreSQL", "AWS", "Jenkins / Maven", "Atlassian", "Git", "GitHub"].map((skill) => (
                              <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Professional Involvement Section */}
                    <div className="px-4 border-x-2 border-[#e2c48d]/40 adaptive-text-container">
                      <h2 className="text-xl font-semibold adaptive-text mb-4">Professional Involvement</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-base font-semibold adaptive-text">National Society of Black Engineers</h3>
                            <span className="text-xs adaptive-text opacity-80">2023 - Present</span>
                          </div>
                          <p className="text-sm adaptive-text opacity-80">Atlanta Professionals Chapter</p>
                        </div>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-base font-semibold adaptive-text">NGC Mentoring Program</h3>
                            <span className="text-xs adaptive-text opacity-80">2021 - 2022</span>
                          </div>
                          <p className="text-sm adaptive-text opacity-80">Technical Professional Program Mentee</p>
                        </div>
                        <div>
                          <div className="flex justify-between items-baseline">
                            <h3 className="text-base font-semibold adaptive-text">NGC African American Task Group</h3>
                            <span className="text-xs adaptive-text opacity-80">2019 - 2022</span>
                          </div>
                          <p className="text-sm adaptive-text opacity-80">Communications Lead / Vice-Chair</p>
                        </div>
                      </div>
                    </div>

                    {/* Education Section */}
                    <div className="px-4 adaptive-text-container">
                      <h2 className="text-xl font-semibold adaptive-text mb-4">Education</h2>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-base font-semibold adaptive-text">Master of Science</h3>
                          <p className="text-sm adaptive-text">Software Engineering</p>
                          <p className="text-sm adaptive-text opacity-80">Mercer University</p>
                        </div>
                        <div>
                          <h3 className="text-base font-semibold adaptive-text">Bachelor of Science</h3>
                          <p className="text-sm adaptive-text">Mechanical Engineering</p>
                          <p className="text-sm adaptive-text opacity-80">Mercer University</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div key="simple-view" className="absolute inset-0">
              {/* Download Button */}
              <div className="flex justify-center mb-6">
                <a 
                  href="/mylesHarris_Resume_v3.pdf"
                  download
                  className="flex items-center gap-2 px-4 py-2 bg-[#e2c48d] text-[#3a2c1a] rounded-lg hover:bg-[#f6bf10] transition-colors duration-300"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Resume
                </a>
              </div>
              <object
                data="/mylesHarris_Resume_v3.pdf#view=FitH"
                type="application/pdf"
                className="w-[850px] h-[1200px] mx-auto"
              >
                <div className="p-4 text-center">
                  <p>It appears your browser doesn't support embedded PDFs.</p>
                  <a 
                    href="/mylesHarris_Resume_v3.pdf"
                    className="text-[#a67c52] underline"
                    download
                  >
                    Download the PDF instead
                  </a>
                </div>
              </object>
            </div>
          )}
        </div>
      </section>
    </main>
  );
} 