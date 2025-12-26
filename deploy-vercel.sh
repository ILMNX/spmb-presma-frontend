#!/bin/bash

echo "🚀 Complete Vercel Deployment Guide for stagingspmb.prestasiprima.sch.id"

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                VERCEL DEPLOYMENT CHECKLIST                  ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

# Step 1: Prerequisites Check
echo -e "\n${YELLOW}📋 STEP 1: Prerequisites Check${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js not found. Please install Node.js first.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ Node.js found: $(node --version)${NC}"
fi

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm not found.${NC}"
    exit 1
else
    echo -e "${GREEN}✅ npm found: $(npm --version)${NC}"
fi

# Install Vercel CLI if not exists
if ! command -v vercel &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Vercel CLI...${NC}"
    npm i -g vercel
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Vercel CLI installed successfully${NC}"
    else
        echo -e "${RED}❌ Failed to install Vercel CLI${NC}"
        exit 1
    fi
else
    echo -e "${GREEN}✅ Vercel CLI found: $(vercel --version)${NC}"
fi

# Step 2: Environment Setup
echo -e "\n${YELLOW}🌍 STEP 2: Environment Variables Check${NC}"

# Create .env files
if [ ! -f ".env.production" ]; then
    echo -e "${YELLOW}📝 Creating .env.production...${NC}"
    cat > .env.production << 'EOF'
PUBLIC_API_URL=https://apispmb.prestasiprima.sch.id/api
EOF
    echo -e "${GREEN}✅ .env.production created${NC}"
else
    echo -e "${GREEN}✅ .env.production already exists${NC}"
fi

if [ ! -f ".env.development" ]; then
    echo -e "${YELLOW}📝 Creating .env.development...${NC}"
    cat > .env.development << 'EOF'
PUBLIC_API_URL=http://127.0.0.1:8000/api
EOF
    echo -e "${GREEN}✅ .env.development created${NC}"
else
    echo -e "${GREEN}✅ .env.development already exists${NC}"
fi

# Step 3: Build Check (Skip local build that requires local API)
echo -e "\n${YELLOW}🔨 STEP 3: Build Check${NC}"
echo -e "${BLUE}⚠️  Skipping local build (will build on Vercel with production API)${NC}"

# Step 4: Authentication
echo -e "\n${YELLOW}🔐 STEP 4: Vercel Authentication${NC}"

# Check if already logged in
if vercel whoami &> /dev/null; then
    echo -e "${GREEN}✅ Already logged in to Vercel as: $(vercel whoami)${NC}"
else
    echo -e "${BLUE}🔑 Please login to Vercel...${NC}"
    vercel login
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Successfully logged in to Vercel${NC}"
    else
        echo -e "${RED}❌ Failed to login to Vercel${NC}"
        exit 1
    fi
fi

# Step 5: Project Setup
echo -e "\n${YELLOW}⚙️ STEP 5: Project Setup${NC}"

# Check if vercel.json exists
if [ ! -f "vercel.json" ]; then
    echo -e "${YELLOW}📝 Creating vercel.json configuration...${NC}"
    cat > vercel.json << 'EOF'
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "installCommand": "npm ci",
  "devCommand": "npm run dev",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
EOF
    echo -e "${GREEN}✅ vercel.json created${NC}"
else
    echo -e "${GREEN}✅ vercel.json already exists${NC}"
fi

# Step 6: Environment Variables Setup
echo -e "\n${YELLOW}🌍 STEP 6: Environment Variables Setup${NC}"

echo -e "${BLUE}Setting up environment variables on Vercel...${NC}"

# Remove old env vars if they exist
vercel env rm PUBLIC_API_URL production -y 2>/dev/null
vercel env rm PUBLIC_API_URL preview -y 2>/dev/null
vercel env rm PUBLIC_API_URL development -y 2>/dev/null

# Set PUBLIC_API_URL for all environments
echo -e "${YELLOW}Setting PUBLIC_API_URL for production...${NC}"
echo "https://apispmb.prestasiprima.sch.id/api" | vercel env add PUBLIC_API_URL production

echo -e "${YELLOW}Setting PUBLIC_API_URL for preview...${NC}"
echo "https://apispmb.prestasiprima.sch.id/api" | vercel env add PUBLIC_API_URL preview

echo -e "${YELLOW}Setting PUBLIC_API_URL for development...${NC}"
echo "https://apispmb.prestasiprima.sch.id/api" | vercel env add PUBLIC_API_URL development

echo -e "${GREEN}✅ Environment variables configured${NC}"

# Step 7: Pull environment variables
echo -e "\n${YELLOW}📥 Pulling environment variables...${NC}"
vercel env pull .env.local

# Step 8: Initial Deployment
echo -e "\n${YELLOW}🚀 STEP 8: Initial Deployment${NC}"

echo -e "${BLUE}Deploying to Vercel...${NC}"
vercel --prod --yes

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment successful!${NC}"
    
    # Get the project name
    PROJECT_NAME=$(node -pe "require('./package.json').name" 2>/dev/null || basename "$PWD")
    
    echo -e "${GREEN}🌐 Check your deployment at: https://vercel.com/dashboard${NC}"
else
    echo -e "${RED}❌ Deployment failed${NC}"
    echo -e "${YELLOW}💡 Check the build logs above for errors${NC}"
    exit 1
fi

# Step 9: Custom Domain Setup Instructions
echo -e "\n${YELLOW}🌐 STEP 9: Custom Domain Setup${NC}"

echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                 CUSTOM DOMAIN SETUP GUIDE                   ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${YELLOW}🔧 Manual Steps Required:${NC}"

echo -e "\n${BLUE}1. Add Custom Domain in Vercel Dashboard:${NC}"
echo "   • Visit: https://vercel.com/dashboard"
echo "   • Select your project: $(basename "$PWD")"
echo "   • Go to Settings → Domains"
echo "   • Click 'Add Domain'"
echo "   • Enter: stagingspmb.prestasiprima.sch.id"
echo "   • Click 'Add'"

echo -e "\n${BLUE}2. Configure DNS Records:${NC}"
echo "   • Login to your domain provider (Hostinger cPanel)"
echo "   • Go to DNS Zone Editor"
echo "   • Add/Update these records:"
echo "   "
echo "   Type: CNAME"
echo "   Name: stagingspmb"
echo "   Value: cname.vercel-dns.com"
echo "   TTL: 14400 (or Auto)"

echo -e "\n${BLUE}3. Wait for Propagation:${NC}"
echo "   • DNS changes take 5-60 minutes"
echo "   • SSL certificate is automatic (2-5 minutes after DNS)"
echo "   • Check status in Vercel Dashboard"

# Step 10: Verification Commands
echo -e "\n${YELLOW}🔍 STEP 10: Verification Commands${NC}"

echo -e "\n${BLUE}Test DNS propagation:${NC}"
echo "   nslookup stagingspmb.prestasiprima.sch.id"
echo "   dig stagingspmb.prestasiprima.sch.id"

echo -e "\n${BLUE}Test SSL certificate:${NC}"
echo "   curl -I https://stagingspmb.prestasiprima.sch.id"

echo -e "\n${BLUE}Test website:${NC}"
echo "   curl https://stagingspmb.prestasiprima.sch.id"

# Step 11: Deployment Commands
echo -e "\n${YELLOW}🔄 STEP 11: Future Deployment Commands${NC}"

cat > DEPLOYMENT_COMMANDS.md << 'EOF'
# Vercel Deployment Commands

## Quick Deploy
```bash
# Deploy to production
vercel --prod

# Deploy preview (for testing)
vercel
```

## Environment Variables
```bash
# List all environment variables
vercel env ls

# Pull environment variables to .env.local
vercel env pull .env.local

# Add environment variable
vercel env add PUBLIC_API_URL production
vercel env add PUBLIC_API_URL preview
vercel env add PUBLIC_API_URL development

# Remove environment variable
vercel env rm PUBLIC_API_URL production
```

## Rollback
```bash
# List deployments
vercel ls

# Rollback to specific deployment
vercel rollback [deployment-url]
```

## Logs & Debugging
```bash
# View logs
vercel logs [deployment-url]

# Follow live logs
vercel logs --follow

# Inspect deployment
vercel inspect [deployment-url]
```

## Domain Management
```bash
# List domains
vercel domains

# Add domain
vercel domains add stagingspmb.prestasiprima.sch.id

# Remove domain
vercel domains rm stagingspmb.prestasiprima.sch.id
```

## Local Development
```bash
# Run development server
npm run dev

# Build locally
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Build fails with "ECONNREFUSED 127.0.0.1:8000"
**Problem:** Pages are trying to fetch from localhost during build.
**Solution:** Ensure all fetch calls use `import.meta.env.PUBLIC_API_URL`

Example:
```javascript
const API_URL = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api';
const response = await fetch(`${API_URL}/endpoint`);
```

### Environment variables not working
**Problem:** Variables not set in Vercel.
**Solution:**
```bash
vercel env pull .env.local  # Pull to see current values
vercel env add PUBLIC_API_URL production  # Add missing ones
```

### API requests fail in production
**Problem:** CORS or API not accessible.
**Solution:**
1. Verify API is deployed: `curl https://apispmb.prestasiprima.sch.id/api/ping`
2. Check CORS settings in Laravel backend
3. Verify environment variables: `vercel env ls`
4. Check browser console for errors

### DNS not propagating
**Problem:** Domain not pointing to Vercel.
**Solution:**
```bash
# Check DNS
nslookup stagingspmb.prestasiprima.sch.id
dig stagingspmb.prestasiprima.sch.id

# Should return: cname.vercel-dns.com
```

Wait 5-60 minutes for propagation.

### SSL certificate not working
**Problem:** HTTPS not available.
**Solution:**
1. Ensure DNS is propagated first
2. Check Vercel dashboard → Domains → SSL status
3. Wait 2-5 minutes after DNS propagation
4. SSL is automatic, no manual action needed
EOF

echo -e "${GREEN}✅ Deployment commands saved to DEPLOYMENT_COMMANDS.md${NC}"

# Step 12: Create API helper file
echo -e "\n${YELLOW}📝 Creating API helper utility...${NC}"

mkdir -p src/lib

cat > src/lib/api.ts << 'EOF'
/**
 * API Configuration
 * Automatically uses production API on Vercel, local API in development
 */
export const API_URL = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

/**
 * Fetch data from API with error handling
 */
export async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T | null> {
  try {
    const url = `${API_URL}${endpoint}`;
    console.log(`Fetching: ${url}`);
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...options?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    return null;
  }
}

/**
 * POST request to API
 */
export async function postAPI<T>(endpoint: string, data: any): Promise<T | null> {
  return fetchAPI<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

/**
 * PUT request to API
 */
export async function putAPI<T>(endpoint: string, data: any): Promise<T | null> {
  return fetchAPI<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

/**
 * DELETE request to API
 */
export async function deleteAPI<T>(endpoint: string): Promise<T | null> {
  return fetchAPI<T>(endpoint, {
    method: 'DELETE',
  });
}
EOF

echo -e "${GREEN}✅ API helper created at src/lib/api.ts${NC}"

# Step 13: Final Instructions
echo -e "\n${YELLOW}✅ STEP 13: Final Checklist${NC}"

echo -e "\n${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║                    DEPLOYMENT CHECKLIST                     ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"

echo -e "\n${GREEN}✅ Completed Steps:${NC}"
echo "   • Vercel CLI installed and authenticated"
echo "   • Environment variables configured"
echo "   • API helper utility created"
echo "   • Production build configured"
echo "   • Initial deployment completed"
echo "   • Configuration files created"

echo -e "\n${YELLOW}⏳ Pending Manual Steps:${NC}"
echo "   □ Update all pages to use import.meta.env.PUBLIC_API_URL"
echo "   □ Ensure backend API is deployed and accessible"
echo "   □ Add custom domain in Vercel Dashboard"
echo "   □ Configure DNS CNAME record"
echo "   □ Wait for DNS propagation (5-60 minutes)"
echo "   □ Verify SSL certificate activation"
echo "   □ Test the live website"

echo -e "\n${BLUE}🔗 Important URLs:${NC}"
echo "   • Vercel Dashboard: https://vercel.com/dashboard"
echo "   • Project Settings: https://vercel.com/dashboard/[your-project]/settings"
echo "   • Domain Settings: https://vercel.com/dashboard/[your-project]/settings/domains"
echo "   • Hostinger cPanel: https://hpanel.hostinger.com/"

echo -e "\n${RED}⚠️  IMPORTANT - ACTION REQUIRED:${NC}"
echo "   Update your Astro pages to use the API helper:"
echo "   "
echo "   import { fetchAPI } from '../lib/api';"
echo "   const data = await fetchAPI('/endpoint');"
echo "   "
echo "   OR use environment variable directly:"
echo "   "
echo "   const API_URL = import.meta.env.PUBLIC_API_URL || 'http://127.0.0.1:8000/api';"
echo "   const response = await fetch(\`\${API_URL}/endpoint\`);"

echo -e "\n${GREEN}🎉 Deployment script completed successfully!${NC}"
echo -e "${YELLOW}📋 Next: Update your pages to use environment variables, then redeploy.${NC}"