"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

import {
  Menu,
  Linkedin,
  Mail,
  ExternalLink,
  Code,
  Briefcase,
  User,
  Star,
  Moon,
  Sun,
  Target,
  TrendingUp,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

const IMAGES = {
  profile: "https://images.troynamath.com/Main-Page/profile-image-artsy.jpeg",
  projects: {
    flyover: "https://images.troynamath.com/Projects/hypergrowth-theflyover.jpg",
    stickergiant: "https://images.troynamath.com/Projects/jis-hil-SGdiecut.jpg",
    allieBolton: "https://images.troynamath.com/Projects/mlplatform-alliebolton.jpg",
    envysion: "https://images.troynamath.com/Projects/pcidss-envysion.jpg",
    target: "https://images.troynamath.com/Projects/investigations-target.jpg",
  }
};

// Skill bar configuration with distinct colors
const SKILL_BARS = [
  {
    name: "CI/CD & Delivery Systems",
    percentage: 96,
    gradient: "from-slate-700 via-slate-600 to-slate-500",
    bgGradient: "from-slate-50 to-slate-100 dark:from-slate-900/40 dark:to-slate-800/40",
    textColor: "text-slate-700 dark:text-slate-300"
  },
  {
    name: "Platform Architecture",
    percentage: 94,
    gradient: "from-emerald-600 via-teal-500 to-cyan-500",
    bgGradient: "from-emerald-50 to-teal-50 dark:from-emerald-900/30 dark:to-teal-900/30",
    textColor: "text-emerald-700 dark:text-emerald-300"
  },
  {
    name: "Machine Learning & Analytics",
    percentage: 88,
    gradient: "from-amber-500 via-orange-500 to-red-500",
    bgGradient: "from-amber-50 to-orange-50 dark:from-amber-900/30 dark:to-orange-900/30",
    textColor: "text-amber-700 dark:text-amber-300"
  },
  {
    name: "EBITDA & Financial Impact",
    percentage: 92,
    gradient: "from-green-600 via-emerald-500 to-teal-400",
    bgGradient: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
    textColor: "text-green-700 dark:text-green-300"
  },
  {
    name: "Org Scaling & Team Topologies",
    percentage: 95,
    gradient: "from-blue-600 via-indigo-500 to-violet-500",
    bgGradient: "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
    textColor: "text-blue-700 dark:text-blue-300"
  },
  {
    name: "Strategic Leadership",
    percentage: 93,
    gradient: "from-rose-600 via-pink-500 to-fuchsia-500",
    bgGradient: "from-rose-50 to-pink-50 dark:from-rose-900/30 dark:to-pink-900/30",
    textColor: "text-rose-700 dark:text-rose-300"
  },
];

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
  image?: string;
}

export default function Portfolio() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSection, setActiveSection] = useState("hero");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [skillBarsAnimated, setSkillBarsAnimated] = useState(false);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const experienceRef = useRef<HTMLDivElement>(null);
  const skillsRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);
  const skillBarsRef = useRef<HTMLDivElement>(null);
  const projectsCarouselRef = useRef<HTMLDivElement>(null);

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

  // Scroll-triggered animations for skill bars
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !skillBarsAnimated) {
            setSkillBarsAnimated(true);
          }
        });
      },
      { threshold: 0.3 }
    );

    if (skillBarsRef.current) {
      observer.observe(skillBarsRef.current);
    }

    return () => observer.disconnect();
  }, [skillBarsAnimated]);

  // Section reveal animations
  useEffect(() => {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.getAttribute('data-reveal');
            if (sectionId) {
              setVisibleSections(prev => new Set([...prev, sectionId]));
            }
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    document.querySelectorAll('[data-reveal]').forEach((el) => {
      revealObserver.observe(el);
    });

    return () => revealObserver.disconnect();
  }, []);

  // Projects carousel scroll handlers
  const updateCarouselState = useCallback(() => {
    if (projectsCarouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = projectsCarouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Calculate pages based on visible width
      const cardWidth = 380 + 24; // card width + gap
      const visibleCards = Math.max(1, Math.floor(clientWidth / cardWidth));
      const totalItems = 8; // number of projects
      const pages = Math.ceil(totalItems / visibleCards);
      setTotalPages(pages);

      // Calculate current page based on scroll position
      const maxScroll = scrollWidth - clientWidth;
      const scrollProgress = maxScroll > 0 ? scrollLeft / maxScroll : 0;
      const page = Math.min(Math.round(scrollProgress * (pages - 1)), pages - 1);
      setCurrentPage(page);
    }
  }, []);

  const scrollCarousel = useCallback((direction: 'left' | 'right') => {
    if (projectsCarouselRef.current) {
      const cardWidth = 380 + 24; // card width + gap
      const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;
      projectsCarouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      setTimeout(updateCarouselState, 300);
    }
  }, [updateCarouselState]);

  useEffect(() => {
    updateCarouselState();
    const carousel = projectsCarouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateCarouselState);
      window.addEventListener('resize', updateCarouselState);
      return () => {
        carousel.removeEventListener('scroll', updateCarouselState);
        window.removeEventListener('resize', updateCarouselState);
      };
    }
  }, [updateCarouselState]);

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
      image: IMAGES.projects.flyover,
      challenge: "The company was experiencing explosive growth but the existing messaging infrastructure couldn't scale. Daily email volumes needed to grow 8x while maintaining deliverability rates. The SMS platform was non-existent, and CRM ticket management was entirely manual.",
      approach: "Built a multi-tenant sending platform with intelligent routing, reputation management, and automated warmup protocols. Designed the SMS platform from scratch with carrier-grade reliability and centralized governance. Implemented AI-driven CRM automation using event-driven architecture to handle ticket classification, routing, and resolution.",
      results: [
        "Scaled daily email volume from 514k to 4.1M/day (8x increase)",
        "Delivered 1.85 billion emails with top tier deliverability and inbox placement",
        "Built SMS platform delivering 1.3M-8M texts/day",
        "Automated 886k ticket events through AI-enabled CRM",
        "Grew the company from 8 to 54 people in under a year",
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
      role: "Director of Software Engineering & Product Management",
      image: IMAGES.projects.stickergiant,
      challenge: "StickerGiant was running on a 15-year-old CRM system with bare-metal infrastructure. Deployments were risky, infrequent (24/year), and required weekend downtime. The system was a monolith with no clear boundaries, making changes slow and error-prone. Operating costs were high and scalability was limited.",
      approach: "Applied the Strangler Fig pattern to incrementally replace the legacy system. Used Domain-Driven Design to identify bounded contexts and extract them as microservices. Implemented Kafka for event-driven communication between domains. Built a modern CI/CD pipeline with automated testing, canary deployments, and feature flags. Migrated infrastructure to AWS with Terraform-managed IaC.",
      results: [
        "Increased deployment cadence from 24/year to 1,300/year (54x improvement)",
        "Reduced infrastructure & operating costs by $400k+/year",
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
      outcome: "Total Turn Time improved from 96.1 hours to 26.9 hours",
      featured: true,
      period: "Feb 2020 - Jan 2024",
      role: "Director of Software Engineering & Product Management",
      image: IMAGES.projects.stickergiant,
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
      role: "Director of Software Engineering & Product Management",
      image: IMAGES.projects.stickergiant,
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
      role: "Director of Software Engineering & Product Management",
      image: IMAGES.projects.stickergiant,
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
      period: "Feb 2017 - Feb 2020",
      role: "Co-Founder",
      image: IMAGES.projects.allieBolton,
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
      image: IMAGES.projects.envysion,
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
      outcome: "$22M cost savings and $40M newly generated revenue impact",
      featured: false,
      period: "Aug 2010 - Aug 2014",
      role: "Executive Team Leader",
      image: IMAGES.projects.target,
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
    {
      title: "VP of Engineering",
      company: "The Flyover (Pop Acta)",
      period: "Aug 2024 - Present",
      location: "Remote",
      description: "Leading the scale of a real-time data platform from 10M → 50M+ daily events with FastAPI, PostgreSQL, and Metabase for ad optimization.",
      achievements: [
        "Scaled organization from 8 to 54 employees while maintaining delivery velocity",
        "Built multi-tenant email platform delivering 4.1M emails/day (8x growth)",
        "Launched SMS platform processing 1.3M-8M texts daily",
        "Automated 886k CRM ticket events through AI-enabled workflows"
      ],
      technologies: ["Python", "FastAPI", "PostgreSQL", "AWS", "Docker", "Metabase"],
      teamSize: "54 engineers across 6 teams",
      impact: "Platform processes 50M+ daily events",
      companyProfile: {
        industry: "AdTech / Marketing",
        stage: "Series A → Hypergrowth",
        headcount: "8 → 54 employees"
      },
      techTransformation: {
        before: ["Monolithic Django", "Single-tenant", "Manual deployments", "No observability"],
        after: ["FastAPI microservices", "Multi-tenant platform", "CI/CD pipelines", "Full observability stack", "Event-driven architecture", "AI/ML automation"]
      }
    },
    {
      title: "Director of Software Engineering & Product Management",
      company: "StickerGiant",
      period: "Feb 2020 - Jan 2024",
      location: "Longmont, CO",
      description: "Led cloud transformation and industrial laser adoption, making StickerGiant the fastest manufacturer in its industry and driving a $100M+ acquisition.",
      achievements: [
        "Increased deployment cadence from 24/year to 1,300/year (54x improvement)",
        "Reduced manufacturing lead time from 96.1 to 26.9 hours (72% improvement)",
        "Cut infrastructure costs by $400k+/year through cloud migration",
        "Improved MTTR from 53 minutes to 1 minute 11 seconds"
      ],
      technologies: ["Java", "Kafka", "AWS", "Terraform", "Docker", "Kubernetes"],
      teamSize: "12 engineers, 3 product managers",
      impact: "Enabled $100M+ acquisition",
      companyProfile: {
        industry: "Manufacturing / E-commerce",
        stage: "Growth → Acquired ($100M+)",
        headcount: "80 → 120 employees"
      },
      techTransformation: {
        before: ["15-year-old CRM", "Bare-metal servers", "Manual deploys (24/yr)", "No CI/CD", "Monolithic architecture"],
        after: ["Cloud-native AWS", "Kubernetes orchestration", "1,300 deploys/year", "Event-driven microservices", "Kafka streaming", "Full IaC with Terraform"]
      }
    },
    {
      title: "Co-Founder",
      company: "Allie Bolton",
      period: "Feb 2017 - June 2020",
      location: "Denver, CO",
      description: "Scaled SMB to Fortune 50 clients with ML-powered social analytics, helping a client win SXSW Pitch Slam and grow 10×.",
      achievements: [
        "Built ML analytics platform connecting social engagement to revenue",
        "Reduced client feedback loop cycles by 4x-10x using OODA methodology",
        "Helped client win SXSW Pitch Slam competition",
        "Scaled client base from SMB to Fortune 50 enterprises"
      ],
      technologies: ["Python", "Machine Learning", "AWS", "Data Pipelines", "Analytics"],
      teamSize: "4 co-founders + contractors",
      impact: "Clients achieved 10x growth",
      companyProfile: {
        industry: "Marketing Analytics",
        stage: "Startup → Growth",
        headcount: "4 → 12 people"
      },
      techTransformation: {
        before: ["Manual spreadsheet analysis", "No automation", "Weeks-long feedback cycles"],
        after: ["ML-powered analytics platform", "Automated data pipelines", "Real-time OODA loops", "Predictive inventory models"]
      }
    },
    {
      title: "Senior Deployment Manager",
      company: "Envysion",
      period: "Aug 2014 - May 2017",
      location: "Louisville, CO",
      description: "Directed development and deployment of a computer vision ML platform using motion video for operational analysis, generating $5M+ in new ARR.",
      achievements: [
        "Completed 700+ PCI Tier 1 secured networking deployments",
        "Reduced deployment time from weeks to days through automation",
        "Built IaC culture and standardized deployment templates",
        "Generated $5M+ in new ARR through faster customer onboarding"
      ],
      technologies: ["Ansible", "Networking", "PCI Compliance", "IaC", "Computer Vision"],
      teamSize: "8 deployment engineers",
      impact: "$5M+ new ARR generated",
      companyProfile: {
        industry: "Computer Vision SaaS",
        stage: "Series B → Enterprise",
        headcount: "50 → 150 employees"
      },
      techTransformation: {
        before: ["Manual customer deployments", "Weeks per installation", "No standardization", "Firefighting culture"],
        after: ["Ansible automation", "Days per deployment", "PCI-compliant templates", "IaC mindset", "Repeatable runbooks"]
      }
    },
    {
      title: "Executive Team Leader",
      company: "Target Corp.",
      period: "Aug 2010 - Aug 2014",
      location: "Minneapolis, MN",
      description: "Built SQL-driven retail analytics systems that delivered $40M in revenue growth and $22M in cost savings across 400 stores.",
      achievements: [
        "Generated $22M in cost savings through analytics-driven insights",
        "Delivered $40M in revenue impact across retail operations",
        "Scaled analytics solutions across 400+ stores",
        "Trained dozens of team members on data-driven investigation methods"
      ],
      technologies: ["SQL", "PowerPivot", "Excel", "CCTV Analytics", "POS Data"],
      teamSize: "Cross-functional teams of 15+",
      impact: "$62M total financial impact",
      companyProfile: {
        industry: "Retail / Fortune 50",
        stage: "Enterprise",
        headcount: "350,000+ employees"
      },
      techTransformation: {
        before: ["Manual investigation", "Gut-feel decisions", "Siloed store data", "Reactive loss prevention"],
        after: ["SQL-driven analytics", "Data-driven investigation playbooks", "Cross-store pattern recognition", "Proactive anomaly detection"]
      }
    }
  ];

  const skills = {
    "Frontend": ["React", "Next.js", "TypeScript", "Vue.js", "Tailwind CSS", "CSS", "HTML", "SASS"],
    "Backend": ["Node.js", "Python", "Flask", "FastAPI", "Kafka", "GraphQL", "REST APIs", "Linux"],
    "Data & Analytics": ["PostgreSQL", "MongoDB", "Redis", "MySQL", "BigQuery", "Elasticsearch", "Tableau"],
    "Cloud & DevOps": ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD", "LaunchDarkly"],
    "Management & Leadership": ["Team Topologies", "Stream-Aligned Teams", "Platform Teams", "Enabling Teams", "Cognitive Load Management", "Org Design"],
    "Tools & Methods": ["DDD", "Git", "DevOps", "Data Mesh","Cypress", "Figma", "Jira", "Agile", "OKRs"]
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 ${darkMode ? 'dark' : ''}`}>
      {/* Skip Link for ADA Compliance */}
      <a
        href="#main-content"
        className="skip-link"
        aria-label="Skip to main content"
      >
        Skip to main content
      </a>

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
              <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 rounded-lg flex items-center justify-center">
                <span className="text-white dark:text-slate-900 font-bold text-sm">TN</span>
              </div>
              <span className="font-bold text-xl text-slate-900 dark:text-slate-100">
                Troy Namath
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
      <section ref={heroRef} id="main-content" className="pt-20 pb-16 px-4 sm:px-6 lg:px-8" role="banner">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <Avatar className="profile-photo w-32 h-32 mx-auto border-4 border-white shadow-xl hover:scale-105 transition-transform duration-300 animate-fade-in">
                <AvatarImage
                  src={IMAGES.profile}
                  alt="Troy Namath - VP of Engineering"
                  className="profile-image object-cover"
                />
                <AvatarFallback className="profile-fallback text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">TN</AvatarFallback>
              </Avatar>
              <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 dark:from-slate-100 dark:via-blue-100 dark:to-slate-100 bg-clip-text text-transparent">Troy Namath<span className="text-2xl sm:text-3xl font-medium text-slate-500 dark:text-slate-400">, PMP, PMI-ACP</span></h1>
              <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">Engineering & Product Leader driving high-velocity platforms, culture-first teams, and products that transform industries</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <Button
                onClick={() => scrollToSection("projects")}
                size="lg"
                className="rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300 group"
                aria-label="View my projects"
              >
                View Projects
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" aria-hidden="true" />
              </Button>
              <Button
                onClick={() => scrollToSection("contact")}
                variant="outline"
                size="lg"
                className="rounded-xl hover:scale-105 hover:shadow-lg transition-all duration-300"
                aria-label="Get in touch with me"
              >
                Get in Touch
              </Button>
            </div>

            <div className="social-links flex justify-center space-x-6 pt-8" role="navigation" aria-label="Social links">
              <a
                href="https://linkedin.com/in/troynamath"
                className="social-link text-slate-600 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="LinkedIn Profile"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Linkedin className="w-6 h-6" aria-hidden="true" />
              </a>
              <a
                href="mailto:troynamath@gmail.com"
                className="social-link text-slate-600 hover:text-blue-600 hover:scale-110 transition-all duration-300"
                aria-label="Send email"
              >
                <Mail className="w-6 h-6" aria-hidden="true" />
              </a>
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
            <div ref={skillBarsRef} className="space-y-4" role="region" aria-label="Core competencies">
              {SKILL_BARS.map((skill, index) => (
                <Card
                  key={skill.name}
                  className={`group p-6 border-0 shadow-lg bg-gradient-to-br ${skill.bgGradient} hover:scale-[1.02] hover:shadow-2xl transition-all duration-300 cursor-default`}
                  style={{ transitionDelay: `${index * 100}ms` }}
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className={`font-semibold ${skill.textColor}`}>
                        {skill.name}
                      </span>
                      <span
                        className={`${skill.textColor} font-bold tabular-nums transition-all duration-300 group-hover:scale-110`}
                        style={{
                          opacity: skillBarsAnimated ? 1 : 0,
                          transform: skillBarsAnimated ? 'translateX(0)' : 'translateX(10px)'
                        }}
                      >
                        {skill.percentage}%
                      </span>
                    </div>
                    <div
                      className="w-full bg-white/30 dark:bg-slate-900/30 rounded-full h-2.5 group-hover:h-4 overflow-hidden transition-all duration-300"
                      role="progressbar"
                      aria-valuenow={skill.percentage}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`${skill.name}: ${skill.percentage}%`}
                    >
                      <div
                        className={`bg-gradient-to-r ${skill.gradient} h-full rounded-full transition-all duration-1000 ease-out group-hover:shadow-lg`}
                        style={{
                          width: skillBarsAnimated ? `${skill.percentage}%` : '0%',
                          transitionDelay: `${index * 150}ms`
                        }}
                      />
                    </div>
                  </div>
                </Card>
              ))}
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

          <div className="grid md:grid-cols-2 gap-8" role="list" aria-label="Work methodologies">
            <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6" role="listitem">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Briefcase className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">The DevOps Handbook</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I treat delivery as a product surface: CI/CD, test discipline, observability, and safe release controls are how the business gets faster without breaking trust.</p>
                </div>
              </div>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6" role="listitem">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <User className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">Team Topologies</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I design team boundaries and interactions intentionally: stream-aligned teams where possible, enabling functions when needed, and platform capabilities that reduce cognitive load.</p>
                </div>
              </div>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6" role="listitem">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Code className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">Domain-Driven Design</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I use ubiquitous language and bounded contexts to make boundaries real, so systems and organizations can scale without constant coordination tax.</p>
                </div>
              </div>
            </Card>

            <Card className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6" role="listitem">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Star className="w-6 h-6 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">Refactoring & Strangler Fig</h3>
                  <p className="text-slate-600 dark:text-slate-400 mt-2">I modernize legacy systems incrementally: carve off capabilities, route new value through the new path, and retire old components safely while the company keeps shipping.</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="projects-section py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900">
        <div className="projects-container max-w-7xl mx-auto">
          <header className="projects-header text-center mb-12">
            <h2 className="projects-title text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Portfolio Projects</h2>
            <div className="title-underline w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            <p className="projects-description text-lg text-slate-600 dark:text-slate-400 mt-6 max-w-3xl mx-auto">Platform-as-a-product, delivery systems, org scaling, DDD, DevOps, and high-trust leadership. Click any project to see the full story.</p>
          </header>

          {/* Horizontal Scroll Carousel */}
          <div className="projects-carousel-wrapper relative">
            {/* Left Navigation Arrow */}
            <button
              onClick={() => scrollCarousel('left')}
              className={`carousel-arrow carousel-arrow-left absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                canScrollLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll projects left"
            >
              <ChevronLeft className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Right Navigation Arrow */}
            <button
              onClick={() => scrollCarousel('right')}
              className={`carousel-arrow carousel-arrow-right absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-xl ${
                canScrollRight ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
              aria-label="Scroll projects right"
            >
              <ChevronRight className="w-6 h-6 text-slate-700 dark:text-slate-300" />
            </button>

            {/* Fade Overlay Left */}
            <div className={`carousel-fade carousel-fade-left absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-slate-900 to-transparent z-[5] pointer-events-none transition-opacity duration-300 ${canScrollLeft ? 'opacity-100' : 'opacity-0'}`} />

            {/* Fade Overlay Right */}
            <div className={`carousel-fade carousel-fade-right absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-slate-900 to-transparent z-[5] pointer-events-none transition-opacity duration-300 ${canScrollRight ? 'opacity-100' : 'opacity-0'}`} />

            {/* Scrollable Projects Container */}
            <div
              ref={projectsCarouselRef}
              className="projects-carousel flex gap-6 overflow-x-auto pb-4 px-2 scroll-smooth scrollbar-hide"
              role="list"
              aria-label="Portfolio projects"
              onScroll={updateCarouselState}
            >
              {projects.map((project, index) => (
                <article
                  key={index}
                  className="project-card flex-shrink-0 w-[340px] sm:w-[380px]"
                >
                  <Card
                    className="project-card-inner group hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300 border-0 overflow-hidden flex flex-col cursor-pointer focus-visible:ring-2 focus-visible:ring-blue-500 h-full"
                    onClick={() => setSelectedProject(project)}
                    onKeyDown={(e) => e.key === 'Enter' && setSelectedProject(project)}
                    tabIndex={0}
                    role="listitem"
                    aria-label={`${project.title} at ${project.company}. ${project.featured ? 'Featured project.' : ''} Press Enter to view details.`}
                  >
                    <div
                      className="project-card-image h-36 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900 relative overflow-hidden flex items-center justify-center"
                      style={project.image ? { backgroundImage: `url(${project.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : undefined}
                    >
                      <div className={`project-card-overlay absolute inset-0 ${project.image ? 'bg-slate-900/60 group-hover:bg-slate-900/40' : 'bg-gradient-to-br from-blue-500/10 to-purple-600/10 group-hover:from-blue-500/20 group-hover:to-purple-600/20'} transition-all duration-300`}></div>
                      <div className="project-card-company relative z-10 text-center px-4 transform group-hover:scale-105 transition-transform duration-300">
                        <span className={`text-sm font-medium ${project.image ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`}>{project.company}</span>
                      </div>
                      {project.featured && (
                        <Badge className="featured-badge absolute top-3 right-3 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-xs shadow-lg">Featured</Badge>
                      )}
                    </div>
                    <CardHeader className="project-card-header flex-grow">
                      <CardTitle className="project-card-title text-lg leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{project.title}</CardTitle>
                      <CardDescription className="project-card-description text-sm leading-relaxed line-clamp-3">{project.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="project-card-content space-y-4">
                      <div className="project-outcome p-3 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 rounded-lg group-hover:from-emerald-100 group-hover:to-teal-100 dark:group-hover:from-emerald-900/40 dark:group-hover:to-teal-900/40 transition-colors duration-300">
                        <p className="outcome-label text-xs font-medium text-emerald-700 dark:text-emerald-400">Outcome</p>
                        <p className="outcome-value text-sm text-emerald-900 dark:text-emerald-300 font-medium">{project.outcome}</p>
                      </div>
                      <div className="project-technologies flex flex-wrap gap-1.5">
                        {project.technologies.slice(0, 4).map((tech) => (
                          <Badge key={tech} variant="outline" className="technology-tag text-xs hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">{tech}</Badge>
                        ))}
                        {project.technologies.length > 4 && (
                          <Badge variant="outline" className="technology-tag-more text-xs">+{project.technologies.length - 4}</Badge>
                        )}
                      </div>
                      <div className="project-cta flex items-center text-xs text-blue-600 dark:text-blue-400 font-medium group-hover:gap-2 transition-all duration-300">
                        <span>View full details</span>
                        <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" aria-hidden="true" />
                      </div>
                    </CardContent>
                  </Card>
                </article>
              ))}
            </div>

            {/* Carousel Page Indicators */}
            <nav className="carousel-indicators flex justify-center gap-3 mt-6" aria-label="Project page navigation">
              {Array.from({ length: totalPages }).map((_, pageIndex) => (
                <button
                  key={pageIndex}
                  onClick={() => {
                    if (projectsCarouselRef.current) {
                      const { scrollWidth, clientWidth } = projectsCarouselRef.current;
                      const maxScroll = scrollWidth - clientWidth;
                      const scrollPosition = totalPages > 1 ? (pageIndex / (totalPages - 1)) * maxScroll : 0;
                      projectsCarouselRef.current.scrollTo({ left: scrollPosition, behavior: 'smooth' });
                      setTimeout(updateCarouselState, 300);
                    }
                  }}
                  className={`carousel-page-dot w-3 h-3 rounded-full transition-all duration-300 ${
                    currentPage === pageIndex
                      ? 'bg-blue-600 dark:bg-blue-400 scale-125'
                      : 'bg-slate-300 dark:bg-slate-700 hover:bg-slate-400 dark:hover:bg-slate-600'
                  }`}
                  aria-label={`Go to page ${pageIndex + 1} of ${totalPages}`}
                  aria-current={currentPage === pageIndex ? 'true' : 'false'}
                />
              ))}
            </nav>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section ref={experienceRef} className="py-20 px-4 sm:px-6 lg:px-8" role="region" aria-label="Work experience">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Experience</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="space-y-8 relative">
            {/* Timeline line */}
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-slate-300 dark:to-slate-700 hidden md:block ml-3" aria-hidden="true"></div>

            {experiences.map((exp, index) => (
              <Card
                key={index}
                className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 md:ml-8 relative overflow-hidden"
              >
                {/* Timeline dot */}
                <div className="absolute -left-[2.1rem] top-8 w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white dark:border-slate-900 hidden md:block group-hover:scale-125 transition-transform duration-300" aria-hidden="true"></div>

                <CardHeader className="pb-4">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="space-y-1">
                      <CardTitle className="text-xl group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{exp.title}</CardTitle>
                      <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">{exp.company}</p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {exp.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                          {exp.teamSize}
                        </span>
                      </div>
                    </div>
                    <Badge variant="outline" className="self-start tabular-nums whitespace-nowrap">{exp.period}</Badge>
                  </div>
                  <CardDescription className="text-base leading-relaxed mt-3">{exp.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Key Achievements */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Key Achievements
                    </h4>
                    <ul className="grid sm:grid-cols-2 gap-2">
                      {exp.achievements.map((achievement, achIndex) => (
                        <li
                          key={achIndex}
                          className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-400"
                        >
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                          <span>{achievement}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Company Profile */}
                  {exp.companyProfile && (
                    <div className="flex flex-wrap gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-100 dark:border-slate-700/50">
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {exp.companyProfile.industry}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                        </svg>
                        {exp.companyProfile.stage}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {exp.companyProfile.headcount}
                      </span>
                    </div>
                  )}

                  {/* Tech Transformation - Before/After */}
                  {exp.techTransformation && (
                    <div className="mt-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-700/50 rounded-xl">
                      <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Engineering Transformation
                      </h4>
                      <div className="grid sm:grid-cols-2 gap-4">
                        {/* Before */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-red-600 dark:text-red-400 uppercase tracking-wide">
                            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                            Inherited
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {exp.techTransformation.before.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md border border-red-200 dark:border-red-800/50"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        {/* After */}
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                            Delivered
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {exp.techTransformation.after.map((tech) => (
                              <span
                                key={tech}
                                className="text-xs px-2 py-1 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-md border border-emerald-200 dark:border-emerald-800/50"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Impact Badge */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-3">
                    <div className="flex-shrink-0">
                      <div className="inline-flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-lg">
                        <TrendingUp className="w-4 h-4 text-blue-600 dark:text-blue-400" aria-hidden="true" />
                        <span className="text-sm font-medium text-blue-700 dark:text-blue-300">{exp.impact}</span>
                      </div>
                    </div>

                    {/* Final Technologies */}
                    <div className="flex flex-wrap gap-1.5">
                      {exp.technologies.map((tech) => (
                        <Badge
                          key={tech}
                          variant="secondary"
                          className="text-xs hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900" role="region" aria-label="Skills and technologies">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Skills & Technologies</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Object.entries(skills).map(([category, skillList], index) => (
              <Card
                key={category}
                className="group border-0 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
                style={{ transitionDelay: `${index * 50}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full group-hover:scale-150 transition-transform duration-300"></div>
                    <span className="group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">{category}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">{(skillList as string[]).map((skill) => (<Badge key={skill} variant="secondary" className="text-sm hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:scale-105 transition-all duration-200 cursor-default">{skill}</Badge>))}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 px-4 sm:px-6 lg:px-8" role="region" aria-label="Contact information">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">Let's Work Together</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full"></div>
            <p className="text-lg text-slate-600 dark:text-slate-400 mt-6">Ready to bring your ideas to life? I'd love to hear from you!</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            <Card className="group border-0 shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <a href="mailto:troynamath@gmail.com" className="flex flex-col items-center text-center space-y-3" aria-label="Email Troy Namath">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Mail className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">Email</h3>
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-sm">troynamath@gmail.com</span>
                </div>
              </a>
            </Card>
            <Card className="group border-0 shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <a href="https://linkedin.com/in/troynamath" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center space-y-3" aria-label="LinkedIn Profile">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <Linkedin className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">LinkedIn</h3>
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors text-sm">linkedin.com/in/troynamath</span>
                </div>
              </a>
            </Card>
            <Card className="group border-0 shadow-lg p-6 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
              <a href="https://troynamath.com" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center text-center space-y-3" aria-label="Personal Website">
                <div className="w-14 h-14 bg-gradient-to-br from-rose-500 to-pink-500 rounded-lg flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                  <ExternalLink className="w-7 h-7 text-white" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">Website</h3>
                  <span className="text-slate-600 dark:text-slate-400 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors text-sm">troynamath.com</span>
                </div>
              </a>
            </Card>
          </div>
        </div>
      </section>

      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-slate-800 to-slate-600 dark:from-slate-200 dark:to-slate-400 rounded-lg flex items-center justify-center">
              <span className="text-white dark:text-slate-900 font-bold text-sm">TN</span>
            </div>
            <span className="font-bold text-xl text-slate-900 dark:text-slate-100">Troy Namath</span>
          </div>
          <p className="text-slate-600 dark:text-slate-400">© 2025 Troy Namath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
