"use client";
import { useEffect } from "react";
import TopBar from "@/components/TopBar";
import HeroSection from "@/components/sections/HeroSection";
import AboutSection from "@/components/sections/AboutSection";
import ResumeSection, { SkillsGrid } from "@/components/sections/ResumeSection";
import ProjectsSection from "@/components/sections/ProjectsSection";
import InvolvementSection from "@/components/sections/InvolvementSection";
import PhotographySection from "@/components/sections/PhotographySection";
import RunningSection from "@/components/sections/RunningSection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  // Reveal-on-scroll: adds .in to .reveal elements when they enter the viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add("in");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="bg-stage" aria-hidden="true" />
      <TopBar />
      <main>
        <HeroSection />
        <AboutSection />
        <ResumeSection />
        <ProjectsSection />
        <SkillsGrid />
        <InvolvementSection />
        <PhotographySection />
        <RunningSection />
        <ContactSection />
      </main>
    </>
  );
}
