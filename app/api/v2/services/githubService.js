import { Octokit } from '@octokit/rest';
import TurndownService from 'turndown';

// Initialize Turndown for HTML to Markdown conversion
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced'
});

/**
 * Generate Jekyll-compatible filename with date prefix
 * @param {Object} article - The article object
 * @returns {string} - Formatted filename like "2025-01-25-article-slug.md"
 */
function generateFilename(article) {
  const date = new Date().toISOString().split('T')[0];
  return `${date}-${article.slug}.md`;
}

/**
 * Convert article to Jekyll markdown format with frontmatter
 * @param {Object} article - The article object with title, excerpt, category, tags, content, slug
 * @returns {string} - Markdown content with Jekyll frontmatter
 */
function generateMarkdownContent(article) {
  // Jekyll frontmatter
  const frontmatter = `---
title: "${article.title.replace(/"/g, '\\"')}"
date: ${new Date().toISOString()}
categories: [${article.category}]
tags: [${article.tags.map(tag => `"${tag}"`).join(', ')}]
excerpt: "${article.excerpt.replace(/"/g, '\\"')}"
permalink: /blog/${article.slug}/
layout: post
---`;
  
  // Convert HTML content to Markdown
  // Replace internal links to maintain consistency
  let htmlContent = article.content;
  htmlContent = htmlContent.replace(/http:\/\/www\.noviachat\.com/g, 'https://www.noviachat.com');
  
  const markdownContent = turndownService.turndown(htmlContent);
  
  return `${frontmatter}\n\n${markdownContent}`;
}

/**
 * Posts a blog article to GitHub Pages repository
 * @param {Object} article - The article object with title, slug, excerpt, category, tags, and content
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export async function postToGitHub(article) {
  try {
    // Validate required environment variables
    if (!process.env.GITHUB_TOKEN || !process.env.GITHUB_OWNER || !process.env.GITHUB_REPO) {
      throw new Error('Missing required GitHub environment variables');
    }

    // Initialize Octokit with authentication
    const octokit = new Octokit({ 
      auth: process.env.GITHUB_TOKEN 
    });

    // Generate markdown content with frontmatter
    const content = generateMarkdownContent(article);
    const filename = generateFilename(article);
    const path = `_posts/${filename}`;
    
    // Encode content to base64 as required by GitHub API
    const contentBase64 = Buffer.from(content, 'utf-8').toString('base64');
    
    // Create or update file in GitHub repository
    const response = await octokit.rest.repos.createOrUpdateFileContents({
      owner: process.env.GITHUB_OWNER,
      repo: process.env.GITHUB_REPO,
      path: path,
      message: `Add blog post: ${article.title}`,
      content: contentBase64,
      branch: process.env.GITHUB_PAGES_BRANCH || 'main'
    });
    
    // Generate the GitHub Pages URL
    // Format depends on whether it's a user/org page or project page
    let githubPagesUrl;
    if (process.env.GITHUB_REPO.endsWith('.github.io')) {
      // User/Organization page
      githubPagesUrl = `https://${process.env.GITHUB_OWNER}.github.io/blog/${article.slug}/`;
    } else {
      // Project page
      githubPagesUrl = `https://${process.env.GITHUB_OWNER}.github.io/${process.env.GITHUB_REPO}/blog/${article.slug}/`;
    }
    
    console.log(`Successfully posted to GitHub: ${githubPagesUrl}`);
    console.log(`File created at: ${path}`);
    
    return { 
      success: true, 
      url: githubPagesUrl,
      filePath: path,
      sha: response.data.content.sha
    };
    
  } catch (error) {
    console.error('Error posting to GitHub:', error);
    
    // Provide more specific error messages
    let errorMessage = 'Failed to post to GitHub';
    if (error.status === 401) {
      errorMessage = 'GitHub authentication failed - check GITHUB_TOKEN';
    } else if (error.status === 404) {
      errorMessage = 'GitHub repository not found - check GITHUB_OWNER and GITHUB_REPO';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return { 
      success: false, 
      error: errorMessage 
    };
  }
}