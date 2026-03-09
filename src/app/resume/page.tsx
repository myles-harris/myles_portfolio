"use client";
import { useState, useEffect } from 'react';
import NavLogo from '@/components/NavLogo';

interface ResumeData {
  name: string;
  contact: {
    phone: string;
    email: string;
    linkedin: string;
    website: string;
  };
  experience: Array<{
    title: string;
    company: string;
    note?: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
    highlights: string[];
  }>;
  projects: Array<{
    name: string;
    technologies: string[];
    highlights: string[];
  }>;
  technical_skills: {
    languages: string[];
    frameworks: string[];
    developer_tools: string[];
    llm_assisted_development: string[];
    libraries: string[];
  };
  involvement: Array<{
    organization: string;
    role: string;
    chapter?: string;
    start_date: string;
    end_date: string | null;
    current: boolean;
  }>;
  education: Array<{
    institution: string;
    location: string;
    degree: string;
    field: string;
  }>;
}

export default function Resume() {
  const [isStyledView, setIsStyledView] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);

  // Set styled view as default after initial render
  useEffect(() => {
    setIsStyledView(true);
  }, []);

  // Fetch resume data
  useEffect(() => {
    fetch('/mylesHarris_Resume_v8.json')
      .then(res => res.json())
      .then(data => setResumeData(data))
      .catch(err => console.error('Error loading resume data:', err));
  }, []);

  // Helper function to format dates
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  const formatDateRange = (startDate: string, endDate: string | null, current: boolean) => {
    const start = formatDate(startDate);
    const end = current ? 'Present' : endDate ? formatDate(endDate) : '';
    return `${start} - ${end}`;
  };

  if (!resumeData) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavLogo />
      <main className="w-full text-[#3a2c1a] font-serif">
        {/* Resume Section */}
        <section className="pt-32 h-screen overflow-hidden">
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
          <div className="relative h-screen overflow-hidden flex flex-col" style={{ height: '100vh' }}>
            {isStyledView ? (
              <div key="styled-view" className="h-full flex flex-col">
                {/* Timeline Container */}
                <div className="relative pt-4" style={{ height: 'fit-content' }}>
                  {/* Timeline Navigation Hint */}
                  <div className="absolute right-8 top-4 flex items-center gap-4 text-[#3a2c1a] z-20">
                    <span className="text-base font-semibold tracking-wider">Scroll Right for History</span>
                    <svg className="w-6 h-6 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>

                  {/* Main Timeline Scroll Area */}
                  <div className="h-full overflow-x-auto overflow-y-hidden custom-scrollbar" onWheel={(e) => {
                    e.preventDefault();
                    const container = e.currentTarget;
                    container.scrollLeft += e.deltaY;
                  }}>
                    <div className="inline-flex gap-8 pl-16 pr-8 pt-4 pb-2 items-start" style={{ minWidth: "max-content" }}>
                      {/* Experience Section */}
                      <div className="relative flex gap-8 items-start">
                        {/* Section Label */}
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 z-10">
                          <h2 className="text-[2.75rem] font-semibold tracking-[0.2em] text-white whitespace-nowrap opacity-90 origin-center -rotate-90 -translate-x-44">
                            EXPERIENCE
                          </h2>
                        </div>

                        {/* Experience Cards */}
                        {resumeData.experience.map((exp, idx) => (
                          <div key={idx} className={`relative flex flex-col bg-white rounded-xl p-8 w-96 h-[28rem] shadow-lg overflow-hidden ${idx === 0 ? 'ml-16' : ''}`}>
                            <div className={`absolute top-4 left-8 ${exp.current ? 'bg-[#f6bf10]' : 'bg-[#e2c48d]'} text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium`}>
                              {formatDateRange(exp.start_date, exp.end_date, exp.current)}
                            </div>
                            <div className="flex-shrink-0 mt-12">
                              <h3 className="text-2xl font-semibold text-[#3a2c1a]">{exp.company}</h3>
                              <p className="text-lg text-[#3a2c1a]/80 mb-3">
                                {exp.title}
                                {exp.note && <span className="text-sm"> | {exp.note}</span>}
                              </p>
                            </div>
                            <div className="flex-1 overflow-y-auto space-y-2 text-[#3a2c1a] pr-2">
                              {exp.highlights.map((highlight, hidx) => (
                                <p key={hidx}>• {highlight}</p>
                              ))}
                            </div>
                          </div>
                        ))}

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

                          {/* Project Cards */}
                          {resumeData.projects.map((project, idx) => (
                            <div key={idx} className={`relative flex flex-col bg-white rounded-xl p-8 w-96 h-[28rem] shadow-lg overflow-hidden ${idx === 0 ? 'ml-8' : ''}`}>
                              <div className="absolute top-4 left-8 bg-[#e2c48d] text-[#3a2c1a] px-4 py-1 rounded-full text-sm font-medium">
                                Project
                              </div>
                              <div className="flex-shrink-0 mt-12">
                                <h3 className="text-2xl font-semibold text-[#3a2c1a] mb-3">{project.name}</h3>
                              </div>
                              <div className="flex-1 overflow-y-auto pr-2">
                                <div className="space-y-2 text-[#3a2c1a] mb-4">
                                  {project.highlights.map((highlight, hidx) => (
                                    <p key={hidx}>• {highlight}</p>
                                  ))}
                                </div>
                                <div className="flex flex-wrap gap-2">
                                  {project.technologies.map((tech) => (
                                    <span key={tech} className="bg-[#e2c48d] px-3 py-1 rounded-full text-sm text-[#3a2c1a]">
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sticky Sections Container */}
                <div className="flex-1 px-8 pt-1 pb-1">
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
                  <div className="bg-[#3a2c1a]/5 backdrop-blur-sm rounded-xl p-1">
                    <div className="grid grid-cols-3 gap-6 h-full">
                      {/* Technical Skills Section */}
                      <div className="px-4 adaptive-text-container col-span-2">
                        <h2 className="text-xl font-semibold adaptive-text mb-4">Technical Skills</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-base font-semibold adaptive-text mb-2">Languages</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {resumeData.technical_skills.languages.map((skill) => (
                                  <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-base font-semibold adaptive-text mb-2">Frameworks</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {resumeData.technical_skills.frameworks.map((skill) => (
                                  <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-base font-semibold adaptive-text mb-2">Developer Tools</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {resumeData.technical_skills.developer_tools.map((skill) => (
                                  <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <h3 className="text-base font-semibold adaptive-text mb-2">LLM-Assisted Development</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {resumeData.technical_skills.llm_assisted_development.map((skill) => (
                                  <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <h3 className="text-base font-semibold adaptive-text mb-2">Libraries</h3>
                              <div className="flex flex-wrap gap-1.5">
                                {resumeData.technical_skills.libraries.map((skill) => (
                                  <span key={skill} className="adaptive-tag px-2 py-0.5 rounded-full text-sm">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right Column - Education and Professional Involvement */}
                      <div className="px-4 adaptive-text-container">
                        {/* Education Section */}
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold adaptive-text mb-4">Education</h2>
                          <div className="grid grid-cols-2 gap-4">
                            {resumeData.education.map((edu, idx) => (
                              <div key={idx}>
                                <h3 className="text-base font-semibold adaptive-text">{edu.degree}</h3>
                                <p className="text-sm adaptive-text">{edu.field}</p>
                                <p className="text-sm adaptive-text opacity-80">{edu.institution}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Professional Involvement Section */}
                        <div>
                          <h2 className="text-xl font-semibold adaptive-text mb-4">Professional Involvement</h2>
                          <div className="space-y-2">
                            {resumeData.involvement.map((inv, idx) => (
                              <div key={idx}>
                                <div className="flex justify-between items-baseline">
                                  <h3 className="text-base font-semibold adaptive-text">{inv.organization}</h3>
                                  <span className="text-xs adaptive-text opacity-80">
                                    {inv.start_date} - {inv.current ? 'Present' : inv.end_date}
                                  </span>
                                </div>
                                <p className="text-sm adaptive-text opacity-80">
                                  {inv.chapter || inv.role}
                                </p>
                              </div>
                            ))}
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
                    href="/mylesHarris_Resume_v8.pdf"
                    download
                    className="flex items-center gap-2 px-4 py-2 bg-[#e2c48d] text-[#3a2c1a] rounded-lg hover:bg-[#f6bf10] transition-colors duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    Download Resume
                  </a>
                </div>
                <div className="w-[900px] h-[calc(100vh-12rem)] overflow-auto mx-auto p-4">
                  <object
                    data="/mylesHarris_Resume_v8.pdf#zoom=100"
                    type="application/pdf"
                    className="w-full h-full min-h-[1100px]"
                  >
                    <div className="p-4 text-center">
                      <p>It appears your browser doesn&apos;t support embedded PDFs.</p>
                      <a
                        href="/mylesHarris_Resume_v8.pdf"
                        className="text-[#a67c52] underline"
                        download
                      >
                        Download the PDF instead
                      </a>
                    </div>
                  </object>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
} 