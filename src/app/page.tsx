"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Menu,
  Github,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Briefcase,
  User,
  Star,
  Sparkles,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Lightbulb,
  CheckCircle2
} from "lucide-react";

interface Project {
  title: string;
  description: string;
  technologies: string[];
  company: string;
  outcome: string;
  featured: boolean;
  challenge: string;
  approach: string;
  results: string[];
  learnings: string;
  period: string;
  role: string;
}

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  const sectionRefs = useMemo(() => ({
    hero: heroRef,
    about: aboutRef,
    projects: projectsRef,
    experience: experienceRef,
    skills: skillsRef,
    contact: contactRef
  }), []);

  // Smart search functionality
  const handleSearch = (query: string) => {
    setSearchQuery(query);
    const lowercaseQuery = query.toLowerCase();

    if (lowercaseQuery.includes("project") || lowercaseQuery.includes("work") || lowercaseQuery.includes("build")) {
      scrollToSection("projects");
    } else if (lowercaseQuery.includes("experience") || lowercaseQuery.includes("job") || lowercaseQuery.includes("career")) {
      scrollToSection("experience");
    } else if (lowercaseQuery.includes("skill") || lowercaseQuery.includes("tech") || lowercaseQuery.includes("language")) {
      scrollToSection("skills");
    } else if (lowercaseQuery.includes("about") || lowercaseQuery.includes("bio") || lowercaseQuery.includes("background")) {
      scrollToSection("about");
    } else if (lowercaseQuery.includes("contact") || lowercaseQuery.includes("hire") || lowercaseQuery.includes("reach")) {
      scrollToSection("contact");
    }
  };

  // Toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const scrollToSection = (section: keyof typeof sectionRefs) => {
    sectionRefs[section].current?.scrollIntoView({ behavior: "smooth" });
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const sectionId = entry.target.getAttribute('data-section');
          if (sectionId) {
            setActiveSection(sectionId);
          }
        }
      });
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    Object.entries(sectionRefs).forEach(([key, ref]) => {
      if (ref.current) {
        ref.current.setAttribute('data-section', key);
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, [sectionRefs]);

  const navigationItems = [
    { id: "about", label: "About", icon: User },
    { id: "projects", label: "Projects", icon: Code },
    { id: "experience", label: "Experience", icon: Briefcase },
    { id: "skills", label: "Skills", icon: Star },
    { id: "contact", label: "Contact", icon: Mail }
  ];

  const projects: Project[] = [
    {
      title: "Hypergrowth Messaging Platform",
      description: "Scaled daily email volume from 514k to 4.1M/day and delivered 1.85B emails via multi-tenant sending platform. Built SMS platform delivering 1.3M-8M texts/day with centralized governance and AI-enabled CRM automation (886k ticket events automated).",
      technologies: ["Python", "FastAPI", "PostgreSQL", "Docker", "EC2", "Multi-tenant Architecture", "AI/ML", "SMS Gateway"],
      company: "The Flyover",
      outcome: "Scaled org from 8 to 54 while maintaining delivery consistency",
      featured: true,
      period: "Jun 2024 - Present",
      role: "VP of Engineering",
      challenge: "The company was experiencing explosive growth but the existing messaging infrastructure couldn't scale. Daily email volumes needed to grow 8x while maintaining deliverability rates. The SMS platform was non-existent, and CRM ticket management was entirely manual.",
      approach: "Built a multi-tenant sending platform with intelligent routing, reputation management, and automated warmup protocols. Designed the SMS platform from scratch with carrier-grade reliability and centralized governance. Implemented AI-driven CRM automation using event-driven architecture to handle ticket classification, routing, and resolution.",
      results: [
        "Scaled daily email volume from 514k to 4.1M/day (8x increase)",
        "Delivered 1.85 billion emails with consistent deliverability",
        "Built SMS platform delivering 1.3M-8M texts/day",
        "Automated 886k ticket events through AI-enabled CRM",
        "Grew engineering org from 8 to 54 people",
        "Maintained delivery consistency despite hypergrowth"
      ],
      learnings: "Hypergrowth requires building systems that can scale independently. The key insight was treating each channel (email, SMS, CRM) as a separate bounded context with clear contracts, allowing teams to move fast without breaking each other's work."
    },
    {
      title: "Strangler-Fig Cloud Modernization",
      description: "Replaced legacy CRM/bare-metal environment with cloud-based internal platform using microservices and event-driven architecture. Used DDD bounded contexts and Kafka for domain decoupling.",
      technologies: ["Java", "Kafka", "AWS", "Microservices", "CI/CD", "Terraform", "Docker", "Event-Driven Architecture"],
      company: "StickerGiant",
      outcome: "Deployment cadence: 24/yr to 1,300/yr. Reduced costs by $400k+/year",
      featured: true,
      period: "Feb 2020 - Jan 2024",
      role: "Director of Software Engineering",
      challenge: "StickerGiant was running on a 15-year-old CRM system with bare-metal infrastructure. Deployments were risky, infrequent (24/year), and required weekend downtime. The system was a monolith with no clear boundaries, making changes slow and error-prone. Operating costs were high and scalability was limited.",
      approach: "Applied the Strangler Fig pattern to incrementally replace the legacy system. Used Domain-Driven Design to identify bounded contexts and extract them as microservices. Implemented Kafka for event-driven communication between domains. Built a modern CI/CD pipeline with automated testing, canary deployments, and feature flags. Migrated infrastructure to AWS with Terraform-managed IaC.",
      results: [
        "Increased deployment cadence from 24/year to 1,300/year (54x improvement)",
        "Reduced infrastructure costs by $400k+/year",
        "Eliminated weekend deployment windows entirely",
        "Achieved zero-downtime deployments",
        "Reduced mean time to recovery from hours to minutes",
        "Enabled the $100M+ acquisition by demonstrating technical excellence"
      ],
      learnings: "The Strangler Fig pattern works best when you're disciplined about routing. We built 'seams' in the legacy system first, then routed traffic through the new services. The hardest part wasn't the technology—it was getting buy-in to invest in the migration while still delivering features."
    },
    {
      title: "Just-in-Sequence Manufacturing Platform",
      description: "Designed JiS + HiL platform that turned manufacturing into real-time sourcing events with automation and live metrics. Integrated supply chain, shipping, payments, and manufacturing workflows.",
      technologies: ["Event-Driven Architecture", "HiL Automation", "Real-time Metrics", "Domain Integration", "Test Discipline"],
      company: "StickerGiant",
      outcome: "Lead time improved from 96.1 hours to 26.9 hours",
      featured: true,
      period: "Feb 2020 - Jan 2024",
      role: "Director of Software Engineering",
      challenge: "Manufacturing lead times were nearly 4 days (96.1 hours), making StickerGiant uncompetitive. The manufacturing floor operated in batches with no real-time visibility. Supply chain, shipping, and payments were disconnected systems requiring manual coordination. Quality control was reactive rather than proactive.",
      approach: "Designed a Just-in-Sequence (JiS) system that treated each manufacturing step as a real-time event. Implemented Hardware-in-the-Loop (HiL) automation to connect physical equipment to the software platform. Built unified dashboards showing live metrics across all manufacturing cells. Integrated supply chain triggers to automatically reorder materials based on consumption patterns.",
      results: [
        "Reduced lead time from 96.1 hours to 26.9 hours (72% improvement)",
        "Made StickerGiant the fastest manufacturer in the industry",
        "Achieved real-time visibility across all manufacturing operations",
        "Automated supply chain reordering based on consumption",
        "Reduced quality defects through proactive monitoring",
        "Integrated payments and shipping into unified workflow"
      ],
      learnings: "Manufacturing is a domain where software can create massive competitive advantage. The key was treating physical processes as first-class events in the system. When you can see everything in real-time, you can optimize everything in real-time."
    },
    {
      title: "0-to-1 SRE Platform",
      description: "Created SRE platform and incident operating model with monitoring, logging, alerting, and operational dashboards tied to service ownership. Improved incident response with clearer on-call expectations and runbooks.",
      technologies: ["Observability", "Monitoring", "Alerting", "Incident Response", "CI/CD", "Release Controls", "Runbooks"],
      company: "StickerGiant",
      outcome: "MTTR improved from 53 minutes to 1 minute 11 seconds",
      featured: false,
      period: "Feb 2020 - Jan 2024",
      role: "Director of Software Engineering",
      challenge: "There was no formal SRE practice. Incidents were discovered by customers, not monitoring. Mean time to recovery was 53 minutes because there were no runbooks, unclear ownership, and no observability. On-call was informal and stressful.",
      approach: "Built an SRE platform from scratch: centralized logging, metrics collection, distributed tracing, and alerting. Created service ownership model where each team owned their services end-to-end. Developed runbooks for common failure modes. Established incident response protocols with clear escalation paths. Implemented release controls including feature flags and canary deployments.",
      results: [
        "Reduced MTTR from 53 minutes to 1 minute 11 seconds (98% improvement)",
        "Achieved proactive incident detection before customer impact",
        "Created comprehensive runbooks for all critical services",
        "Established clear on-call rotations and escalation paths",
        "Implemented feature flags for safe deployments",
        "Built operational dashboards for real-time system health"
      ],
      learnings: "SRE is about creating a culture of ownership, not just tools. The runbooks were actually more valuable than the monitoring because they encoded institutional knowledge. When anyone can respond to an incident effectively, the whole system becomes more resilient."
    },
    {
      title: "Product Operating System",
      description: "Rebuilt decision-making processes: collapsed communication complexity from 117 channels to 9. Built roadmap practices grounded in pirate analytics (AARRR) and created Be-the-Customer onboarding playbook.",
      technologies: ["Team Topologies", "Pirate Analytics", "AARRR", "User Research", "Cross-functional Leadership"],
      company: "StickerGiant",
      outcome: "50%+ reduction in feature development time",
      featured: false,
      period: "Feb 2020 - Jan 2024",
      role: "Director of Software Engineering",
      challenge: "The organization had 117 Slack channels with no clear communication patterns. Product decisions were made ad-hoc without data. Feature development was slow because requirements were unclear and changed frequently. Teams didn't understand customers deeply enough.",
      approach: "Applied Team Topologies principles to restructure communication. Collapsed 117 channels to 9 with clear purposes. Implemented pirate analytics (AARRR: Acquisition, Activation, Retention, Referral, Revenue) to ground roadmap decisions in data. Created 'Be-the-Customer' onboarding where every new hire spent time doing customer support and watching user sessions.",
      results: [
        "Reduced communication channels from 117 to 9",
        "Cut feature development time by 50%+",
        "Grounded all roadmap decisions in AARRR metrics",
        "Every team member completed Be-the-Customer onboarding",
        "Improved feature success rate through better requirements",
        "Created shared language for product decisions"
      ],
      learnings: "Most product problems are actually communication problems. When you reduce the number of channels, you force clarity. When you ground decisions in metrics, you reduce politics. When everyone understands customers, you build better products."
    },
    {
      title: "ML Analytics Platform & OODA Loops",
      description: "Built ML-driven analytics tied to inventory and customer behavior. Implemented OODA loops to reduce client feedback cycles by 4x-10x with instrumented proofs of concept.",
      technologies: ["Python", "Machine Learning", "Analytics", "OODA Framework", "Data Pipelines", "Campaign Optimization"],
      company: "Allie Bolton",
      outcome: "Reduced feedback loop cycle time by 4x-10x",
      featured: false,
      period: "Feb 2017 - Jun 2023",
      role: "Co-Founder / Technical Product Manager",
      challenge: "Clients were running social media campaigns with no way to measure effectiveness. Feedback cycles were weeks or months. Inventory decisions were based on gut feel. There was no connection between social engagement and actual business outcomes.",
      approach: "Built an ML analytics platform that connected social media engagement to inventory movement and customer behavior. Implemented OODA (Observe, Orient, Decide, Act) loops with instrumented proofs of concept. Each campaign had built-in measurement from day one, allowing rapid iteration.",
      results: [
        "Reduced feedback loop cycle time by 4x-10x",
        "Connected social engagement to inventory and revenue",
        "Helped client win SXSW Pitch Slam",
        "Enabled 10x client growth through data-driven campaigns",
        "Scaled from SMB to Fortune 50 clients",
        "Built repeatable campaign optimization playbook"
      ],
      learnings: "The OODA loop is about speed of learning, not speed of action. When you instrument everything from the start, you can learn faster than competitors. The ML wasn't magic—it was just making the feedback loops visible and fast."
    },
    {
      title: "PCI Tier 1 Deployment Platform",
      description: "Led deployments and operational delivery for computer-vision SaaS product in regulated enterprise environments. Built automation and IaC mindset for customer environments at scale.",
      technologies: ["PCI Compliance", "Networking", "IaC", "Ansible", "Enterprise SaaS", "Computer Vision", "B2B Deployments"],
      company: "Envysion",
      outcome: "700+ PCI Tier 1 secured networking deployments",
      featured: false,
      period: "Aug 2014 - May 2017",
      role: "Senior Deployment Manager",
      challenge: "Deploying a computer vision SaaS product into PCI Tier 1 environments (major retailers, banks) required navigating complex security requirements. Each deployment was manual and took weeks. There was no standardization across customer environments.",
      approach: "Built a deployment platform using Ansible for configuration management. Created standardized deployment templates that met PCI requirements. Developed a security checklist and validation process. Trained deployment team on IaC principles and created runbooks for common scenarios.",
      results: [
        "Completed 700+ PCI Tier 1 secured networking deployments",
        "Reduced deployment time from weeks to days",
        "Standardized security configuration across all customers",
        "Generated $5M+ in new ARR through faster deployments",
        "Built IaC culture in the deployment team",
        "Created reusable templates for enterprise environments"
      ],
      learnings: "Enterprise deployments are won or lost on repeatability. When you can deploy the same way every time, you reduce risk and increase speed. The IaC mindset transformed our team from firefighters to architects."
    },
    {
      title: "Investigative Analytics System",
      description: "Led SQL-driven analysis across POS and operational data to isolate patterns and anomalies. Used CCTV-based validation and PowerPivot models to scale improvements across large retail footprints.",
      technologies: ["SQL", "Data Analysis", "PowerPivot", "Excel", "CCTV Analytics", "POS Data", "Investigative Methods"],
      company: "Target Corporation",
      outcome: "$22M cost savings and $40M revenue impact",
      featured: false,
      period: "Aug 2010 - Aug 2014",
      role: "Executive Team Leader",
      challenge: "Target stores were experiencing shrinkage and operational inefficiencies at scale. With 400+ stores, there was no way to manually investigate every anomaly. Traditional loss prevention was reactive and labor-intensive.",
      approach: "Built SQL-driven analytics to identify patterns across POS and operational data. Created PowerPivot models to scale analysis across the entire store footprint. Used CCTV to validate findings and build investigation playbooks. Trained store teams on data-driven investigation methods.",
      results: [
        "Generated $22M in cost savings",
        "Delivered $40M in revenue impact",
        "Scaled analytics across 400 stores",
        "Built repeatable investigation playbook",
        "Reduced time to identify anomalies by 90%",
        "Trained dozens of team members on data-driven methods"
      ],
      learnings: "Retail analytics taught me that data is only valuable if it leads to action. The PowerPivot models were simple, but they worked because they were connected to clear next steps. The CCTV validation created trust in the data."
    }
  ];

  const experiences = [
    { title: "VP of Engineering", company: "The Flyover (Pop Acta)", period: "Jun 2024 - Present", description: "Leading the scale of a real-time data platform from 10M → 50M+ daily events with FastAPI, PostgreSQL, and Metabase for ad optimization." },
    { title: "Director of Software Engineering", company: "StickerGiant", period: "Feb 2020 - Jan 2024", description: "Led cloud transformation and industrial laser adoption, making StickerGiant the fastest manufacturer in its industry and driving a $100M+ acquisition." },
    { title: "Co-Founder / Technical Product Manager", company: "Allie Bolton", period: "Feb 2017 - Jun 2023", description: "Scaled SMB to Fortune 50 clients with ML-powered social analytics, helping a client win SXSW Pitch Slam and grow 10×." },
    { title: "Senior Deployment Manager", company: "Envysion", period: "Aug 2014 - May 2017", description: "Directed development and deployment of a computer vision ML platform using motion video for operational analysis, generating $5M+ in new ARR." },
    { title: "Executive Team Leader", company: "Target Corp.", period: "Aug 2010 - Aug 2014", description: "Built SQL-driven retail analytics systems that delivered $40M in revenue growth and $22M in cost savings across 400 stores." }
  ];

  const skills = {
    "Frontend": ["React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS", "CSS", "HTML", "SASS"],
    "Backend": ["Node.js", "Python", "Flask", "FastAPI", "Kafka", "GraphQL", "REST APIs", "Linux"],
    "Data & Analytics": ["PostgreSQL", "MongoDB", "Redis", "MySQL", "BigQuery", "Elasticsearch", "Tableau"],
    "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "LaunchDarkly"],
    "Management & Leadership": ["Team Topologies", "Stream-Aligned Teams", "Platform Teams", "Enabling Teams", "Cognitive Load Management", "Org Design"],
    "Tools & Methods": ["Git", "Jest", "Cypress", "Figma", "Jira", "Agile/Scrum", "OKRs"]
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${darkMode ? 'dark' : ''}`}>
      {/* Project Detail Modal */}
      <Dialog open={!!selectedProject} onOpenChange={(open: boolean) => !open && setSelectedProject(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedProject && (
            <>
              <DialogHeader>
                <Badge className="mb-2 w-fit bg-gradient-to-r from-blue-500 to-purple-600 text-white">{selectedProject.company}</Badge>
                <DialogTitle className="text-2xl font-bold">{selectedProject.title}</DialogTitle>
                <DialogDescription className="text-base mt-2">
                  <span className="font-medium">{selectedProject.role}</span> • {selectedProject.period}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-4">
                {/* Challenge */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-red-500 to-orange-500 rounded-lg flex items-center justify-center">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">The Challenge</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-10">{selectedProject.challenge}</p>
                </div>

                {/* Approach */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                      <Lightbulb className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">My Approach</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-10">{selectedProject.approach}</p>
                </div>

                {/* Results */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Results</h3>
                  </div>
                  <ul className="space-y-2 pl-10">
                    {selectedProject.results.map((result, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="text-slate-600 dark:text-slate-400">{result}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Learnings */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <Star className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-lg">Key Learnings</h3>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed pl-10 italic">{selectedProject.learnings}</p>
                </div>

                {/* Technologies */}
                <div className="pt-4 border-t">
                  <h4 className="font-semibold text-sm text-slate-500 mb-3">Technologies & Methods</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedProject.technologies.map((tech) => (
                      <Badge key={tech} variant="secondary">{tech}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Portfolio
              </span>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => scrollToSection(item.id as keyof typeof sectionRefs)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200 ${
                      activeSection === item.id
                        ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={toggleDarkMode} className="w-9 h-9 rounded-lg">
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                <span className="sr-only">Toggle dark mode</span>
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="md:hidden">
                    <Menu className="w-4 h-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Navigation</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6 space-y-4">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={() => scrollToSection(item.id as keyof typeof sectionRefs)}
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Icon className="w-5 h-5" />
                          <span>{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Avatar className="w-32 h-32 mx-auto border-4 border-white shadow-xl">
                <AvatarImage src="/api/placeholder/128/128" alt="Profile" />
                <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">TN</AvatarFallback>
              </Avatar>
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">Troy Namath<span className="text-2xl sm:text-3xl font-medium text-slate-500 dark:text-slate-400">, PMP, PMI-ACP</span></h1>
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">Engineering & Product Leader driving high-velocity platforms, culture-first teams, and products that transform industries</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button onClick={() => scrollToSection("projects")} size="lg" className="rounded-xl">View Projects</Button>
              <Button onClick={() => scrollToSection("contact")} variant="outline" size="lg" className="rounded-xl">Get in Touch</Button>
            </div>

            <div className="flex justify-center space-x-6 pt-8">
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors"><Github className="w-6 h-6" /></a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors"><Linkedin className="w-6 h-6" /></a>
              <a href="#" className="text-slate-600 hover:text-blue-600 transition-colors"><Mail className="w-6 h-6" /></a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <div>
                <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">About Me</h2>
                <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
              </div>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">I'm Troy Namath, a product and engineering leader with 17+ years of technical experience and 11+ years in management. I build high-trust teams, scale systems for millions of users, and deliver products that drive revenue, acquisition, and industry-first innovation.</p>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">From leading a $100M+ acquisition at StickerGiant to scaling real-time platforms processing 50M+ daily events, I combine deep technical expertise with strategic leadership to transform industries and build exceptional teams.</p>
              <div className="flex flex-wrap gap-2">{["Product Leader", "Engineering Manager", "Team Builder", "Innovation Driver"].map((trait) => (<Badge key={trait} variant="secondary" className="px-3 py-1">{trait}</Badge>))}</div>
            </div>
            <div className="space-y-4">
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-indigo-50 to-cyan-50 dark:from-indigo-950/20 dark:to-cyan-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">Engineering Leadership</span><span className="text-indigo-600">92%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-indigo-500 to-cyan-500 h-2 rounded-full" style={{width: '92%'}}></div></div></div></Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-950/20 dark:to-emerald-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">Recruiting</span><span className="text-teal-600">84%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-teal-500 to-emerald-500 h-2 rounded-full" style={{width: '84%'}}></div></div></div></Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/20 dark:to-amber-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">0-1 Product Management</span><span className="text-orange-600">96%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-orange-500 to-amber-500 h-2 rounded-full" style={{width: '96%'}}></div></div></div></Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">DevOps</span><span className="text-purple-600">82%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full" style={{width: '82%'}}></div></div></div></Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">Backend</span><span className="text-green-600">88%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full" style={{width: '88%'}}></div></div></div></Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">UX</span><span className="text-rose-600">91%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full" style={{width: '91%'}}></div></div></div></Card>
              <Card className="p-6 border-0 shadow-lg bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-950/20 dark:to-teal-950/20"><div className="space-y-3"><div className="flex justify-between"><span className="font-semibold">Frontend</span><span className="text-blue-600">77%</span></div><div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2"><div className="bg-gradient-to-r from-blue-500 to-teal-500 h-2 rounded-full" style={{width: '77%'}}></div></div></div></Card>
            </div>
          </div>
        </div>
      </section>

      {/* How I Work Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">How I Work</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-2xl mx-auto">My approach is grounded in proven frameworks and practices that drive sustainable delivery and team growth.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">The DevOps Handbook</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I treat delivery as a product surface: CI/CD, test discipline, observability, and safe release controls are how the business gets faster without breaking trust.</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Team Topologies</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I design team boundaries and interactions intentionally: stream-aligned teams where possible, enabling functions when needed, and platform capabilities that reduce cognitive load.</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Code className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Domain-Driven Design</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I use ubiquitous language and bounded contexts to make boundaries real, so systems and organizations can scale without constant coordination tax.</p>
                </div>
              </div>
            </Card>

            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 p-6">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Refactoring & Strangler Fig</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I modernize legacy systems incrementally: carve off capabilities, route new value through the new path, and retire old components safely while the company keeps shipping.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Portfolio Projects</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-3xl mx-auto">Platform-as-a-product, delivery systems, org scaling, DDD, DevOps, and high-trust leadership. Click any project to see the full story.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card
                key={index}
                className={`group hover:shadow-2xl transition-all duration-300 border-0 overflow-hidden flex flex-col cursor-pointer ${project.featured ? 'lg:col-span-1' : ''}`}
                onClick={() => setSelectedProject(project)}
              >
                <div className="h-32 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20 transition-all duration-300"></div>
                  <div className="relative z-10 text-center px-4">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">{project.company}</span>
                  </div>
                  {project.featured && (
                    <Badge className="absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs">Featured</Badge>
                  )}
                </div>
                <CardHeader className="flex-grow">
                  <CardTitle className="text-lg leading-tight group-hover:text-blue-600 transition-colors">{project.title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed line-clamp-3">{project.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg">
                    <p className="text-xs font-medium text-emerald-700 dark:text-emerald-400">Outcome</p>
                    <p className="text-sm text-emerald-900 dark:text-emerald-300">{project.outcome}</p>
                  </div>
                  <div className="flex flex-wrap gap-1.5">{project.technologies.slice(0, 4).map((tech) => (<Badge key={tech} variant="outline" className="text-xs">{tech}</Badge>))}{project.technologies.length > 4 && <Badge variant="outline" className="text-xs">+{project.technologies.length - 4}</Badge>}</div>
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:underline">Click to see full details →</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section ref={experienceRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Experience</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-xl">{exp.title}</CardTitle>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{exp.company}</p>
                    </div>
                    <Badge variant="outline" className="self-start sm:self-center">{exp.period}</Badge>
                  </div>
                  <CardDescription className="text-base leading-relaxed">{exp.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Skills & Technologies</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList]) => (
              <Card key={category} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                    <span>{category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">{(skillList as string[]).map((skill) => (<Badge key={skill} variant="secondary" className="text-sm">{skill}</Badge>))}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Let's Work Together</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-6">Ready to bring your ideas to life? I'd love to hear from you!</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Mail className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <a href="mailto:info@troynamath.com" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">info@troynamath.com</a>
                </div>
              </div>
            </Card>
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Linkedin className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">LinkedIn</h3>
                  <a href="https://linkedin.com/in/troynamath" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">linkedin.com/in/troynamath</a>
                </div>
              </div>
            </Card>
            <Card className="border-0 shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <ExternalLink className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Website</h3>
                  <a href="https://troynamath.com" target="_blank" rel="noopener noreferrer" className="text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">troynamath.com</a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800"><div className="max-w-6xl mx-auto text-center"><div className="flex items-center justify-center space-x-2 mb-4"><div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"><Sparkles className="w-4 h-4 text-white" /></div><span className="font-bold text-xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Portfolio</span></div><p className="text-slate-600 dark:text-slate-400">© 2025 Troy Namath. All rights reserved.</p></div></footer>
    </div>
  );
}
