"use client";
import { useState, useEffect } from 'react';
import NavLogo from '@/components/NavLogo';

export default function Resume() {
  const [isStyledView, setIsStyledView] = useState(false);

  // Set styled view as default after initial render
  useEffect(() => {
    setIsStyledView(true);
  }, []);

  return (
    <>
      <NavLogo />
      <main className="w-full text-[#3a2c1a] font-serif">
        {/* Resume Section */}
        <section className="pt-32">
          {/* Toggle Switch */}
          <div className="fixed left-1/2 -translate-x-1/2 top-8 z-10">
            <button
              onClick={() => {
                console.log('Toggle clicked, switching to:', !isStyledView);
                setIsStyledView(!isStyledView);
              }}
              className="relative inline-flex h-8 w-40 items-center rounded-full transition-colors duration-300"
              style={{ backgroundColor: isStyledView ? '#e2c48d' : '#d1d5db' }}
            >
              {/* Background text layer */}
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className={`text-sm font-medium transition-opacity duration-300 ${
                  !isStyledView ? 'opacity-0' : 'opacity-70'
                }`}>
                  Simple
                </span>
                <span className={`text-sm font-medium transition-opacity duration-300 ${
                  isStyledView ? 'opacity-0' : 'opacity-70'
                }`}>
                  Styled
                </span>
              </div>
              {/* Sliding element with active text */}
              <div
                className={`flex items-center justify-center h-6 w-20 transform rounded-full bg-white shadow-md transition-transform duration-300 ${
                  isStyledView ? 'translate-x-[4.75rem]' : 'translate-x-1'
                }`}
              >
                <span className="text-sm font-medium text-[#3a2c1a]">
                  {isStyledView ? 'Styled' : 'Simple'}
                </span>
              </div>
            </button>
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
                              {["EMG", "Arduino", "3D Printing", "Team LEADERSHIP"].map((tech) => (
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
                    <p>It appears your browser doesn&apos;t support embedded PDFs.</p>
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
    </>
  );
} 