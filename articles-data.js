// Shared articles data - single source of truth
const articlesData = [
    {
        id: 13,
        title: 'Instructions. Skills. Tools. How Google Embedded Skills Into Every Layer of Its Agent Stack',
        date: 'April 2026',
        tags: ['AI', 'ADK', 'AgentSkills', 'Gemini', 'GoogleCloudNext', 'EnterpriseAI'],
        readTime: '11 min read',
        description: 'Prompt Bloat has a name and a fix. Skills are now load-bearing across Google\'s agent stack: from on-device Gemma 4 to enterprise Gemini, from coding assistants to the official Cloud repository.',
        url: 'articles/google-agent-skills-stack/',
        image: 'img/google_agent_skills_stack.png'
    },
    {
        id: 12,
        title: 'Google Cloud\'s Agent Ops Stack: Why Deployment Is No Longer the Hard Part',
        date: 'April 2026',
        tags: ['AI', 'GoogleCloud', 'EnterpriseAI'],
        readTime: '12 min read',
        description: 'The Gemini Enterprise Agent Platform shifts the conversation from deployment to governance. We are leaving the era of the Request/Response cycle and entering the era of the Long-Lived Agentic Session.',
        url: 'articles/agent-ops-stack/',
        image: 'img/agents_first_class_citizens.png'
    },
    {
        id: 11,
        title: 'Gemma 4 and the Rise of Agentic Commerce: A Hands-On Enterprise Perspective',
        date: 'April 2026',
        tags: ['AI', 'AgenticCommerce', 'OpenModels'],
        readTime: '10 min read',
        description: 'Gemma 4 brings native function-calling, multimodal vision, and Apache 2.0 to open models. Here\'s what it means for enterprise agentic commerce systems.',
        url: 'articles/gemma4-agentic-commerce/',
        image: 'img/gemma4_agentic_commerce.png'
    },
    {
        id: 10,
        title: 'The Skills Explosion Is Here. Enterprise Governance Isn\'t.',
        date: 'March 2026',
        tags: ['AgentSkills', 'EnterpriseAI', 'Security'],
        readTime: '13 min read',
        description: 'Anthropic\'s creators say stop building agents, start building skills. They\'re right. But 170 skills in production taught us something they didn\'t cover: the hard part isn\'t building them. It\'s governing them.',
        url: 'articles/enterprise-agent-skills-governance/',
        image: 'img/enterprise_agent_skills_governance.png'
    },
    {
        id: 9,
        title: 'AdkBot: Building a Personal AI Agent with Google ADK on Cloud Run',
        date: 'March 2026',
        tags: ['AI', 'Cloud', 'Security'],
        readTime: '7 min read',
        description: 'Build a secure personal AI agent with Google ADK 1.0 on Cloud Run. 6-layer GCP security, human-in-the-loop approvals, Cloud DLP, and Workload Identity Federation.',
        url: 'articles/adkbot-personal-ai-agent-adk-cloud-run/',
        image: 'img/adkbot_personal_ai_agent.png'
    },
    {
        id: 8,
        title: 'Cost-Optimised MLOps: Reducing Infrastructure Spend by 80%',
        date: 'December 2025',
        tags: ['MLOps', 'Architecture', 'Cloud'],
        readTime: '15 min read',
        description: 'Learn 5 architectural patterns that reduced MLOps costs from $6,600/month to $1,200/month (82% reduction). Auto-shutdown, Spot VMs, zero-scaling inference, Feature Store caching, and multi-cloud WIF patterns.',
        url: 'articles/cost-optimized-mlops/',
        image: 'img/cost_optimized_mlops.png'
    },
    {
        id: 7,
        title: "Internet of Agents: AGNTCY, Protocols, and Mach Alliance's Agent Ecosystem",
        date: 'December 2025',
        tags: ['AI', 'Architecture', 'Strategy'],
        readTime: '25 min read',
        description: 'How AGNTCY, open protocols, and MACH Alliance are building interoperable AI agent systems—and why enterprise architects must act now to avoid lock-in.',
        url: 'articles/architecting-internet-of-agents/',
        image: 'img/architecting_internet_of_agents.png'
    },
    {
        id: 6,
        title: 'Implementing Zero-Trust Multi-Cloud: A Complete WIF Setup Guide',
        date: 'November 2025',
        tags: ['MLOps', 'Security', 'Cloud'],
        readTime: '10 min read',
        description: 'Step-by-step guide to implement Workload Identity Federation for AWS→Vertex AI and Azure→Vertex AI. Production-ready code, real troubleshooting, enterprise patterns.',
        url: 'articles/zero-trust-wif-implementation/',
        image: 'img/wif_implementation.png'
    },
    {
        id: 5,
        title: 'Stop Storing Cloud Secrets: How Workload Identity Federation Eliminates Static Keys',
        date: 'November 2025',
        tags: ['MLOps', 'Security', 'Cloud'],
        readTime: '8 min read',
        description: 'Static credentials cost you money, time, and security. Learn how Workload Identity Federation eliminates secrets entirely through cryptographic trust and zero-trust architecture.',
        url: 'articles/static-credentials-mlops-security/',
        image: 'img/static_credentials_security.png'
    },
    {
        id: 4,
        title: 'The Hidden Cost of Data Chaos in ML Projects',
        date: 'November 2025',
        tags: ['MLOps', 'AI'],
        readTime: '10 min read',
        description: 'Most ML projects fail not because of models, but because of data chaos. Understand the real costs, failure patterns, and how MLOps reduces failure and accelerates time to production.',
        url: 'articles/hidden-cost-of-data-chaos-ml/',
        image: 'img/the_hidden_cost_of_data_chaos.png'
    },
    {
        id: 3,
        title: 'The Creator Divide: Why Fresh Voices Are Solving Problems Experts Miss',
        date: 'November 2025',
        tags: ['AI', 'Innovation', 'Leadership'],
        readTime: '5 min read',
        description: 'AI didn\'t just make learning easier — it changed who gets to innovate. Explore how democratised knowledge is creating a divide between optimisation and innovation, and why diverse voices are the key to solving tomorrow\'s problems.',
        url: 'articles/the-creator-divide/',
        image: 'img/the_creator_divide.png'
    },
    {
        id: 2,
        title: 'Architecture Decisions: Cloud Composer vs Vertex AI Pipelines',
        date: 'October 2025',
        tags: ['MLOps', 'AI'],
        readTime: '11 min read',
        description: 'A practical decision framework for choosing between Cloud Composer and Vertex AI Pipelines. Learn when to use each tool, hybrid patterns, and real-world case studies for enterprise ML infrastructure.',
        url: 'articles/composer-vs-vertex-ai-pipelines/',
        image: 'img/ComposerVsVertexAIBanner.png'
    },
    {
        id: 1,
        title: 'Why Hackathons Are Your Fast-Track to AI Mastery',
        date: 'July 2025',
        tags: ['Technology', 'Leadership'],
        readTime: '8 min read',
        description: 'Explore how hackathons accelerate AI learning and skill development. Learn from my 2025 hackathon journey including AWS AI Hackathon win and insights on building real-world AI solutions.',
        url: 'articles/why-hackathons-fast-track-ai-mastery/',
        image: 'img/hackathons.png'
    }
];
