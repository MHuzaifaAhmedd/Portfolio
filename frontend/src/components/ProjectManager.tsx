'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import Image from 'next/image';
import { getImageUrl } from '@/utils/imageUtils';
import ProjectSkeleton from './ProjectSkeleton';
import {
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Edit3,
  Trash2,
  Eye,
  Star,
  Calendar,
  Tag,
  Globe,
  Github,
  Settings,
  Upload,
  X,
  Check,
  AlertCircle,
  TrendingUp,
  BarChart3,
  Zap,
  Info
} from 'lucide-react';

interface Project {
  _id: string;
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: string[];
  category: string;
  liveDemo: string;
  github: string;
  featured: boolean;
  status: string;
  order: number;
  createdAt: string;
  updatedAt: string;
  views?: number;
  likes?: number;
  completionDate?: string;
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
}

interface ProjectFormData {
  title: string;
  description: string;
  shortDescription: string;
  image: string;
  technologies: string[];
  category: string;
  liveDemo: string;
  github: string;
  featured: boolean;
  status: string;
  order: number;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  completionDate: string;
}

const categories = [
  'AI/ML', 'Web Application', 'Desktop Application', 'E-commerce', 'Analytics', 
  'Mobile Health', 'IoT', 'Blockchain', 'Game Development',
  'Data Science', 'Cybersecurity', 'Cloud Computing', 'Other'
];

const statuses = ['draft', 'published', 'archived'];
const difficulties = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function ProjectManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  // GitHub integration states
  const [githubUrl, setGithubUrl] = useState('');
  const [githubLoading, setGithubLoading] = useState(false);
  const [githubError, setGithubError] = useState('');
  const [githubSuccess, setGithubSuccess] = useState('');
  const [showGitHubHelp, setShowGitHubHelp] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [useToken, setUseToken] = useState(false);

  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    shortDescription: '',
    image: '',
    technologies: [],
    category: 'AI/ML',
    liveDemo: '#',
    github: '#',
    featured: false,
    status: 'published',
    order: 0,
    difficulty: 'Intermediate',
    completionDate: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [techInput, setTechInput] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [dragOver, setDragOver] = useState(false);

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/projects/admin/all', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.data);
      } else {
        setMessage({ type: 'error', text: 'Failed to fetch projects' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setFormData(prev => ({ ...prev, image: '' })); // Clear URL if file is selected
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        setFormData(prev => ({ ...prev, image: '' }));
      }
    }
  };

  const handleTechAdd = () => {
    if (techInput.trim() && !formData.technologies.includes(techInput.trim())) {
      setFormData(prev => ({
        ...prev,
        technologies: [...prev.technologies, techInput.trim()]
      }));
      setTechInput('');
    }
  };

  const handleTechRemove = (tech: string) => {
    setFormData(prev => ({
      ...prev,
      technologies: prev.technologies.filter(t => t !== tech)
    }));
  };

  // Enhanced filtering and sorting
  const filteredAndSortedProjects = projects
    .filter(project => {
      const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           project.technologies.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = categoryFilter === 'all' || project.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesDifficulty = difficultyFilter === 'all' || project.difficulty === difficultyFilter;
      
      return matchesSearch && matchesCategory && matchesStatus && matchesDifficulty;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'order':
          comparison = a.order - b.order;
          break;
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'category':
          comparison = a.category.localeCompare(b.category);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'difficulty':
          const difficultyOrder = { 'Beginner': 1, 'Intermediate': 2, 'Advanced': 3, 'Expert': 4 };
          comparison = (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 0) - 
                      (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 0);
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
        default:
          comparison = 0;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner': return 'from-green-500 to-green-600';
      case 'Intermediate': return 'from-yellow-500 to-yellow-600';
      case 'Advanced': return 'from-orange-500 to-orange-600';
      case 'Expert': return 'from-red-500 to-red-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'from-green-500 to-green-600';
      case 'draft': return 'from-yellow-500 to-yellow-600';
      case 'archived': return 'from-gray-500 to-gray-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  // GitHub Integration Functions
  const parseGitHubUrl = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname !== 'github.com') {
        throw new Error('Not a GitHub URL');
      }

      const pathParts = urlObj.pathname.split('/').filter(part => part);
      if (pathParts.length < 2) {
        throw new Error('Invalid GitHub repository URL');
      }

      const [owner, repo] = pathParts;
      return { owner, repo };
    } catch (error) {
      throw new Error('Invalid GitHub URL format');
    }
  };

  const fetchGitHubRepository = async (url: string) => {
    setGithubLoading(true);
    setGithubError('');
    setGithubSuccess('');

    try {
      const { owner, repo } = parseGitHubUrl(url);

      // Fetch repository data from GitHub API
      const headers: HeadersInit = {};
      if (useToken && githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const repoResponse = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers });

      if (!repoResponse.ok) {
        if (repoResponse.status === 404) {
          throw new Error('Repository not found. Please check the URL.');
        } else if (repoResponse.status === 403) {
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        } else {
          throw new Error('Failed to fetch repository data.');
        }
      }

      const repoData = await repoResponse.json();

      // Fetch comprehensive project files
      const [readmeContent, packageJsonContent, requirementsContent, pomXmlContent, 
             buildGradleContent, composerJsonContent, goModContent, cargoTomlContent,
             setupPyContent, pyProjectTomlContent, gemfileContent, mixfileContent] = await Promise.allSettled([
        fetchFileContent(owner, repo, 'readme'),
        fetchFileContent(owner, repo, 'package.json'),
        fetchFileContent(owner, repo, 'requirements.txt'),
        fetchFileContent(owner, repo, 'pom.xml'),
        fetchFileContent(owner, repo, 'build.gradle'),
        fetchFileContent(owner, repo, 'composer.json'),
        fetchFileContent(owner, repo, 'go.mod'),
        fetchFileContent(owner, repo, 'Cargo.toml'),
        fetchFileContent(owner, repo, 'setup.py'),
        fetchFileContent(owner, repo, 'pyproject.toml'),
        fetchFileContent(owner, repo, 'Gemfile'),
        fetchFileContent(owner, repo, 'mix.exs')
      ]);

      // Extract comprehensive information
      const basicDescription = repoData.description || '';
      const readmeDescription = extractDescriptionFromReadme(readmeContent.status === 'fulfilled' ? readmeContent.value : '');
      const finalDescription = readmeDescription || basicDescription || 'A comprehensive software development project';

      // Extract technologies from ALL sources comprehensively
      const allTechnologies = await extractComprehensiveTechnologies({
        githubTopics: repoData.topics || [],
        description: basicDescription,
        readme: readmeContent.status === 'fulfilled' ? readmeContent.value : '',
        packageJson: packageJsonContent.status === 'fulfilled' ? packageJsonContent.value : '',
        requirements: requirementsContent.status === 'fulfilled' ? requirementsContent.value : '',
        pomXml: pomXmlContent.status === 'fulfilled' ? pomXmlContent.value : '',
        buildGradle: buildGradleContent.status === 'fulfilled' ? buildGradleContent.value : '',
        composerJson: composerJsonContent.status === 'fulfilled' ? composerJsonContent.value : '',
        goMod: goModContent.status === 'fulfilled' ? goModContent.value : '',
        cargoToml: cargoTomlContent.status === 'fulfilled' ? cargoTomlContent.value : '',
        setupPy: setupPyContent.status === 'fulfilled' ? setupPyContent.value : '',
        pyProjectToml: pyProjectTomlContent.status === 'fulfilled' ? pyProjectTomlContent.value : '',
        gemfile: gemfileContent.status === 'fulfilled' ? gemfileContent.value : '',
        mixfile: mixfileContent.status === 'fulfilled' ? mixfileContent.value : '',
        language: repoData.language || '',
        repoData: repoData
      });

      // Generate comprehensive short description
      const shortDescription = generateComprehensiveShortDescription(finalDescription, allTechnologies, repoData.language, repoData);

      // Extract additional project details
      const projectDetails = extractComprehensiveProjectDetails(readmeContent.status === 'fulfilled' ? readmeContent.value : '', repoData);

      setGithubSuccess(`Successfully fetched comprehensive data for ${owner}/${repo} - ${allTechnologies.length} technologies detected!`);

      return {
        title: repoData.name || projectDetails.title,
        description: finalDescription,
        shortDescription: shortDescription,
        github: url,
        technologies: allTechnologies,
        category: inferCategoryFromTechnologies(allTechnologies, repoData.language),
        liveDemo: repoData.homepage || projectDetails.liveDemo || '#',
        image: repoData.owner?.avatar_url || projectDetails.image || '',
        difficulty: inferDifficultyLevel(allTechnologies.length, repoData.language),
        completionDate: projectDetails.completionDate || new Date().toISOString().split('T')[0]
      };
    } catch (error) {
      setGithubError(error instanceof Error ? error.message : 'Failed to fetch GitHub data');
      throw error;
    } finally {
      setGithubLoading(false);
    }
  };

  const extractTechnologiesFromText = (text: string): string[] => {
    const techKeywords = [
      // Frontend
      'react', 'vue', 'angular', 'svelte', 'next.js', 'nuxt', 'vue.js', 'angular.js',
      'typescript', 'javascript', 'html', 'css', 'sass', 'scss', 'tailwind', 'bootstrap',
      'material-ui', 'chakra-ui', 'styled-components', 'emotion',

      // Backend
      'node.js', 'express', 'django', 'flask', 'spring', 'laravel', 'ruby on rails',
      'fastapi', 'graphql', 'rest api', 'mongodb', 'postgresql', 'mysql', 'redis',
      'docker', 'kubernetes', 'aws', 'azure', 'gcp', 'firebase',

      // Languages
      'python', 'javascript', 'typescript', 'java', 'c++', 'c#', 'php', 'ruby', 'go',
      'rust', 'swift', 'kotlin', 'dart',

      // Mobile
      'react native', 'flutter', 'ios', 'android', 'expo',

      // AI/ML
      'tensorflow', 'pytorch', 'scikit-learn', 'pandas', 'numpy', 'jupyter',
      'machine learning', 'deep learning', 'ai', 'data science',

      // Tools
      'git', 'github', 'github actions', 'ci/cd', 'webpack', 'vite', 'babel'
    ];

    const foundTechs = techKeywords.filter(tech =>
      text.toLowerCase().includes(tech.toLowerCase())
    );

    return foundTechs.map(tech => tech.charAt(0).toUpperCase() + tech.slice(1));
  };

  // Extract description from README content
  const extractDescriptionFromReadme = (readmeContent: string): string => {
    if (!readmeContent) return '';

    // Look for common description patterns
    const patterns = [
      // Look for text between ## Description and next heading
      /## Description\s*\n([\s\S]*?)(?=##|\n---|$)/i,
      // Look for text after # Project Name and before first heading
      /^# .+\n\n([\s\S]*?)(?=##|\n---|$)/i,
      // Look for About section
      /## About\s*\n([\s\S]*?)(?=##|\n---|$)/i,
      // Look for Overview section
      /## Overview\s*\n([\s\S]*?)(?=##|\n---|$)/i,
      // Look for first paragraph after title
      /^# .+\n\n([^#][\s\S]*?)(?=##|\n---|$)/i
    ];

    for (const pattern of patterns) {
      const match = readmeContent.match(pattern);
      if (match && match[1]) {
        const description = match[1].trim();
        if (description.length > 20) { // Ensure it's substantial enough
          return description.replace(/\n/g, ' ').replace(/\s+/g, ' ').trim();
        }
      }
    }

    // If no specific sections found, take the first meaningful paragraph
    const lines = readmeContent.split('\n').filter(line => line.trim().length > 0);
    const meaningfulLines = lines.filter(line =>
      !line.match(/^#/) && // Not a heading
      !line.match(/^[-*_]{3,}/) && // Not a separator
      !line.match(/^\s*[!@#$%^&*()]/) && // Not just special characters
      line.length > 20 // Substantial content
    );

    if (meaningfulLines.length > 0) {
      return meaningfulLines[0].trim();
    }

    return '';
  };

  // Extract technologies from package.json
  const extractTechnologiesFromPackageJson = (packageJsonContent: string): string[] => {
    try {
      if (!packageJsonContent) return [];

      const packageJson = JSON.parse(packageJsonContent);
      const technologies: string[] = [];

      // Extract from dependencies
      if (packageJson.dependencies) {
        Object.keys(packageJson.dependencies).forEach(dep => {
          const tech = mapNpmPackageToTechnology(dep);
          if (tech) technologies.push(tech);
        });
      }

      // Extract from devDependencies
      if (packageJson.devDependencies) {
        Object.keys(packageJson.devDependencies).forEach(dep => {
          const tech = mapNpmPackageToTechnology(dep);
          if (tech) technologies.push(tech);
        });
      }

      // Add framework based on common patterns
      if (packageJson.dependencies) {
        if (packageJson.dependencies['next']) technologies.push('Next.js');
        if (packageJson.dependencies['react']) technologies.push('React');
        if (packageJson.dependencies['vue']) technologies.push('Vue.js');
        if (packageJson.dependencies['angular']) technologies.push('Angular');
        if (packageJson.dependencies['express']) technologies.push('Express.js');
        if (packageJson.dependencies['mongoose']) technologies.push('MongoDB');
        if (packageJson.dependencies['socket.io']) technologies.push('Socket.io');
        if (packageJson.dependencies['tailwindcss']) technologies.push('Tailwind CSS');
        if (packageJson.dependencies['bootstrap']) technologies.push('Bootstrap');
        if (packageJson.dependencies['typescript']) technologies.push('TypeScript');
        if (packageJson.dependencies['webpack']) technologies.push('Webpack');
        if (packageJson.dependencies['vite']) technologies.push('Vite');
      }

      return [...new Set(technologies)]; // Remove duplicates
    } catch (error) {
      console.log('Failed to parse package.json:', error);
      return [];
    }
  };

  // Extract technologies from requirements.txt
  const extractTechnologiesFromRequirements = (requirementsContent: string): string[] => {
    if (!requirementsContent) return [];

    const technologies: string[] = [];
    const lines = requirementsContent.split('\n').filter(line => line.trim());

    lines.forEach(line => {
      const packageName = line.split('==')[0].split('>=')[0].split('<')[0].trim().toLowerCase();

      // Map common Python packages to technologies
      if (packageName.includes('django')) technologies.push('Django');
      else if (packageName.includes('flask')) technologies.push('Flask');
      else if (packageName.includes('fastapi')) technologies.push('FastAPI');
      else if (packageName.includes('pandas')) technologies.push('Pandas');
      else if (packageName.includes('numpy')) technologies.push('NumPy');
      else if (packageName.includes('scikit-learn') || packageName.includes('sklearn')) technologies.push('Scikit-learn');
      else if (packageName.includes('tensorflow')) technologies.push('TensorFlow');
      else if (packageName.includes('pytorch') || packageName.includes('torch')) technologies.push('PyTorch');
      else if (packageName.includes('matplotlib')) technologies.push('Matplotlib');
      else if (packageName.includes('seaborn')) technologies.push('Seaborn');
      else if (packageName.includes('requests')) technologies.push('Python Requests');
      else if (packageName.includes('beautifulsoup') || packageName.includes('bs4')) technologies.push('BeautifulSoup');
      else if (packageName.includes('selenium')) technologies.push('Selenium');
      else if (packageName.includes('pytest')) technologies.push('Pytest');
      else if (packageName.includes('jupyter')) technologies.push('Jupyter');
    });

    return [...new Set(technologies)]; // Remove duplicates
  };

  // Extract technologies from Maven pom.xml
  const extractTechnologiesFromPomXml = (pomXmlContent: string): string[] => {
    if (!pomXmlContent) return [];

    const technologies: string[] = [];
    
    // Extract dependencies
    const dependencyPattern = /<dependency>[\s\S]*?<groupId>([^<]+)<\/groupId>[\s\S]*?<artifactId>([^<]+)<\/artifactId>[\s\S]*?<\/dependency>/g;
    let match;
    
    while ((match = dependencyPattern.exec(pomXmlContent)) !== null) {
      const groupId = match[1].toLowerCase();
      const artifactId = match[2].toLowerCase();
      
      // Map common Java dependencies to technologies
      if (groupId.includes('org.springframework')) technologies.push('Spring Framework');
      if (groupId.includes('org.springframework.boot')) technologies.push('Spring Boot');
      if (groupId.includes('org.hibernate')) technologies.push('Hibernate');
      if (groupId.includes('mysql')) technologies.push('MySQL');
      if (groupId.includes('postgresql')) technologies.push('PostgreSQL');
      if (groupId.includes('org.apache.maven')) technologies.push('Maven');
      if (groupId.includes('junit')) technologies.push('JUnit');
      if (groupId.includes('org.mockito')) technologies.push('Mockito');
      if (groupId.includes('org.selenium')) technologies.push('Selenium');
      if (groupId.includes('io.rest-assured')) technologies.push('REST Assured');
    }

    return [...new Set(technologies)];
  };

  // Extract technologies from Gradle build.gradle
  const extractTechnologiesFromGradle = (gradleContent: string): string[] => {
    if (!gradleContent) return [];

    const technologies: string[] = [];
    
    // Extract dependencies
    const dependencyPattern = /(?:implementation|api|compile|runtime)\s+['"]([^'"]+)['"]/g;
    let match;
    
    while ((match = dependencyPattern.exec(gradleContent)) !== null) {
      const dependency = match[1].toLowerCase();
      
      if (dependency.includes('spring-boot')) technologies.push('Spring Boot');
      if (dependency.includes('spring-core')) technologies.push('Spring Framework');
      if (dependency.includes('hibernate')) technologies.push('Hibernate');
      if (dependency.includes('mysql')) technologies.push('MySQL');
      if (dependency.includes('postgresql')) technologies.push('PostgreSQL');
      if (dependency.includes('junit')) technologies.push('JUnit');
      if (dependency.includes('mockito')) technologies.push('Mockito');
      if (dependency.includes('selenium')) technologies.push('Selenium');
    }

    return [...new Set(technologies)];
  };

  // Extract technologies from Composer composer.json
  const extractTechnologiesFromComposer = (composerContent: string): string[] => {
    if (!composerContent) return [];

    try {
      const composer = JSON.parse(composerContent);
      const technologies: string[] = [];

      // Extract from require and require-dev
      const allDeps = { ...composer.require, ...composer['require-dev'] };
      
      Object.keys(allDeps).forEach(dep => {
        if (dep.includes('laravel')) technologies.push('Laravel');
        if (dep.includes('symfony')) technologies.push('Symfony');
        if (dep.includes('wordpress')) technologies.push('WordPress');
        if (dep.includes('drupal')) technologies.push('Drupal');
        if (dep.includes('phpunit')) technologies.push('PHPUnit');
        if (dep.includes('doctrine')) technologies.push('Doctrine');
        if (dep.includes('monolog')) technologies.push('Monolog');
      });

      return [...new Set(technologies)];
    } catch (error) {
      return [];
    }
  };

  // Extract technologies from Go go.mod
  const extractTechnologiesFromGoMod = (goModContent: string): string[] => {
    if (!goModContent) return [];

    const technologies: string[] = [];
    const lines = goModContent.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      if (line.startsWith('require')) {
        const parts = line.split(' ');
        if (parts.length >= 2) {
          const moduleName = parts[1].toLowerCase();
          
          if (moduleName.includes('gin')) technologies.push('Gin');
          if (moduleName.includes('echo')) technologies.push('Echo');
          if (moduleName.includes('fiber')) technologies.push('Fiber');
          if (moduleName.includes('gorilla')) technologies.push('Gorilla');
          if (moduleName.includes('gorm')) technologies.push('GORM');
          if (moduleName.includes('sqlx')) technologies.push('SQLx');
          if (moduleName.includes('testify')) technologies.push('Testify');
        }
      }
    });

    return [...new Set(technologies)];
  };

  // Extract technologies from Rust Cargo.toml
  const extractTechnologiesFromCargo = (cargoContent: string): string[] => {
    if (!cargoContent) return [];

    const technologies: string[] = [];
    
    // Extract dependencies
    const dependencyPattern = /\[dependencies\.([^\]]+)\]/g;
    let match;
    
    while ((match = dependencyPattern.exec(cargoContent)) !== null) {
      const dep = match[1].toLowerCase();
      
      if (dep.includes('tokio')) technologies.push('Tokio');
      if (dep.includes('actix')) technologies.push('Actix');
      if (dep.includes('rocket')) technologies.push('Rocket');
      if (dep.includes('serde')) technologies.push('Serde');
      if (dep.includes('sqlx')) technologies.push('SQLx');
      if (dep.includes('diesel')) technologies.push('Diesel');
    }

    return [...new Set(technologies)];
  };

  // Extract technologies from Python setup.py
  const extractTechnologiesFromSetupPy = (setupPyContent: string): string[] => {
    if (!setupPyContent) return [];

    const technologies: string[] = [];
    
    // Extract install_requires
    const installPattern = /install_requires\s*=\s*\[([\s\S]*?)\]/;
    const match = setupPyContent.match(installPattern);
    
    if (match) {
      const deps = match[1].split(',').map(dep => dep.trim().replace(/['"]/g, ''));
      
      deps.forEach(dep => {
        if (dep.includes('django')) technologies.push('Django');
        if (dep.includes('flask')) technologies.push('Flask');
        if (dep.includes('fastapi')) technologies.push('FastAPI');
        if (dep.includes('pandas')) technologies.push('Pandas');
        if (dep.includes('numpy')) technologies.push('NumPy');
      });
    }

    return [...new Set(technologies)];
  };

  // Extract technologies from Python pyproject.toml
  const extractTechnologiesFromPyProject = (pyProjectContent: string): string[] => {
    if (!pyProjectContent) return [];

    const technologies: string[] = [];
    
    // Extract dependencies
    const dependencyPattern = /\[tool\.poetry\.dependencies\]([\s\S]*?)(?=\[|$)/;
    const match = pyProjectContent.match(dependencyPattern);
    
    if (match) {
      const deps = match[1].split('\n').filter(line => line.includes('='));
      
      deps.forEach(dep => {
        const packageName = dep.split('=')[0].trim();
        if (packageName.includes('django')) technologies.push('Django');
        if (packageName.includes('flask')) technologies.push('Flask');
        if (packageName.includes('fastapi')) technologies.push('FastAPI');
        if (packageName.includes('pandas')) technologies.push('Pandas');
        if (packageName.includes('numpy')) technologies.push('NumPy');
      });
    }

    return [...new Set(technologies)];
  };

  // Extract technologies from Ruby Gemfile
  const extractTechnologiesFromGemfile = (gemfileContent: string): string[] => {
    if (!gemfileContent) return [];

    const technologies: string[] = [];
    const lines = gemfileContent.split('\n').filter(line => line.trim());
    
    lines.forEach(line => {
      if (line.includes('gem')) {
        const gemMatch = line.match(/gem\s+['"]([^'"]+)['"]/);
        if (gemMatch) {
          const gem = gemMatch[1].toLowerCase();
          
          if (gem.includes('rails')) technologies.push('Ruby on Rails');
          if (gem.includes('sinatra')) technologies.push('Sinatra');
          if (gem.includes('rspec')) technologies.push('RSpec');
          if (gem.includes('capybara')) technologies.push('Capybara');
          if (gem.includes('devise')) technologies.push('Devise');
        }
      }
    });

    return [...new Set(technologies)];
  };

  // Extract technologies from Elixir mix.exs
  const extractTechnologiesFromMixfile = (mixfileContent: string): string[] => {
    if (!mixfileContent) return [];

    const technologies: string[] = [];
    
    // Extract dependencies
    const dependencyPattern = /defp deps do[\s\S]*?end/;
    const match = mixfileContent.match(dependencyPattern);
    
    if (match) {
      const deps = match[0];
      
      if (deps.includes('phoenix')) technologies.push('Phoenix');
      if (deps.includes('ecto')) technologies.push('Ecto');
      if (deps.includes('absinthe')) technologies.push('Absinthe');
      if (deps.includes('exunit')) technologies.push('ExUnit');
    }

    return [...new Set(technologies)];
  };

  // Detect frameworks from repository structure
  const detectFrameworksFromStructure = (repoData: any): string[] => {
    const frameworks: string[] = [];
    
    // Check for common framework indicators
    if (repoData.topics) {
      repoData.topics.forEach((topic: string) => {
        if (topic.includes('react')) frameworks.push('React');
        if (topic.includes('vue')) frameworks.push('Vue.js');
        if (topic.includes('angular')) frameworks.push('Angular');
        if (topic.includes('next')) frameworks.push('Next.js');
        if (topic.includes('nuxt')) frameworks.push('Nuxt.js');
        if (topic.includes('django')) frameworks.push('Django');
        if (topic.includes('flask')) frameworks.push('Flask');
        if (topic.includes('spring')) frameworks.push('Spring');
        if (topic.includes('laravel')) frameworks.push('Laravel');
      });
    }

    return frameworks;
  };

  // Map NPM package names to technology names
  const mapNpmPackageToTechnology = (packageName: string): string | null => {
    const packageMappings: { [key: string]: string } = {
      'react': 'React',
      'vue': 'Vue.js',
      '@angular/core': 'Angular',
      'next': 'Next.js',
      'nuxt': 'Nuxt.js',
      'svelte': 'Svelte',
      'express': 'Express.js',
      'mongoose': 'MongoDB',
      'mongodb': 'MongoDB',
      'mysql2': 'MySQL',
      'pg': 'PostgreSQL',
      'redis': 'Redis',
      'socket.io': 'Socket.io',
      'tailwindcss': 'Tailwind CSS',
      'bootstrap': 'Bootstrap',
      'material-ui': '@mui/material',
      'antd': 'Ant Design',
      'chakra-ui': 'Chakra UI',
      'styled-components': 'Styled Components',
      'framer-motion': 'Framer Motion',
      'typescript': 'TypeScript',
      'webpack': 'Webpack',
      'vite': 'Vite',
      'babel': 'Babel',
      'eslint': 'ESLint',
      'prettier': 'Prettier',
      'jest': 'Jest',
      'cypress': 'Cypress',
      'axios': 'Axios',
      'redux': 'Redux',
      'mobx': 'MobX',
      'zustand': 'Zustand',
      'react-query': 'React Query',
      'apollo-client': 'Apollo Client',
      'graphql': 'GraphQL',
      'firebase': 'Firebase',
      'supabase': 'Supabase',
      'stripe': 'Stripe',
      'aws-sdk': 'AWS SDK',
      'docker': 'Docker',
      'kubernetes': 'Kubernetes'
    };

    return packageMappings[packageName] || null;
  };

  // Generate comprehensive short description
  const generateShortDescription = (description: string, technologies: string[], language: string): string => {
    if (description.length <= 150) return description;

    // Try to create a concise summary
    const techString = technologies.slice(0, 3).join(', '); // Top 3 technologies
    const baseDesc = description.substring(0, 100).trim();

    if (techString) {
      return `${baseDesc}... Built with ${techString}${language ? ` in ${language}` : ''}.`;
    }

    return `${baseDesc}...`;
  };

  // Generate comprehensive short description with more details
  const generateComprehensiveShortDescription = (description: string, technologies: string[], language: string, repoData: any): string => {
    if (description.length <= 150) return description;

    const techString = technologies.slice(0, 5).join(', '); // Top 5 technologies
    const baseDesc = description.substring(0, 120).trim();
    const stars = repoData.stargazers_count || 0;
    const forks = repoData.forks_count || 0;

    let summary = `${baseDesc}...`;
    
    if (techString) {
      summary += ` Built with ${techString}`;
    }
    
    if (language) {
      summary += ` in ${language}`;
    }
    
    if (stars > 0) {
      summary += `. ${stars}⭐ ${forks}🍴`;
    }

    return summary;
  };

  // Extract additional project details from README
  const extractProjectDetails = (readmeContent: string, repoData: any) => {
    const details = {
      title: repoData.name || '',
      liveDemo: '',
      image: '',
      completionDate: ''
    };

    if (!readmeContent) return details;

    // Look for live demo URLs
    const demoPatterns = [
      /(?:live demo|demo|preview|view online):?\s*([^\s\n]+)/i,
      /(?:website|homepage):?\s*([^\s\n]+)/i,
      /(?:deployed at|hosted at):?\s*([^\s\n]+)/i,
      /https?:\/\/[^\s\n]+(?:demo|preview|live)/i
    ];

    for (const pattern of demoPatterns) {
      const match = readmeContent.match(pattern);
      if (match && match[1]) {
        const url = match[1].trim();
        if (url.startsWith('http')) {
          details.liveDemo = url;
          break;
        }
      }
    }

    // Look for completion date
    const datePatterns = [
      /(?:completed|finished|built):?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
      /(?:created|developed):?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i,
      /(?:last updated|updated):?\s*([A-Za-z]+\s+\d{1,2},?\s+\d{4})/i
    ];

    for (const pattern of datePatterns) {
      const match = readmeContent.match(pattern);
      if (match && match[1]) {
        try {
          const date = new Date(match[1]);
          if (!isNaN(date.getTime())) {
            details.completionDate = date.toISOString().split('T')[0];
            break;
          }
        } catch (error) {
          console.log('Date parsing failed');
        }
      }
    }

    return details;
  };

  // Extract comprehensive project details from README and repository data
  const extractComprehensiveProjectDetails = (readmeContent: string, repoData: any) => {
    const details = extractProjectDetails(readmeContent, repoData);
    
    // Add more comprehensive details
    details.liveDemo = details.liveDemo || repoData.homepage || '';
    details.image = repoData.owner?.avatar_url || '';
    
    // Extract more details from README if available
    if (readmeContent) {
      // Look for more demo URLs
      const additionalDemoPatterns = [
        /(?:demo|preview|live|try it|test):?\s*([^\s\n]+)/gi,
        /(?:visit|go to|check out):?\s*([^\s\n]+)/gi,
        /https?:\/\/[^\s\n]+(?:\.com|\.org|\.net|\.io|\.app|\.dev)/gi
      ];

      for (const pattern of additionalDemoPatterns) {
        const matches = readmeContent.matchAll(pattern);
        for (const match of matches) {
          const url = match[1]?.trim();
          if (url && url.startsWith('http') && !details.liveDemo.includes(url)) {
            details.liveDemo = details.liveDemo ? `${details.liveDemo}, ${url}` : url;
          }
        }
      }
    }

    return details;
  };

  // Infer difficulty level based on technology stack and language
  const inferDifficultyLevel = (techCount: number, language: string): 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' => {
    // Advanced/Expert languages
    const advancedLanguages = ['Rust', 'C++', 'Assembly', 'Haskell', 'Scala', 'Go'];
    const expertLanguages = ['C', 'Rust', 'Assembly'];

    if (expertLanguages.includes(language)) return 'Expert';
    if (advancedLanguages.includes(language)) return 'Advanced';
    if (techCount >= 8) return 'Advanced';
    if (techCount >= 5) return 'Intermediate';
    if (techCount >= 3) return 'Beginner';

    return 'Beginner';
  };

  const inferCategoryFromTechnologies = (technologies: string[], language?: string): string => {
    const techString = technologies.join(' ').toLowerCase();
    const langString = language?.toLowerCase() || '';

    // AI/ML Detection
    if (techString.includes('tensorflow') || techString.includes('pytorch') ||
        techString.includes('machine learning') || techString.includes('ai') ||
        techString.includes('scikit-learn') || techString.includes('pandas') ||
        techString.includes('numpy') || techString.includes('jupyter') ||
        techString.includes('deep learning') || langString.includes('python')) {
      return 'AI/ML';
    }

    // Web Application Detection
    if (techString.includes('react') || techString.includes('vue') ||
        techString.includes('angular') || techString.includes('next.js') ||
        techString.includes('javascript') || techString.includes('typescript') ||
        techString.includes('html') || techString.includes('css') ||
        techString.includes('node.js') || techString.includes('express')) {
      return 'Web Application';
    }

    // Data Science Detection
    if (techString.includes('data') || techString.includes('analytics') ||
        techString.includes('pandas') || techString.includes('numpy') ||
        techString.includes('matplotlib') || techString.includes('seaborn') ||
        techString.includes('tableau') || techString.includes('power bi')) {
      return 'Data Science';
    }

    // E-commerce Detection
    if (techString.includes('ecommerce') || techString.includes('shop') ||
        techString.includes('woocommerce') || techString.includes('magento') ||
        techString.includes('shopify') || techString.includes('stripe') ||
        techString.includes('payment')) {
      return 'E-commerce';
    }

    // Mobile Development Detection
    if (techString.includes('mobile') || techString.includes('react native') ||
        techString.includes('flutter') || techString.includes('ios') ||
        techString.includes('android') || techString.includes('expo')) {
      return 'Mobile Health';
    }

    // Desktop Application Detection
    if (techString.includes('electron') || techString.includes('tauri') ||
        techString.includes('qt') || techString.includes('gtk') ||
        techString.includes('wxwidgets') || techString.includes('swing') ||
        techString.includes('javafx') || techString.includes('wpf') ||
        techString.includes('winforms') || techString.includes('cocoa') ||
        techString.includes('desktop') || techString.includes('native app') ||
        techString.includes('cross-platform') || techString.includes('gui') ||
        techString.includes('tkinter') || techString.includes('pyqt') ||
        techString.includes('kivy') || techString.includes('flet')) {
      return 'Desktop Application';
    }

    // Blockchain Detection
    if (techString.includes('blockchain') || techString.includes('ethereum') ||
        techString.includes('smart contract') || techString.includes('web3') ||
        techString.includes('solidity') || techString.includes('bitcoin')) {
      return 'Blockchain';
    }

    // Game Development Detection
    if (techString.includes('game') || techString.includes('unity') ||
        techString.includes('unreal') || techString.includes('godot') ||
        techString.includes('phaser') || techString.includes('three.js')) {
      return 'Game Development';
    }

    // IoT Detection
    if (techString.includes('iot') || techString.includes('internet of things') ||
        techString.includes('arduino') || techString.includes('raspberry pi') ||
        techString.includes('sensors') || techString.includes('embedded')) {
      return 'IoT';
    }

    // Cybersecurity Detection
    if (techString.includes('security') || techString.includes('cybersecurity') ||
        techString.includes('encryption') || techString.includes('authentication') ||
        techString.includes('firewall') || techString.includes('penetration testing')) {
      return 'Cybersecurity';
    }

    // Cloud Computing Detection
    if (techString.includes('aws') || techString.includes('azure') ||
        techString.includes('gcp') || techString.includes('cloud') ||
        techString.includes('docker') || techString.includes('kubernetes') ||
        techString.includes('terraform')) {
      return 'Cloud Computing';
    }

    // Default based on programming language
    if (langString.includes('python')) return 'Data Science';
    if (langString.includes('javascript') || langString.includes('typescript')) return 'Web Application';
    if (langString.includes('java') || langString.includes('kotlin')) return 'Web Application';
    if (langString.includes('c#') || langString.includes('c++')) return 'Web Application';
    if (langString.includes('php')) return 'Web Application';

    return 'Web Application'; // Default category
  };

  // Helper function to decode base64 content (GitHub API returns base64 encoded content)
  const decodeBase64 = (base64String: string): string => {
    try {
      // Use Buffer if available (Node.js environment) or atob for browser
      if (typeof Buffer !== 'undefined') {
        return Buffer.from(base64String, 'base64').toString('utf-8');
      } else if (typeof atob !== 'undefined') {
        return atob(base64String);
      } else {
        // Fallback: simple base64 decode for basic ASCII
        return decodeURIComponent(escape(window.atob(base64String)));
      }
    } catch (error) {
      console.error('Failed to decode base64 content:', error);
      return base64String; // Return as-is if decoding fails
    }
  };

  // Fetch file content from GitHub repository
  const fetchFileContent = async (owner: string, repo: string, filename: string): Promise<string> => {
    try {
      let apiPath = '';
      
      if (filename === 'readme') {
        apiPath = `https://api.github.com/repos/${owner}/${repo}/readme`;
      } else {
        apiPath = `https://api.github.com/repos/${owner}/${repo}/contents/${filename}`;
      }

      const headers: HeadersInit = {};
      if (useToken && githubToken) {
        headers['Authorization'] = `token ${githubToken}`;
      }

      const response = await fetch(apiPath, { headers });
      if (response.ok) {
        const data = await response.json();
        return decodeBase64(data.content);
      }
      return '';
    } catch (error) {
      return '';
    }
  };

  // Extract comprehensive technologies from all sources
  const extractComprehensiveTechnologies = async (sources: {
    githubTopics: string[];
    description: string;
    readme: string;
    packageJson: string;
    requirements: string;
    pomXml: string;
    buildGradle: string;
    composerJson: string;
    goMod: string;
    cargoToml: string;
    setupPy: string;
    pyProjectToml: string;
    gemfile: string;
    mixfile: string;
    language: string;
    repoData: any;
  }): Promise<string[]> => {
    const allTechnologies = new Set<string>();

    // Add GitHub topics
    sources.githubTopics.forEach(topic => allTechnologies.add(topic));

    // Extract from description
    const descTech = extractTechnologiesFromText(sources.description);
    descTech.forEach(tech => allTechnologies.add(tech));

    // Extract from README
    const readmeTech = extractTechnologiesFromText(sources.readme);
    readmeTech.forEach(tech => allTechnologies.add(tech));

    // Extract from package.json
    const packageTech = extractTechnologiesFromPackageJson(sources.packageJson);
    packageTech.forEach(tech => allTechnologies.add(tech));

    // Extract from requirements.txt
    const reqTech = extractTechnologiesFromRequirements(sources.requirements);
    reqTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Maven pom.xml
    const pomTech = extractTechnologiesFromPomXml(sources.pomXml);
    pomTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Gradle build.gradle
    const gradleTech = extractTechnologiesFromGradle(sources.buildGradle);
    gradleTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Composer composer.json
    const composerTech = extractTechnologiesFromComposer(sources.composerJson);
    composerTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Go go.mod
    const goTech = extractTechnologiesFromGoMod(sources.goMod);
    goTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Rust Cargo.toml
    const cargoTech = extractTechnologiesFromCargo(sources.cargoToml);
    cargoTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Python setup.py
    const setupPyTech = extractTechnologiesFromSetupPy(sources.setupPy);
    setupPyTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Python pyproject.toml
    const pyProjectTech = extractTechnologiesFromPyProject(sources.pyProjectToml);
    pyProjectTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Ruby Gemfile
    const gemfileTech = extractTechnologiesFromGemfile(sources.gemfile);
    gemfileTech.forEach(tech => allTechnologies.add(tech));

    // Extract from Elixir mix.exs
    const mixfileTech = extractTechnologiesFromMixfile(sources.mixfile);
    mixfileTech.forEach(tech => allTechnologies.add(tech));

    // Add language-specific technologies
    if (sources.language) {
      allTechnologies.add(sources.language);
    }

    // Add framework detection based on repository structure
    const frameworkTech = detectFrameworksFromStructure(sources.repoData);
    frameworkTech.forEach(tech => allTechnologies.add(tech));

    return Array.from(allTechnologies).sort();
  };

  const handleGitHubFetch = async () => {
    if (!githubUrl.trim()) {
      setGithubError('Please enter a GitHub repository URL');
      setGithubSuccess('');
      return;
    }

    try {
      const repoData = await fetchGitHubRepository(githubUrl);

      // Update form data with fetched information
      setFormData(prev => ({
        ...prev,
        title: repoData.title,
        description: repoData.description,
        shortDescription: repoData.shortDescription,
        github: repoData.github,
        technologies: repoData.technologies,
        category: repoData.category,
        liveDemo: repoData.liveDemo,
        image: repoData.image || prev.image
      }));

      // Also update the githubUrl state to keep it in sync
      setGithubUrl(repoData.github || githubUrl);

      setGithubError('');
    } catch (error) {
      // Error is already set in fetchGitHubRepository
      setGithubSuccess('');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      shortDescription: '',
      image: '',
      technologies: [],
      category: 'AI/ML',
      liveDemo: '',
      github: '',
      featured: false,
      status: 'published',
      order: 0,
      difficulty: 'Intermediate',
      completionDate: ''
    });
    setImageFile(null);
    setImagePreview('');
    setEditingProject(null);
    setGithubUrl('');
    setGithubError('');
    setGithubSuccess('');
    setShowGitHubHelp(false);
    setGithubToken('');
    setUseToken(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const formDataToSend = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'technologies') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (key === 'completionDate') {
          // Handle completionDate properly - only send if it has a value
          if (value && value.trim() !== '') {
            formDataToSend.append(key, String(value));
          }
        } else if (key === 'liveDemo' || key === 'github') {
          // Handle liveDemo and github - send '#' if empty, otherwise send the value
          if (value && value.trim() !== '') {
            formDataToSend.append(key, String(value));
          } else {
            formDataToSend.append(key, '#');
          }
        } else {
          formDataToSend.append(key, String(value));
        }
      });

      // Add image file if selected, or use existing image URL
      if (imageFile) {
        formDataToSend.append('image', imageFile);
      } else if (formData.image && formData.image.trim() !== '') {
        // If no file selected but there's an image URL, send it
        formDataToSend.append('image', formData.image);
      } else {
        // If no image at all, send a default placeholder
        formDataToSend.append('image', 'https://via.placeholder.com/400x300/1a2332/ffffff?text=Project+Image');
      }

      const url = editingProject 
        ? `http://localhost:5000/api/projects/admin/${editingProject._id}`
        : 'http://localhost:5000/api/projects/admin/create';

      const method = editingProject ? 'PUT' : 'POST';

      // Debug: Log what's being sent
      console.log('Form data being sent:', {
        url,
        method,
        formData: Object.fromEntries(formDataToSend.entries())
      });

      const response = await fetch(url, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formDataToSend
      });

      if (response.ok) {
        const data = await response.json();
        setMessage({ type: 'success', text: data.message });
        fetchProjects();
        resetForm();
        setShowForm(false);
      } else {
        const errorData = await response.json();
        setMessage({ type: 'error', text: errorData.message || 'Operation failed' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      shortDescription: project.shortDescription,
      image: project.image,
      technologies: project.technologies,
      category: project.category,
      liveDemo: project.liveDemo === '#' ? '' : project.liveDemo,
      github: project.github === '#' ? '' : project.github,
      featured: project.featured,
      status: project.status,
      order: project.order,
      difficulty: project.difficulty || 'Intermediate',
      completionDate: project.completionDate || ''
    });
    // Populate GitHub URL for the integration section
    setGithubUrl(project.github === '#' ? '' : project.github);
    setImagePreview(project.image);
    setShowForm(true);
  };

  const handleDelete = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/projects/admin/${projectId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project deleted successfully' });
        fetchProjects();
      } else {
        setMessage({ type: 'error', text: 'Failed to delete project' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`http://localhost:5000/api/projects/admin/${projectId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Project status updated' });
        fetchProjects();
      } else {
        setMessage({ type: 'error', text: 'Failed to update status' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error' });
    }
  };

  // Calculate statistics
  const stats = {
    total: projects.length,
    published: projects.filter(p => p.status === 'published').length,
    draft: projects.filter(p => p.status === 'draft').length,
    archived: projects.filter(p => p.status === 'archived').length,
    featured: projects.filter(p => p.featured).length,
    byCategory: categories.reduce((acc, cat) => {
      acc[cat] = projects.filter(p => p.category === cat).length;
      return acc;
    }, {} as Record<string, number>),
    byDifficulty: difficulties.reduce((acc, diff) => {
      acc[diff] = projects.filter(p => p.difficulty === diff).length;
      return acc;
    }, {} as Record<string, number>)
  };

  if (loading) {
    return <ProjectSkeleton count={6} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1f] via-[#1a2332] to-[#0a0f1f] text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Enhanced Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0"
        >
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
              Project Management
            </h1>
            <p className="text-gray-400 text-lg">Professional portfolio project administration</p>
          </div>
          
          <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#1a2332] to-[#0f1a2a] border border-[#2a3342] text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-[#2a3342] transition-all duration-300"
            >
              <Filter size={20} />
              <span>Filters</span>
            </button>
            
          <button
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
              className="flex items-center justify-center space-x-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25"
            >
              <Plus size={20} />
              <span>New Project</span>
            </button>
          </div>
        </motion.div>

        {/* Enhanced Statistics Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Total Projects</p>
                <p className="text-3xl font-bold text-white">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-2xl flex items-center justify-center border border-blue-500/30">
                <BarChart3 size={24} className="text-blue-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Published</p>
                <p className="text-3xl font-bold text-green-400">{stats.published}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-2xl flex items-center justify-center border border-green-500/30">
                <Check size={24} className="text-green-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Featured</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.featured}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-500/20 to-yellow-600/20 rounded-2xl flex items-center justify-center border border-yellow-500/30">
                <Star size={24} className="text-yellow-400" />
              </div>
            </div>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">Draft</p>
                <p className="text-3xl font-bold text-orange-400">{stats.draft}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-orange-600/20 rounded-2xl flex items-center justify-center border border-orange-500/30">
                <Edit3 size={24} className="text-orange-400" />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Enhanced Filters and Search */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-6 shadow-xl overflow-hidden"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Search */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Search Projects</label>
                  <div className="relative">
                    <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by title, tech, or description..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl pl-10 pr-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Category</label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Status</label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  >
                    <option value="all">All Status</option>
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Difficulty Filter */}
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-300">Difficulty</label>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  >
                    <option value="all">All Difficulties</option>
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort Controls */}
              <div className="flex flex-wrap items-center justify-between gap-4 mt-6 pt-6 border-t border-[#2a3342]/50">
                <div className="flex items-center space-x-4">
                  <label className="text-sm font-semibold text-gray-300">Sort by:</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                  >
                    <option value="order">Display Order</option>
                    <option value="title">Title</option>
                    <option value="category">Category</option>
                    <option value="status">Status</option>
                    <option value="difficulty">Difficulty</option>
                    <option value="createdAt">Creation Date</option>
                  </select>
                  
                  <button
                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                    className="flex items-center justify-center space-x-2 bg-gradient-to-r from-[#1a2332] to-[#0f1a2a] border border-[#2a3342] text-gray-300 px-4 py-2 rounded-xl font-medium hover:bg-[#2a3342] transition-all duration-300"
                  >
                    {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
          </button>
        </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'grid' 
                        ? 'bg-cyan-400 text-black' 
                        : 'bg-[#0f1a2a] text-gray-400 hover:bg-[#1a2332]'
                    }`}
                  >
                    <Grid3X3 size={20} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-all duration-300 ${
                      viewMode === 'list' 
                        ? 'bg-cyan-400 text-black' 
                        : 'bg-[#0f1a2a] text-gray-400 hover:bg-[#1a2332]'
                    }`}
                  >
                    <List size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Message Display */}
        {message.text && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-xl ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}

        {/* Enhanced Project Form */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-3xl font-bold text-white">
                    {editingProject ? 'Edit Project' : 'Create New Project'}
              </h2>
                  <p className="text-gray-400 mt-2">
                    {editingProject ? 'Update project details and settings' : 'Add a new project to your portfolio'}
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowForm(false);
                    resetForm();
                  }}
                  className="w-10 h-10 bg-[#2a3342] hover:bg-[#3a4352] rounded-full flex items-center justify-center text-gray-400 hover:text-white transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
              
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Title */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <span>Title</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Enter project title"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <Tag size={16} />
                      <span>Category</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  {/* Difficulty */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <TrendingUp size={16} />
                      <span>Difficulty Level</span>
                    </label>
                    <select
                      name="difficulty"
                      value={formData.difficulty}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    >
                      {difficulties.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>

                  {/* Status */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <Settings size={16} />
                      <span>Status</span>
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      required
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    >
                      {statuses.map(status => (
                        <option key={status} value={status}>
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Short Description */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <span>Short Description</span>
                      <span className="text-red-400">*</span>
                    </label>
                    <textarea
                      name="shortDescription"
                      value={formData.shortDescription}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 resize-none"
                      placeholder="Brief project description (max 1000 characters)"
                    />
                    <p className="text-xs text-gray-500">{formData.shortDescription.length}/1000 characters</p>
                  </div>

                  {/* Completion Date */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <Calendar size={16} />
                      <span>Completion Date</span>
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="date"
                      name="completionDate"
                      value={formData.completionDate}
                      onChange={handleInputChange}
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                    />
                  </div>

                  {/* Live Demo URL */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <Globe size={16} />
                      <span>Live Demo URL</span>
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      name="liveDemo"
                      value={formData.liveDemo === '#' ? '' : formData.liveDemo}
                      onChange={handleInputChange}
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="https://demo.example.com (Optional)"
                    />
                  </div>

                  {/* GitHub Repository URL */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <Github size={16} />
                      <span>GitHub Repository URL</span>
                      <span className="text-gray-500 text-xs">(Optional)</span>
                    </label>
                    <input
                      type="url"
                      name="github"
                      value={formData.github === '#' ? '' : formData.github}
                      onChange={handleInputChange}
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="https://github.com/username/repo (Optional)"
                    />
                  </div>

                  {/* GitHub Integration */}
                  <div className="space-y-4">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <Github size={16} />
                      <span>GitHub Repository</span>
                      <button
                        type="button"
                        onClick={() => setShowGitHubHelp(!showGitHubHelp)}
                        className="text-cyan-400 hover:text-cyan-300 transition-colors"
                      >
                        <Info size={14} />
                      </button>
                    </label>

                    {/* GitHub Help Section */}
                    <AnimatePresence>
                      {showGitHubHelp && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 overflow-hidden"
                        >
                          <div className="space-y-3 text-sm text-blue-300">
                            <div className="flex items-start space-x-2">
                              <Zap size={16} className="text-yellow-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-blue-200">Quick Setup:</p>
                                <p>1. Copy your GitHub repository URL</p>
                                <p>2. Paste it in the field below</p>
                                <p>3. Click "Fetch" to auto-populate project details</p>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2">
                              <Check size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-semibold text-green-200">Auto-Detected:</p>
                                <p>• Project title and description</p>
                                <p>• Technology stack from README</p>
                                <p>• Live demo URL if available</p>
                                <p>• Repository owner avatar</p>
                              </div>
                            </div>
                            <div className="text-xs text-blue-400/80">
                              Example: https://github.com/username/portfolio-project
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* GitHub Token (Optional) */}
                    <div className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        id="useToken"
                        checked={useToken}
                        onChange={(e) => setUseToken(e.target.checked)}
                        className="w-4 h-4 text-cyan-400 bg-[#0f1a2a] border-[#2a3342] rounded focus:ring-cyan-400/50 focus:ring-2"
                      />
                      <label htmlFor="useToken" className="text-sm text-gray-300">
                        Use GitHub Token (for higher rate limits)
                      </label>
                    </div>

                    {useToken && (
                      <div className="space-y-2">
                        <label className="text-xs text-gray-400 font-medium">
                          GitHub Personal Access Token
                        </label>
                        <input
                          type="password"
                          value={githubToken}
                          onChange={(e) => setGithubToken(e.target.value)}
                          placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                          className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 text-sm"
                        />
                        <p className="text-xs text-gray-500">
                          Get token from GitHub → Settings → Developer settings → Personal access tokens
                        </p>
                      </div>
                    )}

                    {/* GitHub URL Input and Fetch Button */}
                    <div className="space-y-3">
                      <div className="flex space-x-3">
                        <div className="flex-1">
                          <input
                            type="url"
                            value={githubUrl}
                            onChange={(e) => {
                              setGithubUrl(e.target.value);
                              setGithubError('');
                            }}
                            className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                            placeholder="https://github.com/username/repo"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={handleGitHubFetch}
                          disabled={githubLoading}
                          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium hover:from-purple-600 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-purple-500/25 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {githubLoading ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              <span>Fetching...</span>
                            </>
                          ) : (
                            <>
                              <span>🔗</span>
                              <span>Fetch</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* GitHub Success Message */}
                      {githubSuccess && (
                        <div className="bg-green-500/20 border border-green-500/30 rounded-xl p-3">
                          <p className="text-green-400 text-sm flex items-center space-x-2">
                            <Check size={16} />
                            <span>{githubSuccess}</span>
                          </p>
                        </div>
                      )}

                      {/* GitHub Error Message */}
                      {githubError && (
                        <div className="bg-red-500/20 border border-red-500/30 rounded-xl p-3">
                          <p className="text-red-400 text-sm flex items-center space-x-2">
                            <AlertCircle size={16} />
                            <span>{githubError}</span>
                          </p>
                        </div>
                      )}

                      {/* GitHub URL Preview (when fetched successfully) */}
                      {formData.github && formData.github !== '#' && (
                        <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                          <p className="text-blue-400 text-sm flex items-center space-x-2">
                            <Github size={16} />
                            <span>GitHub repository linked: {formData.github}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order */}
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                      <span>Display Order</span>
                    </label>
                    <input
                      type="number"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="0"
                    />
                    <p className="text-xs text-gray-500">Lower numbers appear first</p>
                  </div>

                  {/* Featured */}
                  <div className="flex items-center space-x-3 pt-6">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="w-5 h-5 text-cyan-400 bg-[#0f1a2a] border-[#2a3342] rounded focus:ring-cyan-400/50 focus:ring-2"
                    />
                    <div className="flex items-center space-x-2">
                      <Star size={16} className="text-yellow-400" />
                      <label className="text-sm font-semibold text-gray-300">Featured Project</label>
                    </div>
                  </div>
                </div>

                {/* Full Description */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                    <span>Full Description</span>
                    <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    required
                    rows={5}
                    className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300 resize-none"
                    placeholder="Detailed project description (max 5000 characters)"
                  />
                  <p className="text-xs text-gray-500">{formData.description.length}/5000 characters</p>
                </div>

                {/* Technologies */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                    <span>Technologies Used</span>
                    {formData.technologies.length > 0 && (
                      <span className="bg-cyan-500/20 text-cyan-400 text-xs px-2 py-1 rounded-full border border-cyan-500/30">
                        {formData.technologies.length} detected
                      </span>
                    )}
                  </label>

                  {/* Auto-detected technologies info */}
                  {formData.technologies.length > 0 && githubUrl && (
                    <div className="bg-blue-500/20 border border-blue-500/30 rounded-xl p-3">
                      <p className="text-blue-400 text-sm flex items-center space-x-2">
                        <span>🔍</span>
                        <span>Technologies auto-detected from GitHub repository</span>
                      </p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mb-4">
                    {formData.technologies.map((tech, index) => (
                      <motion.span
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="bg-gradient-to-r from-cyan-400/20 to-blue-500/20 text-cyan-400 px-4 py-2 rounded-full text-sm flex items-center space-x-2 border border-cyan-400/30"
                      >
                        <span>{tech}</span>
                        <button
                          type="button"
                          onClick={() => handleTechRemove(tech)}
                          className="text-red-400 hover:text-red-300 transition-colors duration-200"
                        >
                          <X size={14} />
                        </button>
                      </motion.span>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={techInput}
                      onChange={(e) => setTechInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleTechAdd())}
                      className="flex-1 bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="Add technology (press Enter to add)"
                    />
                    <button
                      type="button"
                      onClick={handleTechAdd}
                      disabled={!techInput.trim()}
                      className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-6 py-3 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>

                {/* Enhanced Image Upload with Drag & Drop */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-300">
                    <Upload size={16} />
                    <span>Project Image</span>
                  </label>

                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                      dragOver
                        ? 'border-cyan-400 bg-cyan-400/10'
                        : 'border-[#2a3342] bg-[#0f1a2a]/50'
                    }`}
                  >
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    <div className="text-center">
                      <Upload size={48} className={`mx-auto mb-4 ${dragOver ? 'text-cyan-400' : 'text-gray-400'}`} />
                      <p className="text-gray-300 font-medium mb-2">
                        {dragOver ? 'Drop your image here' : 'Drag & drop an image, or click to browse'}
                      </p>
                      <p className="text-gray-500 text-sm">PNG, JPG, GIF up to 5MB</p>
                    </div>
                  </div>

                  {/* URL Alternative */}
                  <div className="space-y-2">
                    <label className="text-xs text-gray-400">Or enter image URL</label>
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="w-full bg-[#0f1a2a]/80 border border-[#2a3342] rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400/50 focus:border-cyan-400/50 transition-all duration-300"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  {/* Image Preview */}
                  {imagePreview && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="relative w-64 h-40 mx-auto"
                    >
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="rounded-xl object-cover shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview('');
                          setImageFile(null);
                          setFormData(prev => ({ ...prev, image: '' }));
                        }}
                        className="absolute top-2 right-2 w-8 h-8 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg transition-colors duration-200"
                      >
                        <X size={16} />
                      </button>
                    </motion.div>
                  )}
                </div>

                {/* Enhanced Form Actions */}
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4 pt-8">
                  <button
                    type="submit"
                    disabled={loading || !formData.title.trim() || !formData.description.trim()}
                    className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        <span>{editingProject ? 'Updating...' : 'Creating...'}</span>
                      </>
                    ) : (
                      <>
                        <Check size={20} />
                        <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      resetForm();
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-[#2a3342] to-[#3a4352] text-gray-300 rounded-xl font-semibold hover:from-[#3a4352] hover:to-[#4a5362] transition-all duration-300 border border-[#4a5362]/30 flex items-center justify-center space-x-2"
                  >
                    <X size={20} />
                    <span>Cancel</span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Enhanced Projects Display */}
        <div className="space-y-6">
          {/* Results Summary */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-white">
                Projects ({filteredAndSortedProjects.length})
              </h2>
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' && (
                <span className="text-sm text-gray-400 bg-[#1a2332] px-3 py-1 rounded-full">
                  Filtered from {projects.length} total
                </span>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">View:</span>
              <div className="flex bg-[#1a2332] rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-cyan-400 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <Grid3X3 size={18} />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list'
                      ? 'bg-cyan-400 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  <List size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Projects Grid View */}
          {viewMode === 'grid' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredAndSortedProjects.map((project, index) => (
                <motion.div
                  key={project._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                >
                  {/* Project Image */}
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={project.image.startsWith('http') ? project.image : `http://localhost:5000${project.image}`}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                    {/* Status Badge */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        project.status === 'published'
                          ? 'bg-green-500/20 text-green-400 border-green-500/30'
                          : project.status === 'draft'
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-gray-500/20 text-gray-400 border-gray-500/30'
                      }`}>
                        {project.status}
                      </span>
                    </div>

                    {/* Featured Badge */}
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                          <Star size={12} />
                          <span>Featured</span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Project Content */}
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors duration-200 mb-2">
                        {project.title}
                      </h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{project.shortDescription}</p>
                    </div>

                    {/* Project Meta */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="flex items-center space-x-2 text-gray-400">
                          <Tag size={14} />
                          <span>{project.category}</span>
                        </span>
                        {project.difficulty && (
                          <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getDifficultyColor(project.difficulty)}`}>
                            {project.difficulty}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <span>Order: {project.order}</span>
                        {project.completionDate && (
                          <>
                            <span>•</span>
                            <span>Completed: {new Date(project.completionDate).toLocaleDateString()}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Technologies */}
                    {project.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.slice(0, 3).map((tech, techIndex) => (
                          <span
                            key={techIndex}
                            className="bg-cyan-400/10 text-cyan-400 px-2 py-1 rounded text-xs border border-cyan-400/20"
                          >
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-gray-500 text-xs px-2 py-1">
                            +{project.technologies.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex space-x-2 pt-2">
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-4 py-2 rounded-lg font-medium hover:from-cyan-500 hover:to-blue-600 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Edit3 size={16} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2"
                      >
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Projects List View */}
          {viewMode === 'list' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl overflow-hidden shadow-xl"
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#0f1a2a]/80">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Project</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Difficulty</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Order</th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2a3342]/50">
                    {filteredAndSortedProjects.map((project, index) => (
                      <motion.tr
                        key={project._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-[#1a2332]/30 transition-all duration-200 group"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                            <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                                                             <Image
                                 src={getImageUrl(project.image)}
                                 alt={project.title}
                                 fill
                                 className="object-cover"
                               />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-semibold text-white group-hover:text-cyan-400 transition-colors duration-200">
                                {project.title}
                              </div>
                              <div className="text-sm text-gray-400 line-clamp-1">{project.shortDescription}</div>
                              {project.technologies.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {project.technologies.slice(0, 3).map((tech, techIndex) => (
                                    <span
                                      key={techIndex}
                                      className="text-xs bg-cyan-400/10 text-cyan-400 px-2 py-0.5 rounded border border-cyan-400/20"
                                    >
                                      {tech}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#223366] text-cyan-400">
                            {project.category}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {project.difficulty && (
                            <span className={`px-2 py-1 rounded text-xs font-medium bg-gradient-to-r ${getDifficultyColor(project.difficulty)}`}>
                              {project.difficulty}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <select
                            value={project.status}
                            onChange={(e) => handleStatusChange(project._id, e.target.value)}
                            className="bg-[#0f1a2a]/80 border border-[#2a3342] rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400/50"
                          >
                            {statuses.map(status => (
                              <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <span className="text-sm text-gray-300">{project.order}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(project)}
                              className="bg-cyan-400 text-black px-3 py-1 rounded-lg text-sm font-medium hover:bg-cyan-500 transition-all duration-200 flex items-center space-x-1"
                            >
                              <Edit3 size={14} />
                              <span>Edit</span>
                            </button>
                            <button
                              onClick={() => handleDelete(project._id)}
                              className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm font-medium hover:bg-red-600 transition-all duration-200 flex items-center space-x-1"
                            >
                              <Trash2 size={14} />
                              <span>Delete</span>
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}

          {/* Empty State */}
          {filteredAndSortedProjects.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 bg-gradient-to-br from-[#1a2332]/90 to-[#0f1a2a]/90 backdrop-blur-xl border border-[#2a3342]/50 rounded-2xl"
            >
              <div className="text-6xl mb-6">📁</div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {projects.length === 0 ? 'No projects yet' : 'No projects match your filters'}
              </h3>
              <p className="text-gray-400 mb-8 max-w-md mx-auto">
                {projects.length === 0
                  ? 'Create your first project to showcase your amazing work!'
                  : 'Try adjusting your search terms or filters to find what you\'re looking for.'
                }
              </p>
              <button
                onClick={() => {
                  resetForm();
                  setShowForm(true);
                }}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-black px-8 py-4 rounded-xl font-semibold hover:from-cyan-500 hover:to-blue-600 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 flex items-center justify-center space-x-2 mx-auto"
              >
                <Plus size={20} />
                <span>Create Your First Project</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
